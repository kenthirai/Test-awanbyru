import type { Model, AspectRatio } from './types';

export const MODELS: Model[] = [
    // Fix: Updated model ID to 'imagen-4.0-generate-001'
    { id: 'imagen-4.0-generate-001', name: 'Imagen 4.0', isFunctional: true, isEditing: false, description: 'Google\'s most advanced text-to-image model.' },
    // Fix: Updated model ID to 'gemini-2.5-flash-image-preview'
    { id: 'gemini-2.5-flash-image-preview', name: 'Nano Banana', isFunctional: true, isEditing: true, description: 'Edit images with text prompts. Requires an image upload.' },
    { id: 'dall-e-3', name: 'DALL-E 3', isFunctional: false, isEditing: false, description: 'A powerful image generator by OpenAI. (Not available)' },
    { id: 'midjourney-v6', name: 'Midjourney v6', isFunctional: false, isEditing: false, description: 'Known for artistic and stylized image generation. (Not available)' },
    { id: 'stable-diffusion-3', name: 'Stable Diffusion 3', isFunctional: false, isEditing: false, description: 'The latest from Stability AI. (Not available)' },
    { id: 'flux-1', name: 'FLUX.1.1', isFunctional: false, isEditing: false, description: 'A fast and efficient image generation model. (Not available)' },
    // Fix: Updated model ID to 'veo-2.0-generate-001' and marked as functional
    { id: 'veo-2.0-generate-001', name: 'Veo 2.0', isFunctional: true, isEditing: false, description: 'Google\'s state-of-the-art text-to-video model.' },
    { id: 'project-astra', name: 'Project Astra', isFunctional: false, isEditing: false, description: 'Google\'s universal AI agent project. (Not available)' }
];

export const ASPECT_RATIOS: AspectRatio[] = [
    { label: 'Square (1:1)', value: '1:1' },
    { label: 'Landscape (16:9)', value: '16:9' },
    { label: 'Portrait (9:16)', value: '9:16' },
    { label: 'Standard (4:3)', value: '4:3' },
    { label: 'Classic (3:4)', value: '3:4' },
];
