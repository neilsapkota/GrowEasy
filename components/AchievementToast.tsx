import React, { useState, useEffect } from 'react';
import { Achievement, AchievementTier } from '../types';
import { TrophyIcon, CheckCircleIcon } from './icons';

interface AchievementToastProps {
    achievement: Achievement;
}

const tierColors: Record<AchievementTier, { text: string; bg: string; }> = {
    [AchievementTier.Bronze]: { text: 'text-amber-700 dark:text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/60' },
    [AchievementTier.Silver]: { text: 'text-slate-600 dark:text-slate-300', bg: 'bg-slate-200 dark:bg-slate-700/60' },
    [AchievementTier.Gold]: { text: 'text-amber-500 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-yellow-900/60' },
};


const AchievementToast: React.FC<AchievementToastProps> = ({ achievement }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // This triggers the transition on mount
        setShow(true);
    }, []);
    
    const colors = tierColors[achievement.tier];

    return (
        <div
            className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-black ring-opacity-5 backdrop-blur-sm transform transition-all duration-300 ease-out ${show ? 'translate-y-0 opacity-100 sm:translate-x-0' : 'translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'}`}
        >
            <div className={`p-4 ${colors.bg}`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                       <div className="p-2 bg-white/50 dark:bg-slate-900/50 rounded-full">
                         <TrophyIcon className={`h-8 w-8 ${colors.text}`} aria-hidden="true" />
                       </div>
                    </div>
                    <div className="ml-4 flex-1">
                        <p className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Achievement Unlocked!</p>
                        <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{achievement.title}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{achievement.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AchievementToast;