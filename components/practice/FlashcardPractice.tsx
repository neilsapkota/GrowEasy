import React, { useState, useEffect } from 'react';
import { FlashcardDeck, Flashcard } from '../../types';
import { CheckCircleIcon } from '../icons';

interface FlashcardPracticeProps {
    deck: FlashcardDeck;
    allDecks: FlashcardDeck[];
    onEnd: () => void;
    onUpdateDecks: (decks: FlashcardDeck[]) => void;
}

// Simple implementation of the SM-2 algorithm for spaced repetition.
const calculateNextReview = (card: Flashcard, performance: 'again' | 'good' | 'easy'): Flashcard => {
    let newInterval: number;
    let newEaseFactor: number = card.easeFactor;
    
    const quality = performance === 'again' ? 0 : performance === 'good' ? 3 : 5;

    if (quality < 3) { // Incorrect response
        newInterval = 1; // Reset interval
    } else {
        if (card.interval === 0) {
            newInterval = 1;
        } else if (card.interval === 1) {
            newInterval = 6;
        } else {
            newInterval = Math.round(card.interval * newEaseFactor);
        }
    }
    
    newEaseFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEaseFactor < 1.3) newEaseFactor = 1.3;

    const now = new Date();
    const nextReviewDate = new Date(now.setDate(now.getDate() + newInterval));

    return {
        ...card,
        interval: newInterval,
        easeFactor: newEaseFactor,
        nextReview: nextReviewDate.toISOString(),
    };
};


const FlashcardPractice: React.FC<FlashcardPracticeProps> = ({ deck, allDecks, onEnd, onUpdateDecks }) => {
    const [reviewQueue, setReviewQueue] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionCompleted, setSessionCompleted] = useState(false);
    const [updatedCards, setUpdatedCards] = useState<Record<string, Flashcard>>({});

    useEffect(() => {
        const now = new Date();
        const dueCards = deck.cards
            .filter(card => new Date(card.nextReview) <= now)
            .sort(() => Math.random() - 0.5); // Shuffle
        
        setReviewQueue(dueCards);

        if (dueCards.length === 0) {
            setSessionCompleted(true);
        }
    }, [deck]);

    const currentItem = reviewQueue[currentIndex];

    const handleFlip = () => setIsFlipped(!isFlipped);
    
    const handleNext = (performance: 'again' | 'good' | 'easy') => {
        if (!currentItem) return;

        const updatedCard = calculateNextReview(currentItem, performance);
        
        // Stage the update
        setUpdatedCards(prev => ({ ...prev, [currentItem.front + currentItem.back]: updatedCard }));

        setIsFlipped(false);
        
        // Use a timeout to allow the card to flip back before changing
        setTimeout(() => {
            if (currentIndex + 1 >= reviewQueue.length) {
                // Session is over, let's save the progress
                const finalUpdatedDeck: FlashcardDeck = {
                    ...deck,
                    cards: deck.cards.map(originalCard => {
                        const key = originalCard.front + originalCard.back;
                        return updatedCards[key] || originalCard;
                    }),
                };
                const newDecksList = allDecks.map(d => d.id === finalUpdatedDeck.id ? finalUpdatedDeck : d);
                onUpdateDecks(newDecksList);
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
               <p className="text-slate-500 dark:text-slate-400 mb-6">You've reviewed all your due cards in this deck.</p>
               <button onClick={onEnd} className="px-6 py-2 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600">
                   Back to Decks
               </button>
           </div>
       );
    }

    if (!currentItem) {
         return (
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl text-center">
                <h2 className="text-2xl font-bold mb-4">Empty Deck!</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">This deck has no cards to study.</p>
                <button onClick={onEnd} className="px-6 py-2 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600">
                    Back to Decks
                </button>
            </div>
        );
    }
    
    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold truncate pr-4">{deck.title}</h2>
                <span className="font-semibold text-slate-500 flex-shrink-0">{currentIndex + 1} / {reviewQueue.length}</span>
            </div>
            
            <div className="relative h-80" style={{ perspective: '1000px' }}>
                <div 
                    className={`relative w-full h-full text-center transition-transform duration-500 cursor-pointer`}
                    style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : ''}}
                    onClick={handleFlip}
                >
                    {/* Front of card */}
                    <div className="absolute w-full h-full p-4 backface-hidden flex flex-col justify-center items-center bg-slate-100 dark:bg-slate-700 rounded-lg shadow-inner">
                        <p className="text-4xl font-bold text-slate-800 dark:text-white">{currentItem.front}</p>
                    </div>
                     {/* Back of card */}
                    <div className="absolute w-full h-full p-4 backface-hidden flex flex-col justify-center items-center bg-cyan-100 dark:bg-cyan-900 rounded-lg shadow-inner" style={{transform: 'rotateY(180deg)'}}>
                        <p className="text-4xl font-bold text-cyan-800 dark:text-cyan-200">{currentItem.back}</p>
                        {currentItem.exampleSentence && (
                            <p className="mt-4 text-lg italic text-slate-500 dark:text-slate-400">"{currentItem.exampleSentence}"</p>
                        )}
                    </div>
                </div>
            </div>
             <p className="text-center text-sm text-slate-400 mt-2">Click card to flip</p>

            {isFlipped ? (
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
            ) : <div className="h-[76px] mt-6" /> }
            
            <div className="text-center mt-6">
                <button onClick={onEnd} className="font-bold text-slate-500 hover:underline">End Practice</button>
            </div>
        </div>
    );
};

export default FlashcardPractice;