import React, { useState, useEffect } from 'react';
import { Language, WritingFeedback } from '../../types';
import { generateWritingPrompt, evaluateWriting } from '../../services/geminiService';
import Loader from '../Loader';
import { SpinnerIcon, CheckCircleIcon } from '../icons';

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const sqSize = 100;
    const strokeWidth = 10;
    const radius = (sqSize - strokeWidth) / 2;
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - dashArray * (score / 100);

    return (
        <div className="relative" style={{ width: sqSize, height: sqSize }}>
            <svg width={sqSize} height={sqSize} viewBox={viewBox} className="-rotate-90">
                <circle
                    className="text-slate-200 dark:text-slate-700"
                    cx={sqSize / 2} cy={sqSize / 2} r={radius}
                    strokeWidth={`${strokeWidth}px`} fill="none" stroke="currentColor"
                />
                <circle
                    className="text-indigo-500 transition-all duration-1000 ease-in-out"
                    cx={sqSize / 2} cy={sqSize / 2} r={radius}
                    strokeWidth={`${strokeWidth}px`} fill="none" stroke="currentColor"
                    strokeLinecap="round"
                    style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{score}</span>
            </div>
        </div>
    );
};


const WritingPractice: React.FC<{ language: Language; onEnd: () => void; }> = ({ language, onEnd }) => {
    const [prompt, setPrompt] = useState<string | null>(null);
    const [userText, setUserText] = useState('');
    const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPrompt = async () => {
        setIsLoading(true);
        setFeedback(null);
        setUserText('');
        setError(null);
        try {
            const newPrompt = await generateWritingPrompt(language);
            setPrompt(newPrompt);
        } catch (err) {
            setError("Failed to fetch a writing prompt. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPrompt();
    }, [language]);

    const handleSubmit = async () => {
        if (!prompt || !userText.trim()) return;
        setIsEvaluating(true);
        setError(null);
        try {
            const result = await evaluateWriting(language, prompt, userText);
            setFeedback(result);
        } catch (err) {
            setError("Sorry, we couldn't evaluate your writing. Please try again.");
        } finally {
            setIsEvaluating(false);
        }
    };

    if (isLoading) {
        return <Loader message="Getting a writing prompt for you..." />;
    }

    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold">Writing Workshop</h2>
                <button onClick={onEnd} className="font-bold text-slate-500 hover:underline">End Practice</button>
            </div>

            {error && <div className="p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg mb-4">{error}</div>}

            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg mb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">Prompt:</p>
                <p className="text-lg font-semibold">{prompt}</p>
            </div>
            
            {feedback ? (
                <div className="animate-fade-in space-y-6">
                    <div>
                        <h3 className="font-bold text-lg mb-2 text-slate-700 dark:text-slate-300">Your Submission:</h3>
                        <p className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg whitespace-pre-wrap">{userText}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2 text-slate-700 dark:text-slate-300">Feedback:</h3>
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-4">
                            <div className="flex items-center gap-6">
                                <ScoreCircle score={feedback.score} />
                                <p className="flex-1 text-lg text-slate-600 dark:text-slate-300">{feedback.summary}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-md mb-2">Suggestions for improvement:</h4>
                                <ul className="space-y-2">
                                    {feedback.suggestions.map((suggestion, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <CheckCircleIcon className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                                            <span>{suggestion}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={fetchPrompt} className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                            Try another prompt
                        </button>
                        <button onClick={onEnd} className="w-full px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                            Finish
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <textarea
                        value={userText}
                        onChange={(e) => setUserText(e.target.value)}
                        placeholder={`Write your response in ${language.name}...`}
                        className="w-full min-h-[150px] p-3 text-lg bg-slate-50 dark:bg-slate-900/50 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={isEvaluating}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!userText.trim() || isEvaluating}
                        className="w-full flex items-center justify-center px-6 py-4 text-lg font-bold text-white bg-indigo-500 rounded-lg border-b-4 border-indigo-700 hover:bg-indigo-600 disabled:bg-slate-400 disabled:border-slate-500 disabled:cursor-not-allowed transition-all active:translate-y-0.5"
                    >
                        {isEvaluating ? (
                            <>
                                <SpinnerIcon className="w-6 h-6 mr-2 animate-spin" />
                                Evaluating...
                            </>
                        ) : 'Submit for Feedback'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default WritingPractice;
