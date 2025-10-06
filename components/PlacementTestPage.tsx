
import React, { useState, useEffect } from 'react';
import { Language, PlacementTestQuestion, PlacementTestResult } from '../types';
import { generatePlacementTestQuestion, evaluatePlacementTest } from '../services/geminiService';
import Loader from './Loader';
import { CheckCircleIcon, XCircleIcon, StarIcon, ShieldCheckIcon } from './icons';

const TEST_LENGTH = 5;

interface PlacementTestPageProps {
    language: Language;
    onComplete: (completedTopics: string[]) => void;
    onSkip: () => void;
}

const IntroScreen: React.FC<{ onStart: () => void, onSkip: () => void, name: string }> = ({ onStart, onSkip, name }) => (
    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md mx-auto animate-fade-in">
        <ShieldCheckIcon className="w-20 h-20 text-teal-500 mx-auto mb-4" />
        {/* FIX: Use the 'name' prop passed from the parent component instead of an undefined variable. */}
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">New to {name}?</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">Take a short test to find your level. It only takes a minute!</p>
        <div className="space-y-4">
            <button
                onClick={onStart}
                className="w-full px-6 py-4 text-lg font-bold text-white uppercase bg-teal-500 rounded-2xl border-b-4 border-teal-700 hover:bg-teal-600 transition-all active:translate-y-0.5"
            >
                Find my level
            </button>
            <button
                onClick={onSkip}
                className="w-full px-6 py-3 font-bold text-teal-600 dark:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-colors"
            >
                No thanks, start from scratch
            </button>
        </div>
    </div>
);

const ResultsScreen: React.FC<{ result: PlacementTestResult, onContinue: () => void }> = ({ result, onContinue }) => {
    const xpGained = result.completedTopics.length * 10;
    return (
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md mx-auto animate-fade-in">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Great job!</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">{result.summary}</p>
            {result.completedTopics.length > 0 && (
                <div className="mt-4">
                    <p className="text-slate-500 dark:text-slate-400">You've unlocked <span className="font-bold">{result.completedTopics.length}</span> lesson{result.completedTopics.length > 1 ? 's' : ''} and earned some XP!</p>
                    <div className="mt-2 flex items-center justify-center p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
                        <StarIcon className="w-8 h-8 text-amber-500 mr-2" />
                        <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">+{xpGained} XP</span>
                    </div>
                </div>
            )}
            <button
                onClick={onContinue}
                className="mt-8 w-full px-6 py-4 text-lg font-bold text-white uppercase bg-green-500 rounded-2xl border-b-4 border-green-700 hover:bg-green-600 transition-all active:translate-y-0.5"
            >
                Continue to my path
            </button>
        </div>
    );
};

