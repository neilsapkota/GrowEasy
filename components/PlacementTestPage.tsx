

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Language, PlacementTestResult } from '../types';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from "@google/genai";
import { evaluateLiveConversation } from '../services/geminiService';
import Loader from './Loader';
import { CheckCircleIcon, StarIcon, ShieldCheckIcon, SpinnerIcon, MicrophoneIcon } from './icons';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Audio Helper Functions ---
function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}

// --- Component Types ---

interface LivePlacementTestPageProps {
    language: Language;
    onComplete: (completedTopics: string[]) => void;
    onSkip: () => void;
    soundEffectsEnabled: boolean;
}

type TranscriptItem = {
    author: 'user' | 'ai';
    text: string;
};

// --- Sub-components ---

const IntroScreen: React.FC<{ onStart: () => void, onSkip: () => void, name: string }> = ({ onStart, onSkip, name }) => (
    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md mx-auto animate-fade-in">
        <ShieldCheckIcon className="w-20 h-20 text-teal-500 mx-auto mb-4" />
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">New to {name}?</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">Let's find your level with a quick chat. It only takes a minute!</p>
        <div className="space-y-4">
            <button
                onClick={onStart}
                className="w-full px-6 py-4 text-lg font-bold text-white uppercase bg-teal-500 rounded-2xl border-b-4 border-teal-700 hover:bg-teal-600 transition-all active:translate-y-0.5"
            >
                Start Chat
            </button>
            <button
                onClick={onSkip}
                className="w-full px-6 py-3 font-bold text-teal-600 dark:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-colors"
            >
                No thanks, I'll start from scratch
            </button>
        </div>
    </div>
);

const ResultsScreen: React.FC<{ result: PlacementTestResult, onContinue: () => void }> = ({ result, onContinue }) => {
    const xpGained = result.completedTopics.length * 10;
    return (
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md mx-auto animate-fade-in">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Great job!</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">{result.summary}</p>
            {result.completedTopics.length > 0 && (
                <div className="mt-4">
                    <p className="text-slate-500 dark:text-slate-400">You've unlocked <span className="font-bold">{result.completedTopics.length}</span> lesson{result.completedTopics.length > 1 ? 's' : ''} and earned some XP!</p>
                    <div className="mt-2 flex items-center justify-center p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
                        <StarIcon className="w-8 h-8 text-amber-500 mr-2" />
                        <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">+{xpGained} XP</span>
                    </div>
                </div>
            )}
            <button
                onClick={onContinue}
                className="mt-8 w-full px-6 py-4 text-lg font-bold text-white uppercase bg-green-500 rounded-2xl border-b-4 border-green-700 hover:bg-green-600 transition-all active:translate-y-0.5"
            >
                Continue to my path
            </button>
        </div>
    );
};


