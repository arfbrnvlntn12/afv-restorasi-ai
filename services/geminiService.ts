// geminiService.ts (SERVER-SIDE)
// Jalankan hanya di Node/Next.js API Route (bukan di browser)
import { GoogleGenAI, Modality } from "@google/genai";

const MODEL_NAME = "gemini-2.5-flash-image-preview"; // ganti jika perlu
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY belum diset di .env (Vite).");
}
const ai = new GoogleGenAI({ apiKey });

const BASE_PROMPTS = {
  enhance: `
    As an expert photo restoration specialist, your primary task is to perform a professional-grade restoration of this color photo. Perform the following actions with extreme precision:
    1. Ultra HD Clarity & Sharpness: Dramatically increase resolution to a photorealistic level. Every detail must be crystal clear. Eliminate all blurriness and haze.
    2. Flawless Damage Repair: Seamlessly fix any scratches, tears, dust, stains, and creases. The repair should be invisible.
    3. Vivid Color Restoration: Restore faded colors to their original, stunning vibrancy. Make the colors pop, appear rich, and deeply saturated, yet completely natural and lifelike.
    4. Advanced Noise Reduction: Intelligently reduce grain and digital noise without sacrificing fine details.
    5. Dynamic Lighting & Contrast: Masterfully balance lighting and contrast to enhance depth and create a powerful, dynamic image.
  `,
  colorize: `
    As an expert photo restoration specialist, your primary task is to perform a professional-grade restoration and colorization of this black and white photo. Perform the following actions with extreme precision:
    1. Perfect Preservation: Do NOT change subjects/background/composition unless instructed.
    2. Vivid & Realistic Colorization: Add natural, historically appropriate colors.
    3. Flawless Damage Repair: Fix scratches, tears, dust, stains, creases invisibly.
    4. Ultra HD Clarity & Sharpness.
    5. Advanced Noise Reduction without losing fine detail.
    6. Dynamic Lighting & Contrast while respecting the original light.
  `,
  repair_bw: `
    As an expert photo restoration specialist, your primary task is to perform a professional-grade monochrome restoration of this black and white photo. It MUST remain black and white.
    1. Flawless Damage Repair.
    2. Ultra HD Clarity & Sharpness.
    3. Advanced Noise Reduction.
    4. Dynamic Lighting & Contrast for a dramatic monochrome image.
    5. ABSOLUTELY DO NOT ADD COLOR.
  `,
} as const;

const ADDITIVE_PROMPTS = {
  passport: `
    ---
    ADDITIONAL TASK: Format as Passport Photo
    1) Crop: head-and-shoulders, face centered.
    2) Replace background with solid neutral white.
    3) Preserve facial identity; do not alter features.
  `,
  full_body: `
    ---
    ADDITIONAL TASK: Generate Full Body
    1) Anatomical Realism: generate missing body & clothes photorealistically.
    2) Seamless Blending: match lighting, shadows, textures, grain.
    3) Pose Generation: [USER_POSE_PROMPT]
    4) Background Generation: [USER_BACKGROUND_PROMPT]
    5) No other people/faces in background.
  `,
  change_clothes: `
    ---
    ADDITIONAL TASK: Change Clothes
    1) New Clothing: [USER_CLOTHING_PROMPT] (photorealistic, fits naturally).
    2) Strict Preservation: do NOT change face, hair, body shape (unless Full Body), pose, or background.
    3) Seamless Integration with original lighting & style.
  `,
} as const;

const CAMERA_QUALITY_PROMPTS = {
  default: "",
  "4k":
    "Render the final image with ultra-high definition detail, equivalent to a 4K photograph. Every texture must be sharp and clear.",
  "8k":
    "Render the final image with cinematic 8K photorealism, capturing microscopic textures and nuances.",
} as const;

const CAMERA_ANGLE_PROMPTS = {
  default: "",
  above:
    "The final image should be rendered as if shot from a high angle, looking down slightly on the subject.",
  eye_level:
    "The final image should be rendered from an eye-level perspective for a direct connection.",
  below:
    "The final image should be rendered from a low angle, looking up for a sense of scale.",
} as const;

const ASPECT_RATIO_PROMPTS = {
  default: "",
  "1:1": "The final image must have a square aspect ratio (1:1).",
  "3:4": "The final image must have a vertical portrait aspect ratio (3:4).",
  "4:5": "The final image must have a vertical portrait aspect ratio (4:5).",
  "9:16": "The final image must have a tall vertical aspect ratio (9:16).",
  "16:9": "The final image must have a widescreen landscape aspect ratio (16:9).",
} as const;

export type BaseRestorationType = keyof typeof BASE_PROMPTS;
export type AdditiveOptions = {
  passport: boolean;
  full_body: boolean;
  change_clothes: boolean;
};
export type CameraQuality = keyof typeof CAMERA_QUALITY_PROMPTS;
export type CameraAngle = keyof typeof CAMERA_ANGLE_PROMPTS;
export type AspectRatio = keyof typeof ASPECT_RATIO_PROMPTS;

