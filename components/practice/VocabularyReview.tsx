import React, { useState, useMemo, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { CheckCircleIcon } from '../icons';

interface VocabularyReviewProps {
    vocabulary: VocabularyItem[];
    onEnd: () => void;
    onUpdateVocabulary: (word: string, performance: 'again' | 'good' | 'easy') => void;
}

const VocabularyReview: React.FC<VocabularyReviewProps> = ({ vocabulary, onEnd, onUpdateVocabulary }) => {
    const [reviewQueue, setReviewQueue] = useState<VocabularyItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionCompleted, setSessionCompleted] = useState(false);
    
    useEffect(() => {
        const now = new Date();
        const dueItems = vocabulary
            .filter(item => {
                if (!item.nextReview) return true; // Review items without a date
                return new Date(item.nextReview) <= now
            })
            .sort(() => Math.random() - 0.5); // Shuffle
        
        setReviewQueue(dueItems);

        if (dueItems.length === 0) {
            setSessionCompleted(true);
        }

    }, [vocabulary]);

    const currentItem = reviewQueue[currentIndex];

    const handleFlip = () => setIsFlipped(!isFlipped);
    
    const handleNext = (performance: 'again' | 'good' | 'easy') => {
        if (!currentItem) return;

        onUpdateVocabulary(currentItem.word, performance);
        
        // If user says "again", add it to the back of the queue for this session
        if (performance === 'again') {
            setReviewQueue(prev => [...prev, currentItem]);
        }

        setIsFlipped(false);
        
        // Use a timeout to allow the card to flip back before changing
        setTimeout(() => {
            if (currentIndex + 1 >= reviewQueue.length) {
                setSessionCompleted(true);
            } else {
                setCurrentIndex(currentIndex + 1);
            }
        }, 250);
    };
    
    if (sessionCompleted) {
        return (
           <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl text-center">
               <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
               <h2 className="text-2xl font-bold mb-4">All Done for Now!</h2>
               <p className="text-slate-500 dark:text-slate-400 mb-6">You've reviewed all your due vocabulary. Come back later for more!</p>
               <button onClick={onEnd} className="px-6 py-2 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600">
                   Back to Hub
               </button>
           </div>
       );
    }

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
                <h2 className="text-2xl font-bold">Smart Review</h2>
                <span className="font-semibold text-slate-500">{currentIndex + 1} / {reviewQueue.length}</span>
            </div>
            
            <div className="relative h-64" style={{ perspective: '1000px' }}>
                <div 
                    className={`relative w-full h-full text-center transition-transform duration-500 cursor-pointer`}
                    style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : ''}}
                    onClick={handleFlip}
                >
                    {/* Front of card */}
                    <div className="absolute w-full h-full p-4 backface-hidden flex flex-col justify-center items-center bg-slate-100 dark:bg-slate-700 rounded-lg shadow-inner">
                        <p className="text-4xl font-bold text-slate-800 dark:text-white">{currentItem.word}</p>
                        {currentItem.pronunciation && (
                            <p className="text-slate-500 dark:text-slate-400 font-mono">/{currentItem.pronunciation}/</p>
                        )}
                    </div>
                     {/* Back of card */}
                    <div className="absolute w-full h-full p-4 backface-hidden flex justify-center items-center bg-teal-100 dark:bg-teal-900 rounded-lg shadow-inner" style={{transform: 'rotateY(180deg)'}}>
                        <p className="text-4xl font-bold text-teal-800 dark:text-teal-200">{currentItem.translation}</p>
                    </div>
                </div>
            </div>
             <p className="text-center text-sm text-slate-400 mt-2">Click card to flip</p>

            {isFlipped && (
                 <div className="grid grid-cols-3 gap-4 mt-6 animate-fade-in">
                    <button onClick={() => handleNext('again')} className="w-full p-4 font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-600 border-b-4 border-rose-700 active:border-b-0 active:translate-y-1 transition-all">
                        Again
                    </button>
                     <button onClick={() => handleNext('good')} className="w-full p-4 font-bold text-white bg-sky-500 rounded-lg hover:bg-sky-600 border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 transition-all">
                        Good
                    </button>
                    <button onClick={() => handleNext('easy')} className="w-full p-4 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all">
                        Easy
                    </button>
                </div>
            )}
            
            <div className="text-center mt-6">
                <button onClick={onEnd} className="font-bold text-slate-500 hover:underline">End Practice</button>
            </div>
        </div>
    );
};

export default VocabularyReview;