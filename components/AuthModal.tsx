import React from 'react';
import { RegisteredUser } from '../types';
import { SpinnerIcon } from './icons';

// Helper function to decode the JWT credential from Google
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error decoding JWT", e);
        return null;
    }
}

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthSuccess: (user: RegisteredUser, isNewUser: boolean) => void;
    registeredUsers: RegisteredUser[];
}

// TypeScript declaration for the global 'google' object from the GSI script
declare const google: any;

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess, registeredUsers }) => {
    const signInButtonRef = React.useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [initError, setInitError] = React.useState<string | null>(null);

    // This callback will be attached to the window object for Google's library to call
    const handleCredentialResponse = React.useCallback((response: any) => {
        setIsLoading(true);
        const userObject = parseJwt(response.credential);
        
        if (!userObject) {
            console.error("Failed to parse user credentials.");
            setIsLoading(false);
            return;
        }

        const googleUserData = {
            name: userObject.name,
            email: userObject.email,
            avatarUrl: userObject.picture,
        };

        const existingUser = registeredUsers.find(ru => ru.user.email.toLowerCase() === googleUserData.email.toLowerCase());

        if (existingUser) {
            onAuthSuccess(existingUser, false);
        } else {
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
    }, [onAuthSuccess, registeredUsers]);

    React.useEffect(() => {
        if (!isOpen) return;
        
        // Make the callback globally accessible for the GSI library
        (window as any).handleCredentialResponse = handleCredentialResponse;
        
        // Periodically check if the Google script has loaded
        const checkGoogle = setInterval(() => {
            if (typeof google !== 'undefined' && google.accounts && google.accounts.id && signInButtonRef.current) {
                clearInterval(checkGoogle);
                
                const clientId = document.querySelector('meta[name="google-signin-client_id"]')?.getAttribute('content');
                if (!clientId || clientId.startsWith('YOUR_CLIENT_ID')) {
                    const errorMsg = "Google Client ID is not configured. Please add it to the meta tag in index.html.";
                    console.error(errorMsg);
                    setInitError(errorMsg);
                    return;
                }

                try {
                    // Initialize the GSI client
                    google.accounts.id.initialize({
                        client_id: clientId,
                        callback: (window as any).handleCredentialResponse
                    });

                    // Render the sign-in button into our target div
                    google.accounts.id.renderButton(
                        signInButtonRef.current,
                        { theme: "outline", size: "large", type: "standard", text: "signin_with", shape: "rectangular", width: "280" }
                    );
                } catch (error) {
                    console.error("Google Sign-In initialization error:", error);
                    setInitError("Failed to initialize Google Sign-In. Check console for details.");
                }
            }
        }, 100);

        // Cleanup function to remove the global callback on component unmount
        return () => {
            clearInterval(checkGoogle);
            if ((window as any).handleCredentialResponse) {
                delete (window as any).handleCredentialResponse;
            }
        };

    }, [isOpen, handleCredentialResponse]);


    if (!isOpen) return null;

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
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Welcome to Fluentli</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">Sign in to save your progress and learn from any device.</p>
                    
                    {isLoading ? (
                         <div className="flex justify-center items-center h-[50px]">
                            <SpinnerIcon className="w-8 h-8 animate-spin"/>
                         </div>
                    ) : initError ? (
                        <div className="p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-sm">
                            {initError}
                        </div>
                    ) : (
                        // This div will be populated by the Google script
                        <div ref={signInButtonRef} className="flex justify-center h-[50px]"></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;