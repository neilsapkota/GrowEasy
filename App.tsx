import React, { useState, useCallback, useEffect } from 'react';
import LanguageSelectionPage from './components/LanguageSelectionPage';
import DashboardPage from './components/DashboardPage';
import LessonPage from './components/LessonPage';
import PracticeHubPage from './components/PracticeHubPage';
import PracticeSessionPage from './components/PracticeSessionPage';
import AuthModal from './components/AuthModal';
import ProgressBar from './components/ProgressBar';
import { Page, User, Language, LessonTopic, UserProgress, MistakeItem, VocabularyItem, PracticeMode, QuestProgress, Quest } from './types';
import { LANGUAGES, DAILY_QUESTS } from './constants';
import { HomeIcon, UserCircleIcon, ChartBarIcon, LogoutIcon, StarIcon, FireIcon, PracticeIcon, ChestIcon, ClockIcon } from './components/icons';

const QUESTS_MAP = new Map(DAILY_QUESTS.map(q => [q.id, q]));

const Sidebar: React.FC<{
    user: User | null;
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onChangeLanguage: () => void;
    onLogout: () => void;
}> = ({ user, currentPage, onNavigate, onChangeLanguage, onLogout }) => {
    
    const navItems = [
        { page: Page.Dashboard, icon: HomeIcon, label: 'Learn' },
        { page: Page.PracticeHub, icon: PracticeIcon, label: 'Practice' },
        { icon: UserCircleIcon, label: 'Profile' },
        { icon: ChartBarIcon, label: 'Leaderboard' },
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
                            <button
                                onClick={() => item.page && onNavigate(item.page)}
                                disabled={!item.page}
                                className={`w-full flex items-center space-x-4 p-3 rounded-xl transition-colors text-lg font-bold ${item.page && currentPage === item.page ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800'} ${!item.page ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed' : ''}`}
                            >
                                <item.icon className="w-8 h-8" />
                                <span>{item.label}</span>
                            </button>
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

const RightSidebar: React.FC<{
    progress: UserProgress | null;
}> = ({ progress }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const diff = tomorrow.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const quests = progress?.quests?.activeQuests;
    const completedQuestsCount = quests?.filter(q => q.completed).length ?? 0;

    return (
        <aside className="w-96 flex-shrink-0 p-6 hidden xl:block">
            <div className="border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 sticky top-6">
                {/* Stats */}
                <h2 className="text-xl font-bold">Your Stats</h2>
                <div className="flex items-center justify-between p-4 bg-amber-100 dark:bg-amber-900/50 rounded-lg mt-4">
                    <div className="flex items-center space-x-3">
                        <StarIcon className="w-8 h-8 text-amber-500" />
                        <span className="text-lg font-bold">Total XP</span>
                    </div>
                    <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{progress?.xp ?? 0}</span>
                </div>
                 <div className="flex items-center justify-between p-4 bg-orange-100 dark:bg-orange-900/50 rounded-lg mt-4">
                    <div className="flex items-center space-x-3">
                        <FireIcon className="w-8 h-8 text-orange-500" />
                        <span className="text-lg font-bold">Day Streak</span>
                    </div>
                    <span className="text-xl font-extrabold text-orange-600 dark:text-orange-400">{progress?.streak ?? 0}</span>
                </div>

                {/* Quests */}
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold">Daily Quests</h2>
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {timeLeft}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        You've completed {completedQuestsCount} out of {quests?.length ?? 3} quests today.
                    </p>
                    <div className="space-y-4">
                        {quests?.map(questProgress => {
                            const questDef = QUESTS_MAP.get(questProgress.questId);
                            if (!questDef) return null;
                            const isCompleted = questProgress.completed;
                            return (
                                <div key={questDef.id}>
                                    <div className="flex items-center mb-2">
                                        <ChestIcon className={`w-10 h-10 mr-3 transition-colors ${isCompleted ? 'text-amber-400' : 'text-slate-400'}`} />
                                        <div>
                                            <p className="font-bold text-slate-700 dark:text-slate-200">{questDef.title}</p>
                                            {!isCompleted && <p className="text-xs text-slate-500 dark:text-slate-400">Reward: {questDef.reward} XP</p>}
                                        </div>
                                    </div>
                                    <ProgressBar value={questProgress.current} max={questDef.target} label={""} />
                                </div>
                            );
                        })}
                         {!quests && <p className="text-sm text-center text-slate-400">Log in to see your daily quests!</p>}
                    </div>
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
    const [practiceMode, setPracticeMode] = useState<PracticeMode | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isChangingLanguage, setIsChangingLanguage] = useState(false);

    const updateQuestProgress = useCallback((updates: { type: 'xp' | 'lesson' | 'practice', amount: number }[]) => {
        if (!user || !selectedLanguage) return;

        setUserProgress(prev => {
            const langProgress = prev[selectedLanguage.id];
            if (!langProgress?.quests) return prev;

            let totalXpReward = 0;
            let questsDirty = false;
            
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
                    return { ...q, current: questDef.target, completed: true };
                } else {
                    return { ...q, current: newProgress };
                }
            });

            if (questsDirty) {
                return {
                    ...prev,
                    [selectedLanguage.id]: {
                        ...langProgress,
                        xp: langProgress.xp + totalXpReward,
                        quests: {
                            ...langProgress.quests,
                            activeQuests: updatedQuests
                        }
                    }
                };
            }
            return prev;
        });
    }, [user, selectedLanguage]);


    useEffect(() => {
        if (!user || !selectedLanguage) return;

        const today = new Date().toISOString().split('T')[0];
        const langProgress = userProgress[selectedLanguage.id];

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
                    ...(prev[selectedLanguage.id] || { xp: 0, streak: 0, completedTopics: [], mistakes: [], learnedVocabulary: [] }),
                    quests: {
                        lastReset: today,
                        activeQuests: newQuests,
                    }
                }
            }));
        }
    }, [user, selectedLanguage, userProgress]);
    
    const handleSelectLanguage = useCallback((language: Language) => {
        setSelectedLanguage(language);
        if (user && !userProgress[language.id]) {
            setUserProgress(prev => ({
                ...prev,
                [language.id]: { xp: 0, streak: 0, completedTopics: [], mistakes: [], learnedVocabulary: [] }
            }));
        }
        setPage(Page.Dashboard);
        setIsChangingLanguage(false);
    }, [user, userProgress]);

    const handleStartLesson = useCallback((topic: LessonTopic) => {
        setSelectedTopic(topic);
        setPage(Page.Lesson);
    }, []);

    const handleStartPractice = useCallback((mode: PracticeMode) => {
        setPracticeMode(mode);
        setPage(Page.PracticeSession);
    }, []);
    
    const handleEndPractice = useCallback(() => {
        if (user) {
            updateQuestProgress([{type: 'practice', amount: 1}]);
        }
        setPracticeMode(null);
        setPage(Page.PracticeHub);
    }, [user, updateQuestProgress]);

    const handleCompleteLesson = useCallback((xpGained: number, newMistakes: MistakeItem[], newVocabulary: VocabularyItem[]) => {
        if (selectedLanguage && selectedTopic) {
            setUserProgress(prev => {
                const langProgress = prev[selectedLanguage.id] || { xp: 0, streak: 0, completedTopics: [], mistakes: [], learnedVocabulary: [] };
                
                const today = new Date().toISOString().split('T')[0];
                const lastCompleted = langProgress.lastCompletedDate;
                let newStreak = langProgress.streak;

                if (!user) { // Guest user progress tracking
                     return {
                        ...prev,
                        [selectedLanguage.id]: {
                           ...langProgress,
                            completedTopics: [...new Set([...langProgress.completedTopics, selectedTopic.id])],
                            learnedVocabulary: [...langProgress.learnedVocabulary, ...newVocabulary],
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
                
                const updatedVocab = [...langProgress.learnedVocabulary];
                newVocabulary.forEach(newItem => {
                    if (!updatedVocab.some(existing => existing.word === newItem.word)) {
                        updatedVocab.push(newItem);
                    }
                });

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
                    }
                };
            });
             if (user) {
                const questUpdates: { type: 'xp' | 'lesson' | 'practice', amount: number }[] = [];
                if (xpGained > 0) {
                    questUpdates.push({ type: 'xp', amount: xpGained });
                    questUpdates.push({ type: 'lesson', amount: 1 });
                }
                updateQuestProgress(questUpdates);
            }
        }
        setPage(Page.Dashboard);
    }, [user, selectedLanguage, selectedTopic, updateQuestProgress]);
    
    const handleChangeLanguage = useCallback(() => {
        setSelectedLanguage(null);
        setIsChangingLanguage(true);
        setPage(Page.LanguageSelection);
    }, []);
    
    const handleLoginSuccess = (loggedInUser: User) => {
        setUser(loggedInUser);
        setIsAuthModalOpen(false);
        if (selectedLanguage && !userProgress[selectedLanguage.id]) {
            setUserProgress(prev => ({
                ...prev,
                [selectedLanguage.id]: { xp: 0, streak: 0, completedTopics: [], mistakes: [], learnedVocabulary: [] }
            }));
        }
    };

    const handleLogout = useCallback(() => {
        setUser(null);
        // Keep progress for guest session
        // setUserProgress({}); 
        // setSelectedLanguage(null);
        // setPage(Page.LanguageSelection);
        setIsChangingLanguage(false);
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

    const renderPage = () => {
        const currentProgress = selectedLanguage ? userProgress[selectedLanguage.id] : null;

        switch (page) {
            case Page.LanguageSelection:
                return <LanguageSelectionPage languages={LANGUAGES} onSelectLanguage={handleSelectLanguage} skipHero={isChangingLanguage} />;
            case Page.Dashboard:
                if (selectedLanguage) {
                    return <DashboardPage user={user} language={selectedLanguage} progress={currentProgress} onStartLesson={handleStartLesson} />;
                }
                break;
            case Page.Lesson:
                if (selectedLanguage && selectedTopic) {
                    return <LessonPage language={selectedLanguage} topic={selectedTopic} onComplete={handleCompleteLesson} onBack={() => setPage(Page.Dashboard)} />;
                }
                break;
            case Page.PracticeHub:
                if (selectedLanguage) {
                    return <PracticeHubPage language={selectedLanguage} progress={currentProgress} onStartPractice={handleStartPractice} />;
                }
                break;
             case Page.PracticeSession:
                if (selectedLanguage && practiceMode) {
                    return <PracticeSessionPage mode={practiceMode} language={selectedLanguage} progress={currentProgress} onEndPractice={handleEndPractice} onUpdateMistakes={handleUpdateMistakes} />;
                }
                break;
        }
        // Default navigation
        setPage(Page.LanguageSelection);
        return null;
    };
    
    const isMainView = [Page.Dashboard, Page.PracticeHub, Page.PracticeSession].includes(page);
    const currentProgress = selectedLanguage ? userProgress[selectedLanguage.id] : null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-500">
            <div className={isMainView ? "flex container mx-auto max-w-[1536px]" : ""}>
                {isMainView && <Sidebar user={user} currentPage={page} onNavigate={setPage} onChangeLanguage={handleChangeLanguage} onLogout={handleLogout} />}
                
                <main className={isMainView ? "flex-grow py-6" : "container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8"}>
                    <div key={`${page}-${practiceMode}`} className={!isMainView ? "animate-fade-in" : ""}>
                        {renderPage()}
                    </div>
                </main>
                
                {isMainView && <RightSidebar progress={currentProgress} />}
            </div>
            
            <AuthModal
                isOpen={!user && page !== Page.LanguageSelection}
                onClose={() => setIsAuthModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </div>
    );
};

export default App;