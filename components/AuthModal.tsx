import React, { useState, useEffect } from 'react';
import { User, RegisteredUser } from '../types';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (user: User) => void;
    registeredUsers: RegisteredUser[];
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, registeredUsers }) => {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    const handleUserSelect = (user: User) => {
        setIsLoading(true);
        setTimeout(() => {
            onLoginSuccess(user);
            setIsLoading(false);
        }, 300);
    };

    const handleSubmitNewUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        
        // Short delay to simulate network
        setTimeout(() => {
            // Check if user already exists (case-insensitive)
            const userExists = registeredUsers.some(ru => ru.user.name.toLowerCase() === name.trim().toLowerCase());
            if (userExists) {
                const existingUser = registeredUsers.find(ru => ru.user.name.toLowerCase() === name.trim().toLowerCase())!.user;
                onLoginSuccess(existingUser);
            } else {
                // Create new user
                const user: User = {
                    name: name.trim(),
                    avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name.trim())}`,
                };
                onLoginSuccess(user);
            }
            
            setIsLoading(false);
            setName('');
            setIsCreatingNew(false);
        }, 500);
    };

    const hasRegisteredUsers = registeredUsers && registeredUsers.length > 0;

    // Reset view when modal opens
    useEffect(() => {
        if (isOpen) {
            setIsCreatingNew(!hasRegisteredUsers);
        }
    }, [isOpen, hasRegisteredUsers]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center animate-fade-in"
            onClick={onClose}
            aria-live="polite"
        >
            <div 
                className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-sm m-4 text-center transform transition-all animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
                style={{ animationDuration: '0.4s' }}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Close modal"
                    disabled={isLoading}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {isCreatingNew ? (
                    <>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Create or Find Account</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">Enter your name to sign in or create a new profile.</p>
                        
                        <form onSubmit={handleSubmitNewUser} className="space-y-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 text-lg bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!name.trim() || isLoading}
                                className="w-full px-4 py-3 text-lg font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
                            >
                                {isLoading ? 'Please wait...' : 'Continue'}
                            </button>
                        </form>
                        {hasRegisteredUsers && (
                            <button onClick={() => setIsCreatingNew(false)} className="mt-4 text-sm text-teal-600 hover:underline">
                                &larr; Back to returning users
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Welcome Back!</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">Select your profile to continue.</p>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {registeredUsers.map(ru => (
                                <button key={ru.user.name} onClick={() => handleUserSelect(ru.user)} className="w-full flex items-center p-3 rounded-lg text-left bg-slate-100 hover:bg-teal-100 dark:bg-slate-700 dark:hover:bg-teal-900/50 transition-colors">
                                    <img src={ru.user.avatarUrl} alt={ru.user.name} className="w-10 h-10 rounded-full mr-4" />
                                    <span className="font-bold text-lg">{ru.user.name}</span>
                                </button>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                             <button onClick={() => setIsCreatingNew(true)} className="w-full text-center py-2 text-teal-600 font-bold hover:underline">
                                Use a different account
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthModal;