function buildPrompt(
  baseType: BaseRestorationType,
  additive: AdditiveOptions,
  clothingPrompt?: string,
  backgroundPrompt?: string,
  posePrompt?: string,
  customPrompt?: string,
  cameraQuality: CameraQuality = "default",
  cameraAngle: CameraAngle = "default",
  aspectRatio: AspectRatio = "default"
) {
  let finalPrompt = `
You will receive a photo to restore. First, perform the primary restoration task defined below. Then, apply any additional tasks that follow.

PRIMARY TASK: ${baseType.toUpperCase()}
${BASE_PROMPTS[baseType]}
  `.trim();

  if (additive.passport) {
    finalPrompt += ADDITIVE_PROMPTS.passport;
  }

  if (additive.full_body) {
    let fullBody = ADDITIVE_PROMPTS.full_body;

    const poseInstruction = (posePrompt || "").trim()
      ? `Follow this specific pose request: "${posePrompt}". The generated pose must be natural and consistent with the visible posture.`
      : `Generate a natural pose consistent with the visible posture.`;
    fullBody = fullBody.replace("[USER_POSE_PROMPT]", poseInstruction);

    const bgInstruction = (backgroundPrompt || "").trim()
      ? `Generate the background based on this description: "${backgroundPrompt}". It should complement the subject.`
      : `Generate a simple, non-distracting background that complements the subject.`;
    fullBody = fullBody.replace("[USER_BACKGROUND_PROMPT]", bgInstruction);

    finalPrompt += fullBody;
  }

  if (additive.change_clothes) {
    if (!clothingPrompt) {
      throw new Error("Clothing description is required for change_clothes.");
    }
    finalPrompt += ADDITIVE_PROMPTS.change_clothes.replace(
      "[USER_CLOTHING_PROMPT]",
      clothingPrompt
    );
  }

  if ((customPrompt || "").trim()) {
    finalPrompt += `
---
ADDITIONAL TASK: Custom User Instruction
Apply this with high priority: "${customPrompt}".
`.trim();
  }

  const artistic: string = [
    cameraQuality !== "default" ? CAMERA_QUALITY_PROMPTS[cameraQuality] : "",
    cameraAngle !== "default" ? CAMERA_ANGLE_PROMPTS[cameraAngle] : "",
    aspectRatio !== "default" ? ASPECT_RATIO_PROMPTS[aspectRatio] : "",
  ]
    .filter(Boolean)
    .join(" ");

  finalPrompt += `
---
Crucial Final Instruction & Artistic Direction:
${artistic || "Keep composition unless explicitly told to crop."}
Output MUST be the processed image only. Do not add text, borders, or artifacts.
`.trim();

  return finalPrompt;
}

export async function restorePhoto(
  base64ImageData: string,
  mimeType: string,
  baseRestorationType: BaseRestorationType,
  additiveOptions: AdditiveOptions,
  clothingPrompt?: string,
  backgroundPrompt?: string,
  posePrompt?: string,
  customPrompt?: string,
  cameraQuality: CameraQuality = "default",
  cameraAngle: CameraAngle = "default",
  aspectRatio: AspectRatio = "default"
): Promise<string> {
  try {
    if (!base64ImageData || !mimeType) {
      throw new Error("Image data/mimeType wajib diisi.");
    }

    const finalPrompt = buildPrompt(
      baseRestorationType,
      additiveOptions,
      clothingPrompt,
      backgroundPrompt,
      posePrompt,
      customPrompt,
      cameraQuality,
      cameraAngle,
      aspectRatio
    );

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { data: base64ImageData, mimeType } },
          { text: finalPrompt },
        ],
      },
      // Jika SDK versi terbaru meminta 'generationConfig', ubah kunci berikut:
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (!response.candidates?.length) {
      const blockReason = response.promptFeedback?.blockReason;
      throw new Error(
        `Request diblokir oleh safety filter.${blockReason ? " Reason: " + blockReason : ""}`
      );
    }

    // Cari gambar di kandidat pertama
    let textFallback = "";
    for (const part of response.candidates[0].content.parts) {
      if ((part as any).inlineData?.data) {
        return (part as any).inlineData.data as string; // base64 hasil
      }
      if ((part as any).text) {
        textFallback += (part as any).text;
      }
    }

    if (textFallback) {
      throw new Error(
        `Model mengembalikan teks, bukan gambar: "${textFallback.slice(0, 300)}..."`
      );
    }
    throw new Error(
      "Model mengembalikan respons tanpa gambar. Coba sesuaikan prompt atau gambar."
    );
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (/API key not valid/i.test(msg)) {
      throw new Error(
        "Gemini API Error: API key tidak valid. Cek GEMINI_API_KEY di server."
      );
    }
    if (/quota|RESOURCE_EXHAUSTED|429/i.test(msg)) {
      throw new Error(
        "Gemini API Error: Kuota/Rate limit habis. Aktifkan billing atau lakukan retry dengan backoff."
      );
    }
    throw new Error(`Gemini API Error: ${msg}`);
  }
}
