
import React, { useState, useMemo } from 'react';
import { User, RegisteredUser, Page } from '../types';
import { UsersIcon } from './icons';

interface FriendsPageProps {
    user: User;
    registeredUsers: RegisteredUser[];
    onSendRequest: (toEmail: string) => void;
    onAcceptRequest: (fromEmail: string) => void;
    onDeclineRequest: (fromEmail: string) => void;
    onRemoveFriend: (friendEmail: string) => void;
    onNavigate: (page: Page) => void;
}

const FriendsPage: React.FC<FriendsPageProps> = ({ user, registeredUsers, onSendRequest, onAcceptRequest, onDeclineRequest, onRemoveFriend, onNavigate }) => {
    const [tab, setTab] = useState<'myFriends' | 'requests' | 'find'>('myFriends');
    const [searchTerm, setSearchTerm] = useState('');

    const currentUserData = useMemo(() => {
        return registeredUsers.find(ru => ru.user.email === user.email);
    }, [user, registeredUsers]);

    const friends = useMemo(() => {
        if (!currentUserData) return [];
        return registeredUsers.filter(ru => currentUserData.friends.includes(ru.user.email));
    }, [currentUserData, registeredUsers]);

    const friendRequests = useMemo(() => {
        if (!currentUserData?.friendRequests) return [];
        return currentUserData.friendRequests.map(req => {
            const sender = registeredUsers.find(ru => ru.user.email === req.from);
            return sender ? { ...req, user: sender.user } : null;
        }).filter(Boolean);
    }, [currentUserData, registeredUsers]);

    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];
        return registeredUsers.filter(ru => 
            ru.user.email.toLowerCase().includes(searchTerm.toLowerCase()) && 
            ru.user.email !== user.email
        );
    }, [searchTerm, registeredUsers, user.email]);

    const getFriendStatus = (targetUserEmail: string): 'friends' | 'request_sent' | 'request_received' | 'none' => {
        if (currentUserData?.friends.includes(targetUserEmail)) return 'friends';
        const targetUser = registeredUsers.find(ru => ru.user.email === targetUserEmail);
        if (targetUser?.friendRequests?.some(req => req.from === user.email)) return 'request_sent';
        if (currentUserData?.friendRequests?.some(req => req.from === targetUserEmail)) return 'request_received';
        return 'none';
    };
    
    const renderContent = () => {
        switch (tab) {
            case 'requests':
                return (
                    <div>
                        {friendRequests.length === 0 ? (
                            <p className="text-center text-slate-500 dark:text-slate-400 py-8">You have no pending friend requests.</p>
                        ) : (
                            <ul className="space-y-3">
                                {friendRequests.map(req => req && (
                                    <li key={req.from} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <img src={req.user.avatarUrl} alt={req.user.name} className="w-10 h-10 rounded-full" />
                                            <span className="font-bold">{req.user.name}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => onAcceptRequest(req.from)} className="px-3 py-1 text-sm font-bold text-white bg-green-500 rounded-md hover:bg-green-600">Accept</button>
                                            <button onClick={() => onDeclineRequest(req.from)} className="px-3 py-1 text-sm font-bold bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300">Decline</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            case 'find':
                return (
                    <div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by email..."
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <ul className="space-y-3 mt-4">
                            {searchResults.map(ru => {
                                const status = getFriendStatus(ru.user.email);
                                return (
                                <li key={ru.user.email} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <img src={ru.user.avatarUrl} alt={ru.user.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-bold">{ru.user.name}</p>
                                            <p className="text-xs text-slate-500">{ru.user.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        {status === 'none' && <button onClick={() => onSendRequest(ru.user.email)} className="px-3 py-1 text-sm font-bold text-white bg-teal-500 rounded-md hover:bg-teal-600">Add Friend</button>}
                                        {status === 'friends' && <span className="text-sm font-semibold text-slate-500">Friends</span>}
                                        {status === 'request_sent' && <span className="text-sm font-semibold text-slate-500">Request Sent</span>}
                                        {status === 'request_received' && <button onClick={() => onAcceptRequest(ru.user.email)} className="px-3 py-1 text-sm font-bold text-white bg-green-500 rounded-md hover:bg-green-600">Accept</button>}
                                    </div>
                                </li>
                            )})}
                        </ul>
                    </div>
                );
            case 'myFriends':
            default:
                return (
                    <div>
                         {friends.length === 0 ? (
                            <p className="text-center text-slate-500 dark:text-slate-400 py-8">You haven't added any friends yet. Go to 'Find Friends' to connect!</p>
                        ) : (
                            <ul className="space-y-3">
                                {friends.map(friend => (
                                    <li key={friend.user.email} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <img src={friend.user.avatarUrl} alt={friend.user.name} className="w-10 h-10 rounded-full" />
                                            <span className="font-bold">{friend.user.name}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => onNavigate(Page.Messages)} className="px-3 py-1 text-sm font-bold text-white bg-sky-500 rounded-md hover:bg-sky-600">Message</button>
                                            <button onClick={() => onRemoveFriend(friend.user.email)} className="px-3 py-1 text-sm font-bold bg-rose-500 text-white rounded-md hover:bg-rose-600">Remove</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
        }
    };
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <UsersIcon className="w-10 h-10 text-teal-500" />
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Friends</h2>
            </div>
            
            <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
                <nav className="flex -mb-px space-x-6">
                    <button onClick={() => setTab('myFriends')} className={`py-3 px-1 border-b-2 font-semibold ${tab === 'myFriends' ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>My Friends</button>
                    <button onClick={() => setTab('requests')} className={`py-3 px-1 border-b-2 font-semibold relative ${tab === 'requests' ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                        Requests
                        {friendRequests.length > 0 && <span className="absolute -top-1 -right-4 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-xs text-white">{friendRequests.length}</span>}
                    </button>
                    <button onClick={() => setTab('find')} className={`py-3 px-1 border-b-2 font-semibold ${tab === 'find' ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Find Friends</button>
                </nav>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
                {renderContent()}
            </div>
        </div>
    );
};

export default FriendsPage;