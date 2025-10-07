

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import HomePage from './components/HomePage';
import LanguageSelectionPage from './components/LanguageSelectionPage';
import DashboardPage from './components/DashboardPage';
import LessonPage from './components/LessonPage';
import PracticeHubPage from './components/PracticeHubPage';
import PracticeSessionPage from './components/PracticeSessionPage';
import DictionaryPage from './components/DictionaryPage';
import QuestsPage from './components/QuestsPage';
import SettingsPage from './components/SettingsPage';
import HelpPage from './components/HelpPage';
import AuthModal from './components/AuthModal';
import ProgressBar from './components/ProgressBar';
import AchievementToast from './components/AchievementToast';
import PlacementTestPage from './components/PlacementTestPage';
import { Page, User, Language, LessonTopic, UserProgress, MistakeItem, VocabularyItem, PracticeMode, QuestProgress, Quest, LeagueTier, Achievement, AchievementTier, RegisteredUser, AppSettings, Theme } from './types';
import { LANGUAGES, DAILY_QUESTS, ACHIEVEMENTS, MONTHLY_CHALLENGES } from './constants';
import { HomeIcon, UserCircleIcon, ChartBarIcon, LogoutIcon, StarIcon, FireIcon, PracticeIcon, ChestIcon, ClockIcon, BookOpenIcon, CheckCircleIcon, ShieldCheckIcon, ArrowUpIcon, ArrowDownIcon, TrophyIcon, QuestsIcon, SettingsIcon, HelpIcon } from './components/icons';

const QUESTS_MAP = new Map(DAILY_QUESTS.map(q => [q.id, q]));
const ACHIEVEMENTS_MAP = new Map(ACHIEVEMENTS.map(a => [a.id, a]));

