
import React, { useState } from 'react';
import { User, UserProgress, Language, Achievement, AchievementTier } from '../types';
import { ACHIEVEMENTS, LEARNING_PATH } from '../constants';
import { TrophyIcon, WritingIcon } from './icons';
import EditProfileModal from './EditProfileModal';

const ProgressChart: React.FC<{ label: string; value: number; max: number; color: string; }> = ({ label, value, max, color }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{label}</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{value} / {max}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div
                    className={`${color} h-2.5 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

interface ProfilePageProps {
    user: User | null;
    userProgress: Record<string, UserProgress>;
    languages: Language[];
    onUpdateUser: (updatedUser: Partial<User>) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, userProgress, languages, onUpdateUser }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (!user) {
        return (
             <div className="p-4 sm:p-6 lg:p-8 animate-fade-in text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Profile</h2>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                    <p className="text-lg">Please create an account to view your profile and track your progress.</p>
                </div>
            </div>
        )
    }
    
    const tierColors: Record<AchievementTier, string> = {
        [AchievementTier.Bronze]: 'text-amber-600 dark:text-amber-500',
        [AchievementTier.Silver]: 'text-slate-500 dark:text-slate-400',
        [AchievementTier.Gold]: 'text-yellow-500 dark:text-yellow-400',
    };
    
    const languagesWithProgress = Object.entries(userProgress)
        .map(([langId, progress]: [string, UserProgress]) => {
            const langInfo = languages.find(l => l.id === langId);
            if (langInfo && (progress.xp > 0 || progress.completedTopics.length > 0)) {
                return { ...langInfo, ...progress };
            }
            return null;
        })
        .filter(Boolean) as (Language & UserProgress)[];
        
    const getLatestAchievements = (progress: UserProgress) => {
        const unlockedIds = progress.unlockedAchievements ?? [];
        return unlockedIds
            .slice(-4)
            .map(id => ACHIEVEMENTS.find(a => a.id === id))
            .filter(Boolean) as Achievement[];
    };
    
    const totalLessons = LEARNING_PATH.sections.flatMap(s => s.units.flatMap(u => u.lessons)).length;
    const totalVocabulary = 500; // Estimated total vocab in the course

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8 text-center relative">
                <button 
                    onClick={() => setIsEditModalOpen(true)} 
                    className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    aria-label="Edit profile"
                >
                    <WritingIcon className="w-5 h-5" />
                </button>
                <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-teal-500 object-cover" />
                <h3 className="text-2xl font-bold">{user.name}</h3>
                {user.bio && <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto">{user.bio}</p>}
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Your Language Progress</h3>
             {languagesWithProgress.length > 0 ? (
                <div className="space-y-8">
                    {languagesWithProgress.map(langProgress => (
                        <div key={langProgress.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                            <div className="flex items-center mb-6">
                                <span className="text-4xl mr-4">{langProgress.flag}</span>
                                <h4 className="text-xl font-bold">{langProgress.name}</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                               <div className="flex justify-around text-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 pb-6 md:pb-0 md:pr-8">
                                    <div>
                                        <p className="text-3xl font-bold text-amber-500">{langProgress.xp}</p>
                                        <p className="text-sm text-slate-500">Total XP</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-orange-500">{langProgress.streak}</p>
                                        <p className="text-sm text-slate-500">Day Streak</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-teal-500">{langProgress.perfectLessons ?? 0}</p>
                                        <p className="text-sm text-slate-500">Perfect Lessons</p>
                                    </div>
                                </div>
                                <div className="pt-6 md:pt-0 md:pl-8">
                                    <h5 className="font-bold text-center md:text-left mb-4">Progress Snapshot</h5>
                                    <div className="space-y-4">
                                        <ProgressChart label="Lessons Completed" value={langProgress.completedTopics.length} max={totalLessons} color="bg-green-500" />
                                        <ProgressChart label="Vocabulary Learned" value={langProgress.learnedVocabulary.length} max={totalVocabulary} color="bg-sky-500" />
                                        <ProgressChart label="Skills Practiced" value={langProgress.practiceSessions} max={50} color="bg-violet-500" />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-slate-200 dark:border-slate-700 md:col-span-2">
                                    <h5 className="font-bold text-center mb-2">Recent Achievements</h5>
                                    <div className="flex justify-center items-center gap-3 h-8">
                                        {getLatestAchievements(langProgress).length > 0 ? getLatestAchievements(langProgress).map(ach => (
                                            <TrophyIcon key={ach.id} className={`w-7 h-7 ${tierColors[ach.tier]}`} title={`${ach.title} (${ach.tier})`} />
                                        )) : <p className="text-sm text-slate-400">No achievements yet.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
                    <p className="text-lg text-slate-500 dark:text-slate-400">Start a lesson to see your progress here!</p>
                </div>
            )}

            {isEditModalOpen && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    user={user}
                    onUpdateUser={onUpdateUser}
                />
            )}
        </div>
    );
};

export default ProfilePage;
