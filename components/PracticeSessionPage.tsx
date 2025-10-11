import React from 'react';
import { Language, UserProgress, PracticeMode, MistakeItem, VocabularyItem, FlashcardDeck } from '../types';
import ConversationPractice from './practice/ConversationPractice';
import ListeningPractice from './practice/ListeningPractice';
import MistakesPractice from './practice/MistakesPractice';
import VocabularyReview from './practice/VocabularyReview';
import StoriesPractice from './practice/StoriesPractice';
import PronunciationPractice from './practice/PronunciationPractice';
import RoleplayPractice from './practice/RoleplayPractice';
import WritingPractice from './practice/WritingPractice';
import FlashcardPractice from './practice/FlashcardPractice';

interface PracticeSessionPageProps {
    mode: PracticeMode;
    language: Language;
    progress: UserProgress | null;
    onEndPractice: () => void;
    onUpdateMistakes: (mistakes: MistakeItem[]) => void;
    onUpdateVocabularyReview: (word: string, performance: 'again' | 'good' | 'easy') => void;
    selectedFlashcardDeck?: FlashcardDeck | null;
    onUpdateFlashcardDecks?: (decks: FlashcardDeck[]) => void;
}

const PracticeSessionPage: React.FC<PracticeSessionPageProps> = ({ mode, language, progress, onEndPractice, onUpdateMistakes, onUpdateVocabularyReview, selectedFlashcardDeck, onUpdateFlashcardDecks }) => {
    const renderPracticeMode = () => {
        switch (mode) {
            case 'conversation':
                return <ConversationPractice language={language} onEnd={onEndPractice} />;
            case 'listening':
                return <ListeningPractice language={language} onEnd={onEndPractice} />;
            case 'mistakes':
                return <MistakesPractice language={language} mistakes={progress?.mistakes ?? []} onEnd={onEndPractice} onUpdateMistakes={onUpdateMistakes} />;
            case 'vocabulary':
                return <VocabularyReview vocabulary={progress?.learnedVocabulary ?? []} onEnd={onEndPractice} onUpdateVocabulary={onUpdateVocabularyReview} />;
            case 'stories':
                return <StoriesPractice language={language} onEnd={onEndPractice} />;
            case 'pronunciation':
                return <PronunciationPractice language={language} onEnd={onEndPractice} />;
            case 'roleplay':
                return <RoleplayPractice language={language} onEnd={onEndPractice} />;
            case 'writing':
                return <WritingPractice language={language} onEnd={onEndPractice} />;
            case 'flashcards':
                if (selectedFlashcardDeck && onUpdateFlashcardDecks && progress?.flashcardDecks) {
                    return <FlashcardPractice 
                                deck={selectedFlashcardDeck} 
                                allDecks={progress.flashcardDecks}
                                onEnd={onEndPractice} 
                                onUpdateDecks={onUpdateFlashcardDecks} 
                            />;
                }
                return <div>Error: No flashcard deck selected.</div>;
            default:
                return (
                    <div>
                        <p>Invalid practice mode selected.</p>
                        <button onClick={onEndPractice} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Back</button>
                    </div>
                );
        }
    };

    return <div className="animate-fade-in">{renderPracticeMode()}</div>;
};

export default PracticeSessionPage;