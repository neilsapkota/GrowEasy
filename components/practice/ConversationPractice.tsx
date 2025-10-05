import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '../../types';
import { generatePracticeContent } from '../../services/geminiService';
import Loader from '../Loader';
import { MicrophoneIcon, VolumeUpIcon } from '../icons';

interface ConversationPracticeProps {
    language: Language;
    onEnd: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const ConversationPractice: React.FC<ConversationPracticeProps> = ({ language, onEnd }) => {
    const [phrases, setPhrases] = useState<string[]>([]);
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState('');
    const recognitionRef = useRef<any>(null);

    // Fetch phrases on mount
    useEffect(() => {
        const fetchPhrases = async () => {
            try {
                const content = await generatePracticeContent(language, 'conversation', 5);
                setPhrases(content);
            } catch (error) {
                console.error(error);
                setFeedback('Could not load phrases. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPhrases();
    }, [language]);

    // Setup speech recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = language.id;
            
            recognition.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                if (event.error === 'not-allowed') {
                    setFeedback('Microphone permission is required. Please allow microphone access in your browser settings and try again.');
                } else {
                    setFeedback('Sorry, I didn\'t catch that. Please try again.');
                }
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;

            return () => {
                recognition.stop();
            };
        }
    }, [language.id]);
    
    const handleListen = useCallback(() => {
        if (!recognitionRef.current) {
            setFeedback('Speech recognition is not supported in your browser.');
            return;
        }
        
        // Define onresult here to capture current state
        recognitionRef.current.onresult = (event: any) => {
            const spokenText = event.results[0][0].transcript;
            setTranscript(spokenText);
            const currentPhrase = phrases[currentPhraseIndex];
            if (currentPhrase && spokenText.trim().toLowerCase() === currentPhrase.trim().toLowerCase()) {
                setFeedback('Perfect!');
            } else {
                setFeedback('Good try! Let\'s move to the next one.');
            }
        };

        setTranscript('');
        setFeedback('');
        setIsListening(true);
        recognitionRef.current.start();
    }, [phrases, currentPhraseIndex]);

    const handleSpeak = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language.id;
            window.speechSynthesis.speak(utterance);
        }
    };

    const nextPhrase = () => {
        setTranscript('');
        setFeedback('');
        if (currentPhraseIndex < phrases.length - 1) {
            setCurrentPhraseIndex(currentPhraseIndex + 1);
        } else {
            onEnd(); // End of practice
        }
    };

    if (isLoading) return <Loader message="Preparing conversation practice..." />;

    if (!phrases || phrases.length === 0) {
        return <div className="text-center p-4">Could not load practice phrases. <button onClick={onEnd} className="underline">Go back</button>.</div>;
    }

    const currentPhrase = phrases[currentPhraseIndex];

    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Conversation Practice</h2>
            <div className="text-center p-8 bg-slate-100 dark:bg-slate-700 rounded-lg mb-6">
                <p className="text-slate-500 dark:text-slate-400 mb-2">Say this phrase:</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{currentPhrase}</h3>
                <button onClick={() => handleSpeak(currentPhrase)} className="mt-2 text-sky-500">
                    <VolumeUpIcon className="w-6 h-6 inline-block" />
                </button>
            </div>
            <div className="flex justify-center mb-6">
                <button onClick={handleListen} disabled={isListening} className={`p-6 rounded-full transition-colors ${isListening ? 'bg-red-500 animate-pulse' : 'bg-sky-500 hover:bg-sky-600'}`}>
                    <MicrophoneIcon className="w-10 h-10 text-white" />
                </button>
            </div>
            {transcript && (
                <div className="text-center mb-4">
                    <p className="text-slate-500">You said:</p>
                    <p className="font-semibold text-lg">"{transcript}"</p>
                </div>
            )}
            {feedback && (
                <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/50 rounded-lg mb-6">
                    <p className="font-semibold">{feedback}</p>
                </div>
            )}
            <div className="flex justify-between">
                <button onClick={onEnd} className="font-bold text-slate-500">End Practice</button>
                <button onClick={nextPhrase} className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600">
                    {currentPhraseIndex === phrases.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default ConversationPractice;
