
import React, { useState, useEffect } from 'react';
import { Language, LessonTopic, LessonContent, MistakeItem, VocabularyItem, Challenge } from '../types';
import { XP_PER_CORRECT_ANSWER } from '../constants';
import { generateLesson } from '../services/geminiService';
import Loader from './Loader';
import { CheckCircleIcon, XCircleIcon, StarIcon, VolumeUpIcon } from './icons';

const SOUND_URLS = {
    CORRECT: 'https://cdn.pixabay.com/download/audio/2023/10/05/audio_d121714e8b.mp3',
    INCORRECT: 'https://cdn.pixabay.com/download/audio/2022/11/21/audio_a72c052971.mp3',
    LESSON_COMPLETE: 'https://cdn.pixabay.com/audio/2022/01/18/audio_82c292a8b3.mp3',
};

const playSound = (url: string, enabled: boolean) => {
    if (!enabled) return;
    try {
        const audio = new Audio(url);
        audio.play().catch(e => console.warn("Could not play sound:", e));
    } catch (e) {
        console.warn("Could not create audio object", e);
    }
};

const speak = (text: string, lang: string, enabled: boolean) => {
    if (!enabled || !('speechSynthesis' in window)) return;
    try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        window.speechSynthesis.speak(utterance);
    } catch (e) {
        console.warn("Speech synthesis error:", e);
    }
};


const LessonHeader: React.FC<{ progress: number; onExit: () => void }> = ({ progress, onExit }) => (
    <div className="flex items-center gap-4 mb-8">
        <button onClick={onExit} className="text-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">&times;</button>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
            <div
                className="bg-green-500 h-4 rounded-full transition-all duration-300 ease-linear"
                style={{ width: `${progress}%` }}
            />
        </div>
    </div>
);

