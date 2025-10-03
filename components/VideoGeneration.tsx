import React, { useState, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { SparkleIcon } from './icons/SparkleIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { VideoCameraIcon } from './icons/VideoCameraIcon';

interface VideoGenerationProps {
    onGenerate: (prompt: string, imageFile?: File) => void;
    isLoading: boolean;
    error: string | null;
    videoUrl: string | null;
}

const VideoGeneration: React.FC<VideoGenerationProps> = ({ onGenerate, isLoading, error, videoUrl }) => {
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState<{ url: string; file: File } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage({ url: URL.createObjectURL(file), file });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(prompt, image?.file);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Video Generation Studio</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="video-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Prompt
                        </label>
                        <textarea
                            id="video-prompt"
                            rows={3}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="e.g., A cinematic shot of a cat driving a car through a neon-lit city."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Optional: Upload an image to animate
                        </label>
                         {image ? (
                            <div className="relative w-48">
                                <img src={image.url} alt="Uploaded preview" className="w-full h-auto rounded-md" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-black/75 transition"
                                >
                                    <XMarkIcon />
                                </button>
                            </div>
                        ) : (
                            <div
                                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <UploadIcon />
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Click to upload an image
                                </p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !prompt.trim()}
                        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <SparkleIcon />
                                <span className="ml-2">Generate Video</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
            
            <div className="mt-8">
                {isLoading && (
                    <div className="text-center p-8 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                        <div className="animate-pulse flex flex-col items-center">
                            <VideoCameraIcon />
                            <p className="mt-2 font-semibold">Generating video...</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">This can take a few minutes. Please keep this page open.</p>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="text-center bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <p className="text-red-600 dark:text-red-400 font-bold">Error</p>
                        <p className="text-red-500 dark:text-red-300 mt-1">{error}</p>
                    </div>
                )}
                {videoUrl && !isLoading && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Generated Video</h3>
                        <video src={videoUrl} controls autoPlay loop className="w-full rounded-lg"></video>
                    </div>
                )}
            </div>

        </div>
    );
};

export default VideoGeneration;
