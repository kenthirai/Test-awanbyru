import React from 'react';
import { RectangleGroupIcon } from './icons/RectangleGroupIcon';

const PhotoStitching: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 mt-10">
            <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-full">
                <RectangleGroupIcon />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Photo Stitching</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
                This feature is coming soon!
            </p>
        </div>
    );
};

export default PhotoStitching;
