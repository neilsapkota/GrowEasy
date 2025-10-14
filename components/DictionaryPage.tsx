import React, { useState } from 'react';
import { Language, DictionaryEntry } from '../types';
import { getDictionaryEntry } from '../services/geminiService';
import { BookOpenIcon, VolumeUpIcon, SpinnerIcon } from './icons';

interface DictionaryPageProps {
    language: Language;
}

const DictionaryPage: React.FC<DictionaryPageProps> = ({ language }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [entry, setEntry] = useState<DictionaryEntry | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        
        setIsLoading(true);
        setError(null);
        setEntry(null);
        try {
            const result = await getDictionaryEntry(language, searchTerm.trim());
            setEntry(result);
        } catch (err) {
            setError(`Could not find a definition for "${searchTerm.trim()}". Please check the spelling and try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpeak = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language.id;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="px-4 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Dictionary</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Look up any word in {language.name}.</p>

            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search in ${language.name}...`}
                    className="flex-grow px-4 py-3 text-lg bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <button
                    type="submit"
                    disabled={isLoading || !searchTerm.trim()}
                    className="px-6 py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                    {isLoading ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : 'Search'}
                </button>
            </form>

            {error && (
                <div className="p-4 text-center bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg">
                    {error}
                </div>
            )}
            
            {!entry && !isLoading && !error && (
                <div className="text-center p-12 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    <BookOpenIcon className="w-24 h-24 mx-auto text-slate-300 dark:text-slate-600" />
                    <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">Your search results will appear here.</p>
                </div>
            )}

            {entry && (
                <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg animate-fade-in-up">
                    <div className="flex justify-between items-baseline">
                        <div>
                            <h3 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{entry.word}</h3>
                            {entry.pronunciation && (
                                <p className="text-lg text-slate-500 dark:text-slate-400 font-mono">/{entry.pronunciation}/</p>
                            )}
                        </div>
                        <button
                            onClick={() => handleSpeak(entry.word)}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
                            aria-label={`Pronounce ${entry.word}`}
                        >
                            <VolumeUpIcon className="w-8 h-8" />
                        </button>
                    </div>

                    <p className="mt-2 text-xl font-semibold text-slate-700 dark:text-slate-300">{entry.translation}</p>
                    
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
                        <div>
                            <h4 className="font-bold text-sm uppercase text-slate-400 dark:text-slate-500 tracking-wider">Definition</h4>
                            <p className="text-lg text-slate-600 dark:text-slate-300">{entry.definition}</p>
                        </div>
                         <div>
                            <h4 className="font-bold text-sm uppercase text-slate-400 dark:text-slate-500 tracking-wider">Example</h4>
                            <p className="text-lg italic text-slate-800 dark:text-slate-200">"{entry.exampleSentence}"</p>
                            <p className="text-md text-slate-500 dark:text-slate-400">"{entry.exampleTranslation}"</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DictionaryPage;