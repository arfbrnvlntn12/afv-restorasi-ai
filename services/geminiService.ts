import { GoogleGenAI, Modality } from "@google/genai";

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

const CAMERA_QUALITY_PROMPTS = {
  'default': '',
  '4k': `Render the final image with ultra-high definition detail, equivalent to a 4K photograph. Every texture, from skin pores to fabric weave, must be incredibly sharp and clear.`,
  '8k': `Render the final image with cinematic 8K resolution and photorealism. The level of detail should be breathtaking, capturing microscopic textures and nuances. The output must be indistinguishable from a high-end professional photograph.`
};

const CAMERA_ANGLE_PROMPTS = {
  'default': '',
  'above': `The final image should be rendered as if shot from a high angle, looking down slightly on the subject.`,
  'eye_level': `The final image should be rendered from an eye-level perspective, creating a direct and personal connection with the subject.`,
  'below': `The final image should be rendered as if shot from a low angle, looking up at the subject. This should create a sense of scale or importance.`
};

const ASPECT_RATIO_PROMPTS = {
  'default': '',
  '1:1': 'The final image must have a square aspect ratio (1:1).',
  '3:4': 'The final image must have a vertical portrait aspect ratio (3:4).',
  '4:5': 'The final image must have a vertical portrait aspect ratio (4:5).',
  '9:16': 'The final image must have a tall vertical aspect ratio (9:16), suitable for phone screens.',
  '16:9': 'The final image must have a widescreen landscape aspect ratio (16:9).'
};

export type BaseRestorationType = keyof typeof BASE_PROMPTS;
export type AdditiveOptions = {
  passport: boolean;
  full_body: boolean;
  change_clothes: boolean;
}
export type CameraQuality = keyof typeof CAMERA_QUALITY_PROMPTS;
export type CameraAngle = keyof typeof CAMERA_ANGLE_PROMPTS;
export type AspectRatio = keyof typeof ASPECT_RATIO_PROMPTS;

export async function restorePhoto(
  apiKey: string,
  base64ImageData: string,
  mimeType: string,
  baseRestorationType: BaseRestorationType,
  additiveOptions: AdditiveOptions,
  clothingPrompt?: string,
  backgroundPrompt?: string,
  posePrompt?: string,
  customPrompt?: string,
  cameraQuality: CameraQuality = 'default',
  cameraAngle: CameraAngle = 'default',
  aspectRatio: AspectRatio = 'default'
): Promise<string> {
  try {
    if (!apiKey) {
      throw new Error("API Key is missing. Please provide a valid Gemini API Key.");
    }
    const ai = new GoogleGenAI({ apiKey });

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
    
    if (customPrompt?.trim()) {
      finalPrompt += `
        ---
        **ADDITIONAL TASK: Custom User Instruction**
        You must follow this special instruction from the user with high priority: "${customPrompt}". Apply this instruction logically in conjunction with all other tasks.
      `;
    }
    
    let artisticDirection = '';
    if (cameraQuality !== 'default') {
      artisticDirection += CAMERA_QUALITY_PROMPTS[cameraQuality] + ' ';
    }
    if (cameraAngle !== 'default') {
      artisticDirection += CAMERA_ANGLE_PROMPTS[cameraAngle] + ' ';
    }
    if (aspectRatio !== 'default') {
      artisticDirection += ASPECT_RATIO_PROMPTS[aspectRatio];
    }

    finalPrompt += `
      ---
      **Crucial Final Instruction & Artistic Direction:**
      ${artisticDirection.trim()}
      After applying all requested tasks, the final output must be ONLY the processed image itself. Do not add any text, borders, or other artifacts. Preserve the original composition unless explicitly told to crop or change it.
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

    if (!response.candidates || response.candidates.length === 0) {
      const blockReason = response.promptFeedback?.blockReason;
      let errorMessage = "The request was blocked by the AI model's safety filters.";
      if (blockReason) {
        errorMessage += ` Reason: ${blockReason}.`;
      }
      throw new Error(errorMessage);
    }

    let textResponse = '';
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
      if (part.text) {
        textResponse += part.text;
      }
    }
    
    if (textResponse) {
      throw new Error(`The model provided a text response instead of an image: "${textResponse}"`);
    }

    throw new Error("The AI model returned a response, but it did not contain an image. Please adjust your prompt or try a different image.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred during photo restoration.");
  }
}