import React, { useEffect, useCallback, useState } from 'react';
import { GoogleIcon, FacebookIcon, SpinnerIcon } from './icons';
import { User } from '../types';

// Fix: Add type declarations for external SDKs on the window object to resolve TypeScript errors.
declare global {
    interface Window {
        google?: any;
        FB?: any;
        FB_APP_ID?: string;
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
    const [isFbSdkReady, setIsFbSdkReady] = useState(false);
    const [isFbConfigured, setIsFbConfigured] = useState(false);
    const [isHttps, setIsHttps] = useState(false);
    const [isLoading, setIsLoading] = useState<null | 'google' | 'facebook'>(null);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        setError(null);
        setIsLoading(null);
        onClose();
    };

    const handleGoogleCredentialResponse = useCallback((response: any) => {
        setIsLoading('google');
        setError(null);
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
                setError('Could not process Google credential. Please try again.');
                setIsLoading(null);
            }
        } else {
            setError('Google sign-in failed. Please try again.');
            setIsLoading(null);
        }
    }, [onLoginSuccess]);

    useEffect(() => {
        if (isOpen && window.google) {
            window.google.accounts.id.initialize({
                client_id: '763308202157-ac4tcod20i6o4mng0tbo0cmgtqir5hsj.apps.googleusercontent.com',
                callback: handleGoogleCredentialResponse,
            });

            const googleButtonContainer = document.getElementById('google-signin-button');
            if (googleButtonContainer) {
                 window.google.accounts.id.renderButton(
                    googleButtonContainer,
                    { theme: "outline", size: "large", type: 'standard', text: 'continue_with', width: googleButtonContainer.offsetWidth }
                );
            }
        }
    }, [isOpen, handleGoogleCredentialResponse]);
    
    useEffect(() => {
        setIsHttps(window.location.protocol === 'https:');
        setIsFbConfigured(!!window.FB_APP_ID && window.FB_APP_ID !== 'YOUR_FACEBOOK_APP_ID');

        const setSdkReady = () => setIsFbSdkReady(true);
        window.addEventListener('fbAsyncInit', setSdkReady);
        // Check if SDK might already be loaded
        if (window.FB && (window.FB as any).XFBML) {
            setSdkReady();
        }
        return () => {
            window.removeEventListener('fbAsyncInit', setSdkReady);
        };
    }, []);

    const fetchFacebookUserInfo = useCallback(() => {
        if (window.FB) {
            window.FB.api('/me', { fields: 'name,picture.type(large)' }, function(apiResponse: any) {
                if (apiResponse && !apiResponse.error) {
                    const user: User = {
                        name: apiResponse.name,
                        avatarUrl: apiResponse.picture.data.url,
                    };
                    onLoginSuccess(user);
                } else {
                    setError("Failed to fetch your Facebook profile. Please try again.");
                    setIsLoading(null);
                    console.error("Facebook API error:", apiResponse ? apiResponse.error : 'Unknown error');
                }
            });
        }
    }, [onLoginSuccess]);
    
    const handleFacebookLogin = () => {
        if (!isFbSdkReady || !isHttps || !isFbConfigured || isLoading) {
             return;
        }
        
        setIsLoading('facebook');
        setError(null);
        
        window.FB.getLoginStatus(function(response: any) {
            if (response.status === 'connected') {
                fetchFacebookUserInfo();
            } else {
                window.FB.login(function(loginResponse: any) {
                    if (loginResponse.authResponse) {
                        fetchFacebookUserInfo();
                    } else {
                        setError('Facebook login was cancelled or not fully authorized.');
                        setIsLoading(null);
                    }
                }, { scope: 'public_profile,email' });
            }
        });
    };

    if (!isOpen) return null;

    const isFacebookLoginDisabled = !isFbSdkReady || !isHttps || !isFbConfigured;
    let facebookButtonTooltip = '';
    if (!isFbConfigured) {
        facebookButtonTooltip = "Facebook App ID is not configured. Please see tip below.";
    } else if (!isHttps) {
        facebookButtonTooltip = "Facebook login requires a secure (HTTPS) connection.";
    } else if (!isFbSdkReady) {
        facebookButtonTooltip = "Initializing Facebook login...";
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
            onClick={handleClose}
            aria-live="polite"
        >
            <div 
                className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-sm m-4 text-center transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Create an Account</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Sign up to save your progress and learn faster!</p>
                
                {!isFbConfigured && (
                     <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-xs text-slate-600 dark:text-slate-300 text-left space-y-2">
                        <p className="font-bold text-blue-800 dark:text-blue-300">Developer Tip: Setup Facebook Login</p>
                        <p>1. Go to <a href="https://developers.facebook.com/apps/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 underline">Meta for Developers</a> and create a new "Consumer" app.</p>
                        <p>2. In your app's "Facebook Login for Web" settings, add this URL to "Valid OAuth Redirect URIs":</p>
                        <code className="select-all font-mono bg-slate-200 dark:bg-slate-600 p-1 rounded text-teal-600 dark:text-teal-400 block mt-1">
                            {window.location.origin}
                        </code>
                        <p>3. Copy your App ID and paste it into `index.html`.</p>
                    </div>
                )}


                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm font-semibold" role="alert">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div id="google-signin-button" className={`flex justify-center transition-opacity ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}></div>
                    
                    <div className="relative">
                        <button
                            onClick={handleFacebookLogin}
                            disabled={isFacebookLoginDisabled || !!isLoading}
                            aria-busy={isLoading === 'facebook'}
                            className="w-full flex items-center justify-center px-4 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            {isLoading === 'facebook' ? (
                                <>
                                    <SpinnerIcon className="animate-spin w-5 h-5 mr-3" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <FacebookIcon className="w-6 h-6 mr-3" />
                                    <span>Continue with Facebook</span>
                                </>
                            )}
                        </button>
                        {isFacebookLoginDisabled && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-2">
                                {facebookButtonTooltip}
                            </p>
                        )}
                    </div>
                </div>
                
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Close modal"
                    disabled={!!isLoading}
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