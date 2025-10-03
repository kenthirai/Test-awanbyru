import React from 'react';
import { SparkleIcon } from './icons/SparkleIcon';
// Fix: Use named import for ThemeToggle.
import { ThemeToggle } from './ThemeToggle';

const Header: React.FC = () => {
    return (
        <header className="py-4 px-4 md:px-8 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <SparkleIcon />
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Image Universe</h1>
                </div>
                <div className="flex items-center">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};

export default Header;
