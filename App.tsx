
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import HomePage from './components/HomePage';
import LanguageSelectionPage from './components/LanguageSelectionPage';
import OnboardingPage from './components/OnboardingPage';
import DashboardPage from './components/DashboardPage';
import LessonPage from './components/LessonPage';
import PracticeHubPage from './components/PracticeHubPage';
import PracticeSessionPage from './components/PracticeSessionPage';
import DictionaryPage from './components/DictionaryPage';
import QuestsPage from './components/QuestsPage';
import AchievementsPage from './components/AchievementsPage';
import SettingsPage from './components/SettingsPage';
import HelpPage from './components/HelpPage';
import AuthModal from './components/AuthModal';
import AchievementToast from './components/AchievementToast';
import LivePlacementTestPage from './components/PlacementTestPage';
import FriendsPage from './components/FriendsPage';
import MessagesPage from './components/MessagesPage';
import LeaderboardPage from './components/LeaderboardPage';
import { Page, User, Language, LessonTopic, UserProgress, MistakeItem, VocabularyItem, PracticeMode, Quest, LeagueTier, Achievement, RegisteredUser, AppSettings, Theme, Message, AchievementTier } from './types';
import { LANGUAGES, DAILY_QUESTS, ACHIEVEMENTS, MONTHLY_CHALLENGES } from './constants';
import { HomeIcon, UserCircleIcon, ChartBarIcon, LogoutIcon, StarIcon, FireIcon, PracticeIcon, BookOpenIcon, TrophyIcon, QuestsIcon, SettingsIcon, HelpIcon, UsersIcon, ChatBubbleLeftRightIcon } from './components/icons';

const QUESTS_MAP = new Map(DAILY_QUESTS.map(q => [q.id, q]));

const DUMMY_REGISTERED_USERS: RegisteredUser[] = [];

