import React from 'react';
import { UserProgress, Language, Achievement, AchievementTier } from '../types';
import { ACHIEVEMENTS } from '../constants';
import { TrophyIcon } from './icons';

interface AchievementsPageProps {
    userProgress: Record<string, UserProgress>;
    selectedLanguage: Language | null;
}

const tierColors: Record<AchievementTier, { text: string; bg: string; border: string; }> = {
    [AchievementTier.Bronze]: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/50', border: 'border-amber-300 dark:border-amber-700' },
    [AchievementTier.Silver]: { text: 'text-slate-600 dark:text-slate-300', bg: 'bg-slate-200 dark:bg-slate-800', border: 'border-slate-300 dark:border-slate-600' },
    [AchievementTier.Gold]: { text: 'text-yellow-500 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/50', border: 'border-yellow-300 dark:border-yellow-700' },
};

const AchievementCard: React.FC<{ achievement: Achievement, isUnlocked: boolean }> = ({ achievement, isUnlocked }) => {
    const colors = tierColors[achievement.tier];
    
    return (
        <div className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all duration-300 ${isUnlocked ? `${colors.bg} ${colors.border} shadow-md` : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60 grayscale'}`}>
            <TrophyIcon className={`w-12 h-12 flex-shrink-0 ${isUnlocked ? colors.text : 'text-slate-400 dark:text-slate-500'}`} />
            <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100">{achievement.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{achievement.description}</p>
            </div>
        </div>
    );
};

const AchievementsPage: React.FC<AchievementsPageProps> = ({ userProgress, selectedLanguage }) => {
    if (!selectedLanguage) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Achievements</h2>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                    <p className="text-lg text-slate-500 dark:text-slate-400">Please select a language from the dashboard to see your achievements.</p>
                </div>
            </div>
        );
    }
    
    const currentProgress = userProgress[selectedLanguage.id];
    const unlockedIds = new Set(currentProgress?.unlockedAchievements ?? []);

    const achievementsByTier = {
        [AchievementTier.Gold]: ACHIEVEMENTS.filter(a => a.tier === AchievementTier.Gold),
        [AchievementTier.Silver]: ACHIEVEMENTS.filter(a => a.tier === AchievementTier.Silver),
        [AchievementTier.Bronze]: ACHIEVEMENTS.filter(a => a.tier === AchievementTier.Bronze),
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Achievements</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
                You've unlocked {unlockedIds.size} of {ACHIEVEMENTS.length} achievements in {selectedLanguage.name}.
            </p>

            <div className="space-y-10">
                {Object.entries(achievementsByTier).map(([tier, achievements]) => (
                    <section key={tier}>
                        <h3 className={`text-2xl font-bold mb-4 ${tierColors[tier as AchievementTier].text}`}>{tier} Tier</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {achievements.map(ach => (
                                <AchievementCard key={ach.id} achievement={ach} isUnlocked={unlockedIds.has(ach.id)} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default AchievementsPage;