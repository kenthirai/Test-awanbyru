import React, { useRef } from 'react';
import type { Model, AspectRatio, HistoryItem } from '../types';
import { MODELS, ASPECT_RATIOS } from '../constants';
import { SparkleIcon } from './icons/SparkleIcon';
import { UploadIcon } from './icons/UploadIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import CreativeTools from './CreativeTools';

interface ControlPanelProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    negativePrompt: string;
    setNegativePrompt: (prompt: string) => void;
    selectedModel: Model;
    setSelectedModel: (model: Model) => void;
    aspectRatio: AspectRatio;
    setAspectRatio: (aspectRatio: AspectRatio) => void;
    style: string;
    setStyle: (style: string) => void;
    numberOfImages: number;
    setNumberOfImages: (num: number) => void;
    handleGenerate: () => void;
    isLoading: boolean;
    isEditingMode: boolean;
    uploadedImage: { url: string; file: File } | null;
    setUploadedImage: (image: { url: string; file: File } | null) => void;
    history: HistoryItem[];
    onReuseHistory: (item: HistoryItem) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    prompt,
    setPrompt,
    negativePrompt,
    setNegativePrompt,
    selectedModel,
    setSelectedModel,
    aspectRatio,
    setAspectRatio,
    style,
    setStyle,
    numberOfImages,
    setNumberOfImages,
    handleGenerate,
    isLoading,
    isEditingMode,
    uploadedImage,
    setUploadedImage,
    history,
    onReuseHistory,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const STYLES = ['None', 'Photorealistic', 'Cinematic', 'Anime', 'Fantasy', 'Digital Art', 'Low Poly'];

    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const model = MODELS.find(m => m.id === e.target.value);
        if (model) {
            setSelectedModel(model);
        }
    };

    const handleAspectRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const ratio = ASPECT_RATIOS.find(r => r.value === e.target.value);
        if (ratio) {
            setAspectRatio(ratio);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadedImage({ url: URL.createObjectURL(file), file });
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg col-span-1 h-fit">
            <h2 className="text-2xl font-bold mb-4">Image Studio</h2>
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Prompt
                    </label>
                    <textarea
                        id="prompt"
                        rows={5}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="e.g., A cinematic shot of a raccoon in a library, 4k."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="negative-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Negative Prompt
                    </label>
                    <textarea
                        id="negative-prompt"
                        rows={2}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="e.g., blurry, watermark, text, low quality"
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                    />
                </div>

                {isEditingMode && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Upload Image
                        </label>
                        {uploadedImage ? (
                            <div className="relative">
                                <img src={uploadedImage.url} alt="Uploaded preview" className="w-full h-auto rounded-md" />
                                <button
                                    onClick={() => {
                                        setUploadedImage(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black/75 transition"
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
                )}

                <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Model
                    </label>
                    <select
                        id="model"
                        value={selectedModel.id}
                        onChange={handleModelChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                    >
                        {MODELS.filter(m => !m.id.includes('veo')).map(model => (
                            <option key={model.id} value={model.id} disabled={!model.isFunctional}>
                                {model.name} {!model.isFunctional && '(Not available)'}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedModel.description}</p>
                </div>

                {!isEditingMode && (
                     <details className="group border border-gray-200 dark:border-gray-700 rounded-lg" open>
                        <summary className="cursor-pointer list-none flex justify-between items-center text-sm font-medium text-gray-700 dark:text-gray-300 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-t-lg transition-colors">
                            Advanced Settings
                            <svg className="w-4 h-4 transform transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </summary>
                        <div className="space-y-4 p-4 border-t border-gray-200 dark:border-gray-700">
                             <div>
                                <label htmlFor="style" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Style</label>
                                <select
                                    id="style"
                                    value={style}
                                    onChange={(e) => setStyle(e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                                >
                                    {STYLES.map(s => (
                                        <option key={s} value={s.toLowerCase().replace(' ', '-')}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Aspect Ratio
                                </label>
                                <select
                                    id="aspect-ratio"
                                    value={aspectRatio.value}
                                    onChange={handleAspectRatioChange}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                                >
                                    {ASPECT_RATIOS.map(ratio => (
                                        <option key={ratio.value} value={ratio.value}>
                                            {ratio.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="number-of-images" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Number of Images <span className="text-gray-400">(1-4)</span>
                                </label>
                                <input
                                    type="number"
                                    id="number-of-images"
                                    value={numberOfImages}
                                    onChange={(e) => {
                                        let num = parseInt(e.target.value, 10);
                                        if (isNaN(num)) num = 1;
                                        setNumberOfImages(Math.max(1, Math.min(4, num)));
                                    }}
                                    min="1"
                                    max="4"
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                                />
                            </div>
                        </div>
                    </details>
                )}
            </div>
            
            <div className="my-6">
                <CreativeTools 
                    setPrompt={setPrompt} 
                    setNegativePrompt={setNegativePrompt}
                    history={history}
                    onReuseHistory={onReuseHistory}
                />
            </div>


            <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim() || (isEditingMode && !uploadedImage)}
                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition"
            >
                {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                    <>
                        <SparkleIcon />
                        <span className="ml-2">{isEditingMode ? 'Edit Image' : 'Generate'}</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default ControlPanel;