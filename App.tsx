import React, { useState, useCallback, useEffect } from 'react';
import LanguageSelectionPage from './components/LanguageSelectionPage';
import DashboardPage from './components/DashboardPage';
import LessonPage from './components/LessonPage';
import AuthModal from './components/AuthModal';
import { Page, User, Language, LessonTopic, UserProgress } from './types';
import { LANGUAGES } from './constants';
import { HomeIcon, UserCircleIcon, ChartBarIcon, LogoutIcon, StarIcon, FireIcon } from './components/icons';


const Sidebar: React.FC<{
    user: User | null;
    onChangeLanguage: () => void;
    onLogout: () => void;
}> = ({ user, onChangeLanguage, onLogout }) => {
    
    const navItems = [
        { icon: HomeIcon, label: 'Learn', active: true },
        { icon: UserCircleIcon, label: 'Profile', active: false },
        { icon: ChartBarIcon, label: 'Leaderboard', active: false },
    ];

    return (
        <aside className="w-64 flex-shrink-0 p-6 hidden lg:flex flex-col">
            <h1 className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 mb-10">
                GrowEasy
            </h1>
            <nav className="flex-grow">
                <ul>
                    {navItems.map(item => (
                        <li key={item.label}>
                            <a href="#" className={`flex items-center space-x-4 p-3 rounded-xl transition-colors text-lg font-bold ${item.active ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                <item.icon className="w-8 h-8" />
                                <span>{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="space-y-4">
                <button 
                    onClick={onChangeLanguage} 
                    className="w-full text-left flex items-center space-x-4 p-3 rounded-xl transition-colors text-lg font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <span>🌐</span>
                    <span>Change Language</span>
                </button>
                 {user && (
                    <div className="flex items-center space-x-3 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                        <span className="font-bold flex-grow truncate">{user.name}</span>
                        <button onClick={onLogout} title="Log Out" className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">
                            <LogoutIcon className="w-6 h-6" />
                        </button>
                    </div>
                 )}
            </div>
        </aside>
    );
};

const StatsPanel: React.FC<{
    progress: UserProgress | null;
}> = ({ progress }) => {
    return (
        <aside className="w-72 flex-shrink-0 p-6 hidden xl:block">
            <div className="border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 sticky top-6 space-y-6">
                <h2 className="text-xl font-bold">Your Stats</h2>
                <div className="flex items-center justify-between p-4 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <StarIcon className="w-8 h-8 text-amber-500" />
                        <span className="text-lg font-bold">Total XP</span>
                    </div>
                    <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{progress?.xp ?? 0}</span>
                </div>
                 <div className="flex items-center justify-between p-4 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <FireIcon className="w-8 h-8 text-orange-500" />
                        <span className="text-lg font-bold">Day Streak</span>
                    </div>
                    <span className="text-xl font-extrabold text-orange-600 dark:text-orange-400">{progress?.streak ?? 0}</span>
                </div>
            </div>
        </aside>
    );
};

const App: React.FC = () => {
    const [page, setPage] = useState<Page>(Page.LanguageSelection);
    const [user, setUser] = useState<User | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<LessonTopic | null>(null);
    const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleSelectLanguage = useCallback((language: Language) => {
        setSelectedLanguage(language);
        if (user && !userProgress[language.id]) {
            setUserProgress(prev => ({
                ...prev,
                [language.id]: { xp: 0, streak: 0, completedTopics: [] }
            }));
        }
        setPage(Page.Dashboard);
    }, [user, userProgress]);

    const handleStartLesson = useCallback((topic: LessonTopic) => {
        setSelectedTopic(topic);
        setPage(Page.Lesson);
    }, []);

    const handleCompleteLesson = useCallback((xpGained: number) => {
        if (selectedLanguage && selectedTopic) {
            setUserProgress(prev => {
                const langProgress = prev[selectedLanguage.id] || { xp: 0, streak: 0, completedTopics: [] };
                
                const today = new Date().toISOString().split('T')[0];
                const lastCompleted = langProgress.lastCompletedDate;
                let newStreak = langProgress.streak;

                if (!user) { // Guest user progress tracking
                     return {
                        ...prev,
                        [selectedLanguage.id]: {
                           ...langProgress,
                            completedTopics: [...new Set([...langProgress.completedTopics, selectedTopic.id])],
                        }
                    };
                }

                if (!lastCompleted) {
                    newStreak = 1;
                } else {
                    const lastDate = new Date(lastCompleted);
                    const todayDate = new Date(today);
                    const diffTime = todayDate.getTime() - lastDate.getTime();
                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays === 1) {
                        newStreak += 1;
                    } else if (diffDays > 1) {
                        newStreak = 1;
                    }
                }

                return {
                    ...prev,
                    [selectedLanguage.id]: {
                        xp: langProgress.xp + xpGained,
                        streak: newStreak,
                        completedTopics: [...new Set([...langProgress.completedTopics, selectedTopic.id])],
                        lastCompletedDate: today,
                    }
                };
            });
        }
        setPage(Page.Dashboard);
    }, [user, selectedLanguage, selectedTopic]);
    
    const handleChangeLanguage = useCallback(() => {
        setSelectedLanguage(null);
        setPage(Page.LanguageSelection);
    }, []);
    
    const handleLoginSuccess = (loggedInUser: User) => {
        setUser(loggedInUser);
        setIsAuthModalOpen(false);
        if (selectedLanguage && !userProgress[selectedLanguage.id]) {
            setUserProgress(prev => ({
                ...prev,
                [selectedLanguage.id]: { xp: 0, streak: 0, completedTopics: [] }
            }));
        }
    };

    const handleLogout = useCallback(() => {
        setUser(null);
        setUserProgress({});
        setSelectedLanguage(null);
        setPage(Page.LanguageSelection);
    }, []);

    const renderPage = () => {
        const currentProgress = selectedLanguage ? userProgress[selectedLanguage.id] : null;

        switch (page) {
            case Page.LanguageSelection:
                return <LanguageSelectionPage languages={LANGUAGES} onSelectLanguage={handleSelectLanguage} />;
            case Page.Dashboard:
                if (selectedLanguage) {
                    return (
                        <DashboardPage
                            user={user}
                            language={selectedLanguage}
                            progress={currentProgress}
                            onStartLesson={handleStartLesson}
                        />
                    );
                }
                setPage(Page.LanguageSelection);
                return null;
            case Page.Lesson:
                if (selectedLanguage && selectedTopic) {
                    return (
                        <LessonPage
                            language={selectedLanguage}
                            topic={selectedTopic}
                            onComplete={handleCompleteLesson}
                            onBack={() => setPage(Page.Dashboard)}
                        />
                    );
                }
                setPage(Page.Dashboard);
                return null;
            default:
                 setPage(Page.LanguageSelection);
                 return null;
        }
    };

    const isDashboard = page === Page.Dashboard;
    const currentProgress = selectedLanguage ? userProgress[selectedLanguage.id] : null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-500">
            <div className={isDashboard ? "flex container mx-auto max-w-7xl" : ""}>
                {isDashboard && <Sidebar user={user} onChangeLanguage={handleChangeLanguage} onLogout={handleLogout} />}
                
                <main className={isDashboard ? "flex-grow py-6" : "container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8"}>
                    <div key={page} className={page !== Page.Dashboard ? "animate-fade-in" : ""}>
                        {renderPage()}
                    </div>
                </main>
                
                {isDashboard && user && <StatsPanel progress={currentProgress} />}
            </div>
            
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </div>
    );
};

export default App;