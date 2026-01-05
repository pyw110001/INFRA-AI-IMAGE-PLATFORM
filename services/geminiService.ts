import { GoogleGenAI, Type } from "@google/genai";
import { GenerationParams, ImageAsset } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// Initialize API Client
// Note: process.env.API_KEY is assumed to be available as per instructions.
const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data.split(',')[1], // Remove 'data:image/png;base64,' prefix
      mimeType
    },
  };
};

export const generateImage = async (
  prompt: string,
  baseImage: ImageAsset,
  styleImages: ImageAsset[],
  params: GenerationParams,
  maskImage?: string // Optional mask data URL
): Promise<string> => {
  const ai = getAiClient();
  
  // Mapping "Nano Banana Pro" -> 'gemini-3-pro-image-preview'
  const modelName = 'gemini-3-pro-image-preview';

  const parts: any[] = [];

  // 1. Add Base Image
  if (baseImage.url) {
    parts.push(fileToGenerativePart(baseImage.url, 'image/png'));
  }

  // 2. Add Style Images (if any)
  styleImages.forEach(img => {
     parts.push(fileToGenerativePart(img.url, 'image/png'));
  });

  // 3. Add Prompt & System Context
  // We combine system instruction into the prompt for image models as they often treat systemInstruction separate strictly for text.
  // But for Gemini 3 Pro Image, we can pass text parts.
  const fullPrompt = `
    ${SYSTEM_INSTRUCTION}
    
    User Request: ${prompt}
    
    ${maskImage ? 'INPAINTING TASK: Use the provided image context. Modify specific areas if described.' : 'TRANSFORMATION TASK: Style transfer and render.'}
  `;
  
  parts.push({ text: fullPrompt });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          imageSize: params.outputQuality || '1K',
          aspectRatio: params.aspectRatio || '16:9',
          // Seed logic would go here if SDK supports it in config for this model version
        },
        // We use Thinking Config for complex reasoning if we were using a thinking model, 
        // but for image gen, we rely on prompt adherence.
      }
    });

    // Extract Image
    // Note: Gemini 3 Pro Image response handling
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data found in response");

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw new Error(error.message || "Failed to generate image");
  }
};
