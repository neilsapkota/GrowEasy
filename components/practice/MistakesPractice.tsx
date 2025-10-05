import React, { useState } from 'react';
import { Language, MistakeItem } from '../../types';
import { getFeedback } from '../../services/geminiService';
import { CheckCircleIcon, XCircleIcon } from '../icons';

interface MistakesPracticeProps {
    language: Language;
    mistakes: MistakeItem[];
    onEnd: () => void;
    onUpdateMistakes: (mistakes: MistakeItem[]) => void;
}

const MistakesPractice: React.FC<MistakesPracticeProps> = ({ language, mistakes, onEnd, onUpdateMistakes }) => {
    const [currentMistakeIndex, setCurrentMistakeIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState<{ correct: boolean, explanation: string } | null>(null);

    const currentMistake = mistakes[currentMistakeIndex];

    const checkAnswer = async () => {
        const result = await getFeedback(language, currentMistake.question, userAnswer, currentMistake.correctAnswer);
        setFeedback({ correct: result.isCorrect, explanation: result.explanation });
        if (result.isCorrect) {
            // Remove the mistake from the list
            const updatedMistakes = mistakes.filter((_, index) => index !== currentMistakeIndex);
            onUpdateMistakes(updatedMistakes);
        }
    };

    const nextMistake = () => {
        setFeedback(null);
        setUserAnswer('');
        // If the mistake was corrected, it's already removed, so we stay at the same index for the new list.
        // If it was incorrect, we move to the next one.
        if (feedback && !feedback.correct && currentMistakeIndex < mistakes.length - 1) {
            setCurrentMistakeIndex(currentMistakeIndex + 1);
        } else if (mistakes.length === 0 || (feedback && feedback.correct && currentMistakeIndex >= mistakes.length)) {
             onEnd(); // End if no mistakes left
        } else if (feedback && !feedback.correct && currentMistakeIndex >= mistakes.length - 1) {
            onEnd();
        }
    };

    if (!currentMistake) {
        return (
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">All mistakes cleared!</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Great job practicing. You've corrected all your previous mistakes.</p>
                <button onClick={onEnd} className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600">
                    Finish
                </button>
            </div>
        );
    }
    
    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Mistakes Practice</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Question {currentMistakeIndex + 1} of {mistakes.length}</p>

            <div className="my-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <p className="text-lg font-semibold">{currentMistake.question}</p>
            </div>
            
            <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Your answer..."
                className="w-full px-4 py-3 text-lg bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                disabled={!!feedback}
            />

            {feedback && (
                 <div className={`p-4 rounded-lg mt-4 ${feedback.correct ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                    <div className="flex items-start">
                        {feedback.correct ? <CheckCircleIcon className="w-8 h-8 mr-3 text-green-500" /> : <XCircleIcon className="w-8 h-8 mr-3 text-red-500" />}
                        <div>
                            <h3 className={`text-xl font-bold ${feedback.correct ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                                {feedback.correct ? 'Correct!' : 'The correct answer is:'}
                            </h3>
                            {!feedback.correct && <p className="font-semibold text-lg">{currentMistake.correctAnswer}</p>}
                            <p className="mt-1 text-slate-700 dark:text-slate-300">{feedback.explanation}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mt-6">
                <button onClick={onEnd} className="font-bold text-slate-500">End Practice</button>
                {feedback ? (
                    <button onClick={nextMistake} className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600">
                        Continue
                    </button>
                ) : (
                    <button onClick={checkAnswer} disabled={!userAnswer.trim()} className="px-6 py-2 bg-rose-500 text-white font-bold rounded-lg hover:bg-rose-600 disabled:bg-slate-400">
                        Check Answer
                    </button>
                )}
            </div>
        </div>
    );
};

export default MistakesPractice;