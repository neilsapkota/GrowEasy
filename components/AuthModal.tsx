import React, { useEffect, useCallback, useState } from 'react';
import { SpinnerIcon } from './icons';
import { User } from '../types';

// Fix: Add type declarations for external SDKs on the window object to resolve TypeScript errors.
declare global {
    interface Window {
        google?: any;
    }
}

// Helper to decode JWT for Google Sign-In
const decodeJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // IMPORTANT: Replace this with your own Google Client ID
    const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

    const handleClose = () => {
        setIsLoading(false);
        onClose();
    };

    const handleGoogleCredentialResponse = useCallback((response: any) => {
        setIsLoading(true);
        const credential = response.credential;
        if (credential) {
            const decodedToken = decodeJwt(credential);
            if (decodedToken) {
                const user: User = {
                    name: decodedToken.name,
                    avatarUrl: decodedToken.picture,
                };
                onLoginSuccess(user);
            } else {
                console.error('Could not process Google credential.');
                setIsLoading(false);
            }
        } else {
            console.error('Google sign-in failed.');
            setIsLoading(false);
        }
    }, [onLoginSuccess]);

    useEffect(() => {
        if (isOpen && window.google) {
            // If the client ID is the placeholder, Google's library will show an error, which is the expected behavior.
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleCredentialResponse,
            });

            const googleButtonContainer = document.getElementById('google-signin-button');
            if (googleButtonContainer) {
                googleButtonContainer.innerHTML = ''; // Clear previous button to prevent duplicates
                 window.google.accounts.id.renderButton(
                    googleButtonContainer,
                    { theme: "outline", size: "large", type: 'standard', text: 'continue_with' }
                );
            }
        }
    }, [isOpen, handleGoogleCredentialResponse, GOOGLE_CLIENT_ID]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center animate-fade-in"
            onClick={handleClose}
            aria-live="polite"
        >
            <div 
                className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-sm m-4 text-center transform transition-all animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
                style={{ animationDuration: '0.4s' }}
            >
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Create an Account</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Sign up to save your progress and learn faster!</p>
                
                <div className="space-y-4 min-h-[50px] flex items-center justify-center">
                     {isLoading ? (
                        <SpinnerIcon className="w-8 h-8 animate-spin text-slate-500" />
                     ) : (
                        <div id="google-signin-button" className="flex justify-center"></div>
                     )}
                </div>
                
                <button 
                    onClick={handleClose}
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