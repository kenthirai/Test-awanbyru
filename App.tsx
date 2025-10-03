import React, { useState } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ImageDisplay from './components/ImageDisplay';
import { handleGeminiError } from './utils/errorHandler';
import type { Model, AspectRatio, HistoryItem } from './types';
import { MODELS, ASPECT_RATIOS } from './constants';
import { generateImages, editImage, generateVideo } from './services/geminiService';
import VideoGeneration from './components/VideoGeneration';
import PhotoRestoration from './components/PhotoRestoration';
import PhotoStitching from './components/PhotoStitching';
import { PhotoIcon } from './components/icons/PhotoIcon';
import { VideoCameraIcon } from './components/icons/VideoCameraIcon';
import { WrenchIcon } from './components/icons/WrenchIcon';
import { RectangleGroupIcon } from './components/icons/RectangleGroupIcon';
import Modal from './components/Modal';

type Tab = 'image' | 'video' | 'restoration' | 'stitching';

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [negativePrompt, setNegativePrompt] = useState<string>('');
    const [images, setImages] = useState<string[]>([]);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<Model>(MODELS[0]);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]);
    const [style, setStyle] = useState<string>('none');
    const [numberOfImages, setNumberOfImages] = useState<number>(1);
    const [uploadedImage, setUploadedImage] = useState<{ url: string; file: File } | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('image');
    const [editedImageResult, setEditedImageResult] = useState<{ text: string | null, image: string | null } | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<{ title: string; message: string; }>({ title: '', message: '' });

    const handleModelSelection = (model: Model) => {
        if (model.isFunctional) {
            setSelectedModel(model);
            if (!model.isEditing) {
                setUploadedImage(null);
            }
        } else {
            setModalContent({
                title: `${model.name} is Not Available`,
                message: "This application is built to showcase Google's powerful AI models and is not integrated with other services. Please select one of the available, functional models to continue creating."
            });
            setIsModalOpen(true);
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setImages([]);
        setEditedImageResult(null);

        try {
            if (selectedModel.isEditing) {
                if (!uploadedImage) {
                    throw new Error("Please upload an image to edit.");
                }
                const base64data = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(uploadedImage.file);
                    reader.onload = () => resolve((reader.result as string).split(',')[1]);
                    reader.onerror = error => reject(error);
                });
                
                const result = await editImage(prompt, { data: base64data, mimeType: uploadedImage.file.type });
                setEditedImageResult(result);
                if (result.image) {
                    setImages([result.image]);
                }
            } else {
                let engineeredPrompt = prompt.trim();
                if (style !== 'none') {
                    engineeredPrompt = `${style.replace('-', ' ')} style, ${engineeredPrompt}`;
                }

                const fullPrompt = negativePrompt.trim()
                    ? `${engineeredPrompt}. Negative prompt: ${negativePrompt.trim()}`
                    : engineeredPrompt;

                const generatedImages = await generateImages(fullPrompt, aspectRatio.value, numberOfImages);
                setImages(generatedImages);

                if (generatedImages.length > 0) {
                    const newHistoryItem: HistoryItem = {
                        id: Date.now().toString(),
                        image: generatedImages[0],
                        prompt,
                        negativePrompt,
                        modelName: selectedModel.name,
                        aspectRatio: aspectRatio.value,
                        style,
                        numberOfImages,
                    };
                    setHistory(prevHistory => [newHistoryItem, ...prevHistory].slice(0, 20));
                }
            }
        } catch (err) {
            setError(handleGeminiError(err).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateVideo = async (videoPrompt: string, imageFile?: File) => {
        if (!videoPrompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);

        try {
            let imagePayload;
            if (imageFile) {
                const base64data = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(imageFile);
                    reader.onload = () => resolve((reader.result as string).split(',')[1]);
                    reader.onerror = error => reject(error);
                });
                imagePayload = { data: base64data, mimeType: imageFile.type };
            }
            const url = await generateVideo(videoPrompt, imagePayload);
            setVideoUrl(url);
        } catch (err) {
            setError(handleGeminiError(err).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReuseHistory = (item: HistoryItem) => {
        setPrompt(item.prompt);
        setNegativePrompt(item.negativePrompt);
        const model = MODELS.find(m => m.name === item.modelName);
        if (model && model.isFunctional && !model.isEditing) {
            setSelectedModel(model);
        }
        const ratio = ASPECT_RATIOS.find(r => r.value === item.aspectRatio);
        if (ratio) {
            setAspectRatio(ratio);
        }
        setStyle(item.style);
        setNumberOfImages(item.numberOfImages);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const isEditingMode = selectedModel.isEditing;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'image':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8">
                        <ControlPanel
                            prompt={prompt}
                            setPrompt={setPrompt}
                            negativePrompt={negativePrompt}
                            setNegativePrompt={setNegativePrompt}
                            selectedModel={selectedModel}
                            setSelectedModel={handleModelSelection}
                            aspectRatio={aspectRatio}
                            setAspectRatio={setAspectRatio}
                            style={style}
                            setStyle={setStyle}
                            numberOfImages={numberOfImages}
                            setNumberOfImages={setNumberOfImages}
                            handleGenerate={handleGenerate}
                            isLoading={isLoading}
                            isEditingMode={isEditingMode}
                            uploadedImage={uploadedImage}
                            setUploadedImage={setUploadedImage}
                            history={history}
                            onReuseHistory={handleReuseHistory}
                        />
                        <ImageDisplay
                            images={images}
                            isLoading={isLoading}
                            error={error}
                            prompt={prompt}
                            isEditingMode={isEditingMode}
                            editedImageText={editedImageResult?.text}
                        />
                    </div>
                );
            case 'video':
                return <VideoGeneration 
                    onGenerate={handleGenerateVideo} 
                    isLoading={isLoading}
                    error={error}
                    videoUrl={videoUrl}
                 />;
            case 'restoration':
                return <PhotoRestoration />;
            case 'stitching':
                return <PhotoStitching />;
            default:
                return null;
        }
    };
    
    const TABS: { id: Tab, name: string, icon: React.ReactNode }[] = [
        { id: 'image', name: 'Image Studio', icon: <PhotoIcon /> },
        { id: 'video', name: 'Video Studio', icon: <VideoCameraIcon /> },
        { id: 'restoration', name: 'Photo Restoration', icon: <WrenchIcon /> },
        { id: 'stitching', name: 'Photo Stitching', icon: <RectangleGroupIcon /> },
    ];

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        setError(null);
        setImages([]);
        setVideoUrl(null);
        setPrompt('');
        setNegativePrompt('');
        setUploadedImage(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <Header />
            <main className="container mx-auto">
                <div className="flex justify-center p-4">
                    <div className="flex space-x-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-full">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-800 ${
                                    activeTab === tab.id
                                        ? 'bg-white text-indigo-600 shadow-sm dark:bg-indigo-600 dark:text-white'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                {tab.icon}
                                <span className="ml-2 hidden sm:inline">{tab.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                {renderTabContent()}
            </main>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalContent.title}
            >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {modalContent.message}
                </p>
            </Modal>
        </div>
    );
};

export default App;