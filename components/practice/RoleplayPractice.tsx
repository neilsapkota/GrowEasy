import React, { useState, useEffect, useRef } from 'react';
import { Language, ChatMessage } from '../../types';
import { startRoleplayConversation, sendChatMessage } from '../../services/geminiService';
import { Chat } from '@google/genai';
import Loader from '../Loader';
import { SpinnerIcon } from '../icons';

interface RoleplayPracticeProps {
    language: Language;
    onEnd: () => void;
}

const scenarios = [
    { key: 'coffee', title: 'Ordering Coffee', description: "Practice ordering your favorite drink at a café.", icon: '☕' },
    { key: 'market', title: 'At the Market', description: "Buy fruits and vegetables from a friendly vendor.", icon: '🍎' },
    { key: 'taxi', title: 'Booking a Taxi', description: "Tell the driver where you need to go.", icon: '🚕' },
];

const ChatInterface: React.FC<{
    language: Language;
    scenario: typeof scenarios[0];
    onEnd: () => void;
}> = ({ language, scenario, onEnd }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const initChat = async () => {
            try {
                setIsLoading(true);
                const chatSession = startRoleplayConversation(language, scenario.key);
                setChat(chatSession);

                const initialResponse = await sendChatMessage(chatSession, "Start the conversation.");
                setMessages([{ author: 'ai', content: initialResponse.reply, correction: null }]);
            } catch (err) {
                console.error(err);
                setError("Sorry, the AI partner isn't available right now. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        initChat();
    }, [language, scenario]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || isLoading) return;

        const userMessage: ChatMessage = { author: 'user', content: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await sendChatMessage(chat, userInput);
            const aiMessage: ChatMessage = { author: 'ai', content: response.reply, correction: response.correction };
            
            if (response.correction) {
                 setMessages(prev => prev.map((msg, index) => 
                    index === prev.length - 1 ? { ...msg, correction: response.correction } : msg
                ));
            }
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { author: 'system', content: "I'm having trouble connecting. Let's try that again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
             <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl text-center">
                <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
                <button onClick={onEnd} className="px-6 py-2 bg-slate-500 text-white font-bold rounded-lg hover:bg-slate-600">
                    Back to Hub
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex flex-col h-[75vh]">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold">{scenario.title}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{scenario.description}</p>
                </div>
                <button onClick={onEnd} className="font-bold text-slate-500 hover:underline">End Practice</button>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex flex-col ${msg.author === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl ${
                            msg.author === 'user' ? 'bg-teal-500 text-white rounded-br-none' : 
                            msg.author === 'ai' ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none' : 
                            'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                        }`}>
                           {msg.content}
                        </div>
                        {msg.author === 'user' && msg.correction && (
                             <div className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-1 rounded-full">
                                💡 {msg.correction}
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && messages.length > 0 && (
                    <div className="flex items-start">
                         <div className="max-w-[80%] p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 rounded-bl-none flex items-center space-x-2">
                            <SpinnerIcon className="w-4 h-4 animate-spin text-slate-500" />
                            <span className="text-sm text-slate-500">AI is thinking...</span>
                        </div>
                    </div>
                )}
                 {messages.length === 0 && isLoading && (
                     <Loader message={`Entering the ${scenario.title.toLowerCase()} scenario...`} />
                 )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow px-4 py-3 text-lg bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                    disabled={isLoading}
                />
                <button type="submit" disabled={!userInput.trim() || isLoading} className="px-6 py-3 font-bold text-white bg-teal-600 rounded-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">Send</button>
            </form>
        </div>
    );
};


const RoleplayPractice: React.FC<RoleplayPracticeProps> = ({ language, onEnd }) => {
    const [selectedScenario, setSelectedScenario] = useState<typeof scenarios[0] | null>(null);

    if (selectedScenario) {
        return <ChatInterface language={language} scenario={selectedScenario} onEnd={onEnd} />;
    }

    return (
        <div className="p-4 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Role-play Scenarios</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10">Choose a situation to practice your {language.name}.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scenarios.map(scenario => (
                    <button
                        key={scenario.key}
                        onClick={() => setSelectedScenario(scenario)}
                        className="p-6 bg-white dark:bg-slate-800 rounded-2xl text-left shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                        <span className="text-4xl mb-4 block">{scenario.icon}</span>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{scenario.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400">{scenario.description}</p>
                    </button>
                ))}
            </div>
             <div className="text-center mt-8">
                <button onClick={onEnd} className="font-bold text-slate-500 hover:underline">Back to Practice Hub</button>
            </div>
        </div>
    );
};

export default RoleplayPractice;