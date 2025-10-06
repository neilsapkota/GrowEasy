import React, { useState, useEffect, useRef } from 'react';
import { Language, PronunciationFeedback } from '../../types';
import { generatePracticeContent, getPronunciationFeedback } from '../../services/geminiService';
import Loader from '../Loader';
import { VolumeUpIcon, MicrophoneIcon, SpinnerIcon, StarIcon } from '../icons';

interface PronunciationPracticeProps {
    language: Language;
    onEnd: () => void;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = (reader.result as string).split(',')[1];
            resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const CircularProgress: React.FC<{ score: number }> = ({ score }) => {
    const sqSize = 120;
    const strokeWidth = 10;
    const radius = (sqSize - strokeWidth) / 2;
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - dashArray * (score / 100);

    return (
        <svg width={sqSize} height={sqSize} viewBox={viewBox} className="-rotate-90">
            <circle
                className="text-slate-200 dark:text-slate-700"
                cx={sqSize / 2} cy={sqSize / 2} r={radius}
                strokeWidth={`${strokeWidth}px`} fill="none" stroke="currentColor"
            />
            <circle
                className="text-teal-500 transition-all duration-1000 ease-in-out"
                cx={sqSize / 2} cy={sqSize / 2} r={radius}
                strokeWidth={`${strokeWidth}px`} fill="none" stroke="currentColor"
                strokeLinecap="round"
                style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset }}
            />
        </svg>
    );
};

const PronunciationPractice: React.FC<PronunciationPracticeProps> = ({ language, onEnd }) => {
    const [phrases, setPhrases] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true); // For initial phrase loading
    const [isAnalyzing, setIsAnalyzing] = useState(false); // For AI feedback
    const [error, setError] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        const fetchPhrases = async () => {
            try {
                const content = await generatePracticeContent(language, 'pronunciation', 5);
                if (content && content.length > 0) {
                    setPhrases(content);
                } else {
                    setError("Could not load any phrases to practice.");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch practice phrases. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPhrases();
    }, [language]);

    const currentPhrase = phrases[currentIndex];

    const handleSpeak = () => {
        if ('speechSynthesis' in window && currentPhrase) {
            const utterance = new SpeechSynthesisUtterance(currentPhrase);
            utterance.lang = language.id;
            window.speechSynthesis.speak(utterance);
        }
    };

    const startRecording = async () => {
        setFeedback(null);
        setError(null);
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioBase64 = await blobToBase64(audioBlob);
                
                setIsAnalyzing(true);
                try {
                    const result = await getPronunciationFeedback(language, currentPhrase, audioBase64, 'audio/webm');
                    setFeedback(result);
                } catch (err) {
                    setError("Couldn't get feedback from the AI. Please try again.");
                } finally {
                    setIsAnalyzing(false);
                }
                // Clean up stream
                stream.getTracks().forEach(track => track.stop());
                setIsRecording(false);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Microphone access error:", err);
            if (err instanceof DOMException) {
                if (err.name === 'NotFoundError') {
                    setError("No microphone found. Please connect a microphone and try again.");
                } else if (err.name === 'NotAllowedError') {
                    setError("Microphone permission was denied. Please enable it in your browser's site settings to use this feature.");
                } else {
                     setError("Could not access the microphone. Please check your browser and system settings.");
                }
            } else {
                 setError("An unknown error occurred while accessing the microphone.");
            }
        }
    };

    const handleNext = () => {
        setFeedback(null);
        setError(null);
        if (currentIndex < phrases.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onEnd();
        }
    };

    if (isLoading) return <Loader message="Loading pronunciation exercises..." />;

    return (
         <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="w-full flex justify-between items-center mb-6">
                 <h2 className="text-xl sm:text-2xl font-bold text-left">Pronunciation Practice</h2>
                 <button onClick={onEnd} className="font-bold text-slate-500 hover:underline">End</button>
            </div>
            
            {error && <div className="my-4 p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}

            <div className="p-8 bg-slate-100 dark:bg-slate-700 rounded-lg mb-6 w-full">
                <p className="text-slate-500 dark:text-slate-400 mb-2">Say this phrase:</p>
                <p className="text-2xl sm:text-3xl font-bold mb-4">{currentPhrase}</p>
                <button onClick={handleSpeak} className="p-2 rounded-full bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-600 dark:text-slate-200" aria-label="Hear pronunciation">
                    <VolumeUpIcon className="w-6 h-6" />
                </button>
            </div>
            
            {isAnalyzing && <Loader message="Analyzing your speech..." />}

            {!isAnalyzing && feedback && (
                 <div className="w-full my-4 animate-fade-in-up">
                    <div className="relative w-32 h-32 mx-auto">
                        <CircularProgress score={feedback.score} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{feedback.score}</span>
                        </div>
                    </div>
                    <div className="mt-4 p-4 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                        <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">{feedback.feedback}</p>
                    </div>
                </div>
            )}
           
            <div className="mt-6 flex flex-col items-center gap-4 w-full">
                {!feedback && !isAnalyzing && (
                    <button onClick={startRecording} className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors duration-300 ${isRecording ? 'bg-red-500 animate-pulse-live' : 'bg-blue-500 hover:bg-blue-600'}`}>
                        <MicrophoneIcon className="w-12 h-12 text-white" />
                    </button>
                )}
                 {feedback && (
                    <button onClick={handleNext} className="w-full max-w-xs px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600">
                        {currentIndex === phrases.length - 1 ? 'Finish' : 'Next Phrase'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PronunciationPractice;