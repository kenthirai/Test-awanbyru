import React from 'react';
import { XMarkIcon } from './icons/XMarkIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md m-4 transform transition-all"
                style={{ transform: 'scale(1)', opacity: 1 }}
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex justify-between items-start">
                         <div className="flex items-center">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 sm:mx-0 sm:h-10 sm:w-10">
                               <InformationCircleIcon />
                            </div>
                            <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-white ml-4" id="modal-title">
                                {title}
                            </h3>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Close"
                        >
                            <XMarkIcon />
                        </button>
                    </div>
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                        {children}
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 flex flex-row-reverse rounded-b-2xl">
                    <button 
                        type="button" 
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm dark:focus:ring-offset-gray-800" 
                        onClick={onClose}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;