const DUMMY_MESSAGES: Message[] = [
    { id: '1', from: 'alice@groeasy.com', to: 'bob@groeasy.com', content: 'Hey Bob, ready for the weekly leaderboard race?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: true },
    { id: '2', from: 'bob@groeasy.com', to: 'alice@groeasy.com', content: 'You bet! I\'ve been practicing my Spanish. Watch out!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), read: false },
];


const Sidebar: React.FC<{
    user: User | null;
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onChangeLanguage: () => void;
    onLogout: () => void;
    friendRequestCount: number;
    unreadMessageCount: number;
}> = ({ user, currentPage, onNavigate, onChangeLanguage, onLogout, friendRequestCount, unreadMessageCount }) => {
    
    const mainNavItems = [
        { page: Page.Dashboard, icon: HomeIcon, label: 'LEARN' },
        { page: Page.PracticeHub, icon: PracticeIcon, label: 'PRACTICE' },
        { page: Page.Dictionary, icon: BookOpenIcon, label: 'DICTIONARY' },
        { page: Page.Quests, icon: QuestsIcon, label: 'QUESTS' },
        { page: Page.Achievements, icon: TrophyIcon, label: 'ACHIEVEMENTS' },
        { page: Page.Leaderboard, icon: ChartBarIcon, label: 'LEADERBOARD' },
        { page: Page.Friends, icon: UsersIcon, label: 'FRIENDS', count: friendRequestCount },
        { page: Page.Messages, icon: ChatBubbleLeftRightIcon, label: 'MESSAGES', count: unreadMessageCount },
    ];

    const bottomNavItems = [
        { page: Page.Profile, icon: UserCircleIcon, label: 'PROFILE' },
        { page: Page.Settings, icon: SettingsIcon, label: 'SETTINGS' },
        { page: Page.Help, icon: HelpIcon, label: 'HELP' },
    ];

    const NavButton: React.FC<{item: {page: Page; icon: React.ElementType; label: string; count?: number}; isActive: boolean;}> = ({ item, isActive }) => (
        <button
            onClick={() => onNavigate(item.page)}
            className={`w-full flex items-center space-x-4 py-3 px-4 rounded-lg transition-all duration-200 text-md font-extrabold uppercase relative ${
                isActive 
                ? 'bg-sky-500/20 text-sky-400 border-l-4 border-sky-500' 
                : 'text-slate-400 hover:bg-slate-800'
            }`}
        >
            <item.icon className={`w-8 h-8 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
            <span>{item.label}</span>
            {item.count !== undefined && item.count > 0 && (
                 <span className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {item.count}
                </span>
            )}
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
                        <div className="flex-grow truncate">
                            <span className="font-bold text-slate-200">{user.name}</span>
                        </div>
                        <button onClick={onLogout} title="Log Out" className="p-2 rounded-md text-slate-400 hover:bg-slate-700">
                            <LogoutIcon className="w-6 h-6" />
                        </button>
                    </div>
                 )}
            </div>
        </aside>
    );
};

const Header: React.FC<{
    page: Page;
    user: User | null;
    progress: UserProgress | null;
    selectedLanguage: Language | null;
    onChangeLanguage: () => void;
}> = ({ page, user, progress, selectedLanguage, onChangeLanguage }) => {
    const pageTitles: Record<Page, string> = {
        [Page.Dashboard]: "Learn",
        [Page.PracticeHub]: "Practice",
        [Page.Dictionary]: "Dictionary",
        [Page.Quests]: "Quests",
        [Page.Achievements]: "Achievements",
        [Page.Leaderboard]: "Leaderboard",
        [Page.Friends]: "Friends",
        [Page.Messages]: "Messages",
        [Page.Profile]: "Profile",
        [Page.Settings]: "Settings",
        [Page.Help]: "Help",
        [Page.Home]: "",
        [Page.LanguageSelection]: "",
        [Page.Onboarding]: "",
        [Page.LivePlacementTest]: "",
        [Page.Lesson]: "",
        [Page.PracticeSession]: "",
    };
    
    return (
        <header className="flex justify-between items-center p-4">
             <h2 className="text-2xl font-bold text-slate-100 hidden lg:block">{pageTitles[page]}</h2>
             <div className="flex-grow flex items-center justify-end lg:hidden gap-4">
                 <div className="flex items-center space-x-2 text-amber-400">
                    <StarIcon className="w-6 h-6" />
                    <span className="text-lg font-bold">{progress?.xp ?? 0}</span>
                </div>
                 <div className="flex items-center space-x-2 text-orange-400">
                    <FireIcon className="w-6 h-6" />
                    <span className="text-lg font-bold">{progress?.streak ?? 0}</span>
                </div>
                 {selectedLanguage && (
                    <button onClick={onChangeLanguage} className="text-3xl">
                        {selectedLanguage.flag}
                    </button>
                 )}
             </div>
        </header>
    );
}

const BottomNavBar: React.FC<{ currentPage: Page; onNavigate: (page: Page) => void }> = ({ currentPage, onNavigate }) => {
    const navItems = [
        { page: Page.Dashboard, icon: HomeIcon, label: 'Learn' },
        { page: Page.PracticeHub, icon: PracticeIcon, label: 'Practice' },
        { page: Page.Quests, icon: QuestsIcon, label: 'Quests' },
        { page: Page.Profile, icon: UserCircleIcon, label: 'Profile' },
    ];
    
    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#141a24] border-t border-slate-700 flex justify-around z-50">
            {navItems.map(item => (
                <button
                    key={item.label}
                    onClick={() => onNavigate(item.page)}
                    className={`flex flex-col items-center justify-center pt-2 pb-1 w-full transition-colors ${
                        currentPage === item.page ? 'text-sky-400' : 'text-slate-400'
                    }`}
                >
                    <item.icon className="w-7 h-7" />
                    <span className="text-xs font-bold mt-1">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};


const ProfilePage: React.FC<{
    user: User | null;
    userProgress: Record<string, UserProgress>;
    languages: Language[];
}> = ({ user, userProgress, languages }) => {
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
    
// FIX: Define tierColors to resolve reference error.
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

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8 text-center relative">
                <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-teal-500" />
                <h3 className="text-2xl font-bold">{user.name}</h3>
                {user.bio && <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto">{user.bio}</p>}
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Your Language Progress</h3>
             {languagesWithProgress.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {languagesWithProgress.map(langProgress => (
                        <div key={langProgress.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <span className="text-4xl mr-4">{langProgress.flag}</span>
                                <h4 className="text-xl font-bold">{langProgress.name}</h4>
                            </div>
                            <div className="space-y-4">
                               <div className="flex justify-around text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-amber-500">{langProgress.xp}</p>
                                        <p className="text-sm text-slate-500">XP</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-orange-500">{langProgress.streak}</p>
                                        <p className="text-sm text-slate-500">Day Streak</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
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

    const [messages, setMessages] = useState<Message[]>(() => {
        try {
            const savedMessages = localStorage.getItem('growEasyMessages');
            return savedMessages ? JSON.parse(savedMessages) : DUMMY_MESSAGES;
        } catch {
            return DUMMY_MESSAGES;
        }
    });

    // Theme handler
    useEffect(() => {
        // ... existing theme logic
    }, [appSettings.theme]);

    // Toast notification handler
    const addToast = (achievement: Achievement) => {
        // ... existing toast logic
    };
    
    // Achievement checking logic
    const checkAndUnlockAchievements = useCallback((currentProgress: Record<string, UserProgress>) => {
        // ... existing achievement logic
    }, [user]);

    // Monthly Challenge logic
    const checkAndUnlockMonthlyChallenges = useCallback(() => {
        // ... existing challenge logic
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

    // Persist messages
    useEffect(() => {
        localStorage.setItem('growEasyMessages', JSON.stringify(messages));
    }, [messages]);


    // Keep registered user data in sync with the current user's progress
    useEffect(() => {
        if (user) {
            setRegisteredUsers(prev => {
                const updatedUsers = prev.map(ru => {
                    if (ru.user.email === user.email) {
                        // Ensure all properties of user are updated
                        const updatedRuUser = { ...ru.user, ...user };
                        return { ...ru, user: updatedRuUser, progress: userProgress };
                    }
                    return ru;
                });
                return updatedUsers;
            });
        }
    }, [user, userProgress]);

    const updateQuestProgress = useCallback((updates: { type: 'xp' | 'lesson' | 'practice' | 'perfect_lesson', amount: number }[]) => {
        // ... existing quest logic
    }, [user, selectedLanguage]);


    useEffect(() => {
        // ... existing quest reset logic
    }, [user, selectedLanguage, userProgress]);
    
    const handleSelectLanguage = useCallback((language: Language) => {
        setSelectedLanguage(language);
        const langProgress = userProgress[language.id];

        if (!langProgress) {
             setUserProgress(prev => ({
                ...prev,
                [language.id]: { xp: 0, streak: 0, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Bronze, unlockedAchievements: [], practiceSessions: 0, perfectLessons: 0, activityLog: [] }
            }));
        }
        
        if (!langProgress || langProgress.completedTopics.length === 0) {
            setPage(Page.Onboarding);
        } else {
            setPage(Page.Dashboard);
        }
    }, [userProgress]);

    const handleCompleteOnboarding = useCallback((startWithTest: boolean) => {
        if(startWithTest) {
            setPage(Page.LivePlacementTest);
        } else {
            setPage(Page.Dashboard);
        }
    }, []);


    const handleNavigate = useCallback((targetPage: Page) => {
        if (!user && [Page.Profile, Page.Leaderboard, Page.Quests, Page.Achievements, Page.Settings, Page.Friends, Page.Messages].includes(targetPage)) {
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
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        setPracticeMode(mode);
        setPage(Page.PracticeSession);
    }, [user]);
    
    const handleEndPractice = useCallback(() => {
        // ... existing practice end logic
    }, [user, selectedLanguage, updateQuestProgress]);

    const handleCompleteLesson = useCallback((xpGained: number, newMistakes: MistakeItem[], newVocabulary: Omit<VocabularyItem, 'nextReview' | 'interval'>[]) => {
        // ... existing lesson completion logic
    }, [user, selectedLanguage, selectedTopic, updateQuestProgress]);
    
    const handleChangeLanguage = useCallback(() => {
        setSelectedLanguage(null);
        setPage(Page.LanguageSelection);
    }, []);
    
    const handleAuthSuccess = (authedUser: User, isNewUser: boolean, newUserDetails?: { user: User; password?: string }) => {
        if (isNewUser && newUserDetails) {
            // New user registration
            const newRegisteredUser: RegisteredUser = {
                user: newUserDetails.user,
                password: newUserDetails.password,
                progress: {},
                friends: [],
                friendRequests: [],
            };
            setRegisteredUsers(prev => [...prev, newRegisteredUser]);
            setUserProgress(newRegisteredUser.progress);
            setUser(newRegisteredUser.user);
        } else {
            // Existing user login
            const existingRegisteredUser = registeredUsers.find(ru => ru.user.email === authedUser.email);
            if (existingRegisteredUser) {
                setUserProgress(existingRegisteredUser.progress);
                setUser(existingRegisteredUser.user);
            } else {
                // This case should not be reached with email/pass login but is a safe fallback
                setUserProgress({});
                setUser(authedUser);
            }
        }
    
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
        // ... existing mistake update logic
    }
    
    const handleUpdateVocabularyReview = useCallback((word: string, performance: 'again' | 'good' | 'easy') => {
        // ... existing vocab update logic
    }, [selectedLanguage]);

    const handleSkipPlacementTest = useCallback(() => {
        setPage(Page.Dashboard);
    }, []);

    const handleCompletePlacementTest = useCallback((completedTopics: string[]) => {
        if (selectedLanguage) {
            const xpGained = completedTopics.length * 10;
            setUserProgress(prev => ({
                ...prev,
                [selectedLanguage.id]: {
                    ...(prev[selectedLanguage.id] || { xp: 0, streak: 0, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Bronze, unlockedAchievements: [], practiceSessions: 0, perfectLessons: 0, activityLog: [] }),
                    xp: (prev[selectedLanguage.id]?.xp || 0) + xpGained,
                    completedTopics: [...new Set(completedTopics)],
                }
            }));
        }
        setPage(Page.Dashboard);
    }, [selectedLanguage]);
    
    const handleUpdateSettings = useCallback((newSettings: Partial<AppSettings>) => {
        setAppSettings(prev => ({ ...prev, ...newSettings }));
    }, []);

    const handleUpdateUser = useCallback((updatedUser: Partial<User>) => {
        setUser(prevUser => {
            if (!prevUser) return null;
            const newUser = { ...prevUser, ...updatedUser };
            return newUser;
        });
    }, []);

    // --- Social Handlers ---
    const handleSendFriendRequest = useCallback((toEmail: string) => {
        if (!user) return;
        setRegisteredUsers(prev => prev.map(ru => {
            if (ru.user.email === toEmail) {
                const requests = ru.friendRequests || [];
                if (!requests.some(req => req.from === user.email)) {
                    return { ...ru, friendRequests: [...requests, { from: user.email, status: 'pending' }] };
                }
            }
            return ru;
        }));
    }, [user]);

    const handleAcceptFriendRequest = useCallback((fromEmail: string) => {
        if (!user) return;
        setRegisteredUsers(prev => {
            const currentUserEmail = user.email;
            return prev.map(ru => {
                // Add friend to current user
                if (ru.user.email === currentUserEmail) {
                    const updatedFriends = [...ru.friends, fromEmail];
                    const updatedRequests = (ru.friendRequests || []).filter(req => req.from !== fromEmail);
                    return { ...ru, friends: updatedFriends, friendRequests: updatedRequests };
                }
                // Add current user to the sender's friend list
                if (ru.user.email === fromEmail) {
                    const updatedFriends = [...ru.friends, currentUserEmail];
                    return { ...ru, friends: updatedFriends };
                }
                return ru;
            });
        });
    }, [user]);

    const handleDeclineFriendRequest = useCallback((fromEmail: string) => {
        if (!user) return;
        setRegisteredUsers(prev => prev.map(ru => {
            if (ru.user.email === user.email) {
                const updatedRequests = (ru.friendRequests || []).filter(req => req.from !== fromEmail);
                return { ...ru, friendRequests: updatedRequests };
            }
            return ru;
        }));
    }, [user]);

     const handleRemoveFriend = useCallback((friendEmail: string) => {
        if (!user) return;
        setRegisteredUsers(prev => {
            const currentUserEmail = user.email;
            return prev.map(ru => {
                // Remove friend from current user
                if (ru.user.email === currentUserEmail) {
                    return { ...ru, friends: ru.friends.filter(f => f !== friendEmail) };
                }
                // Remove current user from the friend's list
                if (ru.user.email === friendEmail) {
                    return { ...ru, friends: ru.friends.filter(f => f !== currentUserEmail) };
                }
                return ru;
            });
        });
    }, [user]);
    
    const handleSendMessage = useCallback((toEmail: string, content: string) => {
        if (!user) return;
        const newMessage: Message = {
            id: new Date().toISOString() + Math.random(),
            from: user.email,
            to: toEmail,
            content: content.trim(),
            timestamp: new Date().toISOString(),
            read: false,
        };
        setMessages(prev => [...prev, newMessage]);
    }, [user]);

    const handleMarkConversationAsRead = useCallback((friendEmail: string) => {
        if(!user) return;
        const currentUserEmail = user.email;
        setMessages(prev => prev.map(msg => {
            if (msg.to === currentUserEmail && msg.from === friendEmail && !msg.read) {
                return { ...msg, read: true };
            }
            return msg;
        }));
    }, [user]);


    // --- Memos for Social Notifications ---
    const friendRequestCount = useMemo(() => {
        if (!user) return 0;
        const currentUserData = registeredUsers.find(ru => ru.user.email === user.email);
        return currentUserData?.friendRequests?.length ?? 0;
    }, [user, registeredUsers]);

    const unreadMessageCount = useMemo(() => {
        if (!user) return 0;
        return messages.filter(msg => msg.to === user.email && !msg.read).length;
    }, [user, messages]);

    const renderPageContent = () => {
        const currentProgress = selectedLanguage ? userProgress[selectedLanguage.id] : null;

        switch (page) {
            case Page.LanguageSelection:
                return <LanguageSelectionPage languages={LANGUAGES} onSelectLanguage={handleSelectLanguage} />;
            case Page.Onboarding:
                return <OnboardingPage onComplete={handleCompleteOnboarding} />;
            case Page.LivePlacementTest:
                 if (selectedLanguage) {
                    return <LivePlacementTestPage language={selectedLanguage} onComplete={handleCompletePlacementTest} onSkip={handleSkipPlacementTest} soundEffectsEnabled={appSettings.soundEffectsEnabled} />;
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
                    return <PracticeHubPage language={selectedLanguage} progress={currentProgress} user={user} onStartPractice={handleStartPractice} />;
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
            case Page.Achievements:
                return <AchievementsPage userProgress={userProgress} selectedLanguage={selectedLanguage} />;
            case Page.Leaderboard:
                return <LeaderboardPage user={user} registeredUsers={registeredUsers} selectedLanguage={selectedLanguage} />;
            case Page.Dictionary:
                 if (selectedLanguage) {
                    return <DictionaryPage language={selectedLanguage} />;
                }
                break;
            case Page.Friends:
                if (user) {
                    return <FriendsPage user={user} registeredUsers={registeredUsers} onSendRequest={handleSendFriendRequest} onAcceptRequest={handleAcceptFriendRequest} onDeclineRequest={handleDeclineFriendRequest} onRemoveFriend={handleRemoveFriend} onNavigate={handleNavigate} />;
                }
                break;
            case Page.Messages:
                if (user) {
                    return <MessagesPage user={user} registeredUsers={registeredUsers} messages={messages} onSendMessage={handleSendMessage} onMarkRead={handleMarkConversationAsRead} />;
                }
                break;
            case Page.Settings:
                return <SettingsPage user={user} appSettings={appSettings} onUpdateUser={handleUpdateUser} onUpdateSettings={handleUpdateSettings} onLogout={handleLogout} />;
            case Page.Help:
                return <HelpPage />;
            default:
                 // Fallback for any unhandled page state
                break;
        }
        
        // If a page requires a selected language but none is present, redirect to language selection.
        // The pages that fall through the switch above are the ones that need a selected language.
        setPage(Page.LanguageSelection);
        return null;
    };
    
    if (page === Page.Home) {
        return <HomePage onGetStarted={() => setPage(Page.LanguageSelection)} />;
    }

    const isMainView = [Page.Dashboard, Page.PracticeHub, Page.PracticeSession, Page.Profile, Page.Leaderboard, Page.Dictionary, Page.Quests, Page.Achievements, Page.Settings, Page.Help, Page.Friends, Page.Messages].includes(page);
    const currentProgress = selectedLanguage ? userProgress[selectedLanguage.id] : null;

    return (
        <div className="min-h-screen transition-colors duration-500">
            <div className={isMainView ? "lg:flex" : ""}>
                {isMainView && <Sidebar user={user} currentPage={page} onNavigate={handleNavigate} onChangeLanguage={handleChangeLanguage} onLogout={handleLogout} friendRequestCount={friendRequestCount} unreadMessageCount={unreadMessageCount} />}
                
                <div className="flex-1 flex flex-col">
                    {isMainView && <Header page={page} user={user} progress={currentProgress} selectedLanguage={selectedLanguage} onChangeLanguage={handleChangeLanguage} />}
                    <main className={isMainView ? "flex-grow p-4 sm:p-6 pb-24 lg:pb-6" : "container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8"}>
                        <div key={`${page}-${practiceMode}`} className="animate-fade-in">
                            {renderPageContent()}
                        </div>
                    </main>
                </div>
            </div>
            
             {isMainView && <BottomNavBar currentPage={page} onNavigate={handleNavigate} />}
            
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onAuthSuccess={handleAuthSuccess}
                registeredUsers={registeredUsers}
            />
            <div aria-live="assertive" className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-[100]">
                {/* ... existing toast container */}
            </div>
        </div>
    );
};

export default App;
