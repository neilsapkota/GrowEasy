import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Language, ChatMessage } from '../../types';
import { startConversation, sendChatMessage } from '../../services/geminiService';
import { Chat } from '@google/genai';
import Loader from '../Loader';
import { MicrophoneIcon, SpinnerIcon } from '../icons';

interface ConversationPracticeProps {
    language: Language;
    onEnd: () => void;
}

const ConversationPractice: React.FC<ConversationPracticeProps> = ({ language, onEnd }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Initialize conversation
    useEffect(() => {
        const initChat = async () => {
            try {
                setIsLoading(true);
                const chatSession = startConversation(language);
                setChat(chatSession);

                // Get the first message from the AI
                const initialResponse = await sendChatMessage(chatSession, "Start the conversation.");
                setMessages([{ author: 'ai', content: initialResponse.reply, correction: null }]);
            } catch (err) {
                console.error(err);
                setError("Sorry, the conversation partner isn't available right now. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        initChat();
    }, [language]);
    
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
            
            // Add correction to user's message if available
            if (response.correction) {
                 setMessages(prev => prev.map((msg, index) => 
                    index === prev.length - 1 ? { ...msg, correction: response.correction } : msg
                ));
            }

            setMessages(prev => [...prev, aiMessage]);

        } catch (err) {
            console.error(err);
            const errorMessage: ChatMessage = { author: 'system', content: "I'm having trouble connecting. Let's try that again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
             <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl text-center">
                <h2 className="text-xl font-bold mb-4 text-red-500">An Error Occurred</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
                <button onClick={onEnd} className="px-6 py-2 bg-slate-500 text-white font-bold rounded-lg hover:bg-slate-600">
                    Back to Hub
                </button>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex flex-col h-[75vh]">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Conversation Practice</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Chat with Alex, your AI partner.</p>
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
                            <span className="text-sm text-slate-500">Alex is typing...</span>
                        </div>
                    </div>
                )}
                 {messages.length === 0 && isLoading && (
                     <Loader message="Connecting to your conversation partner..." />
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
                <button
                    type="submit"
                    disabled={!userInput.trim() || isLoading}
                    className="px-6 py-3 font-bold text-white bg-teal-600 rounded-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ConversationPractice;