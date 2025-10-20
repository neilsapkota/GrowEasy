import React from 'react';

const Mascot: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="parrot-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <filter id="drop-shadow">
                    <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.2" />
                </filter>
            </defs>
            <g filter="url(#drop-shadow)">
                {/* Branch */}
                <path d="M 20 180 Q 100 150 180 180" stroke="#854d0e" strokeWidth="15" fill="none" strokeLinecap="round" />
                
                {/* Body */}
                <ellipse cx="100" cy="110" rx="45" ry="60" fill="url(#parrot-gradient)" />

                {/* Head */}
                <circle cx="100" cy="60" r="35" fill="#6366f1" />

                {/* Beak */}
                <path d="M 75 60 C 50 60, 60 85, 75 75 Z" fill="#facc15" />

                {/* Eye */}
                <circle cx="110" cy="55" r="10" fill="white" />
                <circle cx="112" cy="55" r="5" fill="black" />
                
                {/* Crest */}
                <path d="M 95 25 Q 100 10, 105 25" stroke="#f472b6" strokeWidth="6" fill="none" strokeLinecap="round" />
                <path d="M 100 25 Q 105 10, 110 25" stroke="#ec4899" strokeWidth="6" fill="none" strokeLinecap="round" />

                 {/* Wing */}
                <path d="M 110 100 A 40 40 0 0 1 140 140 L 120 130 Z" fill="#10b981" />

                 {/* Tail */}
                 <path d="M 80 165 L 60 195 L 70 190 Z" fill="#ef4444" />
                 <path d="M 90 168 L 80 198 L 90 195 Z" fill="#f97316" />
            </g>
        </svg>
    );
};

export default Mascot;