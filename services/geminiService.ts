import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_PROMPTS = {
  enhance: `
    As an expert photo restoration specialist, your primary task is to perform a professional-grade restoration of this color photo. Perform the following actions with extreme precision:
    1.  **Ultra HD Clarity & Sharpness:** Dramatically increase resolution to a photorealistic level. Every detail must be crystal clear. Eliminate all blurriness and haze.
    2.  **Flawless Damage Repair:** Seamlessly fix any scratches, tears, dust, stains, and creases. The repair should be invisible.
    3.  **Vivid Color Restoration:** Restore faded colors to their original, stunning vibrancy. Make the colors pop, appear rich, and deeply saturated, yet completely natural and lifelike.
    4.  **Advanced Noise Reduction:** Intelligently reduce grain and digital noise without sacrificing fine details.
    5.  **Dynamic Lighting & Contrast:** Masterfully balance lighting and contrast to enhance depth and create a powerful, dynamic image.
  `,
  colorize: `
    As an expert photo restoration specialist, your primary task is to perform a professional-grade restoration and colorization of this black and white photo. Perform the following actions with extreme precision:
    1.  **Perfect Preservation:** It is absolutely critical that you DO NOT change the content, subjects, background, or composition of the original photo in any way, unless instructed by an additional task.
    2.  **Vivid & Realistic Colorization:** Add stunningly realistic, natural, and historically appropriate colors. The colors should be vibrant and make the photo come to life.
    3.  **Flawless Damage Repair:** Seamlessly fix any scratches, tears, dust, stains, and creases. The repair should be invisible.
    4.  **Ultra HD Clarity & Sharpness:** Dramatically increase resolution to a photorealistic level. Every detail must be crystal clear.
    5.  **Advanced Noise Reduction:** Intelligently reduce grain and digital noise without sacrificing fine details.
    6.  **Dynamic Lighting & Contrast:** Masterfully balance lighting and contrast to enhance depth, while respecting the original's lighting.
  `,
  repair_bw: `
    As an expert photo restoration specialist, your primary task is to perform a professional-grade monochrome restoration of this black and white photo. It MUST remain black and white. Perform the following actions with extreme precision:
    1.  **Flawless Damage Repair:** Seamlessly fix any scratches, tears, dust, stains, and creases. The repair should be invisible.
    2.  **Ultra HD Clarity & Sharpness:** Dramatically increase resolution to a photorealistic level. Every detail must be crystal clear.
    3.  **Advanced Noise Reduction:** Intelligently reduce grain and digital noise without sacrificing fine details.
    4.  **Dynamic Lighting & Contrast:** Masterfully improve the contrast, shadows, and highlights for a powerful and dramatic monochrome image.
    5.  **ABSOLUTELY DO NOT ADD COLOR.** The final image must be purely grayscale.
  `,
};

const ADDITIVE_PROMPTS = {
  passport: `
    ---
    **ADDITIONAL TASK: Format as Passport Photo**
    After performing the primary restoration tasks, you must also format the image as a professional passport photo.
    1.  **Crop:** Crop the image to a head-and-shoulders portrait. The person's face should be centered and clearly visible.
    2.  **Background Replacement:** Completely replace the original background with a solid, neutral white background.
    3.  **Preserve Identity:** The person's facial features must remain completely unchanged.
  `,
  full_body: `
    ---
    **ADDITIONAL TASK: Generate Full Body**
    After performing the primary restoration tasks, you must also realistically generate the rest of the person's body.
    1.  **Anatomical Realism:** Your highest priority is anatomical correctness. Generate the rest of the person's body (legs, arms, feet, etc.) and clothing with extreme photorealism. Every limb and feature must be perfectly proportioned and appear completely natural.
    2.  **Seamless Blending:** The transition between the original photo and the generated parts must be invisible. Meticulously match the lighting, shadows, textures, grain, and overall image quality.
    3.  **Pose Generation:** [USER_POSE_PROMPT]
    4.  **Background Generation:** [USER_BACKGROUND_PROMPT]
    5.  **Absolute Background Rule:** The generated background must be completely empty of other people or faces. The focus must be 100% on the main subject.
  `,
  change_clothes: `
    ---
    **ADDITIONAL TASK: Change Clothes**
    You must change the clothing of the person in the photo based on the following description, while keeping everything else identical.
    1.  **New Clothing:** The person must be wearing: [USER_CLOTHING_PROMPT]. Generate the clothing to be photorealistic, high-quality, and fitting the person's body naturally.
    2.  **Strict Preservation:** The person's face, hair, body shape (unless 'Generate Full Body' is also active), pose, and the entire background MUST NOT be changed. Only the clothes should be different.
    3.  **Seamless Integration:** The new clothing must match the lighting, shadows, and overall style of the original photo perfectly.
  `
};

export type BaseRestorationType = keyof typeof BASE_PROMPTS;
export type AdditiveOptions = {
  passport: boolean;
  full_body: boolean;
  change_clothes: boolean;
}

export async function restorePhoto(
  base64ImageData: string,
  mimeType: string,
  baseRestorationType: BaseRestorationType,
  additiveOptions: AdditiveOptions,
  clothingPrompt?: string,
  backgroundPrompt?: string,
  posePrompt?: string
): Promise<string | null> {
  try {
    let finalPrompt = `
      You will receive a photo to restore. First, perform the primary restoration task defined below. Then, apply any additional tasks that follow.
      
      **PRIMARY TASK: ${baseRestorationType.toUpperCase()}**
      ${BASE_PROMPTS[baseRestorationType]}
    `;

    if (additiveOptions.passport) {
      finalPrompt += ADDITIVE_PROMPTS.passport;
    }
    if (additiveOptions.full_body) {
      let fullBodyPrompt = ADDITIVE_PROMPTS.full_body;

      const poseInstruction = posePrompt?.trim() 
        ? `Follow this specific pose request: "${posePrompt}". The generated pose must be natural, believable, and consistent with the person's visible posture and expression.`
        : `Generate a natural, believable pose that is consistent with the person's visible posture and expression.`;
      fullBodyPrompt = fullBodyPrompt.replace('[USER_POSE_PROMPT]', poseInstruction);
      
      const backgroundInstruction = backgroundPrompt?.trim()
        ? `Generate the background based on this description: "${backgroundPrompt}". The background should complement the subject.`
        : `Generate a simple, non-distracting background that complements the subject.`;
      fullBodyPrompt = fullBodyPrompt.replace('[USER_BACKGROUND_PROMPT]', backgroundInstruction);

      finalPrompt += fullBodyPrompt;
    }
    if (additiveOptions.change_clothes) {
      if (!clothingPrompt) {
        throw new Error("Clothing description is required for this feature.");
      }
      finalPrompt += ADDITIVE_PROMPTS.change_clothes.replace('[USER_CLOTHING_PROMPT]', clothingPrompt);
    }
    
    finalPrompt += `
      ---
      **Crucial Final Instruction:** After applying all requested tasks, the final output must be ONLY the processed image itself. Do not add any text, borders, or other artifacts. Preserve the original composition unless explicitly told to crop or change it.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    return null;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred during photo restoration.");
  }
}
