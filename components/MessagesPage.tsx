

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { User, RegisteredUser, Message } from '../types';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from './icons';

interface MessagesPageProps {
    user: User;
    registeredUsers: RegisteredUser[];
    messages: Message[];
    onSendMessage: (toEmail: string, content: string) => void;
    onMarkRead: (friendEmail: string) => void;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ user, registeredUsers, messages, onSendMessage, onMarkRead }) => {
    const [activeChat, setActiveChat] = useState<string | null>(null); // friend's email
    const [messageContent, setMessageContent] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentUserData = useMemo(() => {
        return registeredUsers.find(ru => ru.user.email === user.email);
    }, [user, registeredUsers]);
    
    const friends = useMemo(() => {
        if (!currentUserData) return [];
        return registeredUsers.filter(ru => currentUserData.friends.includes(ru.user.email));
    }, [currentUserData, registeredUsers]);

    const conversationList = useMemo(() => {
        return friends.map(friend => {
            const relevantMessages = messages.filter(m => (m.from === user.email && m.to === friend.user.email) || (m.from === friend.user.email && m.to === user.email));
            const lastMessage = relevantMessages.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            const unreadCount = relevantMessages.filter(m => m.to === user.email && !m.read).length;
            return {
                friend,
                lastMessage,
                unreadCount,
            };
        }).sort((a,b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
        });
    }, [friends, messages, user.email]);

    const activeChatMessages = useMemo(() => {
        if (!activeChat) return [];
        return messages.filter(m => (m.from === user.email && m.to === activeChat) || (m.from === activeChat && m.to === user.email))
                        .sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [activeChat, messages, user.email]);

    const activeFriend = useMemo(() => {
        if (!activeChat) return null;
        return friends.find(f => f.user.email === activeChat);
    }, [activeChat, friends]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeChatMessages]);
    
    useEffect(() => {
        // Automatically select the first conversation if none is selected
        if (!activeChat && conversationList.length > 0) {
            setActiveChat(conversationList[0].friend.user.email);
        }
    }, [conversationList, activeChat]);

    useEffect(() => {
        if (activeChat) {
            onMarkRead(activeChat);
        }
    }, [activeChat, onMarkRead]);
    
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeChat || !messageContent.trim()) return;
        onSendMessage(activeChat, messageContent);
        setMessageContent('');
    };

    return (
        <div className="flex h-[calc(100vh-3rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
            {/* Left Pane: Conversation List */}
            <aside className="w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold">Chats</h2>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {conversationList.length === 0 && (
                        <p className="p-4 text-center text-sm text-slate-500">You have no conversations. Add some friends to start chatting!</p>
                    )}
                    <ul>
                        {conversationList.map(({ friend, lastMessage, unreadCount }) => (
                            <li key={friend.user.email}>
                                <button
                                    onClick={() => setActiveChat(friend.user.email)}
                                    className={`w-full text-left p-3 flex items-center gap-3 transition-colors ${activeChat === friend.user.email ? 'bg-sky-100 dark:bg-sky-900/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
                                >
                                    <div className="relative">
                                        <img src={friend.user.avatarUrl} alt={friend.user.name} className="w-12 h-12 rounded-full" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-rose-500 border-2 border-white dark:border-slate-800 text-xs text-white flex items-center justify-center font-bold">{unreadCount}</span>
                                        )}
                                    </div>
                                    <div className="flex-grow overflow-hidden">
                                        <p className="font-bold truncate">{friend.user.name}</p>
                                        <p className={`text-sm truncate ${unreadCount > 0 ? 'text-slate-800 dark:text-slate-100 font-semibold' : 'text-slate-500'}`}>
                                            {lastMessage?.content ?? 'No messages yet'}
                                        </p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Right Pane: Chat Window */}
            <main className="w-2/3 flex flex-col">
                {activeFriend ? (
                    <>
                    <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                        <img src={activeFriend.user.avatarUrl} alt={activeFriend.user.name} className="w-10 h-10 rounded-full" />
                        <h3 className="font-bold text-lg">{activeFriend.user.name}</h3>
                    </header>
                    <div className="flex-grow p-4 overflow-y-auto space-y-4">
                        {activeChatMessages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.from === user.email ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] p-3 rounded-2xl ${msg.from === user.email ? 'bg-teal-500 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 rounded-bl-none'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <footer className="p-4 border-t border-slate-200 dark:border-slate-700">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <input
                                type="text"
                                value={messageContent}
                                onChange={e => setMessageContent(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-grow px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <button type="submit" className="p-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors disabled:bg-slate-400" disabled={!messageContent.trim()}>
                                <PaperAirplaneIcon className="w-6 h-6" />
                            </button>
                        </form>
                    </footer>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                        <ChatBubbleLeftRightIcon className="w-24 h-24 text-slate-300 dark:text-slate-600 mb-4" />
                        <h3 className="text-xl font-bold">Select a conversation</h3>
                        <p className="text-slate-500">Choose a friend from the list to start chatting.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MessagesPage;
