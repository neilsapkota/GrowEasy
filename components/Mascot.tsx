import React from 'react';

const Mascot: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter id="mascot-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.2" />
                </filter>
            </defs>
            <g filter="url(#mascot-shadow)" transform="translate(0, -5)">
                {/* Pot */}
                <path d="M 25,80 L 30,95 L 70,95 L 75,80 Z" fill="#d2a679" />
                <path d="M 22,75 L 78,75 L 75,80 L 25,80 Z" fill="#b98c5d" />

                {/* Stem */}
                <path d="M 50,75 C 55,60 45,40 50,25" stroke="#6a994e" strokeWidth="8" fill="none" strokeLinecap="round" />

                {/* Leaf Head */}
                <path d="M 50,25 C 20,25 30,5 50,5 C 70,5 80,25 50,25" fill="#a7c957" />
                <path d="M 50,25 C 50,15 55,10 50,5" stroke="#6a994e" strokeWidth="2" fill="none" strokeLinecap="round" />

                {/* Eyes */}
                <circle cx="42" cy="18" r="5" fill="black" />
                <circle cx="58" cy="18" r="5" fill="black" />
                 {/* Eye highlights */}
                <circle cx="44" cy="17" r="1.5" fill="white" />
                <circle cx="60" cy="17" r="1.5" fill="white" />
            </g>
        </svg>
    );
};

export default Mascot;