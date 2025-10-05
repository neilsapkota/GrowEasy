import React, { useState, useMemo } from 'react';
import { VocabularyItem } from '../../types';
import { VolumeUpIcon } from '../icons';

interface VocabularyReviewProps {
    vocabulary: VocabularyItem[];
    onEnd: () => void;
}

const VocabularyReview: React.FC<VocabularyReviewProps> = ({ vocabulary, onEnd }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    
    const shuffledVocabulary = useMemo(() => [...vocabulary].sort(() => Math.random() - 0.5), [vocabulary]);
    const currentItem = shuffledVocabulary[currentIndex];

    const handleFlip = () => setIsFlipped(!isFlipped);
    
    const handleNext = (knewIt: boolean) => {
        setIsFlipped(false);
        if (currentIndex < shuffledVocabulary.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onEnd(); // End of review session
        }
    };
    
    if (!currentItem) {
         return (
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl text-center">
                <h2 className="text-2xl font-bold mb-4">No Vocabulary Yet!</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Complete some lessons to build up your vocabulary list.</p>
                <button onClick={onEnd} className="px-6 py-2 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600">
                    Back to Hub
                </button>
            </div>
        );
    }
    
    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Vocabulary Review</h2>
                <span className="font-semibold text-slate-500">{currentIndex + 1} / {shuffledVocabulary.length}</span>
            </div>
            
            <div className="relative h-64" style={{ perspective: '1000px' }}>
                <div 
                    className={`relative w-full h-full text-center transition-transform duration-500`}
                    style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : ''}}
                    onClick={handleFlip}
                >
                    {/* Front of card */}
                    <div className="absolute w-full h-full p-4 backface-hidden flex flex-col justify-center items-center bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <p className="text-4xl font-bold text-slate-800 dark:text-white">{currentItem.word}</p>
                        {currentItem.pronunciation && (
                            <p className="text-slate-500 dark:text-slate-400 font-mono">/{currentItem.pronunciation}/</p>
                        )}
                    </div>
                     {/* Back of card */}
                    <div className="absolute w-full h-full p-4 backface-hidden flex justify-center items-center bg-teal-100 dark:bg-teal-900 rounded-lg" style={{transform: 'rotateY(180deg)'}}>
                        <p className="text-4xl font-bold text-teal-800 dark:text-teal-200">{currentItem.translation}</p>
                    </div>
                </div>
            </div>
             <p className="text-center text-sm text-slate-400 mt-2">Click card to flip</p>

            {isFlipped && (
                 <div className="grid grid-cols-2 gap-4 mt-6 animate-fade-in">
                    <button onClick={() => handleNext(false)} className="w-full p-4 font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-600">
                        Review Again
                    </button>
                     <button onClick={() => handleNext(true)} className="w-full p-4 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600">
                        Got It!
                    </button>
                </div>
            )}
            
            <div className="text-center mt-6">
                <button onClick={onEnd} className="font-bold text-slate-500">End Practice</button>
            </div>
        </div>
    );
};

export default VocabularyReview;