const LivePlacementTestPage: React.FC<LivePlacementTestPageProps> = ({ language, onComplete, onSkip }) => {
    const [status, setStatus] = useState<'intro' | 'testing' | 'evaluating' | 'results'>('intro');
    const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
    const [statusText, setStatusText] = useState('Connecting to AI tutor...');
    const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
    const [result, setResult] = useState<PlacementTestResult | null>(null);
    
    const turnCountRef = useRef(0);
    const currentInputRef = useRef('');
    const currentOutputRef = useRef('');
    const sessionPromiseRef = useRef<any>(null);

    // Audio processing refs
    const inputAudioContextRef = useRef<AudioContext>();
    const outputAudioContextRef = useRef<AudioContext>();
    const scriptProcessorRef = useRef<ScriptProcessorNode>();
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode>();
    const outputNodeRef = useRef<GainNode>();
    const nextStartTimeRef = useRef(0);
    const audioSourcesRef = useRef(new Set<AudioBufferSourceNode>());

    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    const disconnect = useCallback(() => {
        sessionPromiseRef.current?.then((session: any) => session.close());
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.onaudioprocess = null;
            // FIX: The disconnect method on AudioNode was being called without arguments, but the type definitions expect one.
            if (inputAudioContextRef.current) {
                scriptProcessorRef.current.disconnect(inputAudioContextRef.current.destination);
            }
        }
        // FIX: The disconnect method on AudioNode was being called without arguments.
        if (mediaStreamSourceRef.current && scriptProcessorRef.current) {
            mediaStreamSourceRef.current.disconnect(scriptProcessorRef.current);
        }
        inputAudioContextRef.current?.close().catch(console.error);
        outputAudioContextRef.current?.close().catch(console.error);
        setConnectionState('disconnected');
    }, []);

    const endTestAndEvaluate = useCallback(async () => {
        disconnect();
        setStatus('evaluating');
        setStatusText("Evaluating your proficiency...");
        try {
            const fullTranscript = transcript.map(t => `${t.author === 'ai' ? 'AI' : 'User'}: ${t.text}`).join('\n');
            const finalResult = await evaluateLiveConversation(language, fullTranscript);
            setResult(finalResult);
            setStatus('results');
        } catch (err) {
            console.error(err);
            setStatusText("Error evaluating. Starting from basics.");
            setTimeout(() => onSkip(), 2000);
        }
    }, [disconnect, transcript, language, onSkip]);

    const connect = useCallback(async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Your browser does not support the necessary audio APIs.');
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            if (inputAudioContextRef.current.state === 'suspended') {
                await inputAudioContextRef.current.resume();
            }

            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            if (outputAudioContextRef.current.state === 'suspended') {
                await outputAudioContextRef.current.resume();
            }

            outputNodeRef.current = outputAudioContextRef.current.createGain();
            outputNodeRef.current.connect(outputAudioContextRef.current.destination);

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setConnectionState('connected');
                        setStatusText('Connected! AI will start the conversation.');
                        mediaStreamSourceRef.current = inputAudioContextRef.current!.createMediaStreamSource(stream);
                        scriptProcessorRef.current = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then(((session: any) => session.sendRealtimeInput({ media: pcmBlob })));
                        };
                        mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
                        scriptProcessorRef.current.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            currentInputRef.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            setStatusText('AI is speaking...');
                            currentOutputRef.current += message.serverContent.outputTranscription.text;
                        }
                        if (message.serverContent?.turnComplete) {
                            const fullInput = currentInputRef.current.trim();
                            const fullOutput = currentOutputRef.current.trim();
                            
                            setTranscript(prev => {
                                const newTranscript = [...prev];
                                if(fullInput) newTranscript.push({ author: 'user', text: fullInput });
                                if(fullOutput) newTranscript.push({ author: 'ai', text: fullOutput });
                                return newTranscript;
                            });

                            if(fullInput && fullOutput) turnCountRef.current += 1;
                            
                            currentInputRef.current = '';
                            currentOutputRef.current = '';
                            setStatusText('Your turn. You can speak now.');

                            if(turnCountRef.current >= 2) {
                                endTestAndEvaluate();
                            }
                        }
                        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (audioData && outputAudioContextRef.current && outputNodeRef.current) {
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
                            const audioBuffer = await decodeAudioData(decode(audioData), outputAudioContextRef.current, 24000, 1);
                            const source = outputAudioContextRef.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputNodeRef.current);
                            source.addEventListener('ended', () => { audioSourcesRef.current.delete(source); });
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            audioSourcesRef.current.add(source);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setStatusText('A connection error occurred.');
                        setConnectionState('error');
                        disconnect();
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Live session closed');
                        stream.getTracks().forEach(track => track.stop());
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: `You are a friendly language examiner for a placement test. Your goal is to assess a beginner's proficiency in ${language.name}. Start by greeting them and asking a simple question like "What is your name?" or "How are you?". Keep your responses very short (1 sentence). After their response, ask another simple, common question.`,
                },
            });
        } catch (error) {
            console.error('Failed to initialize live conversation:', error);
            setStatusText('Could not access microphone. Please check permissions.');
            setConnectionState('error');
        }
    }, [language, disconnect, endTestAndEvaluate]);

    const handleStartTest = () => {
        setStatus('testing');
        connect();
    };

    if (status === 'intro') {
        return <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center"><IntroScreen onStart={handleStartTest} onSkip={onSkip} name={language.name} /></div>;
    }

    if (status === 'evaluating') {
        return <Loader message={statusText} />;
    }

    if (status === 'results' && result) {
        return <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center"><ResultsScreen result={result} onContinue={() => onComplete(result.completedTopics)} /></div>;
    }

    return (
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex flex-col h-[75vh] max-w-2xl mx-auto">
             <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Placement Test</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Have a quick chat with your AI tutor.</p>
                </div>
                <button onClick={onSkip} className="font-bold text-slate-500 hover:underline">Skip Test</button>
            </div>
            
            <div className="flex flex-col flex-grow justify-center items-center">
                 <div className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ${connectionState === 'connected' ? 'bg-teal-500/20' : 'bg-slate-500/20'}`}>
                    <div className={`absolute w-full h-full rounded-full animate-ping-slow ${connectionState === 'connected' ? 'bg-teal-500/30' : 'bg-slate-500/30'}`} />
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors duration-300 ${connectionState === 'connected' ? 'bg-teal-500' : 'bg-slate-500'}`}>
                        {connectionState === 'connecting' ? <SpinnerIcon className="w-12 h-12 text-white animate-spin" /> : <MicrophoneIcon className="w-12 h-12 text-white" />}
                    </div>
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-600 dark:text-slate-300 h-6">{statusText}</p>
            </div>

             <div className="h-48 overflow-y-auto pr-2 space-y-4 mb-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                {transcript.map((msg, index) => (
                    <div key={index} className={`flex flex-col ${msg.author === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl ${
                            msg.author === 'user' ? 'bg-teal-500 text-white rounded-br-none' : 
                            'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
                        }`}>
                           {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default LivePlacementTestPage;