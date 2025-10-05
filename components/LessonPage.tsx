import React, { useState, useEffect, useCallback } from 'react';
import { Language, LessonTopic, LessonContent, Feedback, MistakeItem, VocabularyItem } from '../types';
import { XP_PER_CORRECT_ANSWER } from '../constants';
import { generateLesson, getFeedback } from '../services/geminiService';
import Loader from './Loader';
import { CheckCircleIcon, XCircleIcon, VolumeUpIcon } from './icons';

interface LessonPageProps {
    language: Language;
    topic: LessonTopic;
    onComplete: (xpGained: number, mistakes: MistakeItem[], vocabulary: VocabularyItem[]) => void;
    onBack: () => void;
}

const langCodeMap: { [key: string]: string } = {
    es: 'es-ES', fr: 'fr-FR', de: 'de-DE', it: 'it-IT', jp: 'ja-JP',
    kr: 'ko-KR', cn: 'zh-CN', in: 'hi-IN', sa: 'ar-SA', bd: 'bn-BD',
    ru: 'ru-RU', pt: 'pt-PT', pk: 'ur-PK', id: 'id-ID', nl: 'nl-NL',
    tr: 'tr-TR', vn: 'vi-VN', th: 'th-TH', pl: 'pl-PL', ro: 'ro-RO',
    gr: 'el-GR', se: 'sv-SE', no: 'nb-NO', dk: 'da-DK', fi: 'fi-FI',
    il: 'he-IL', ke: 'sw-KE', cz: 'cs-CZ', hu: 'hu-HU', bg: 'bg-BG',
    hr: 'hr-HR', ua: 'uk-UA', sk: 'sk-SK',
};

const LessonPage: React.FC<LessonPageProps> = ({ language, topic, onComplete, onBack }) => {
    const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
    
    useEffect(() => {
        const fetchLesson = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const content = await generateLesson(language, topic.title);
                setLessonContent(content);
            } catch (err) {
                setError('Failed to generate the lesson. Please try again.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLesson();
    }, [language, topic]);

    const handleAnswerSelect = async (answer: string) => {
        if (!lessonContent) return;
        
        setSelectedAnswer(answer);
        setIsSubmitting(true);
        setFeedback(null);
        try {
            const result = await getFeedback(language, lessonContent.quiz.question, answer, lessonContent.quiz.correctAnswer);
            setFeedback(result);
            if(result.isCorrect) {
                setIsCompleted(true);
            } else {
                setMistakes(prev => [...prev, {
                    question: lessonContent.quiz.question,
                    correctAnswer: lessonContent.quiz.correctAnswer,
                    topicId: topic.id,
                }]);
            }
        } catch (err) {
            setError('Failed to get feedback. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSpeak = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = langCodeMap[language.id] || language.id;
            utterance.rate = 0.9;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Sorry, your browser doesn't support text-to-speech.");
        }
    };

    const handleFinish = () => {
        if (lessonContent) {
            onComplete(XP_PER_CORRECT_ANSWER, mistakes, lessonContent.vocabulary);
        }
    };

    if (isLoading) {
        return <Loader message={`Building your ${topic.title} lesson...`} />;
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

    return (
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
            <div className="flex justify-between items-start mb-6">
                 <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">{topic.icon} {topic.title} Lesson</h1>
                    <p className="text-slate-500 dark:text-slate-400">Time to learn something new in {language.name}!</p>
                </div>
                 <button onClick={onBack} className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:underline">
                    &larr; Back
                </button>
            </div>

            <div className="space-y-8">
                <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-2xl font-bold mb-4 border-b-2 border-teal-500 pb-2">Vocabulary</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {lessonContent.vocabulary.map((item, index) => (
                             <li key={index} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg flex justify-between items-center">
                                <div className="flex-grow">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-lg text-teal-600 dark:text-teal-400">{item.word}</span>
                                        {item.pronunciation && (
                                            <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">/{item.pronunciation}/</span>
                                        )}
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 font-medium">{item.translation}</p>
                                </div>
                                <button 
                                    onClick={() => handleSpeak(item.word)}
                                    className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors flex-shrink-0 ml-4"
                                    aria-label={`Pronounce ${item.word}`}
                                    title={`Pronounce ${item.word}`}
                                >
                                    <VolumeUpIcon className="w-6 h-6" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                    <h2 className="text-2xl font-bold mb-4 border-b-2 border-teal-500 pb-2">Examples</h2>
                    <ul className="space-y-3">
                        {lessonContent.examples.map((example, index) => (
                            <li key={index} className="italic text-slate-600 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                                "{example}"
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <h2 className="text-2xl font-bold mb-4 border-b-2 border-teal-500 pb-2">Quiz Time!</h2>
                    <p className="text-lg mb-4 p-4 bg-blue-100 dark:bg-blue-900/50 rounded-lg">{lessonContent.quiz.question}</p>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {lessonContent.quiz.options.map((option) => {
                            const isSelected = selectedAnswer === option;
                            const isCorrect = lessonContent.quiz.correctAnswer === option;
                            
                            let buttonClass = "w-full text-left p-4 rounded-lg font-semibold text-lg transition-all duration-300 border-2 ";

                            if (selectedAnswer) {
                                if (isCorrect) {
                                    buttonClass += 'bg-green-500 border-green-600 text-white scale-105';
                                } else if (isSelected && !isCorrect) {
                                    buttonClass += 'bg-red-500 border-red-600 text-white';
                                } else {
                                    buttonClass += 'bg-slate-200 dark:bg-slate-700 border-transparent text-slate-500 cursor-not-allowed opacity-70';
                                }
                            } else {
                                buttonClass += 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 hover:border-teal-500';
                            }
                            
                            return (
                                <button
                                    key={option}
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={selectedAnswer !== null || isSubmitting}
                                    className={buttonClass}
                                >
                                    {option}
                                </button>
                            )
                        })}
                    </div>
                </div>
                
                {feedback && (
                    <div className={`p-4 rounded-lg transition-all duration-300 mt-4 ${feedback.isCorrect ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                        <div className="flex items-start">
                            {feedback.isCorrect ? <CheckCircleIcon className="w-8 h-8 mr-3 text-green-500" /> : <XCircleIcon className="w-8 h-8 mr-3 text-red-500" />}
                            <div>
                                <h3 className={`text-xl font-bold ${feedback.isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                                    {feedback.isCorrect ? 'Correct!' : 'Not Quite'}
                                </h3>
                                <p className="mt-1 text-slate-700 dark:text-slate-300">{feedback.explanation}</p>
                                {!feedback.isCorrect && feedback.suggestion && (
                                     <p className="mt-2 text-slate-700 dark:text-slate-300">Suggestion: <em className="font-semibold">{feedback.suggestion}</em></p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {isCompleted && (
                    <div className="text-center p-6 bg-teal-100 dark:bg-teal-900/50 rounded-lg">
                        <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-300">Lesson Complete!</h3>
                        <p className="text-lg text-slate-600 dark:text-slate-400">You've earned {XP_PER_CORRECT_ANSWER} XP!</p>
                        <button onClick={handleFinish} className="mt-4 px-6 py-3 font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-transform transform hover:scale-105 active:scale-95">
                            Finish & Continue
                        </button>
                    </div>
                )}
                 {!isCompleted && feedback && !feedback.isCorrect && (
                     <div className="text-center p-6 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                        <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Let's keep going!</h3>
                        <p className="text-lg text-slate-600 dark:text-slate-400">Don't worry, we'll practice this later.</p>
                        <button onClick={() => onComplete(0, mistakes, [])} className="mt-4 px-6 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95">
                            Continue
                        </button>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default LessonPage;