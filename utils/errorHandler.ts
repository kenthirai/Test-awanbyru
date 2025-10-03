export const handleGeminiError = (error: unknown): Error => {
    if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        // Check for specific error patterns from the Gemini API
        if (errorMessage.includes("api_key_invalid") || errorMessage.includes("api key not valid")) {
            return new Error("Invalid API Key. Please ensure your API key is configured correctly.");
        }
        if (errorMessage.includes("safety") || errorMessage.includes("blocked")) {
            return new Error("The request was blocked due to safety policies. Please modify your prompt or image.");
        }
        if (errorMessage.includes("429") || errorMessage.includes("resource has been exhausted")) {
            return new Error("The service is currently busy (Rate limit exceeded). Please try again in a few moments.");
        }
        if (errorMessage.includes("model 'imagen-4.0-generate-001' is not found")) {
            return new Error("The specified image generation model is not available. Please contact support.");
        }

        // Return the original error message if it's a specific one we've thrown
        return error;
    }
    
    // Fallback for non-Error objects
    return new Error("An unknown error occurred. Please check the console for more details.");
};
