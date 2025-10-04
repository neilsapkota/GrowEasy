import React from 'react';

export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
);

export const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A9.75 9.75 0 0110.5 18.75a8.25 8.25 0 01-1.413-1.625.75.75 0 00-1.063.163l-.703.882A.75.75 0 008.25 19.5a9 9 0 009-9 .75.75 0 00-.75-.75h-1.5z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A9.75 9.75 0 0110.5 18.75a8.25 8.25 0 01-1.413-1.625.75.75 0 00-1.063.163l-.703.882A.75.75 0 008.25 19.5a9 9 0 009-9 .75.75 0 00-.75-.75h-1.5z" clipRule="evenodd" />
        <path d="M11.25 9.75a1.5 1.5 0 00-1.5 1.5v5.25a1.5 1.5 0 001.5 1.5h1.5a1.5 1.5 0 001.5-1.5v-5.25a1.5 1.5 0 00-1.5-1.5h-1.5z" />
    </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06l-3.25 3.25-1.5-1.5a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l3.75-3.75z" clipRule="evenodd" />
    </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
    </svg>
);

export const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 48 48" >
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A7.98 7.98 0 0 1 24 36c-4.418 0-8.28-3.37-9.4-7.617l-6.571 4.819A19.999 19.999 0 0 0 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.24 44 30.022 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 48 48">
        <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z" />
        <path fill="#fff" d="M26.572 29.036h4.917l-.772-4.995h-4.145v-3.282c0-1.438.396-2.417 2.456-2.417h2.618v-4.243c-.453-.06-.996-.09-1.536-.09-1.523 0-2.564.925-2.564 2.634v3.066h-2.57v4.995h2.57v11.905c.522.08 1.056.12 1.604.12z" />
    </svg>
);

export const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);


// Topic Icons
export const GreetingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
);

export const FoodIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12.812c.38.13.737.283 1.085.457-1.168 2.22-3.15 3.923-5.464 4.901a8.76 8.76 0 01-1.23-.332c.163-.585.295-1.186.39-1.802.1-.64.148-1.295.148-1.972 0-.34-.015-.678-.043-1.012.383-.352.748-.724 1.09-1.114.734-.823 1.344-1.782 1.83-2.826.317-.68.56-1.403.72-2.158.04-.19.073-.383.1-.578.028-.19.048-.382.06-.575a1.833 1.833 0 00-.36-.95c-.32-.423-.775-.718-1.295-.898-.225-.078-.46-.145-.7-.204-1.92.5-3.62 1.54-4.99 2.972-.69.72-1.28 1.54-1.76 2.44-.04.07-.08.14-.12.21-.08.14-.14.28-.22.42a13.92 13.92 0 01-1.16 1.852c-.32.44-.68.85-1.08 1.23-.32.3-.68.57-1.08.81-.4.24-.8.46-1.2.66-.2.1-.4.2-.6.3-.6.28-1.2.5-1.8.68a5.2 5.2 0 01-3.6-1.5c-.9-.8-1.5-2-1.5-3.3 0-1.2.6-2.3 1.5-3.1.9-.8 2.1-1.3 3.3-1.3.4 0 .8.1 1.2.2.6.2 1.2.4 1.8.7.2.1.4.2.6.3.4.2.8.4 1.2.6.4.24.8.5 1.1.8.4.3.8.7 1.1 1.1.5.5 1 1.1 1.5 1.8.1.1.2.2.3.4a12.8 12.8 0 011.6 2.3c.5.8 1 1.7 1.4 2.6.2.5.4.9.6 1.4zm-4.246 3.94c.3-.1.6-.2.9-.4-2.1-1-3.9-2.5-5.4-4.5-.4-.5-.8-1-1.1-1.5-.2-.2-.5-.5-.7-.7-.3-.3-.6-.6-.9-.8-.2-.2-.4-.3-.7-.5-.2-.1-.5-.2-.7-.3-.3-.1-.6-.2-.9-.3-.2-.1-.4-.1-.6-.1-.7 0-1.4.2-2 .6-.6.4-1 .9-1 1.5 0 .6.2 1.2.7 1.6.5.4 1.1.7 1.8.7.4 0 .7 0 1.1-.1.3-.1.6-.2.9-.3.3-.1.7-.3 1-.5.3-.1.6-.3.9-.5l.9-.5c.3-.2.6-.4.9-.6.3-.2.6-.5.9-.7.3-.3.6-.6.8-.9.2-.3.4-.6.6-.9.2-.3.3-.6.5-.9.1-.3.2-.6.3-.9.1-.3.2-.6.2-.9.1-.3.1-.6.1-.9v-.3z" />
    </svg>
);

export const TravelIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
);

export const FamilyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a4.5 4.5 0 011.88-2.186c.38-.198.668-.528.816-1.002a3 3 0 01-1.33-2.164 2.25 2.25 0 00-4.242 0 3 3 0 01-1.33 2.164c.148.474.436.804.817 1.002a4.5 4.5 0 011.88 2.186m-5.862 2.952a9.094 9.094 0 013.741-.479 3 3 0 01-4.682-2.72M12 12.75a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);

export const HobbiesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-4.243 4.243l-3.275-3.275a4.5 4.5 0 00-6.336 4.486c.046.58.026 1.193-.14 1.743m5.108-.233l5.242 2.257m-5.242-2.257l-5.242 2.257" />
    </svg>
);

export const WorkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.07a2.25 2.25 0 01-2.25 2.25H5.92a2.25 2.25 0 01-2.25-2.25v-4.07a2.25 2.25 0 01.91-1.79l3.055-2.29a.75.75 0 01.82 0l3.055 2.29a2.25 2.25 0 01.91 1.79z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5a9 9 0 0115 0" />
    </svg>
);