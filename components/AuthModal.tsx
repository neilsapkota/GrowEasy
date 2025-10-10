import React, { useState, useEffect } from 'react';
import { User, RegisteredUser } from '../types';
import { SpinnerIcon, EyeIcon, EyeSlashIcon, BackIcon } from './icons';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthSuccess: (user: User, isNewUser?: boolean, newUserDetails?: { user: User; password?: string }) => void;
    registeredUsers: RegisteredUser[];
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess, registeredUsers }) => {
    const [view, setView] = useState<'options' | 'signin' | 'signup'>('options');
    
    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Control state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Reset state when modal opens
            setView('options');
            setName('');
            setEmail('');
            setPassword('');
            setError('');
            setIsLoading(false);
            setShowPassword(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        setTimeout(() => {
            const foundUser = registeredUsers.find(ru => ru.user.email.toLowerCase() === email.toLowerCase() && ru.password === password);
            if (foundUser) {
                onAuthSuccess(foundUser.user, false);
            } else {
                setError('Invalid email or password.');
            }
            setIsLoading(false);
        }, 500);
    };

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            const emailExists = registeredUsers.some(ru => ru.user.email.toLowerCase() === email.toLowerCase());
            if (emailExists) {
                setError('An account with this email already exists.');
                setIsLoading(false);
                return;
            }

            const newUser: User = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name.trim())}`,
                isPro: false,
            };
            
            const newUserDetails = { user: newUser, password };
            
            onAuthSuccess(newUser, true, newUserDetails);
            setIsLoading(false);
        }, 500);
    };

    const renderOptions = () => (
        <>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Get Started</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Create an account or sign in to save your progress.</p>
            <div className="space-y-3">
                 <button 
                    onClick={() => setView('signin')}
                    className="w-full p-3 font-bold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                    disabled={isLoading}
                >
                    Sign In with Email
                </button>
            </div>
            <div className="mt-6 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    New to GrowEasy?{' '}
                    <button onClick={() => setView('signup')} className="font-bold text-teal-600 hover:underline">
                        Create an account
                    </button>
                </p>
            </div>
        </>
    );
    
    const renderSignIn = () => (
        <>
            <button onClick={() => setView('options')} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800 dark:hover:text-white"><BackIcon className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">Sign In</h2>
            <form onSubmit={handleSignIn} className="space-y-4">
                 <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                />
                 <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500">
                        {showPassword ? <EyeSlashIcon className="w-6 h-6"/> : <EyeIcon className="w-6 h-6" />}
                    </button>
                 </div>
                 <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full p-3 font-bold rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-400 transition-colors"
                >
                    {isLoading ? <SpinnerIcon className="w-6 h-6 mx-auto animate-spin"/> : 'Sign In'}
                </button>
            </form>
        </>
    );

     const renderSignUp = () => (
        <>
            <button onClick={() => setView('options')} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800 dark:hover:text-white"><BackIcon className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">Create Account</h2>
            <form onSubmit={handleSignUp} className="space-y-4">
                 <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                />
                 <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                />
                 <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password (min. 6 characters)"
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    />
                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500">
                        {showPassword ? <EyeSlashIcon className="w-6 h-6"/> : <EyeIcon className="w-6 h-6" />}
                    </button>
                 </div>
                 <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full p-3 font-bold rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-400 transition-colors"
                >
                    {isLoading ? <SpinnerIcon className="w-6 h-6 mx-auto animate-spin"/> : 'Create Account'}
                </button>
            </form>
        </>
    );

    const renderContent = () => {
        switch (view) {
            case 'signin': return renderSignIn();
            case 'signup': return renderSignUp();
            case 'options':
            default:
                return renderOptions();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-sm m-4 transform transition-all animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Close modal"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <div className="min-h-[250px]">
                    {renderContent()}
                </div>

                {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default AuthModal;