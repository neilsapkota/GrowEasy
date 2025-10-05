import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { generatePracticeContent } from '../../services/geminiService';
import Loader from '../Loader';
import { VolumeUpIcon } from '../icons';

interface ListeningPracticeProps {
    language: Language;
    onEnd: () => void;
}

const ListeningPractice: React.FC<ListeningPracticeProps> = ({ language, onEnd }) => {
    const [sentences, setSentences] = useState<string[]>([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    useEffect(() => {
        const fetchSentences = async () => {
            try {
                const content = await generatePracticeContent(language, 'listening', 5);
                setSentences(content);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSentences();
    }, [language]);
    
    const currentSentence = sentences[currentSentenceIndex];

    const handleSpeak = () => {
        if ('speechSynthesis' in window && currentSentence) {
            const utterance = new SpeechSynthesisUtterance(currentSentence);
            utterance.lang = language.id;
            window.speechSynthesis.speak(utterance);
        }
    };
    
    const checkAnswer = () => {
        if (userAnswer.trim().toLowerCase() === currentSentence.toLowerCase().replace(/[.,!?]/g, '')) {
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
    };

    const nextSentence = () => {
        setUserAnswer('');
        setFeedback(null);
        if (currentSentenceIndex < sentences.length - 1) {
            setCurrentSentenceIndex(currentSentenceIndex + 1);
        } else {
            onEnd();
        }
    };
    
    if (isLoading) return <Loader message="Preparing listening practice..." />;
    if (!currentSentence) return <div className="text-center p-4">Could not load practice sentences. <button onClick={onEnd} className="underline">Go back</button>.</div>;

    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Listening Practice</h2>
            <div className="text-center p-8 bg-slate-100 dark:bg-slate-700 rounded-lg mb-6">
                <p className="text-slate-500 dark:text-slate-400 mb-2">Listen and type what you hear:</p>
                <button onClick={handleSpeak} className="p-4 rounded-full bg-violet-500 hover:bg-violet-600 text-white">
                    <VolumeUpIcon className="w-10 h-10" />
                </button>
            </div>
            
            <div className="my-6">
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type here..."
                    className="w-full px-4 py-3 text-lg bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    disabled={!!feedback}
                />
            </div>
            
            {feedback && (
                <div className={`p-4 rounded-lg mb-4 text-center ${feedback === 'correct' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'}`}>
                    <p className="font-bold">{feedback === 'correct' ? 'Correct!' : 'Not quite. The correct answer was:'}</p>
                    {feedback === 'incorrect' && <p className="font-semibold mt-1">"{currentSentence}"</p>}
                </div>
            )}
            
            <div className="flex justify-between items-center">
                <button onClick={onEnd} className="font-bold text-slate-500">End Practice</button>
                {feedback ? (
                    <button onClick={nextSentence} className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600">
                        {currentSentenceIndex === sentences.length - 1 ? 'Finish' : 'Next'}
                    </button>
                ) : (
                    <button onClick={checkAnswer} disabled={!userAnswer.trim()} className="px-6 py-2 bg-violet-500 text-white font-bold rounded-lg hover:bg-violet-600 disabled:bg-slate-400">
                        Check
                    </button>
                )}
            </div>
        </div>
    );
};

export default ListeningPractice;