import React, { useState, useEffect } from 'react';
import type { HistoryItem } from '../types';
import { WandIcon } from './icons/WandIcon';
import { LanguageIcon } from './icons/LanguageIcon';
import { ClockIcon } from './icons/ClockIcon';
import { translateText } from '../services/geminiService';
import { handleGeminiError } from '../utils/errorHandler';

const AccordionItem: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
}> = ({ title, icon, children, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center p-3 text-left font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition"
                aria-expanded={isOpen}
            >
                <div className="flex items-center space-x-2">
                    {icon}
                    <span>{title}</span>
                </div>
                <svg
                    className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
                    {children}
                </div>
            </div>
        </div>
    );
};

const PromptCreator: React.FC<{ setPrompt: (p: string) => void }> = ({ setPrompt }) => {
    const [promptParts, setPromptParts] = useState({ subject: '', style: '', setting: '', composition: '', lighting: '' });
    const [generatedPrompt, setGeneratedPrompt] = useState('');

    useEffect(() => {
        const { subject, style, setting, composition, lighting } = promptParts;
        const fullPrompt = [subject, style, setting, composition, lighting].filter(Boolean).join(', ');
        setGeneratedPrompt(fullPrompt);
    }, [promptParts]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPromptParts({ ...promptParts, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <input type="text" name="subject" placeholder="Subject (e.g., a majestic lion)" onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700" />
                 <input type="text" name="setting" placeholder="Setting (e.g., in the Serengeti)" onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700" />
                <select name="style" onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                    <option value="">Style</option>
                    <option value="photorealistic">Photorealistic</option>
                    <option value="oil painting">Oil Painting</option>
                    <option value="cartoon">Cartoon</option>
                    <option value="cyberpunk">Cyberpunk</option>
                </select>
                <select name="composition" onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                    <option value="">Composition</option>
                    <option value="close-up shot">Close-up shot</option>
                    <option value="wide-angle shot">Wide-angle shot</option>
                    <option value="portrait">Portrait</option>
                </select>
            </div>
            {generatedPrompt && (
                <div className="p-2 bg-gray-200 dark:bg-gray-800 rounded-md">
                    <p className="font-mono text-xs">{generatedPrompt}</p>
                    <button onClick={() => setPrompt(generatedPrompt)} className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Use this prompt</button>
                </div>
            )}
        </div>
    );
};

const Translator: React.FC<{ setPrompt: (p: string) => void; setNegativePrompt: (p: string) => void }> = ({ setPrompt, setNegativePrompt }) => {
    const [text, setText] = useState('');
    const [translated, setTranslated] = useState('');
    const [sourceLang, setSourceLang] = useState('Indonesian');
    const [targetLang, setTargetLang] = useState('English');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTranslate = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await translateText(text, sourceLang, targetLang);
            setTranslated(result);
        } catch (err) {
            setError(handleGeminiError(err).message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
                <select value={sourceLang} onChange={e => setSourceLang(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                    <option>Indonesian</option>
                    <option>English</option>
                </select>
                <select value={targetLang} onChange={e => setTargetLang(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                    <option>English</option>
                    <option>Indonesian</option>
                </select>
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={3} placeholder="Text to translate..." className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"></textarea>
            <button onClick={handleTranslate} disabled={loading || !text} className="w-full text-xs font-bold py-2 px-3 rounded-md bg-indigo-500 text-white disabled:bg-indigo-300 dark:disabled:bg-indigo-800">
                {loading ? 'Translating...' : 'Translate'}
            </button>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            {translated && (
                <div className="p-2 bg-gray-200 dark:bg-gray-800 rounded-md">
                    <p className="text-xs">{translated}</p>
                    <div className="mt-2 space-x-2">
                        <button onClick={() => setPrompt(translated)} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Use as Prompt</button>
                        <button onClick={() => setNegativePrompt(translated)} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Use as Negative</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const History: React.FC<{ history: HistoryItem[]; onReuseHistory: (item: HistoryItem) => void }> = ({ history, onReuseHistory }) => {
    if (history.length === 0) {
        return <p className="text-xs text-center text-gray-500 dark:text-gray-400">Your generation history will appear here.</p>;
    }
    return (
        <ul className="space-y-2 max-h-72 overflow-y-auto pr-2">
            {history.map(item => (
                <li 
                    key={item.id} 
                    className="group flex items-start space-x-3 p-2 rounded-lg bg-white dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer" 
                    onClick={() => onReuseHistory(item)}
                >
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                            src={item.image} 
                            alt={item.prompt}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                        />
                    </div>
                    <div className="text-xs overflow-hidden flex-grow">
                        <p className="truncate font-medium" title={item.prompt}>{item.prompt}</p>
                        {item.negativePrompt && <p className="truncate text-gray-500 dark:text-gray-400" title={item.negativePrompt}>Negative: {item.negativePrompt}</p>}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation(); 
                                onReuseHistory(item);
                            }} 
                            className="mt-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Reuse settings
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};


const CreativeTools: React.FC<{
    setPrompt: (p: string) => void;
    setNegativePrompt: (p: string) => void;
    history: HistoryItem[];
    onReuseHistory: (item: HistoryItem) => void;
}> = (props) => {
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const toggleAccordion = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    const tools = [
        { id: 'creator', title: 'Prompt Creator', icon: <WandIcon />, content: <PromptCreator setPrompt={props.setPrompt} /> },
        { id: 'translator', title: 'Translator', icon: <LanguageIcon />, content: <Translator setPrompt={props.setPrompt} setNegativePrompt={props.setNegativePrompt} /> },
        { id: 'history', title: 'History', icon: <ClockIcon />, content: <History history={props.history} onReuseHistory={props.onReuseHistory} /> }
    ];

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            {tools.map(tool => (
                <AccordionItem
                    key={tool.id}
                    title={tool.title}
                    icon={tool.icon}
                    isOpen={openAccordion === tool.id}
                    onClick={() => toggleAccordion(tool.id)}
                >
                    {tool.content}
                </AccordionItem>
            ))}
        </div>
    );
};

export default CreativeTools;