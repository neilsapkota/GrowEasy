import React from 'react';

const HeroIllustration: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#87CEEB" />
                    <stop offset="100%" stopColor="#E0F6FF" />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="5" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.1" />
                </filter>
            </defs>

            {/* Background Sky */}
            <rect width="500" height="500" rx="50" fill="url(#skyGradient)" />

            {/* Ground */}
            <path d="M 0 400 Q 150 350, 250 400 T 500 400 L 500 500 L 0 500 Z" fill="#90EE90" />
            <path d="M 0 420 Q 100 380, 250 420 T 500 410 L 500 500 L 0 500 Z" fill="#3CB371" opacity="0.6" />

            {/* Sun */}
            <circle cx="80" cy="80" r="40" fill="#FFD700" filter="url(#shadow)" />

            {/* Character */}
            <g transform="translate(250, 300)" filter="url(#shadow)">
                {/* Body */}
                <ellipse cx="0" cy="50" rx="50" ry="70" fill="#3498db" />
                {/* Eyes */}
                <circle cx="-15" cy="40" r="8" fill="white" />
                <circle cx="15" cy="40" r="8" fill="white" />
                <circle cx="-15" cy="40" r="4" fill="black" />
                <circle cx="15" cy="40" r="4" fill="black" />
                {/* Mouth */}
                <path d="M -15 65 Q 0 80, 15 65" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
            
            {/* Floating Icons */}
            <g filter="url(#shadow)">
                 {/* Speech Bubble "Hola" */}
                <g transform="translate(100, 180)">
                    <path d="M10,0 C4.477,0 0,4.477 0,10 L0,30 C0,35.523 4.477,40 10,40 L30,40 L40,50 L50,40 L70,40 C75.523,40 80,35.523 80,30 L80,10 C80,4.477 75.523,0 70,0 Z" fill="#FFFFFF"/>
                    <text x="40" y="25" fontFamily="Nunito, sans-serif" fontSize="18" fontWeight="bold" fill="#333" textAnchor="middle">Hola!</text>
                </g>

                {/* Speech Bubble "你好" */}
                <g transform="translate(350, 100) scale(0.9)">
                    <path d="M10,0 C4.477,0 0,4.477 0,10 L0,30 C0,35.523 4.477,40 10,40 L30,40 L40,50 L50,40 L70,40 C75.523,40 80,35.523 80,30 L80,10 C80,4.477 75.523,0 70,0 Z" fill="#FFFFFF" transform="scale(-1, 1) translate(-80, 0)"/>
                    <text x="40" y="25" fontFamily="Nunito, sans-serif" fontSize="20" fontWeight="bold" fill="#333" textAnchor="middle">你好</text>
                </g>

                {/* Flag Icon (Stylized) */}
                <g transform="translate(400, 350)">
                    <rect x="0" y="0" width="60" height="40" fill="#FFCE00" rx="5" />
                    <rect x="0" y="13.3" width="60" height="13.3" fill="#007A3D" />
                </g>
                
                {/* Globe Icon */}
                <g transform="translate(80, 400)">
                    <circle cx="0" cy="0" r="30" fill="#87CEFA" />
                    <path d="M -20 -10 C -10 0, 10 0, 20 -10" stroke="#3CB371" strokeWidth="4" fill="none" />
                    <path d="M -15 15 C 0 5, 0 25, 15 15" stroke="#3CB371" strokeWidth="4" fill="none" />
                </g>
            </g>
        </svg>
    );
};

export default HeroIllustration;
