
import React, { useState } from 'react';
import { Language, FlashcardDeck, Flashcard, UserProgress } from '../types';
import { generateFlashcardsForTopic, generateFlashcardsFromMistakes } from '../services/geminiService';
import { BackIcon, CardsIcon, SpinnerIcon, WritingIcon } from './icons';
import EditDeckModal from './EditDeckModal';

interface FlashcardDecksPageProps {
    language: Language;
    progress: UserProgress | null;
    onUpdateDecks: (decks: FlashcardDeck[]) => void;
    onStartPractice: (deck: FlashcardDeck) => void;
    onBack: () => void;
}

const CreateDeckModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');

    const handleSave = () => {
        if (title.trim()) {
            onSave(title.trim());
            setTitle('');
            onClose();
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Create New Deck</h2>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Deck Title (e.g., 'Restaurant Phrases')"
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg mb-4"
                />
                <div className="flex justify-end gap-3">
                     <button onClick={onClose} className="px-4 py-2 font-bold rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300">Cancel</button>
                     <button onClick={handleSave} disabled={!title.trim()} className="px-4 py-2 font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:bg-slate-400">Create</button>
                </div>
            </div>
        </div>
    );
};

const GenerateDeckModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (deck: FlashcardDeck) => void;
    language: Language;
}> = ({ isOpen, onClose, onSave, language }) => {
    const [aiTopic, setAiTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!aiTopic.trim()) return;
        setIsGenerating(true);
        setError('');
        try {
            const newCardStubs = await generateFlashcardsForTopic(language, aiTopic);
            const now = new Date().toISOString();
            const newCards: Flashcard[] = newCardStubs.map(c => ({
                ...c,
                nextReview: now,
                interval: 1,
                easeFactor: 2.5
            }));

            const newDeck: FlashcardDeck = {
                id: new Date().toISOString(),
                title: `${aiTopic} Deck`,
                cards: newCards,
            };
            onSave(newDeck);
            setAiTopic('');
            onClose();
        } catch (err) {
            console.error("Failed to generate cards", err);
            setError("Couldn't generate cards. Please try a different topic.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Generate Deck with AI</h2>
                <p className="text-slate-500 mb-4">Enter a topic, and we'll create a deck for you.</p>
                <input
                    type="text"
                    value={aiTopic}
                    onChange={e => setAiTopic(e.target.value)}
                    placeholder="e.g., Common greetings, Food items"
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg"
                />
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                <div className="flex justify-end gap-3 mt-4">
                     <button onClick={onClose} className="px-4 py-2 font-bold rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300">Cancel</button>
                     <button onClick={handleGenerate} disabled={isGenerating || !aiTopic.trim()} className="px-4 py-2 w-28 font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:bg-slate-400">
                        {isGenerating ? <SpinnerIcon className="w-6 h-6 mx-auto animate-spin" /> : 'Generate'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const FlashcardDecksPage: React.FC<FlashcardDecksPageProps> = ({ language, progress, onUpdateDecks, onStartPractice, onBack }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [isGeneratingFromMistakes, setIsGeneratingFromMistakes] = useState(false);
    const [editingDeck, setEditingDeck] = useState<FlashcardDeck | null>(null);

    const decks = progress?.flashcardDecks ?? [];

    const handleCreateDeck = (title: string) => {
        const newDeck: FlashcardDeck = {
            id: new Date().toISOString(),
            title: title,
            cards: [],
        };
        onUpdateDecks([...decks, newDeck]);
    };
    
    const handleSaveGeneratedDeck = (newDeck: FlashcardDeck) => {
         onUpdateDecks([...decks, newDeck]);
    }
    
    const handleGenerateFromMistakes = async () => {
        const mistakes = progress?.mistakes ?? [];
        if (mistakes.length === 0) return;
        
        setIsGeneratingFromMistakes(true);
        try {
            const newCardStubs = await generateFlashcardsFromMistakes(language, mistakes);
            const now = new Date().toISOString();
            const newCards: Flashcard[] = newCardStubs.map(c => ({
                ...c,
                nextReview: now,
                interval: 1,
                easeFactor: 2.5
            }));
            const newDeck: FlashcardDeck = {
                id: new Date().toISOString(),
                title: "Mistakes Review Deck",
                cards: newCards
            };
            onUpdateDecks([...decks, newDeck]);
        } catch (error) {
            console.error(error);
            alert("Sorry, there was an error generating the deck from your mistakes.");
        } finally {
            setIsGeneratingFromMistakes(false);
        }
    };
    
    const handleDeleteDeck = (deckIdToDelete: string) => {
        if (window.confirm("Are you sure you want to delete this deck?")) {
            const updatedDecks = decks.filter(deck => deck.id !== deckIdToDelete);
            onUpdateDecks(updatedDecks);
        }
    };

    const handleSaveDeck = (updatedDeck: FlashcardDeck) => {
        onUpdateDecks(decks.map(d => d.id === updatedDeck.id ? updatedDeck : d));
    };

    const handleExportToCSV = (deck: FlashcardDeck) => {
        const header = "front,back,exampleSentence\n";
        const rows = deck.cards.map(c => `"${c.front.replace(/"/g, '""')}","${c.back.replace(/"/g, '""')}","${c.exampleSentence ? c.exampleSentence.replace(/"/g, '""') : ''}"`).join('\n');
        const csvContent = header + rows;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${deck.title.replace(/\s/g, '_')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 font-bold text-sky-400 mb-6 hover:underline">
                <BackIcon className="w-5 h-5" />
                Back to Practice Hub
            </button>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold">Your Flashcard Decks</h2>
                <div className="flex gap-2">
                     <button 
                        onClick={handleGenerateFromMistakes} 
                        disabled={!progress?.mistakes || progress.mistakes.length === 0 || isGeneratingFromMistakes}
                        className="px-4 py-2 font-bold text-white bg-amber-500 rounded-lg hover:bg-amber-600 border-b-4 border-amber-700 disabled:bg-slate-400 disabled:border-slate-500 disabled:cursor-not-allowed"
                     >
                        {isGeneratingFromMistakes ? <SpinnerIcon className="w-5 h-5 animate-spin"/> : "Generate from Mistakes"}
                    </button>
                    <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 border-b-4 border-green-700">
                        + New Deck
                    </button>
                    <button onClick={() => setIsGenerateModalOpen(true)} className="px-4 py-2 font-bold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 border-b-4 border-indigo-700">
                        AI Deck
                    </button>
                </div>
            </div>
            {decks.length === 0 ? (
                <div className="text-center p-12 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    <CardsIcon className="w-24 h-24 mx-auto text-slate-300 dark:text-slate-600" />
                    <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">You have no flashcard decks.</p>
                    <p className="text-slate-400">Click a button above to create your first one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {decks.map(deck => (
                        <div key={deck.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-1">{deck.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-4">{deck.cards.length} cards</p>
                            </div>
                            <div className="space-y-2 mt-4">
                                <button onClick={() => onStartPractice(deck)} disabled={deck.cards.length === 0} className="w-full px-4 py-3 font-bold text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 disabled:bg-slate-400">
                                    Study
                                </button>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingDeck(deck)} className="w-full flex justify-center items-center gap-2 px-4 py-2 font-semibold text-sm bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300">
                                        <WritingIcon className="w-4 h-4" /> Edit
                                    </button>
                                    <button onClick={() => handleExportToCSV(deck)} className="w-full px-4 py-2 font-semibold text-sm bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300">
                                        Export
                                    </button>
                                </div>
                                <button onClick={() => handleDeleteDeck(deck.id)} className="w-full text-center text-xs text-rose-500 hover:underline pt-1">
                                    Delete Deck
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <CreateDeckModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreateDeck}
            />
             <GenerateDeckModal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                onSave={handleSaveGeneratedDeck}
                language={language}
            />
            {editingDeck && (
                <EditDeckModal
                    deck={editingDeck}
                    onClose={() => setEditingDeck(null)}
                    onSave={handleSaveDeck}
                />
            )}
        </div>
    );
};

export default FlashcardDecksPage;
