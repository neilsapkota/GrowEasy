import React, { useState, useEffect } from 'react';
import { Language, GrammarTip } from '../types';
import { generateGrammarTip } from '../services/geminiService';
import { SpinnerIcon } from './icons';

interface GrammarTipCardProps {
    language: Language;
}

const GrammarTipCard: React.FC<GrammarTipCardProps> = ({ language }) => {
    const [tip, setTip] = useState<GrammarTip | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTip = async () => {
        setIsLoading(true);
        try {
            const newTip = await generateGrammarTip(language);
            setTip(newTip);
        } catch (error) {
            console.error(error);
            setTip(null); // Or set an error state
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTip();
    }, [language]);
    
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Grammar Tip of the Day</h3>
            {isLoading ? (
                <div className="flex items-center justify-center h-24">
                    <SpinnerIcon className="w-8 h-8 animate-spin text-teal-500" />
                </div>
            ) : tip ? (
                <div>
                    <h4 className="font-semibold text-teal-600 dark:text-teal-400">{tip.tip}</h4>
                    <p className="text-slate-600 dark:text-slate-300 my-2">{tip.explanation}</p>
                    <p className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md italic">"{tip.example}"</p>
                    <button onClick={fetchTip} className="text-sm font-bold text-sky-500 hover:underline mt-4">
                        New Tip
                    </button>
                </div>
            ) : (
                <p className="text-slate-500">Could not load a grammar tip. Please try again.</p>
            )}
        </div>
    );
};

export default GrammarTipCard;