import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { generateInitialStory, continueInteractiveStory } from '../../services/geminiService';
import Loader from '../Loader';
import { SpinnerIcon } from '../icons';

interface InteractiveStoryPracticeProps {
    language: Language;
    onEnd: () => void;
}

const InteractiveStoryPractice: React.FC<InteractiveStoryPracticeProps> = ({ language, onEnd }) => {
    const [storyHistory, setStoryHistory] = useState<string[]>([]);
    const [currentSegment, setCurrentSegment] = useState<string>('');
    const [choices, setChoices] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEnded, setIsEnded] = useState(false);
    const storyEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        storyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [storyHistory]);

    useEffect(() => {
        const startStory = async () => {
            setIsLoading(true);
            try {
                const { storySegment, choices } = await generateInitialStory(language);
                setCurrentSegment(storySegment);
                setChoices(choices);
            } catch (error) {
                console.error("Failed to start story", error);
                setCurrentSegment("Sorry, I couldn't think of a story right now. Please try again later.");
                setChoices([]);
                setIsEnded(true);
            } finally {
                setIsLoading(false);
            }
        };
        startStory();
    }, [language]);

    const handleChoice = async (choice: string) => {
        setIsLoading(true);
        setStoryHistory(prev => [...prev, currentSegment, `> ${choice}`]);
        setCurrentSegment('');

        try {
            const fullHistory = [...storyHistory, currentSegment, `> ${choice}`].join('\n\n');
            const { storySegment, choices: newChoices } = await continueInteractiveStory(language, fullHistory, choice);
            setCurrentSegment(storySegment);
            if (newChoices && newChoices.length > 0) {
                setChoices(newChoices);
            } else {
                setChoices([]);
                setIsEnded(true);
            }
        } catch (error) {
            console.error("Failed to continue story", error);
            setCurrentSegment("Oops, I lost my train of thought! Let's end the story here for now.");
            setChoices([]);
            setIsEnded(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex flex-col h-[75vh] max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl sm:text-2xl font-bold">Interactive Story</h2>
                <button onClick={onEnd} className="font-bold text-slate-500 hover:underline">End Practice</button>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4">
                {storyHistory.map((segment, index) => (
                    <p key={index} className={`whitespace-pre-wrap ${segment.startsWith('>') ? 'text-teal-600 dark:text-teal-400 italic' : 'text-slate-700 dark:text-slate-300'}`}>
                        {segment}
                    </p>
                ))}
                {currentSegment && <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{currentSegment}</p>}
                {isLoading && <div className="flex justify-center p-4"><SpinnerIcon className="w-8 h-8 animate-spin text-teal-500" /></div>}
                <div ref={storyEndRef}></div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                {isEnded ? (
                    <div className="text-center">
                        <p className="font-bold text-lg mb-4">The End</p>
                        <button onClick={onEnd} className="w-full max-w-xs px-6 py-3 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600">
                            Finish Story
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {choices.map((choice, index) => (
                            <button
                                key={index}
                                onClick={() => handleChoice(choice)}
                                disabled={isLoading}
                                className="w-full p-4 text-left font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
                            >
                                {choice}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InteractiveStoryPractice;