import React, { useState } from 'react';
import { RegisteredUser } from '../types';
import { SpinnerIcon } from './icons';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthSuccess: (user: RegisteredUser, isNewUser: boolean) => void;
    registeredUsers: RegisteredUser[];
}

const GoogleLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
            <path d="M20.64 12.2045c0-.6382-.0573-1.2518-.1636-1.8409H12v3.4818h4.8445c-.209 1.125-.8455 2.0782-1.7772 2.7164v2.2582h2.9082c1.7018-1.5664 2.6836-3.8736 2.6836-6.6155z" fill="#4285F4"/>
            <path d="M12 21c2.43 0 4.4673-.8064 5.9564-2.1809l-2.9082-2.2582c-.8064.5427-1.8409.8618-3.0482.8618-2.3455 0-4.329-1.5836-5.0363-3.7109H3.957v2.3318C5.4382 18.9836 8.4818 21 12 21z" fill="#34A853"/>
            <path d="M6.9637 14.71c-.181-.5427-.2828-1.1164-.2828-1.71s.1018-1.1673.2828-1.71V8.9582H3.957C3.3473 10.1473 3 11.5355 3 13s.3473 2.8527.957 4.0418L6.9637 14.71z" fill="#FBBC05"/>
            <path d="M12 6.2836c1.3227 0 2.509.4555 3.4409 1.3464l2.5855-2.5855C16.4636 3.8236 14.43 3 12 3 8.4818 3 5.4382 5.0164 3.957 7.9582L6.9637 10.29C7.671 8.1636 9.6545 6.2836 12 6.2836z" fill="#EA4335"/>
        </g>
    </svg>
);

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess, registeredUsers }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    // This function simulates a Google Sign-In flow.
    // In a real app, you'd use a library like @react-oauth/google
    // to get the user's profile information.
    const handleGoogleSignIn = () => {
        setIsLoading(true);
        setError('');

        // Simulate network delay
        setTimeout(() => {
            // Simulate receiving user data from Google
            const googleUserData = {
                name: 'Alex Johnson',
                email: 'alex.j@example.com',
                avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=Alex`,
            };

            // Check if user already exists
            const existingUser = registeredUsers.find(ru => ru.user.email.toLowerCase() === googleUserData.email.toLowerCase());

            if (existingUser) {
                // User exists, log them in
                onAuthSuccess(existingUser, false);
            } else {
                // User is new, create an account
                const newUser: RegisteredUser = {
                    user: {
                        name: googleUserData.name,
                        email: googleUserData.email,
                        avatarUrl: googleUserData.avatarUrl,
                        bio: 'Just started my language journey!',
                    },
                    progress: {},
                    friends: [],
                    friendRequests: [],
                };
                onAuthSuccess(newUser, true);
            }
            setIsLoading(false);
        }, 1000);
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
                
                <div className="text-center">
                     <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Welcome to WordVine</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">Sign in to save your progress and learn from any device.</p>
                    
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 p-3 font-bold rounded-lg bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 shadow-sm transition-colors disabled:bg-slate-200 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <SpinnerIcon className="w-6 h-6 animate-spin"/>
                        ) : (
                           <>
                                <GoogleLogo />
                                <span>Sign in with Google</span>
                           </>
                        )}
                    </button>
                    {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;