const PlacementTestPage: React.FC<PlacementTestPageProps> = ({ language, onComplete, onSkip }) => {
    const [status, setStatus] = useState<'intro' | 'testing' | 'evaluating' | 'results'>('intro');
    const [history, setHistory] = useState<{ question: PlacementTestQuestion; userAnswer: string; isCorrect: boolean }[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<PlacementTestQuestion | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<PlacementTestResult | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'incorrect'>('idle');

    const fetchNextQuestion = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const question = await generatePlacementTestQuestion(language, history);
            setCurrentQuestion(question);
        } catch (err) {
            setError("Failed to load the next question. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartTest = () => {
        setStatus('testing');
        fetchNextQuestion();
    };

    const handleCheckAnswer = () => {
        if (!currentQuestion || !selectedAnswer) return;
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        setAnswerState(isCorrect ? 'correct' : 'incorrect');
        setHistory(prev => [...prev, { question: currentQuestion, userAnswer: selectedAnswer, isCorrect }]);
    };

    const handleContinue = async () => {
        setSelectedAnswer(null);
        setAnswerState('idle');
        if (history.length < TEST_LENGTH) {
            fetchNextQuestion();
        } else {
            setStatus('evaluating');
            try {
                const finalResult = await evaluatePlacementTest(language, history);
                setResult(finalResult);
                setStatus('results');
            } catch (err) {
                setError("There was an error evaluating your results. Starting from the beginning.");
                setTimeout(() => onSkip(), 3000);
            }
        }
    };

    const progress = (history.length / TEST_LENGTH) * 100;

    if (status === 'intro') {
        return <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center"><IntroScreen onStart={handleStartTest} onSkip={onSkip} name={language.name} /></div>;
    }

    if (status === 'evaluating') {
        return <Loader message="Evaluating your level..." />;
    }

    if (status === 'results' && result) {
        return <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center"><ResultsScreen result={result} onContinue={() => onComplete(result.completedTopics)} /></div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">{error} <button onClick={onSkip} className="underline">Exit</button></div>;
    }

    if (isLoading || !currentQuestion) {
        return <Loader message="Building your test..." />;
    }

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-2rem)] max-w-3xl mx-auto">
            <div className="px-4 sm:px-8 pt-4">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                        <div
                            className="bg-green-500 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="font-bold text-slate-500">{history.length} / {TEST_LENGTH}</div>
                </div>
            </div>
            <main className="flex-grow flex flex-col px-4 sm:px-8">
                <div className="flex-grow flex flex-col justify-center items-center">
                    <div className="w-full text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-8">{currentQuestion.question}</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {currentQuestion.options.map((option) => {
                                const isSelected = selectedAnswer === option;
                                const isCorrect = currentQuestion.correctAnswer === option;
                                let buttonClass = "w-full text-center p-4 rounded-xl font-bold text-lg transition-all duration-200 border-b-4 disabled:cursor-not-allowed ";

                                if (answerState !== 'idle') {
                                    if (isCorrect) buttonClass += 'bg-green-400 border-green-600 text-white';
                                    else if (isSelected) buttonClass += 'bg-red-400 border-red-600 text-white';
                                    else buttonClass += 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-400 opacity-50';
                                } else {
                                    buttonClass += isSelected ? 'bg-sky-300 border-sky-500 text-white' : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600';
                                }
                                
                                return (
                                    <button key={option} onClick={() => setSelectedAnswer(option)} disabled={answerState !== 'idle'} className={buttonClass}>
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
            <footer className="mt-auto">
                {answerState === 'idle' ? (
                     <div className="h-32 flex items-center justify-center border-t-2 border-slate-200 dark:border-slate-700">
                        <button onClick={handleCheckAnswer} disabled={!selectedAnswer} className="w-full max-w-xs px-6 py-4 text-xl font-bold text-white uppercase bg-green-500 rounded-2xl border-b-4 border-green-700 hover:bg-green-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:border-slate-400 dark:disabled:border-slate-700 disabled:cursor-not-allowed transition-all">
                            Check
                        </button>
                    </div>
                ) : (
                    <div className={`h-32 p-4 transition-colors ${answerState === 'correct' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                        <div className="max-w-4xl mx-auto flex justify-between items-center h-full">
                            <div className="flex items-center">
                                {answerState === 'correct' ? <CheckCircleIcon className="w-10 h-10 mr-4 text-green-600" /> : <XCircleIcon className="w-10 h-10 mr-4 text-red-600" />}
                                <div>
                                    <p className={`font-bold text-xl ${answerState === 'correct' ? 'text-green-600' : 'text-red-600'}`}>{answerState === 'correct' ? "Correct!" : "Correct solution:"}</p>
                                    {answerState === 'incorrect' && <p className="font-semibold text-lg">{currentQuestion.correctAnswer}</p>}
                                </div>
                            </div>
                            <button onClick={handleContinue} className={`px-8 py-4 text-xl font-bold text-white uppercase rounded-2xl border-b-4 ${answerState === 'correct' ? 'bg-green-500 border-green-700' : 'bg-red-500 border-red-700'}`}>
                                Continue
                            </button>
                        </div>
                    </div>
                )}
            </footer>
        </div>
    );
};

export default PlacementTestPage;
