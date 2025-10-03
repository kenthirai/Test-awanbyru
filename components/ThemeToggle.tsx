import React, { useState, useEffect } from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { ComputerDesktopIcon } from './icons/ComputerDesktopIcon';

type Theme = 'light' | 'dark' | 'system';

// Fix: The component was incomplete. Added return statement with JSX and used a named export.
export const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('system');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const updateTheme = () => {
            if (theme === 'system') {
                localStorage.removeItem('theme');
                if (mediaQuery.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            } else {
                localStorage.setItem('theme', theme);
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        };

        updateTheme();

        mediaQuery.addEventListener('change', updateTheme);
        return () => mediaQuery.removeEventListener('change', updateTheme);
    }, [theme]);

    const getNextTheme = (): Theme => {
        if (theme === 'light') return 'dark';
        if (theme === 'dark') return 'system';
        return 'light';
    };

    const getTitle = (): string => {
        const nextTheme = getNextTheme();
        return `Switch to ${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)} mode`;
    }

    const renderIcon = () => {
        switch (theme) {
            case 'light':
                return <SunIcon />;
            case 'dark':
                return <MoonIcon />;
            case 'system':
            default:
                return <ComputerDesktopIcon />;
        }
    };

    return (
        <button
            onClick={() => setTheme(getNextTheme())}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title={getTitle()}
        >
            {renderIcon()}
        </button>
    );
};
