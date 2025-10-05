import React, { useState } from 'react';
import { Language } from '../types';
import HeroIllustration from './HeroIllustration';

interface LanguageSelectionPageProps {
    languages: Language[];
    onSelectLanguage: (language: Language) => void;
}

const LanguageSelectionPage: React.FC<LanguageSelectionPageProps> = ({ languages, onSelectLanguage }) => {
    
    const [showLanguages, setShowLanguages] = useState(false);

    const handleGetStartedClick = () => {
        setShowLanguages(true);
    };

    return (
        <div className="text-center">
            {!showLanguages ? (
                // Hero Section
                <div className="grid md:grid-cols-2 items-center gap-12 min-h-[80vh]">
                    <div className="flex justify-center mb-8 md:mb-0 animate-fade-in-up">
                        <HeroIllustration className="w-full max-w-md" />
                    </div>
                    <div className="text-left md:text-left animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-800 dark:text-white leading-tight">
                            The free, fun, and effective way to learn a language!
                        </h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <button 
                                onClick={handleGetStartedClick}
                                className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-green-500 rounded-2xl border-b-4 border-green-700 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform transform hover:-translate-y-1 active:scale-95 uppercase tracking-wider"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // Language Grid Section
                <div id="language-grid" className="animate-fade-in">
                    <h2 className="text-3xl md:text-4xl font-extrabold my-8 text-slate-800 dark:text-white">
                        I want to learn...
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {languages.map((lang, index) => (
                            <button
                                key={lang.id}
                                onClick={() => onSelectLanguage(lang)}
                                className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 animate-fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <span className="text-4xl sm:text-5xl mb-3">{lang.flag}</span>
                                <span className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200 text-center">{lang.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSelectionPage;