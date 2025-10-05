import React, { useState, useEffect } from 'react';
import { Language, Story } from '../../types';
import { generateStory } from '../../services/geminiService';
import Loader from '../Loader';
import { BookOpenIcon } from '../icons';

interface StoriesPracticeProps {
    language: Language;
    onEnd: () => void;
}

const StoriesPractice: React.FC<StoriesPracticeProps> = ({ language, onEnd }) => {
    const [story, setStory] = useState<Story | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStory = async () => {
        setIsLoading(true);
        try {
            const newStory = await generateStory(language);
            setStory(newStory);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchStory();
    }, [language]);

    if (isLoading) return <Loader message="Generating a new story for you..." />;
    if (!story) return <div className="text-center p-4">Could not load a story. <button onClick={onEnd} className="underline">Go back</button>.</div>;

    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-3"><BookOpenIcon className="w-8 h-8 text-emerald-500" /> Story Time</h2>
                <button onClick={onEnd} className="font-bold text-slate-500">End Practice</button>
            </div>
            
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg space-y-4">
                 <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{story.title}</h3>
                 <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{story.content}</p>
                 <span className="inline-block bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-2 py-1 rounded-full">{story.level}</span>
            </div>
            
            <div className="text-center mt-6">
                 <button onClick={fetchStory} className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600">
                    Read Another Story
                </button>
            </div>
        </div>
    );
};

export default StoriesPractice;