const DUMMY_REGISTERED_USERS: RegisteredUser[] = [
    // Gold League
    { user: { name: 'Alice', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Alice' }, progress: { 'es': { xp: 2540, streak: 12, completedTopics: ['greetings', 'family', 'food'], mistakes: [], learnedVocabulary: [{word: 'Hola', translation: 'Hello', pronunciation: 'o-la', nextReview: '2024-01-01T00:00:00.000Z', interval: 1}], league: LeagueTier.Gold, unlockedAchievements: [], practiceSessions: 0 }, 'fr': { xp: 1200, streak: 3, completedTopics: ['greetings'], mistakes: [], learnedVocabulary: [], league: LeagueTier.Bronze, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Fiona', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Fiona' }, progress: { 'es': { xp: 2450, streak: 11, completedTopics: ['greetings', 'family', 'food'], mistakes: [], learnedVocabulary: [], league: LeagueTier.Gold, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Bob', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Bob' }, progress: { 'es': { xp: 2310, streak: 10, completedTopics: ['greetings', 'family'], mistakes: [], learnedVocabulary: [], league: LeagueTier.Gold, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'George', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=George' }, progress: { 'es': { xp: 2200, streak: 9, completedTopics: ['greetings', 'family'], mistakes: [], learnedVocabulary: [], league: LeagueTier.Gold, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Charlie', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Charlie' }, progress: { 'es': { xp: 2100, streak: 8, completedTopics: ['greetings', 'family'], mistakes: [], learnedVocabulary: [], league: LeagueTier.Gold, unlockedAchievements: [], practiceSessions: 0 }, 'de': { xp: 3000, streak: 20, completedTopics: ['greetings', 'family', 'food', 'travel'], mistakes: [], learnedVocabulary: [], league: LeagueTier.Gold, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Diana', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Diana' }, progress: { 'es': { xp: 1980, streak: 7, completedTopics: ['greetings'], mistakes: [], learnedVocabulary: [], league: LeagueTier.Gold, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Hannah', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Hannah' }, progress: { 'es': { xp: 1820, streak: 6, completedTopics: ['greetings'], mistakes: [], learnedVocabulary: [], league: LeagueTier.Gold, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Ethan', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Ethan' }, progress: { 'es': { xp: 1750, streak: 5, completedTopics: ['greetings'], mistakes: [], learnedVocabulary: [], league: LeagueTier.Gold, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Ian', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Ian' }, progress: { 'es': { xp: 1600, streak: 4, completedTopics: ['greetings'], mistakes: [], learnedVocabulary: [], league: LeagueTier.Gold, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Jane', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Jane' }, progress: { 'es': { xp: 1450, streak: 3, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Gold, unlockedAchievements: [], practiceSessions: 0 } } },

    // Silver League
    { user: { name: 'Kyle', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Kyle' }, progress: { 'es': { xp: 1200, streak: 15, completedTopics: ['greetings'], mistakes: [], learnedVocabulary: [], league: LeagueTier.Silver, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Liam', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Liam' }, progress: { 'es': { xp: 1150, streak: 14, completedTopics: ['greetings'], mistakes: [], learnedVocabulary: [], league: LeagueTier.Silver, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Mona', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Mona' }, progress: { 'es': { xp: 1100, streak: 13, completedTopics: ['greetings'], mistakes: [], learnedVocabulary: [], league: LeagueTier.Silver, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Nora', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Nora' }, progress: { 'es': { xp: 1050, streak: 12, completedTopics: ['greetings'], mistakes: [], learnedVocabulary: [], league: LeagueTier.Silver, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Oscar', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Oscar' }, progress: { 'es': { xp: 1000, streak: 11, completedTopics: ['greetings'], mistakes: [], learnedVocabulary: [], league: LeagueTier.Silver, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Pria', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Pria' }, progress: { 'es': { xp: 950, streak: 10, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Silver, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Quinn', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Quinn' }, progress: { 'es': { xp: 900, streak: 9, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Silver, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Riley', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Riley' }, progress: { 'es': { xp: 850, streak: 8, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Silver, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Sam', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Sam' }, progress: { 'es': { xp: 800, streak: 7, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Silver, unlockedAchievements: [], practiceSessions: 0 } } },
    { user: { name: 'Tina', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Tina' }, progress: { 'es': { xp: 750, streak: 6, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Silver, unlockedAchievements: [], practiceSessions: 0 } } },
];

const Sidebar: React.FC<{
    user: User | null;
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onChangeLanguage: () => void;
    onLogout: () => void;
}> = ({ user, currentPage, onNavigate, onChangeLanguage, onLogout }) => {
    
    const mainNavItems = [
        { page: Page.Dashboard, icon: HomeIcon, label: 'LEARN', color: 'text-rose-500' },
        { page: Page.PracticeHub, icon: PracticeIcon, label: 'PRACTICE', color: 'text-sky-500' },
        { page: Page.Dictionary, icon: BookOpenIcon, label: 'DICTIONARY', color: 'text-orange-500' },
        { page: Page.Quests, icon: QuestsIcon, label: 'QUESTS', color: 'text-amber-500' },
        { page: Page.Leaderboard, icon: ChartBarIcon, label: 'LEADERBOARD', color: 'text-violet-500' },
    ];

    const bottomNavItems = [
        { page: Page.Profile, icon: UserCircleIcon, label: 'PROFILE', color: 'text-green-500' },
        { page: Page.Settings, icon: SettingsIcon, label: 'SETTINGS', color: 'text-slate-400' },
        { page: Page.Help, icon: HelpIcon, label: 'HELP', color: 'text-indigo-400' },
    ];

    const NavButton: React.FC<{item: {page: Page; icon: React.ElementType; label: string; color: string;}; isActive: boolean;}> = ({ item, isActive }) => (
        <button
            onClick={() => onNavigate(item.page)}
            className={`w-full flex items-center space-x-4 py-3 px-4 rounded-lg transition-all duration-200 text-md font-extrabold uppercase ${
                isActive 
                ? 'bg-sky-500/20 text-sky-400 border-2 border-sky-500' 
                : 'text-slate-400 hover:bg-slate-800'
            }`}
        >
            <item.icon className={`w-8 h-8 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
            <span>{item.label}</span>
        </button>
    );

    return (
        <aside className="w-64 bg-[#141a24] flex-shrink-0 p-4 hidden lg:flex flex-col">
            <h1 className="text-3xl font-extrabold text-emerald-400 mb-10 px-2 pt-2">
                GrowEasy
            </h1>
            <nav className="flex-grow">
                <ul className="space-y-2">
                    {mainNavItems.map(item => (
                        <li key={item.label}>
                           <NavButton item={item} isActive={currentPage === item.page} />
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="space-y-2">
                <ul className="space-y-2 pt-4 border-t border-slate-700">
                    {bottomNavItems.map(item => (
                         <li key={item.label}>
                           <NavButton item={item} isActive={currentPage === item.page} />
                        </li>
                    ))}
                </ul>
                <button 
                    onClick={onChangeLanguage} 
                    className="w-full text-left flex items-center space-x-4 py-3 px-4 rounded-lg transition-colors text-md font-extrabold uppercase text-slate-400 hover:bg-slate-800"
                >
                    <span className="text-2xl">🌐</span>
                    <span>Language</span>
                </button>
                 {user && (
                    <div className="flex items-center space-x-3 p-2 rounded-xl mt-4 border-t border-slate-700 pt-4">
                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                        <span className="font-bold flex-grow truncate text-slate-200">{user.name}</span>
                        <button onClick={onLogout} title="Log Out" className="p-2 rounded-md text-slate-400 hover:bg-slate-700">
                            <LogoutIcon className="w-6 h-6" />
                        </button>
                    </div>
                 )}
            </div>
        </aside>
    );
};

const DailyQuestsCard: React.FC<{ quests: QuestProgress[] | undefined, onNavigate: (page: Page) => void }> = ({ quests, onNavigate }) => {
    if (!quests || quests.length === 0) {
        return null;
    }
    return (
        <div className="bg-[#2e3a4e] border border-slate-700 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Daily Quests</h3>
                <button onClick={() => onNavigate(Page.Quests)} className="text-sm font-bold text-sky-400 hover:underline">VIEW ALL</button>
            </div>
            <ul className="space-y-4">
                {quests.map(q => {
                    const questDef = QUESTS_MAP.get(q.questId);
                    if (!questDef) return null;
                    const percentage = (q.current / questDef.target) * 100;
                    return (
                        <li key={q.questId}>
                            <p className="font-semibold text-sm mb-1">{questDef.title}</p>
                            <div className="flex items-center gap-3">
                                <div className="w-full bg-slate-600 rounded-full h-2.5">
                                    <div className="bg-amber-400 h-2.5 rounded-full" style={{width: `${percentage}%`}}></div>
                                </div>
                                <ChestIcon className="w-8 h-8 text-amber-400" />
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

const RightSidebar: React.FC<{
    progress: UserProgress | null;
    onNavigate: (page: Page) => void;
}> = ({ progress, onNavigate }) => {
    return (
        <aside className="w-96 flex-shrink-0 p-6 hidden xl:block">
            <div className="space-y-6 sticky top-6">
                <div className="bg-[#2e3a4e] border border-slate-700 rounded-2xl p-4 flex justify-around">
                    <div className="flex items-center space-x-2 text-amber-400">
                        <StarIcon className="w-6 h-6" />
                        <span className="text-lg font-bold">{progress?.xp ?? 0}</span>
                    </div>
                     <div className="flex items-center space-x-2 text-orange-400">
                        <FireIcon className="w-6 h-6" />
                        <span className="text-lg font-bold">{progress?.streak ?? 0}</span>
                    </div>
                </div>
                <DailyQuestsCard quests={progress?.quests?.activeQuests} onNavigate={onNavigate} />
            </div>
        </aside>
    );
};

const tierColors: Record<AchievementTier, { text: string; bg: string; shadow: string }> = {
    [AchievementTier.Bronze]: { text: 'text-amber-700 dark:text-amber-500', bg: 'bg-amber-200 dark:bg-amber-900/50', shadow: 'shadow-amber-500/30' },
    [AchievementTier.Silver]: { text: 'text-slate-600 dark:text-slate-300', bg: 'bg-slate-200 dark:bg-slate-700', shadow: 'shadow-slate-500/30' },
    [AchievementTier.Gold]: { text: 'text-amber-500 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-yellow-900/50', shadow: 'shadow-yellow-500/30' },
};

const AchievementsDisplay: React.FC<{
    userProgress: Record<string, UserProgress>;
}> = ({ userProgress }) => {
    const unlockedAchievements = useMemo(() => {
        const allUnlocked = new Set<string>();
        Object.values(userProgress).forEach((progress: UserProgress) => {
            progress.unlockedAchievements?.forEach(id => allUnlocked.add(id));
        });
        return allUnlocked;
    }, [userProgress]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {ACHIEVEMENTS.map(ach => {
                const isUnlocked = unlockedAchievements.has(ach.id);
                const colors = tierColors[ach.tier];

                return (
                    <div key={ach.id} className={`p-5 rounded-2xl transition-all duration-300 ${isUnlocked ? `${colors.bg} ${colors.shadow} shadow-lg` : 'bg-slate-100 dark:bg-slate-800/50'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${isUnlocked ? colors.bg : 'bg-slate-200 dark:bg-slate-700'}`}>
                                <TrophyIcon className={`w-8 h-8 transition-colors ${isUnlocked ? colors.text : 'text-slate-400 dark:text-slate-500'}`} />
                            </div>
                            <div className="flex-grow">
                                <h4 className={`font-bold text-lg ${isUnlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>{ach.title}</h4>
                                <p className={`text-sm ${isUnlocked ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>{ach.description}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const ProfilePage: React.FC<{
    user: User | null;
    userProgress: Record<string, UserProgress>;
    languages: Language[];
}> = ({ user, userProgress, languages }) => {
    const [activeTab, setActiveTab] = useState('progress');
    
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
    
    const languagesWithProgress = Object.entries(userProgress)
        .map(([langId, progress]: [string, UserProgress]) => {
            const langInfo = languages.find(l => l.id === langId);
            if (langInfo && (progress.xp > 0 || progress.completedTopics.length > 0)) {
                return { ...langInfo, ...progress };
            }
            return null;
        })
        .filter(Boolean) as (Language & UserProgress)[];

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Profile</h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8 text-center">
                <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-teal-500" />
                <h3 className="text-2xl font-bold">{user.name}</h3>
            </div>
            
             <div className="mb-8">
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('progress')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'progress' ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                        >
                            Progress
                        </button>
                        <button
                            onClick={() => setActiveTab('achievements')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'achievements' ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                        >
                            Achievements
                        </button>
                    </nav>
                </div>
            </div>

            {activeTab === 'progress' && (
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Your Language Progress</h3>
                    {languagesWithProgress.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {languagesWithProgress.map(langProgress => (
                                <div key={langProgress.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                                    <div className="flex items-center mb-4">
                                        <span className="text-4xl mr-4">{langProgress.flag}</span>
                                        <h4 className="text-xl font-bold">{langProgress.name}</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                                                <StarIcon className="w-6 h-6 text-amber-500" />
                                                <span>Total XP</span>
                                            </div>
                                            <span className="font-bold text-amber-500">{langProgress.xp}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                                                <FireIcon className="w-6 h-6 text-orange-500" />
                                                <span>Day Streak</span>
                                            </div>
                                            <span className="font-bold text-orange-500">{langProgress.streak}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                                                <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                                <span>Lessons Done</span>
                                            </div>
                                            <span className="font-bold text-green-500">{langProgress.completedTopics.length}</span>
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
                </div>
            )}
             {activeTab === 'achievements' && <AchievementsDisplay userProgress={userProgress} />}
        </div>
    );
};

const LEAGUE_PROMOTION_COUNT = 3;
const LEAGUE_DEMOTION_COUNT = 3;

const LeagueTierInfo: Record<LeagueTier, { color: string; icon: string; bg: string }> = {
    [LeagueTier.Diamond]: { color: 'text-cyan-400', icon: '💎', bg: 'bg-cyan-500' },
    [LeagueTier.Gold]: { color: 'text-amber-400', icon: '🥇', bg: 'bg-amber-500' },
    [LeagueTier.Silver]: { color: 'text-slate-400', icon: '🥈', bg: 'bg-slate-500' },
    [LeagueTier.Bronze]: { color: 'text-amber-600', icon: '🥉', bg: 'bg-yellow-600' },
};

const LeaderboardPage: React.FC<{
    user: User | null;
    registeredUsers: RegisteredUser[];
    selectedLanguage: Language | null;
}> = ({ user, registeredUsers, selectedLanguage }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const endOfWeek = new Date(now);
            endOfWeek.setDate(now.getDate() + (7 - now.getDay()) % 7);
            endOfWeek.setHours(23, 59, 59, 999);
            
            const diff = endOfWeek.getTime() - now.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        }, 1000 * 60);
        
        // Initial call
        const now = new Date();
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + (7 - now.getDay()) % 7);
        endOfWeek.setHours(23, 59, 59, 999);
        const diff = endOfWeek.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);

        return () => clearInterval(timer);
    }, []);

    const { currentLeague, leagueData } = useMemo(() => {
        if (!selectedLanguage) return { currentLeague: null, leagueData: [] };

        const langId = selectedLanguage.id;
        let currentUserLeague = LeagueTier.Bronze; 

        if (user) {
            const currentUserRegistered = registeredUsers.find(ru => ru.user.name === user.name);
            currentUserLeague = currentUserRegistered?.progress[langId]?.league ?? LeagueTier.Bronze;
        }

        const data = registeredUsers
            .filter(ru => (ru.progress[langId]?.league ?? LeagueTier.Bronze) === currentUserLeague)
            .map(ru => ({
                name: ru.user.name,
                avatarUrl: ru.user.avatarUrl,
                xp: ru.progress[langId]?.xp ?? 0
            }))
            .sort((a, b) => b.xp - a.xp);
        
        return { currentLeague: currentUserLeague, leagueData: data };
    }, [registeredUsers, selectedLanguage, user]);
    
    const renderZone = (index: number) => {
        if (index < LEAGUE_PROMOTION_COUNT) return 'promotion';
        if (index >= leagueData.length - LEAGUE_DEMOTION_COUNT) return 'demotion';
        return 'safe';
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Leaderboard</h2>
            {selectedLanguage && <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">Your weekly progress in {selectedLanguage.name}</p>}

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
                {currentLeague && (
                     <div className={`p-6 rounded-t-2xl ${LeagueTierInfo[currentLeague].bg} text-white`}>
                        <div className="flex justify-between items-center">
                             <div className="flex items-center gap-4">
                                <span className="text-5xl">{LeagueTierInfo[currentLeague].icon}</span>
                                <div>
                                    <h3 className="text-3xl font-extrabold">{currentLeague} League</h3>
                                    <p className="text-white/80">Top {LEAGUE_PROMOTION_COUNT} advance to the next league!</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg">{timeLeft}</p>
                                <p className="text-sm text-white/80">left</p>
                            </div>
                         </div>
                    </div>
                )}
                
                <div className="p-2 sm:p-4">
                    {leagueData.length > 0 ? (
                        <ul>
                            {leagueData.map((player, index) => {
                                const zone = renderZone(index);
                                let zoneStyle = '';
                                if (zone === 'promotion' && index === LEAGUE_PROMOTION_COUNT - 1) zoneStyle += ' border-b-2 border-dashed border-green-400 dark:border-green-600 pb-4 mb-4';
                                if (zone === 'safe' && index === leagueData.length - LEAGUE_DEMOTION_COUNT - 1) zoneStyle += ' border-b-2 border-dashed border-red-400 dark:border-red-600 pb-4 mb-4';

                                return (
                                <li key={player.name} className={`flex items-center p-3 rounded-lg transition-all ${user && player.name === user.name ? 'bg-teal-100 dark:bg-teal-900/50 ring-2 ring-teal-500' : ''} ${zoneStyle}`}>
                                    <span className={`w-8 h-8 text-sm flex items-center justify-center font-bold rounded-full mr-3
                                        ${zone === 'promotion' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300' 
                                        : zone === 'demotion' ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300' 
                                        : 'bg-slate-200 dark:bg-slate-600'}`
                                    }>
                                        {index + 1}
                                    </span>
                                    <img src={player.avatarUrl} alt={player.name} className="w-12 h-12 rounded-full mr-4" />
                                    <span className="font-bold text-lg flex-grow">{player.name}</span>
                                    <div className="flex items-center gap-4">
                                      <span className="font-extrabold text-teal-500 text-xl hidden sm:inline">{player.xp} XP</span>
                                       {zone === 'promotion' && <ArrowUpIcon className="w-6 h-6 text-green-500" title="Promotion Zone" />}
                                       {zone === 'demotion' && <ArrowDownIcon className="w-6 h-6 text-red-500" title="Demotion Zone" />}
                                    </div>
                                </li>
                            )})}
                        </ul>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-500 dark:text-slate-400">No one is in this league for this language yet. Be the first!</p>
                        </div>
                    )}
                    {!user && (
                        <div className="text-center mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <p>Create an account to join the competition!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
    const [page, setPage] = useState<Page>(Page.Home);
    const [user, setUser] = useState<User | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<LessonTopic | null>(null);
    const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
    const [practiceMode, setPracticeMode] = useState<PracticeMode | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [toasts, setToasts] = useState<{ id: number; achievement: Achievement }[]>([]);
    const [appSettings, setAppSettings] = useState<AppSettings>(() => {
        try {
            const savedSettings = localStorage.getItem('growEasySettings');
            return savedSettings ? JSON.parse(savedSettings) : { theme: 'system', soundEffectsEnabled: true };
        } catch {
            return { theme: 'system', soundEffectsEnabled: true };
        }
    });

    
    const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
        try {
            const savedUsers = localStorage.getItem('growEasyUsers');
            if (savedUsers) {
                return JSON.parse(savedUsers);
            }
        } catch (error) {
            console.error("Failed to parse registered users from localStorage", error);
        }
        return DUMMY_REGISTERED_USERS;
    });

    // Theme handler
    useEffect(() => {
        const applyTheme = (theme: Theme) => {
            const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        applyTheme(appSettings.theme);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => appSettings.theme === 'system' && applyTheme('system');
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [appSettings.theme]);

    // Toast notification handler
    const addToast = (achievement: Achievement) => {
        const id = Date.now();
        setToasts(prev => [...prev.filter(t => t.achievement.id !== achievement.id), { id, achievement }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000); // Remove toast after 5 seconds
    };
    
    // Achievement checking logic
    const checkAndUnlockAchievements = useCallback((currentProgress: Record<string, UserProgress>) => {
        if (!user) return;

        let changed = false;
        const newProgress = { ...currentProgress };

        Object.keys(newProgress).forEach(langId => {
            const langProgress = newProgress[langId];
            const alreadyUnlocked = new Set(langProgress.unlockedAchievements ?? []);
            
            ACHIEVEMENTS.forEach(ach => {
                if (!alreadyUnlocked.has(ach.id)) {
                    if (ach.check(langProgress, newProgress)) {
                        if (!langProgress.unlockedAchievements) {
                            langProgress.unlockedAchievements = [];
                        }
                        langProgress.unlockedAchievements.push(ach.id);
                        addToast(ach);
                        changed = true;
                    }
                }
            });
        });
        
        if(changed) {
            setUserProgress(newProgress);
        }

    }, [user]);

    // Monthly Challenge logic
    const checkAndUnlockMonthlyChallenges = useCallback(() => {
        if (!user || !selectedLanguage) return;

        const currentMonthId = new Date().toISOString().slice(0, 7); // e.g., "2024-07"
        const challenge = MONTHLY_CHALLENGES.find(c => c.id === currentMonthId);
        if (!challenge) return;

        setUserProgress(prev => {
            const langProgress = prev[selectedLanguage.id];
            // FIX: Add optional chaining to prevent crash if langProgress is undefined.
            const alreadyCompleted = langProgress?.completedMonthlyChallenges?.includes(currentMonthId);

            if (!langProgress || alreadyCompleted) {
                return prev;
            }
            // FIX: Explicitly type the accumulator `total` as a number to prevent type inference issues.
            const totalQuestsCompleted = Object.values(prev)
                .reduce((total: number, p: UserProgress) => total + (p.quests?.completedTodayCount || 0), 0);

            // FIX: Resolve TS error by ensuring totalQuestsCompleted is treated as a number
            // before comparison. In some TS environments, its type might be inferred as 'unknown'.
            if (typeof totalQuestsCompleted === 'number' && totalQuestsCompleted >= challenge.target) {
                const newProgress = { ...prev };
                if (!newProgress[selectedLanguage.id].completedMonthlyChallenges) {
                    newProgress[selectedLanguage.id].completedMonthlyChallenges = [];
                }
                newProgress[selectedLanguage.id].completedMonthlyChallenges!.push(currentMonthId);
                // Optionally add a toast for monthly challenges too
                return newProgress;
            }
            
            return prev;
        });
    }, [user, selectedLanguage]);


    // Effect to run achievement checks whenever progress changes
    useEffect(() => {
        if(user && Object.keys(userProgress).length > 0) {
            checkAndUnlockAchievements(userProgress);
            checkAndUnlockMonthlyChallenges();
        }
    }, [userProgress, user, checkAndUnlockAchievements, checkAndUnlockMonthlyChallenges]);


    useEffect(() => {
        const savedData = localStorage.getItem('growEasySession');
        if (savedData) {
            try {
                const { user: savedUser, selectedLanguageId, userProgress: savedProgress } = JSON.parse(savedData);
                if (savedUser && savedProgress) {
                     const language = LANGUAGES.find(l => l.id === selectedLanguageId) || null;
                     setUser(savedUser);
                     setUserProgress(savedProgress);
                     setSelectedLanguage(language);
                     if (language) {
                         setPage(Page.Dashboard);
                     }
                }
            } catch (error) {
                console.error("Failed to parse saved session data", error);
                localStorage.removeItem('growEasySession');
            }
        } else {
            setPage(Page.Home);
        }
    }, []);

    useEffect(() => {
        if (user) {
            const dataToSave = {
                user,
                selectedLanguageId: selectedLanguage?.id,
                userProgress,
            };
            localStorage.setItem('growEasySession', JSON.stringify(dataToSave));
        }
    }, [user, selectedLanguage, userProgress]);
    
    // Persist settings
    useEffect(() => {
        localStorage.setItem('growEasySettings', JSON.stringify(appSettings));
    }, [appSettings]);


    // Persist the entire registered users database whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('growEasyUsers', JSON.stringify(registeredUsers));
        } catch (error) {
            console.error("Failed to save registered users to localStorage", error);
        }
    }, [registeredUsers]);


    // Keep registered user data in sync with the current user's progress
    useEffect(() => {
        if (user) {
            setRegisteredUsers(prev => {
                const userExists = prev.some(ru => ru.user.name === user.name);
                if (!userExists) {
                    return [...prev, { user, progress: userProgress }];
                }
                return prev.map(ru =>
                    ru.user.name === user.name
                        ? { ...ru, progress: userProgress }
                        : ru
                );
            });
        }
    }, [user, userProgress]);

    const updateQuestProgress = useCallback((updates: { type: 'xp' | 'lesson' | 'practice' | 'perfect_lesson', amount: number }[]) => {
        if (!user || !selectedLanguage) return;

        setUserProgress(prev => {
            const langProgress = prev[selectedLanguage.id];
            if (!langProgress?.quests) return prev;

            let totalXpReward = 0;
            let questsDirty = false;
            let newlyCompletedCount = 0;
            
            const updatedQuests = langProgress.quests.activeQuests.map(q => {
                if (q.completed) return q;
                
                const questDef = QUESTS_MAP.get(q.questId);
                if (!questDef) return q;

                const relevantUpdate = updates.find(u => u.type === questDef.type);
                if (!relevantUpdate) return q;

                const newProgress = q.current + relevantUpdate.amount;
                
                if (newProgress !== q.current) {
                    questsDirty = true;
                }

                if (newProgress >= questDef.target) {
                    totalXpReward += questDef.reward;
                    newlyCompletedCount++;
                    return { ...q, current: questDef.target, completed: true };
                } else {
                    return { ...q, current: newProgress };
                }
            });

            if (questsDirty) {
                const updatedLangProgress = {
                    ...langProgress,
                    xp: langProgress.xp + totalXpReward,
                    quests: {
                        ...langProgress.quests,
                        activeQuests: updatedQuests,
                        completedTodayCount: (langProgress.quests.completedTodayCount || 0) + newlyCompletedCount,
                    }
                };
                
                return {
                    ...prev,
                    [selectedLanguage.id]: updatedLangProgress
                };
            }
            return prev;
        });
    }, [user, selectedLanguage]);


    useEffect(() => {
        if (!user || !selectedLanguage) return;

        const today = new Date().toISOString().split('T')[0];
        const langProgress = userProgress[selectedLanguage.id];
        const defaultProgress = { xp: 0, streak: 0, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Bronze, unlockedAchievements: [], practiceSessions: 0, perfectLessons: 0 };

        if (!langProgress?.quests || langProgress.quests.lastReset !== today) {
            const shuffledQuests = [...DAILY_QUESTS].sort(() => 0.5 - Math.random());
            const newQuests = shuffledQuests.slice(0, 3).map(quest => ({
                questId: quest.id,
                current: 0,
                completed: false,
            }));

            setUserProgress(prev => ({
                ...prev,
                [selectedLanguage.id]: {
                    ...(prev[selectedLanguage.id] || defaultProgress),
                    quests: {
                        lastReset: today,
                        activeQuests: newQuests,
                        completedTodayCount: 0,
                    }
                }
            }));
        }
    }, [user, selectedLanguage, userProgress]);
    
    const handleSelectLanguage = useCallback((language: Language) => {
        setSelectedLanguage(language);
        const langProgress = userProgress[language.id];

        // Ensure progress object exists
        if (!langProgress) {
             setUserProgress(prev => ({
                ...prev,
                [language.id]: { xp: 0, streak: 0, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Bronze, unlockedAchievements: [], practiceSessions: 0, perfectLessons: 0 }
            }));
        }
        
        // If the user has no completed topics in this language, offer placement test.
        if (!langProgress || langProgress.completedTopics.length === 0) {
            setPage(Page.PlacementTest);
        } else {
            setPage(Page.Dashboard);
        }
    }, [userProgress]);

    const handleNavigate = useCallback((targetPage: Page) => {
        if (!user && (targetPage === Page.Profile || targetPage === Page.Leaderboard || targetPage === Page.Quests || targetPage === Page.Settings)) {
            setIsAuthModalOpen(true);
        } else {
            setPage(targetPage);
        }
    }, [user]);

    const handleStartLesson = useCallback((topic: LessonTopic) => {
        if (user) {
            setSelectedTopic(topic);
            setPage(Page.Lesson);
        } else {
            setIsAuthModalOpen(true);
        }
    }, [user]);

    const handleStartPractice = useCallback((mode: PracticeMode) => {
        if (user) {
            setPracticeMode(mode);
            setPage(Page.PracticeSession);
        } else {
            setIsAuthModalOpen(true);
        }
    }, [user]);
    
    const handleEndPractice = useCallback(() => {
        if (user && selectedLanguage) {
            setUserProgress(prev => {
                const langProgress = prev[selectedLanguage.id] || { xp: 0, streak: 0, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Bronze, unlockedAchievements: [], practiceSessions: 0, perfectLessons: 0 };
                return {
                    ...prev,
                    [selectedLanguage.id]: {
                        ...langProgress,
                        practiceSessions: (langProgress.practiceSessions || 0) + 1,
                    }
                }
            });
            updateQuestProgress([{type: 'practice', amount: 1}]);
        }
        setPracticeMode(null);
        setPage(Page.PracticeHub);
    }, [user, selectedLanguage, updateQuestProgress]);

    const handleCompleteLesson = useCallback((xpGained: number, newMistakes: MistakeItem[], newVocabulary: Omit<VocabularyItem, 'nextReview' | 'interval'>[]) => {
        if (selectedLanguage && selectedTopic) {
            setUserProgress(prev => {
                const langProgress = prev[selectedLanguage.id] || { xp: 0, streak: 0, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Bronze, unlockedAchievements: [], practiceSessions: 0, perfectLessons: 0 };
                
                const today = new Date().toISOString().split('T')[0];
                const lastCompleted = langProgress.lastCompletedDate;
                let newStreak = langProgress.streak;
                
                const updatedVocab = [...langProgress.learnedVocabulary];
                newVocabulary.forEach(newItem => {
                    if (!updatedVocab.some(existing => existing.word === newItem.word)) {
                        updatedVocab.push({
                            ...newItem,
                            nextReview: new Date().toISOString(),
                            interval: 1
                        });
                    }
                });

                if (!user) { // Guest user progress tracking
                     return {
                        ...prev,
                        [selectedLanguage.id]: {
                           ...langProgress,
                            completedTopics: [...new Set([...langProgress.completedTopics, selectedTopic.id])],
                            learnedVocabulary: updatedVocab,
                        }
                    };
                }

                if (xpGained > 0 && !lastCompleted) {
                    newStreak = 1;
                } else if (xpGained > 0) {
                    const lastDate = new Date(lastCompleted!);
                    const todayDate = new Date(today);
                    const diffTime = todayDate.getTime() - lastDate.getTime();
                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays === 1) {
                        newStreak += 1;
                    } else if (diffDays > 1) {
                        newStreak = 1;
                    }
                }
                
                const isPerfect = xpGained > 0 && newMistakes.length === 0;

                return {
                    ...prev,
                    [selectedLanguage.id]: {
                        ...langProgress,
                        xp: langProgress.xp + xpGained,
                        streak: newStreak,
                        completedTopics: [...new Set([...langProgress.completedTopics, selectedTopic.id])],
                        lastCompletedDate: xpGained > 0 ? today : langProgress.lastCompletedDate,
                        mistakes: [...langProgress.mistakes, ...newMistakes],
                        learnedVocabulary: updatedVocab,
                        perfectLessons: isPerfect ? (langProgress.perfectLessons || 0) + 1 : langProgress.perfectLessons,
                    }
                };
            });
             if (user) {
                const questUpdates: { type: 'xp' | 'lesson' | 'practice' | 'perfect_lesson', amount: number }[] = [];
                if (xpGained > 0) {
                    questUpdates.push({ type: 'xp', amount: xpGained });
                    questUpdates.push({ type: 'lesson', amount: 1 });
                }
                if (xpGained > 0 && newMistakes.length === 0) {
                    questUpdates.push({ type: 'perfect_lesson', amount: 1 });
                }
                updateQuestProgress(questUpdates);
            }
        }
        setPage(Page.Dashboard);
    }, [user, selectedLanguage, selectedTopic, updateQuestProgress]);
    
    const handleChangeLanguage = useCallback(() => {
        setSelectedLanguage(null);
        setPage(Page.LanguageSelection);
    }, []);
    
    const handleLoginSuccess = (loggedInUser: User) => {
        const existingRegisteredUser = registeredUsers.find(ru => ru.user.name === loggedInUser.name);
    
        if (existingRegisteredUser) {
            setUserProgress(existingRegisteredUser.progress);
        } else {
            // New user, initialize progress if they already picked a language as a guest
            const initialProgress = { ...(userProgress || {}) };
            if (selectedLanguage && !initialProgress[selectedLanguage.id]) {
                 initialProgress[selectedLanguage.id] = { xp: 0, streak: 0, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Bronze, unlockedAchievements: [], practiceSessions: 0, perfectLessons: 0 };
            }
             setUserProgress(initialProgress);
        }
    
        setUser(loggedInUser);
        setIsAuthModalOpen(false);
    };

    const handleLogout = useCallback(() => {
        localStorage.removeItem('growEasySession');
        setUser(null);
        setUserProgress({});
        setSelectedLanguage(null);
        setPage(Page.Home);
    }, []);
    
    const handleUpdateMistakes = (mistakes: MistakeItem[]) => {
        if(selectedLanguage) {
             setUserProgress(prev => ({
                ...prev,
                [selectedLanguage.id]: {
                   ...prev[selectedLanguage.id],
                    mistakes,
                }
            }));
        }
    }
    
    const handleUpdateVocabularyReview = useCallback((word: string, performance: 'again' | 'good' | 'easy') => {
        if (!selectedLanguage) return;
    
        setUserProgress(prev => {
            const langProgress = prev[selectedLanguage.id];
            if (!langProgress) return prev;
    
            const updatedVocab = langProgress.learnedVocabulary.map(item => {
                if (item.word === word) {
                    let newInterval: number;
                    switch (performance) {
                        case 'again':
                            newInterval = 1; // Reset
                            break;
                        case 'good':
                            newInterval = Math.max(2, Math.ceil(item.interval * 2));
                            break;
                        case 'easy':
                            newInterval = Math.max(4, Math.ceil(item.interval * 4));
                            break;
                    }
                    const newNextReview = new Date();
                    newNextReview.setDate(newNextReview.getDate() + newInterval);
    
                    return { ...item, interval: newInterval, nextReview: newNextReview.toISOString() };
                }
                return item;
            });
    
            return {
                ...prev,
                [selectedLanguage.id]: {
                    ...langProgress,
                    learnedVocabulary: updatedVocab,
                }
            };
        });
    }, [selectedLanguage]);

    const handleSkipPlacementTest = useCallback(() => {
        setPage(Page.Dashboard);
    }, []);

    const handleCompletePlacementTest = useCallback((completedTopics: string[]) => {
        if (selectedLanguage) {
            // Award 10 XP per lesson skipped
            const xpGained = completedTopics.length * 10;

            setUserProgress(prev => {
                const langProgress = prev[selectedLanguage.id] || { xp: 0, streak: 0, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Bronze, unlockedAchievements: [], practiceSessions: 0, perfectLessons: 0 };
                return {
                    ...prev,
                    [selectedLanguage.id]: {
                        ...langProgress,
                        xp: langProgress.xp + xpGained,
                        completedTopics: [...new Set(completedTopics)],
                    }
                };
            });
        }
        setPage(Page.Dashboard);
    }, [selectedLanguage]);
    
    const handleUpdateSettings = useCallback((newSettings: Partial<AppSettings>) => {
        setAppSettings(prev => ({ ...prev, ...newSettings }));
    }, []);

    const handleUpdateUser = useCallback((updatedUser: Partial<User>) => {
        setUser(prev => {
            if (!prev) return null;
            return { ...prev, ...updatedUser };
        });
    }, []);


    const renderPageContent = () => {
        const currentProgress = selectedLanguage ? userProgress[selectedLanguage.id] : null;

        switch (page) {
            case Page.LanguageSelection:
                return <LanguageSelectionPage languages={LANGUAGES} onSelectLanguage={handleSelectLanguage} />;
            case Page.PlacementTest:
                 if (selectedLanguage) {
                    return <PlacementTestPage language={selectedLanguage} onComplete={handleCompletePlacementTest} onSkip={handleSkipPlacementTest} />;
                }
                break;
            case Page.Dashboard:
                if (selectedLanguage) {
                    return <DashboardPage user={user} language={selectedLanguage} progress={currentProgress} onStartLesson={handleStartLesson} />;
                }
                break;
            case Page.Lesson:
                if (selectedLanguage && selectedTopic) {
                    return <LessonPage language={selectedLanguage} topic={selectedTopic} onComplete={handleCompleteLesson} onBack={() => setPage(Page.Dashboard)} soundEffectsEnabled={appSettings.soundEffectsEnabled} />;
                }
                break;
            case Page.PracticeHub:
                if (selectedLanguage) {
                    return <PracticeHubPage language={selectedLanguage} progress={currentProgress} onStartPractice={handleStartPractice} />;
                }
                break;
             case Page.PracticeSession:
                if (selectedLanguage && practiceMode) {
                    return <PracticeSessionPage mode={practiceMode} language={selectedLanguage} progress={currentProgress} onEndPractice={handleEndPractice} onUpdateMistakes={handleUpdateMistakes} onUpdateVocabularyReview={handleUpdateVocabularyReview} />;
                }
                break;
            case Page.Profile:
                return <ProfilePage user={user} userProgress={userProgress} languages={LANGUAGES} />;
            case Page.Quests:
                return <QuestsPage user={user} userProgress={userProgress} selectedLanguage={selectedLanguage} />;
            case Page.Leaderboard:
                return <LeaderboardPage user={user} registeredUsers={registeredUsers} selectedLanguage={selectedLanguage} />;
            case Page.Dictionary:
                 if (selectedLanguage) {
                    return <DictionaryPage language={selectedLanguage} />;
                }
                break;
            case Page.Settings:
                return <SettingsPage user={user} appSettings={appSettings} onUpdateUser={handleUpdateUser} onUpdateSettings={handleUpdateSettings} onLogout={handleLogout} />;
            case Page.Help:
                return <HelpPage />;
        }
        // Default navigation
        if (page !== Page.Home) {
            setPage(Page.LanguageSelection);
        }
        return null;
    };
    
    if (page === Page.Home) {
        return <HomePage onGetStarted={() => setPage(Page.LanguageSelection)} />;
    }

    const isMainView = [Page.Dashboard, Page.PracticeHub, Page.PracticeSession, Page.Profile, Page.Leaderboard, Page.Dictionary, Page.Quests, Page.Settings, Page.Help].includes(page);
    const currentProgress = selectedLanguage ? userProgress[selectedLanguage.id] : null;

    return (
        <div className="min-h-screen transition-colors duration-500">
            <div className={isMainView ? "flex container mx-auto max-w-[1536px]" : ""}>
                {isMainView && <Sidebar user={user} currentPage={page} onNavigate={handleNavigate} onChangeLanguage={handleChangeLanguage} onLogout={handleLogout} />}
                
                <main className={isMainView ? "flex-grow py-6" : "container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8"}>
                    <div key={`${page}-${practiceMode}`} className="animate-fade-in">
                        {renderPageContent()}
                    </div>
                </main>
                
                {isMainView && <RightSidebar progress={currentProgress} onNavigate={handleNavigate} />}
            </div>
            
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
                registeredUsers={registeredUsers}
            />
            <div aria-live="assertive" className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-[100]">
                <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                    {toasts.map(toast => (
                       <AchievementToast key={toast.id} achievement={toast.achievement} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;