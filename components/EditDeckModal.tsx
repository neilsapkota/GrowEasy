import React, { useState, useEffect } from 'react';
import { FlashcardDeck, Flashcard } from '../types';

interface EditDeckModalProps {
    deck: FlashcardDeck;
    onClose: () => void;
    onSave: (deck: FlashcardDeck) => void;
}

const EditDeckModal: React.FC<EditDeckModalProps> = ({ deck, onClose, onSave }) => {
    const [cards, setCards] = useState<Flashcard[]>(deck.cards);
    const [newCard, setNewCard] = useState({ front: '', back: '' });
    
    const handleAddCard = () => {
        if (newCard.front.trim() && newCard.back.trim()) {
            const cardToAdd: Flashcard = {
                ...newCard,
                nextReview: new Date().toISOString(),
                interval: 1,
                easeFactor: 2.5,
            };
            setCards([...cards, cardToAdd]);
            setNewCard({ front: '', back: '' });
        }
    };
    
    const handleUpdateCard = (index: number, field: 'front' | 'back', value: string) => {
        const updatedCards = [...cards];
        updatedCards[index] = { ...updatedCards[index], [field]: value };
        setCards(updatedCards);
    };

    const handleDeleteCard = (index: number) => {
        setCards(cards.filter((_, i) => i !== index));
    };
    
    const handleSave = () => {
        onSave({ ...deck, cards });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl m-4 flex flex-col h-[90vh]" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 flex-shrink-0">Edit "{deck.title}"</h2>
                
                <div className="flex-grow overflow-y-auto pr-2 space-y-2 mb-4">
                    {cards.map((card, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                            <input
                                type="text"
                                value={card.front}
                                onChange={e => handleUpdateCard(index, 'front', e.target.value)}
                                placeholder="Front"
                                className="w-full px-3 py-2 bg-white dark:bg-slate-700 rounded-md"
                            />
                            <input
                                type="text"
                                value={card.back}
                                onChange={e => handleUpdateCard(index, 'back', e.target.value)}
                                placeholder="Back"
                                className="w-full px-3 py-2 bg-white dark:bg-slate-700 rounded-md"
                            />
                            <button onClick={() => handleDeleteCard(index)} className="p-2 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-full">
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 pt-4">
                    <h3 className="font-semibold mb-2">Add New Card</h3>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newCard.front}
                            onChange={e => setNewCard({ ...newCard, front: e.target.value })}
                            placeholder="Front of card"
                            className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-md"
                        />
                        <input
                            type="text"
                            value={newCard.back}
                            onChange={e => setNewCard({ ...newCard, back: e.target.value })}
                            placeholder="Back of card"
                            className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-md"
                        />
                        <button onClick={handleAddCard} className="px-4 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600">+</button>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 flex-shrink-0">
                     <button onClick={onClose} className="px-6 py-2 font-bold rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300">Cancel</button>
                     <button onClick={handleSave} className="px-6 py-2 font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700">Save & Close</button>
                </div>
            </div>
        </div>
    );
};

export default EditDeckModal;