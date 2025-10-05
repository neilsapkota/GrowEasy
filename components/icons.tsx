import React from 'react';

export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
);

export const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A9.75 9.75 0 0110.5 18.75a8.25 8.25 0 01-1.413-1.625.75.75 0 00-1.063.163l-.703.882A.75.75 0 008.25 19.5a9 9 0 009-9 .75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25.75.75 0 00-.75-.75A3.75 3.75 0 0012 4.5c0-1.036.84-1.875 1.875-1.875h.375a.75.75 0 00.713-.889z" clipRule="evenodd" />
    </svg>
);

export const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const GreetingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <span className={className} style={{ fontSize: '1.5em' }}>👋</span>
);
export const FoodIcon: React.FC<{ className?: string }> = ({ className }) => (
    <span className={className} style={{ fontSize: '1.5em' }}>🍕</span>
);
export const TravelIcon: React.FC<{ className?: string }> = ({ className }) => (
    <span className={className} style={{ fontSize: '1.5em' }}>✈️</span>
);
export const FamilyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <span className={className} style={{ fontSize: '1.5em' }}>👨‍👩‍👧‍👦</span>
);
export const HobbiesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <span className={className} style={{ fontSize: '1.5em' }}>🎨</span>
);
export const WorkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <span className={className} style={{ fontSize: '1.5em' }}>💼</span>
);


export const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        <path d="M1 1h22v22H1z" fill="none"/>
    </svg>
);

export const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const VolumeUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

export const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
        <path d="M12 5.432l8.159 8.159c.026.026.05.054.07.084v6.101a2.25 2.25 0 01-2.25 2.25H6.94a2.25 2.25 0 01-2.25-2.25v-6.101c.02-.03.044-.058.07-.084L12 5.432z" />
    </svg>
);

export const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c-1.036 0-1.875.84-1.875 1.875v11.25c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V10.5c0-1.036-.84-1.875-1.875-1.875h-.75zM3 15.375c-1.036 0-1.875.84-1.875 1.875v4.5c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875v-4.5c0-1.036-.84-1.875-1.875-1.875H3z" />
    </svg>
);

export const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
);

export const BookOpenIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.5 2.25a2.25 2.25 0 00-2.25 2.25v15a2.25 2.25 0 002.25 2.25h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 01-.75-.75V4.5a.75.75 0 01.75-.75h7.5a.75.75 0 01.75.75v15a.75.75 0 01-.75-.75h-1.5a.75.75 0 000 1.5h1.5a2.25 2.25 0 002.25-2.25V4.5a2.25 2.25 0 00-2.25-2.25h-7.5z" />
        <path d="M12.75 6a.75.75 0 00-1.5 0v11.25a.75.75 0 001.5 0V6z" />
    </svg>
);

export const ChestIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15v-1.5H1.5V15c0 1.036.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
        <path d="M22.5 9.375c0-1.036-.84-1.875-1.875-1.875h-5.25V15h7.125c1.035 0 1.875-.84 1.875-1.875v-3.75z" />
    </svg>
);

export const PracticeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 6.75a5.25 5.25 0 00-5.25 5.25H3a.75.75 0 000 1.5h3.75A5.25 5.25 0 0012 18.75a5.25 5.25 0 005.25-5.25H21a.75.75 0 000-1.5h-3.75A5.25 5.25 0 0012 6.75z" />
        <path fillRule="evenodd" d="M6.113 9.342a.75.75 0 01.75.068l.25.125a.75.75 0 010 1.28l-.25.125a.75.75 0 01-.818-1.348zM12 2.25a.75.75 0 01.75.75v.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM12 20.25a.75.75 0 01.75.75v.25a.75.75 0 01-1.5 0v-.25a.75.75 0 01.75-.75zM17.887 9.342a.75.75 0 01.068.75l.125.25a.75.75 0 01-1.28 0l-.125-.25a.75.75 0 011.348-.818z" clipRule="evenodd" />
    </svg>
);

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6z" />
        <path d="M12 5.25a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" />
        <path fillRule="evenodd" d="M12 21a8.25 8.25 0 005.65-2.073.75.75 0 00-1.016-1.118A6.75 6.75 0 0112 19.5a6.75 6.75 0 01-4.634-1.69.75.75 0 10-1.016 1.118A8.25 8.25 0 0012 21z" clipRule="evenodd" />
    </svg>
);

export const HeadphonesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M1.5 12a10.5 10.5 0 1121 0 10.5 10.5 0 01-21 0zM12 2.25a9.75 9.75 0 00-9.75 9.75 9.75 9.75 0 009.75 9.75 9.75 9.75 0 009.75-9.75A9.75 9.75 0 0012 2.25z" clipRule="evenodd" />
        <path d="M8.25 12a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V12h-.75a.75.75 0 01-.75-.75zM12.75 12a.75.75 0 01.75-.75h.75v3.75a.75.75 0 01-1.5 0V12h.75a.75.75 0 010-1.5h-1.5a.75.75 0 01-.75-.75.75.75 0 01.75-.75h1.5a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25h-1.5a.75.75 0 010-1.5h.75v-3z" />
    </svg>
);

export const TargetIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0V6zM12 13.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" clipRule="evenodd" />
    </svg>
);

export const CardsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.5 3.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v17.25c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 20.625V3.375z" />
    </svg>
);

export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
    </svg>
);

export const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75v1.506c4.72 1.01 7.5 5.05 7.5 9.744 0 4.346-2.526 8.22-6.101 9.773a.75.75 0 01-.798 0c-3.575-1.553-6.101-5.427-6.101-9.773 0-4.694 2.78-8.734 7.5-9.744V2.25A.75.75 0 0112 1.5zm-.805 10.335a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.06 0l3-3a.75.75 0 00-1.06-1.06L11.25 13.44l-.515-.515z" clipRule="evenodd" />
    </svg>
);

export const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 2.25a.75.75 0 00-1.5 0v2.079a25.286 25.286 0 00-3.328 0V2.25a.75.75 0 00-1.5 0v2.079a25.286 25.286 0 00-3.328 0V2.25a.75.75 0 00-1.5 0v2.079c-2.433.504-4.333 2.193-4.333 4.171 0 1.954 1.769 3.61 4.12 4.133.456.091.92.16 1.388.204v2.518a.75.75 0 00.75.75h6a.75.75 0 00.75-.75v-2.518c.468-.044.932-.113 1.388-.204 2.351-.523 4.12-2.18 4.12-4.133 0-1.978-1.9-3.667-4.333-4.171V2.25zM12 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
        <path d="M4.5 15.75a.75.75 0 00.75.75h13.5a.75.75 0 00.75-.75V15c-2.433-.504-4.333-2.193-4.333-4.171 0-.312.042-.618.12-.916a25.343 25.343 0 00-9.874 0c.078.298.12.604.12.916 0 1.978-1.9 3.667-4.333 4.171v.75z" />
    </svg>
);

// FIX: Add title prop to ArrowUpIcon to allow tooltips.
export const ArrowUpIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
);

// FIX: Add title prop to ArrowDownIcon to allow tooltips.
export const ArrowDownIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);