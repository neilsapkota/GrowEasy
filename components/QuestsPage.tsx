import React from 'react';
import { User, UserProgress, Language, Quest, QuestProgress } from '../types';
import { DAILY_QUESTS, MONTHLY_CHALLENGES } from '../constants';
import ProgressBar from './ProgressBar';
import { ChestIcon, ClockIcon, StarIcon, CheckCircleIcon, TrophyIcon } from './icons';

const QUESTS_MAP = new Map(DAILY_QUESTS.map(q => [q.id, q]));

const QuestCard: React.FC<{ questProgress: QuestProgress }> = ({ questProgress }) => {
    const questDef = QUESTS_MAP.get(questProgress.questId);
    if (!questDef) return null;

    const isCompleted = questProgress.completed;

    const iconMap: Record<Quest['type'], React.ElementType> = {
        'xp': StarIcon,
        'lesson': CheckCircleIcon,
        'practice': ClockIcon,
        'perfect_lesson': TrophyIcon,
    };
    const colorMap: Record<Quest['type'], string> = {
        'xp': 'text-amber-500',
        'lesson': 'text-green-500',
        'practice': 'text-sky-500',
        'perfect_lesson': 'text-violet-500',
    };
    
    const Icon = iconMap[questDef.type];
    const color = colorMap[questDef.type];

    return (
        <div className={`p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all ${isCompleted ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-4">
                <Icon className={`w-12 h-12 ${color}`} />
                <div className="flex-grow">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{questDef.title}</p>
                    <ProgressBar value={questProgress.current} max={questDef.target} label="" />
                </div>
                <div className="flex flex-col items-center">
                    <ChestIcon className={`w-10 h-10 ${isCompleted ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-amber-500">{questDef.reward} XP</span>
                </div>
            </div>
        </div>
    );
};

interface QuestsPageProps {
    user: User | null;
    userProgress: Record<string, UserProgress>;
    selectedLanguage: Language | null;
}

const QuestsPage: React.FC<QuestsPageProps> = ({ user, userProgress, selectedLanguage }) => {
    
    const currentProgress = selectedLanguage ? userProgress[selectedLanguage.id] : null;
    const quests = currentProgress?.quests?.activeQuests ?? [];
    const completedQuestsCount = quests.filter(q => q.completed).length;

    const currentMonthId = new Date().toISOString().slice(0, 7); // e.g., "2024-07"
    const currentMonthlyChallenge = MONTHLY_CHALLENGES.find(c => c.id === currentMonthId);
    
    const totalQuestsCompletedThisMonth = Object.values(userProgress)
        .reduce((total, p) => total + (p.quests?.completedTodayCount || 0), 0);
    
    const hasCompletedCurrentMonthChallenge = (currentProgress?.completedMonthlyChallenges ?? []).includes(currentMonthId);

    if (!user) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Quests</h2>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                    <p className="text-lg">Please log in to see your quests and earn rewards!</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">Quests</h2>

            {/* Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white mb-10 shadow-lg">
                <h3 className="text-2xl font-extrabold">Earn rewards with quests!</h3>
                <p className="text-white/80 mt-1">You've completed {completedQuestsCount} of {quests.length} quests today.</p>
            </div>

            {/* Daily Quests */}
            <div className="mb-12">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Daily Quests</h3>
                <div className="space-y-4">
                    {quests.length > 0 ? (
                        quests.map(q => <QuestCard key={q.questId} questProgress={q} />)
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400">Your daily quests will appear here. Complete a lesson to get started!</p>
                    )}
                </div>
            </div>

            {/* Monthly Badges */}
            <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Monthly Badges</h3>
                {currentMonthlyChallenge && (
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">{currentMonthlyChallenge.icon}</span>
                            <div className="flex-grow">
                                <h4 className="font-bold text-lg">{currentMonthlyChallenge.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{currentMonthlyChallenge.description}</p>
                            </div>
                            {hasCompletedCurrentMonthChallenge && <CheckCircleIcon className="w-10 h-10 text-green-500" />}
                        </div>
                        {!hasCompletedCurrentMonthChallenge && (
                            <div className="mt-4">
                                <ProgressBar value={totalQuestsCompletedThisMonth} max={currentMonthlyChallenge.target} label={`${totalQuestsCompletedThisMonth} / ${currentMonthlyChallenge.target}`} />
                            </div>
                        )}
                    </div>
                )}
                
                {/* Past Badges can be added here */}
                
            </div>
        </div>
    );
};

export default QuestsPage;