import React from 'react';
import { WrenchIcon } from './icons/WrenchIcon';

const PhotoRestoration: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 mt-10">
            <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-full">
                <WrenchIcon />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Photo Restoration</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
                This feature is coming soon!
            </p>
        </div>
    );
};

export default PhotoRestoration;
