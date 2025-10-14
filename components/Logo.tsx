import React from 'react';
import NovaLingo from './NovaLingo';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#38bdf8"/>
                        <stop offset="1" stopColor="#6366f1"/>
                    </linearGradient>
                </defs>
                <path d="M40 4H8C5.79086 4 4 5.79086 4 8V32C4 34.2091 5.79086 36 8 36H16L24 44L32 36H40C42.2091 36 44 34.2091 44 32V8C44 5.79086 42.2091 4 40 4Z" fill="url(#logo-gradient)"/>
                <path d="M18 14C18 14 22 14 26 14C30 14 30 18 30 18C30 18 30 22 26 22C22 22 18 22 18 22M18 14V30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <NovaLingo />
        </div>
    );
};

export default Logo;