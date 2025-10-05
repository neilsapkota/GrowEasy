import React, { useState } from 'react';
import { User } from '../types';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        
        // Simulate a network request
        setTimeout(() => {
            const user: User = {
                name: name.trim(),
                // Generate a simple, consistent avatar from an external service
                avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name.trim())}`,
            };
            onLoginSuccess(user);
            setIsLoading(false);
            setName('');
        }, 500);
    };

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
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Create an Account</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Enter your name to save progress and access all features!</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                
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
            </div>
        </div>
    );
};

export default AuthModal;