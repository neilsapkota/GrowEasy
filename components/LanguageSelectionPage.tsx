import React from 'react';
import { Language } from '../types';

interface LanguageSelectionPageProps {
    languages: Language[];
    onSelectLanguage: (language: Language) => void;
}

const LanguageSelectionPage: React.FC<LanguageSelectionPageProps> = ({ languages, onSelectLanguage }) => {
    return (
        <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-slate-800 dark:text-white">Choose a language to learn</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-12">Let's get started on your next adventure!</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {languages.map((lang) => (
                    <button
                        key={lang.id}
                        onClick={() => onSelectLanguage(lang)}
                        className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50"
                    >
                        <span className="text-4xl sm:text-5xl mb-3">{lang.flag}</span>
                        <span className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200 text-center">{lang.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageSelectionPage;