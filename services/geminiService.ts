import { GoogleGenAI, Modality } from '@google/genai';
import type { AspectRatio } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateImages = async (prompt: string, aspectRatio: AspectRatio['value'], numberOfImages: number): Promise<string[]> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt,
            config: {
                numberOfImages,
                outputMimeType: 'image/jpeg',
                aspectRatio,
            },
        });

        return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
    } catch (error) {
        console.error("Error generating images:", error);
        throw error;
    }
};

export const editImage = async (prompt: string, image: { data: string; mimeType: string }): Promise<{ text: string | null, image: string | null }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: image.data,
                            mimeType: image.mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        let textPart: string | null = null;
        let imagePart: string | null = null;
        
        if (response.candidates && response.candidates.length > 0 && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.text) {
                    textPart = part.text;
                } else if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    imagePart = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                }
            }
        }
        return { text: textPart, image: imagePart };

    } catch (error) {
        console.error("Error editing image:", error);
        throw error;
    }
};

export const generateVideo = async (prompt: string, image?: { data: string; mimeType: string }): Promise<string> => {
    try {
        const request: any = {
            model: 'veo-2.0-generate-001',
            prompt,
            config: {
                numberOfVideos: 1,
            },
        };

        if (image) {
            request.image = {
                imageBytes: image.data,
                mimeType: image.mimeType,
            };
        }

        let operation = await ai.models.generateVideos(request);

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Video generation failed, no download link found.");
        }
        
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) {
            throw new Error(`Failed to download video: ${response.statusText}`);
        }
        const videoBlob = await response.blob();
        return URL.createObjectURL(videoBlob);

    } catch (error) {
        console.error("Error generating video:", error);
        throw error;
    }
};

export const translateText = async (text: string, from: string, to: string): Promise<string> => {
    try {
        if (!text.trim()) {
            return '';
        }
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate the following text from ${from} to ${to}. Only provide the translated text, without any preamble or explanation.\n\nText: "${text}"`,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error translating text:", error);
        throw error;
    }
};
