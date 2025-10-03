import React from 'react';
import { PhotoIcon } from './icons/PhotoIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageDisplayProps {
    images: string[];
    isLoading: boolean;
    error: string | null;
    prompt: string;
    isEditingMode: boolean;
    editedImageText: string | null;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ images, isLoading, error, prompt, isEditingMode, editedImageText }) => {
    
    const handleDownload = (imageUrl: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `gemini-image-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 mb-4"></div>
                    <p className="text-lg font-semibold">Generating your masterpiece...</p>
                    <p className="text-gray-500 dark:text-gray-400">This can take a few moments. Please wait.</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 font-bold text-lg">Oops! Something went wrong.</p>
                    <p className="text-red-500 dark:text-red-300 mt-2">{error}</p>
                </div>
            );
        }

        if (images.length > 0) {
            return (
                <div>
                    {isEditingMode && editedImageText && (
                        <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                            <h3 className="font-semibold text-indigo-800 dark:text-indigo-200">Model's Response:</h3>
                            <p className="text-indigo-700 dark:text-indigo-300">{editedImageText}</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 gap-4">
                        {images.map((img, index) => (
                            <div key={index} className="relative group">
                                <img src={img} alt={`Generated image ${index + 1} for prompt: ${prompt}`} className="w-full h-auto object-contain rounded-lg shadow-md" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        onClick={() => handleDownload(img)}
                                        className="text-white bg-indigo-600 hover:bg-indigo-700 p-3 rounded-full transition-transform transform-gpu group-hover:scale-110"
                                        title="Download Image"
                                    >
                                        <DownloadIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                <PhotoIcon />
                <h3 className="mt-4 text-xl font-semibold">Your creations will appear here</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                    Use the panel on the left to generate or edit an image.
                </p>
            </div>
        );
    };

    return (
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg min-h-[60vh] flex flex-col">
            {renderContent()}
        </div>
    );
};

export default ImageDisplay;