const LearningView: React.FC<{
    vocabulary: Omit<VocabularyItem, 'nextReview' | 'interval'>[];
    language: Language;
    soundEffectsEnabled: boolean;
    onComplete: () => void;
}> = ({ vocabulary, language, soundEffectsEnabled, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const item = vocabulary[currentIndex];

    const handleNext = () => {
        if (currentIndex < vocabulary.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete();
        }
    };

    if (!item) return null;

    return (
        <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-700 rounded-2xl shadow-xl p-8 transform transition-transform hover:scale-105 duration-300">
                <button 
                    onClick={() => speak(item.word, language.id, soundEffectsEnabled)}
                    className="flex items-center justify-center gap-4 mx-auto mb-2 group"
                >
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-teal-600 dark:text-teal-400">{item.word}</h2>
                    <VolumeUpIcon className="w-8 h-8 text-slate-400 group-hover:text-teal-500 transition-colors" />
                </button>
                <p className="font-mono text-slate-500 dark:text-slate-400 mb-6">/{item.pronunciation}/</p>
                <p className="text-2xl font-semibold text-slate-700 dark:text-slate-200">{item.translation}</p>
            </div>
            <button
                onClick={handleNext}
                className="mt-12 w-full max-w-xs px-6 py-4 text-xl font-bold text-white uppercase bg-green-500 rounded-2xl border-b-4 border-green-700 hover:bg-green-600 transition-all duration-200 active:translate-y-0.5"
            >
                {currentIndex < vocabulary.length - 1 ? 'Next' : 'Got it! Start Practice'}
            </button>
        </div>
    );
};


const ChallengeView: React.FC<{
    challenge: Challenge;
    selectedAnswer: string | null;
    answerState: 'idle' | 'correct' | 'incorrect';
    onSelectAnswer: (answer: string) => void;
}> = ({ challenge, selectedAnswer, answerState, onSelectAnswer }) => {
    return (
        <div className="flex-grow flex flex-col justify-center items-center">
            <div className="w-full max-w-2xl text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-8">{challenge.question}</h2>
                <div className="grid grid-cols-2 gap-3">
                    {challenge.options.map((option) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = challenge.correctAnswer === option;
                        
                        let buttonClass = "w-full text-center p-4 rounded-xl font-bold text-lg transition-all duration-200 border-b-4 disabled:cursor-not-allowed ";

                        if (answerState !== 'idle') {
                            if (isCorrect) {
                                buttonClass += 'bg-green-400 border-green-600 text-white';
                            } else if (isSelected && !isCorrect) {
                                buttonClass += 'bg-red-400 border-red-600 text-white';
                            } else {
                                buttonClass += 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-400 opacity-50';
                            }
                        } else {
                             buttonClass += isSelected 
                                ? 'bg-sky-300 border-sky-500 text-white' 
                                : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600';
                        }
                        
                        return (
                            <button
                                key={option}
                                onClick={() => onSelectAnswer(option)}
                                disabled={answerState !== 'idle'}
                                className={buttonClass}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const LessonFooter: React.FC<{
    answerState: 'idle' | 'correct' | 'incorrect';
    onContinue: () => void;
    correctAnswer: string;
}> = ({ answerState, onContinue, correctAnswer }) => {
    if (answerState === 'idle') {
        return (
            <div className="h-32 border-t-2 border-slate-200 dark:border-slate-700" />
        );
    }
    
    const isCorrect = answerState === 'correct';
    const bgColor = isCorrect ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50';
    const textColor = isCorrect ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300';
    const buttonBgColor = isCorrect ? 'bg-green-500 border-green-700 hover:bg-green-600' : 'bg-red-500 border-red-700 hover:bg-red-600';

    return (
        <div className={`h-32 p-4 transition-colors duration-300 ${bgColor}`}>
            <div className="max-w-4xl mx-auto flex justify-between items-center h-full">
                <div className="flex items-center">
                    {isCorrect ? <CheckCircleIcon className={`w-10 h-10 mr-4 ${textColor}`} /> : <XCircleIcon className={`w-10 h-10 mr-4 ${textColor}`} />}
                     <div>
                        <p className={`font-bold text-xl ${textColor}`}>{isCorrect ? "Correct!" : "Correct solution:"}</p>
                        {!isCorrect && <p className={`font-semibold text-lg ${textColor}`}>{correctAnswer}</p>}
                    </div>
                </div>
                <button
                    onClick={onContinue}
                    className={`px-8 py-4 text-xl font-bold text-white uppercase rounded-2xl border-b-4 ${buttonBgColor} transition-all duration-200 active:translate-y-0.5`}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

const LessonCompletionSummary: React.FC<{ xpGained: number, onFinish: () => void, soundEffectsEnabled: boolean }> = ({ xpGained, onFinish, soundEffectsEnabled }) => {
    useEffect(() => {
        playSound(SOUND_URLS.LESSON_COMPLETE, soundEffectsEnabled);
    }, [soundEffectsEnabled]);
    return (
        <div className="text-center p-8 flex flex-col justify-center items-center h-full animate-fade-in">
            <CheckCircleIcon className="w-24 h-24 text-green-500 animate-pulse" />
            <h2 className="text-4xl font-extrabold mt-6 text-slate-800 dark:text-white">Lesson Complete!</h2>
            <div className="mt-4 flex items-center justify-center p-4 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
                 <StarIcon className="w-10 h-10 text-amber-500 mr-3" />
                 <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">+{xpGained} XP</span>
            </div>
            <button
                onClick={onFinish}
                className="mt-12 w-full max-w-xs px-6 py-4 text-xl font-bold text-white uppercase bg-teal-500 rounded-2xl border-b-4 border-teal-700 hover:bg-teal-600 transition-all duration-200 active:translate-y-0.5"
            >
                Continue
            </button>
        </div>
    );
};

interface LessonPageProps {
    language: Language;
    topic: LessonTopic;
    onComplete: (xpGained: number, newMistakes: MistakeItem[], newVocabulary: Omit<VocabularyItem, 'nextReview' | 'interval'>[], isPerfect: boolean) => void;
    onBack: () => void;
    soundEffectsEnabled: boolean;
}

const LessonPage: React.FC<LessonPageProps> = ({ language, topic, onComplete, onBack, soundEffectsEnabled }) => {
    const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lessonPhase, setLessonPhase] = useState<'learning' | 'practice' | 'summary'>('learning');
    
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
    const [xpGained, setXpGained] = useState(0);
    const [mistakes, setMistakes] = useState<MistakeItem[]>([]);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const content = await generateLesson(language, topic.title);
                if (!content.challenges || content.challenges.length === 0 || !content.vocabulary || content.vocabulary.length === 0) {
                    throw new Error("Generated lesson is incomplete.");
                }
                setLessonContent(content);
                setLessonPhase('learning');
            } catch (err) {
                setError('Failed to generate the lesson. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLesson();
    }, [language, topic]);

    const handleAnswerSelection = (answer: string) => {
        if (answerState !== 'idle' || !lessonContent) return;
    
        setSelectedAnswer(answer);
    
        const currentChallenge = lessonContent.challenges[currentChallengeIndex];
        const isCorrect = answer === currentChallenge.correctAnswer;
    
        if (isCorrect) {
            playSound(SOUND_URLS.CORRECT, soundEffectsEnabled);
            setAnswerState('correct');
            setXpGained(prev => prev + XP_PER_CORRECT_ANSWER);
        } else {
            playSound(SOUND_URLS.INCORRECT, soundEffectsEnabled);
            setAnswerState('incorrect');
            setMistakes(prev => [...prev, {
                question: currentChallenge.question,
                correctAnswer: currentChallenge.correctAnswer,
                topicId: topic.id,
            }]);
        }
    };
    
    const handleContinue = () => {
        if (!lessonContent) return;

        if (currentChallengeIndex < lessonContent.challenges.length - 1) {
            setCurrentChallengeIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setAnswerState('idle');
        } else {
            setLessonPhase('summary');
        }
    };
    
    const handleFinish = () => {
        if (lessonContent) {
            const isPerfect = mistakes.length === 0;
            onComplete(xpGained, mistakes, lessonContent.vocabulary, isPerfect);
        }
    };

    if (isLoading) {
        return <Loader message={`Building your interactive ${topic.title} lesson...`} />;
    }

    if (error) {
        return (
            <div className="text-center p-8 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <p className="text-red-600 dark:text-red-300 font-semibold">{error}</p>
                <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    if (!lessonContent) {
        return null;
    }
    
    const totalSteps = (lessonContent?.challenges.length ?? 0);
    const progress = totalSteps > 0 ? (currentChallengeIndex / totalSteps) * 100 : 0;
    const currentChallenge = lessonContent.challenges[currentChallengeIndex];

    if (lessonPhase === 'summary') {
        return <LessonCompletionSummary xpGained={xpGained} onFinish={handleFinish} soundEffectsEnabled={soundEffectsEnabled} />;
    }

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-2rem)]">
            <div className="px-4 sm:px-8 pt-4">
                 <LessonHeader progress={progress} onExit={onBack} />
            </div>
            
            {lessonPhase === 'learning' ? (
                 <LearningView 
                    vocabulary={lessonContent.vocabulary}
                    language={language}
                    soundEffectsEnabled={soundEffectsEnabled}
                    onComplete={() => setLessonPhase('practice')}
                />
            ) : (
                <>
                    <main className="flex-grow flex flex-col px-4 sm:px-8">
                        <ChallengeView
                            challenge={currentChallenge}
                            selectedAnswer={selectedAnswer}
                            answerState={answerState}
                            onSelectAnswer={handleAnswerSelection}
                        />
                    </main>
                     <footer className="mt-auto">
                         <LessonFooter
                            answerState={answerState}
                            onContinue={handleContinue}
                            correctAnswer={currentChallenge.correctAnswer}
                         />
                    </footer>
                </>
            )}
        </div>
    );
};

export default LessonPage;
