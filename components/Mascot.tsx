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
                 <linearGradient id="robot-body" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
            </defs>
            <g filter="url(#mascot-shadow)" transform="translate(0, -5)">
                {/* Antenna */}
                <line x1="50" y1="15" x2="50" y2="5" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="50" cy="5" r="3" fill="#38bdf8" />
                
                {/* Head */}
                <rect x="30" y="15" width="40" height="35" rx="8" fill="url(#robot-body)" />
                
                {/* Face Plate */}
                <rect x="35" y="20" width="30" height="25" rx="4" fill="#1e293b" />
                
                 {/* Eyes */}
                <circle cx="43" cy="33" r="4" fill="#38bdf8" />
                <circle cx="57" cy="33" r="4" fill="#38bdf8" />

                {/* Body */}
                <rect x="20" y="50" width="60" height="40" rx="10" fill="url(#robot-body)" />
                
                {/* Center Circle on Body */}
                 <circle cx="50" cy="70" r="10" fill="#1e293b"/>
                 <circle cx="50" cy="70" r="6" fill="#38bdf8" className="animate-pulse" />

            </g>
        </svg>
    );
};

export default Mascot;