
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
import AboutPage from './components/AboutPage';
import AuthModal from './components/AuthModal';
import AchievementToast from './components/AchievementToast';
import LivePlacementTestPage from './components/PlacementTestPage';
import FriendsPage from './components/FriendsPage';
import MessagesPage from './components/MessagesPage';
import LeaderboardPage from './components/LeaderboardPage';
import FlashcardDecksPage from './components/FlashcardDecksPage'; // New Import
import FeaturesPage from './components/FeaturesPage';
import TestimonialsPage from './components/TestimonialsPage';
import Logo from './components/Logo';
import { getRegisteredUsers, saveRegisteredUsers, getMessages, saveMessages, ensureTestUserExists } from './components/mockDatabase';
// FIX: Added missing type imports
import { Page, User, Language, LessonTopic, UserProgress, MistakeItem, VocabularyItem, PracticeMode, Quest, LeagueTier, Achievement, RegisteredUser, AppSettings, Theme, Message, AchievementTier, FlashcardDeck } from './types';
import { LANGUAGES, DAILY_QUESTS, ACHIEVEMENTS, MONTHLY_CHALLENGES } from './constants';
import { HomeIcon, UserCircleIcon, ChartBarIcon, LogoutIcon, StarIcon, FireIcon, PracticeIcon, BookOpenIcon, TrophyIcon, QuestsIcon, SettingsIcon, HelpIcon, UsersIcon, ChatBubbleLeftRightIcon, InfoIcon, MenuIcon, XIcon } from './components/icons';
import ProfilePage from './components/ProfilePage';

declare const google: any; // Add this to inform TypeScript about the global 'google' object from the GSI library

const QUESTS_MAP = new Map(DAILY_QUESTS.map(q => [q.id, q]));

const MISTAKE_LIMIT = 100;


const StaggeredMenu: React.FC<{
    user: User | null;
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onChangeLanguage: () => void;
    onLogout: () => void;
    friendRequestCount: number;
    unreadMessageCount: number;
    isOpen: boolean;
    onClose: () => void;
}> = ({ user, currentPage, onNavigate, onChangeLanguage, onLogout, friendRequestCount, unreadMessageCount, isOpen, onClose }) => {
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // FIX: Define a type for navigation items to allow for the optional 'count' property, resolving TypeScript errors.
    type NavItem = {
        page: Page;
        icon: React.ElementType;
        label: string;
        count?: number;
    };

    const mainNavItems: NavItem[] = [
        { page: Page.Dashboard, icon: HomeIcon, label: 'LEARN' },
        { page: Page.PracticeHub, icon: PracticeIcon, label: 'PRACTICE' },
        { page: Page.Dictionary, icon: BookOpenIcon, label: 'DICTIONARY' },
        { page: Page.Quests, icon: QuestsIcon, label: 'QUESTS' },
        { page: Page.Achievements, icon: TrophyIcon, label: 'ACHIEVEMENTS' },
        { page: Page.Leaderboard, icon: ChartBarIcon, label: 'LEADERBOARD' },
        { page: Page.Friends, icon: UsersIcon, label: 'FRIENDS', count: friendRequestCount },
        { page: Page.Messages, icon: ChatBubbleLeftRightIcon, label: 'MESSAGES', count: unreadMessageCount },
    ];

    const bottomNavItems: NavItem[] = [
        { page: Page.Profile, icon: UserCircleIcon, label: 'PROFILE' },
        { page: Page.Settings, icon: SettingsIcon, label: 'SETTINGS' },
        { page: Page.Help, icon: HelpIcon, label: 'HELP' },
    ];
    
    const allNavItems: NavItem[] = [...mainNavItems, ...bottomNavItems];

    return (
        <div 
            className={`fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div 
                className="relative w-full h-full flex flex-col items-center justify-center p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
                    <XIcon className="w-8 h-8" />
                </button>
                
                <nav className="flex-grow flex items-center">
                    <ul className="space-y-4 text-center">
                        {allNavItems.map((item, index) => (
                            <li 
                                key={item.page}
                                className="transform transition-all duration-300 ease-out"
                                style={{ 
                                    transitionDelay: `${100 + index * 30}ms`,
                                    transform: isOpen ? 'translateX(0)' : 'translateX(-15px)',
                                    opacity: isOpen ? 1 : 0
                                }}
                            >
                                <button
                                    onClick={() => onNavigate(item.page)}
                                    className={`relative text-2xl md:text-3xl font-bold transition-colors duration-300 group py-2 ${currentPage === item.page ? 'text-sky-400' : 'text-slate-300 hover:text-white'}`}
                                >
                                    <span className="flex items-center gap-3">
                                        <item.icon className="w-7 h-7" />
                                        <span>{item.label}</span>
                                        {item.count !== undefined && item.count > 0 && (
                                            <span className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                                {item.count}
                                            </span>
                                        )}
                                    </span>
                                    {currentPage === item.page && <span className="absolute -bottom-0 left-0 w-full h-0.5 bg-sky-400"></span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div 
                    className="flex-shrink-0 space-y-4 text-center transform transition-all duration-300 ease-out"
                    style={{
                        transitionDelay: `${100 + allNavItems.length * 30}ms`,
                        transform: isOpen ? 'translateY(0)' : 'translateY(15px)',
                        opacity: isOpen ? 1 : 0
                    }}
                >
                    <button 
                        onClick={onChangeLanguage} 
                        className="text-lg font-bold uppercase text-slate-400 hover:text-white transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-2xl">🌐</span>
                            <span>Change Language</span>
                        </span>
                    </button>
                     {user && (
                        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-700">
                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                            <span className="font-bold text-slate-200">{user.name}</span>
                            <button onClick={onLogout} title="Log Out" className="p-2 rounded-md text-slate-400 hover:bg-slate-700">
                                <LogoutIcon className="w-6 h-6" />
                            </button>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

const Header: React.FC<{
    page: Page;
    user: User | null;
    progress: UserProgress | null;
    selectedLanguage: Language | null;
    onChangeLanguage: () => void;
    onOpenNav: () => void;
}> = ({ page, user, progress, selectedLanguage, onChangeLanguage, onOpenNav }) => {
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
        [Page.About]: "About Vocal AI",
        [Page.FlashcardDecks]: "Flashcard Decks",
        [Page.Home]: "",
        [Page.LanguageSelection]: "",
        [Page.Onboarding]: "",
        [Page.LivePlacementTest]: "",
        [Page.Lesson]: "",
        [Page.PracticeSession]: "",
        [Page.Features]: "Features",
        [Page.Testimonials]: "Testimonials",
    };
    
    return (
        <header className="flex justify-between items-center p-4 border-b border-slate-800 lg:border-none">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                 <button onClick={onOpenNav} className="p-1 text-slate-300">
                    <MenuIcon className="w-6 h-6" />
                 </button>
                 <h2 className="text-2xl font-bold text-slate-100 hidden lg:block">{pageTitles[page]}</h2>
            </div>
            
            {/* Right Section (User Stats) */}
            <div className="flex items-center space-x-2 sm:space-x-4">
                 <div className="flex items-center space-x-2 text-amber-400">
                    <StarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-lg font-bold">{progress?.xp ?? 0}</span>
                </div>
                 <div className="flex items-center space-x-2 text-orange-400">
                    <FireIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-lg font-bold">{progress?.streak ?? 0}</span>
                </div>
                 {selectedLanguage && (
                    <button onClick={onChangeLanguage} className="text-2xl sm:text-3xl">
                        {selectedLanguage.flag}
                    </button>
                 )}
             </div>
        </header>
    );
}

const App: React.FC = () => {
    const [page, setPage] = useState<Page>(Page.Home);
    const [user, setUser] = useState<User | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<LessonTopic | null>(null);
    const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
    const [practiceMode, setPracticeMode] = useState<PracticeMode | null>(null);
    const [selectedFlashcardDeck, setSelectedFlashcardDeck] = useState<FlashcardDeck | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [toasts, setToasts] = useState<{ id: number; achievement: Achievement }[]>([]);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [appSettings, setAppSettings] = useState<AppSettings>(() => {
        try {
            const savedSettings = localStorage.getItem('vocalAiSettings');
            return savedSettings ? JSON.parse(savedSettings) : { theme: 'system', soundEffectsEnabled: true };
        } catch {
            return { theme: 'system', soundEffectsEnabled: true };
        }
    });

    const [languageChoiceForOnboarding, setLanguageChoiceForOnboarding] = useState<Language | null>(null);
    
    // Use the new mockDatabase functions for state initialization
    const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
        const users = getRegisteredUsers();
        return ensureTestUserExists(users); // Ensure our test user is always there
    });
    const [messages, setMessages] = useState<Message[]>(getMessages);

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
        const savedData = localStorage.getItem('vocalAiSession');
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
                localStorage.removeItem('vocalAiSession');
            }
        } else {
            setPage(Page.Home);
        }
    }, []);

    useEffect(() => {
        if (user) {
            try {
                const dataToSave = {
                    user,
                    selectedLanguageId: selectedLanguage?.id,
                    userProgress,
                };
                localStorage.setItem('vocalAiSession', JSON.stringify(dataToSave));
            } catch (error) {
                console.error("Failed to save session to localStorage", error);
            }
        }
    }, [user, selectedLanguage, userProgress]);
    
    // Persist settings
    useEffect(() => {
        localStorage.setItem('vocalAiSettings', JSON.stringify(appSettings));
    }, [appSettings]);


    // Persist registered users and messages using the new service functions
    useEffect(() => {
        saveRegisteredUsers(registeredUsers);
    }, [registeredUsers]);

    useEffect(() => {
        saveMessages(messages);
    }, [messages]);


    const updateQuestProgress = useCallback((updates: { type: 'xp' | 'lesson' | 'practice' | 'perfect_lesson', amount: number }[]) => {
        // ... existing quest logic
    }, [user, selectedLanguage]);


    useEffect(() => {
        // ... existing quest reset logic
    }, [user, selectedLanguage, userProgress]);
    
    const handleSelectLanguage = useCallback((language: Language) => {
        if (!user) {
            // New user flow: set choice and open auth modal
            setLanguageChoiceForOnboarding(language);
            setIsAuthModalOpen(true);
        } else {
            // Logged-in user is selecting a language
            setSelectedLanguage(language);
            const langProgress = userProgress[language.id];
    
            // If progress for this language doesn't exist, create it.
            if (!langProgress) {
                 setUserProgress(prev => ({
                    ...prev,
                    [language.id]: { xp: 0, streak: 0, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Bronze, unlockedAchievements: [], practiceSessions: 0, perfectLessons: 0, activityLog: [], flashcardDecks: [] }
                }));
            }
            // ALWAYS go to the dashboard for a logged-in user.
            // The dashboard will correctly display their progress (or lack thereof) for the selected language.
            setPage(Page.Dashboard);
        }
    }, [user, userProgress]);

    const handleCompleteOnboarding = useCallback((startWithTest: boolean) => {
        if(startWithTest) {
            setPage(Page.LivePlacementTest);
        } else {
            setPage(Page.Dashboard);
        }
    }, []);


    const handleNavigate = useCallback((targetPage: Page) => {
        setIsNavOpen(false); // Close nav on navigation
        if (!user && [Page.Profile, Page.Leaderboard, Page.Quests, Page.Achievements, Page.Settings, Page.Friends, Page.Messages, Page.FlashcardDecks].includes(targetPage)) {
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
    
    const handleStartFlashcardPractice = useCallback((deck: FlashcardDeck) => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        setPracticeMode('flashcards');
        setSelectedFlashcardDeck(deck);
        setPage(Page.PracticeSession);
    }, [user]);

    const handleEndPractice = useCallback(() => {
        if (user && selectedLanguage) {
            updateQuestProgress([{ type: 'practice', amount: 1 }]);
    
            const langId = selectedLanguage.id;
            setUserProgress(prev => {
                const currentLangProgress = prev[langId] || { xp: 0, streak: 0, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Bronze, unlockedAchievements: [], practiceSessions: 0, perfectLessons: 0, activityLog: [], flashcardDecks: [] };
                return {
                    ...prev,
                    [langId]: {
                        ...currentLangProgress,
                        practiceSessions: (currentLangProgress.practiceSessions ?? 0) + 1,
                    }
                }
            });
        }
        setPage(Page.PracticeHub);
    }, [user, selectedLanguage, updateQuestProgress]);

    const handleCompleteLesson = useCallback((xpGained: number, newMistakes: MistakeItem[], newVocabulary: Omit<VocabularyItem, 'nextReview' | 'interval'>[], isPerfect: boolean) => {
        if (!user || !selectedLanguage || !selectedTopic) return;
        const langId = selectedLanguage.id;
    
        // Use functional updates to ensure atomicity and avoid stale state.
        setUserProgress(prevUserProgress => {
            const currentProgress = prevUserProgress[langId];
    
            // Update mistakes
            const existingMistakeQuestions = new Set(currentProgress.mistakes.map(m => m.question));
            const uniqueNewMistakes = newMistakes.filter(m => !existingMistakeQuestions.has(m.question));
            const combinedMistakes = [...currentProgress.mistakes, ...uniqueNewMistakes];
            const prunedMistakes = combinedMistakes.slice(-MISTAKE_LIMIT);
    
            // Update vocabulary
            const existingVocabularyWords = new Set(currentProgress.learnedVocabulary.map(v => v.word));
            const uniqueNewVocabulary = newVocabulary
                .filter(v => !existingVocabularyWords.has(v.word))
                .map(v => ({
                    ...v,
                    nextReview: new Date().toISOString(),
                    interval: 1,
                }));
                
            const perfectLessonCount = (currentProgress.perfectLessons ?? 0) + (isPerfect ? 1 : 0);
    
            const updatedLangProgress: UserProgress = {
                ...currentProgress,
                xp: currentProgress.xp + xpGained,
                completedTopics: [...new Set([...currentProgress.completedTopics, selectedTopic.id])],
                mistakes: prunedMistakes,
                learnedVocabulary: [...currentProgress.learnedVocabulary, ...uniqueNewVocabulary],
                perfectLessons: perfectLessonCount,
            };
    
            const newTotalProgress = { ...prevUserProgress, [langId]: updatedLangProgress };
    
            // Sync with registeredUsers immediately within the same state update cycle.
            setRegisteredUsers(prevRegisteredUsers => 
                prevRegisteredUsers.map(ru => {
                    if (ru.user.email === user.email) {
                        return { ...ru, progress: newTotalProgress };
                    }
                    return ru;
                })
            );
            
            return newTotalProgress; // Return the new state for setUserProgress
        });
    
        setPage(Page.Dashboard);
    
        const questUpdates: { type: 'xp' | 'lesson' | 'practice' | 'perfect_lesson', amount: number }[] = [
            { type: 'xp', amount: xpGained },
            { type: 'lesson', amount: 1 },
        ];
        if (isPerfect) {
            questUpdates.push({ type: 'perfect_lesson', amount: 1 });
        }
        updateQuestProgress(questUpdates);
    
    }, [user, selectedLanguage, selectedTopic, updateQuestProgress]);
    
    const handleChangeLanguage = useCallback(() => {
        setSelectedLanguage(null);
        setPage(Page.LanguageSelection);
        setIsNavOpen(false);
    }, []);
    
    const handleAuthSuccess = (authedUser: RegisteredUser, isNewUser: boolean) => {
        if (isNewUser) {
            setRegisteredUsers(prev => [...prev, authedUser]);
        }

        setIsAuthModalOpen(false);
        setUser(authedUser.user);
        setUserProgress(authedUser.progress);

        if (languageChoiceForOnboarding) {
            const language = languageChoiceForOnboarding;
            setSelectedLanguage(language);
            setLanguageChoiceForOnboarding(null); 

            const langProgress = authedUser.progress[language.id];

            if (!langProgress) {
                setUserProgress(prev => ({
                    ...prev,
                    [language.id]: { xp: 0, streak: 0, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Bronze, unlockedAchievements: [], practiceSessions: 0, perfectLessons: 0, activityLog: [], flashcardDecks: [] }
                }));
                setPage(Page.Onboarding);
            } else if (langProgress.completedTopics.length === 0) {
                setPage(Page.Onboarding);
            } else {
                setPage(Page.Dashboard);
            }
        }
    };

    const handleLogout = useCallback(() => {
        localStorage.removeItem('vocalAiSession');
        setUser(null);
        setUserProgress({});
        setSelectedLanguage(null);
        setPage(Page.Home);
        setIsNavOpen(false);
        // Add Google Sign-Out logic to prevent auto-relogin
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            google.accounts.id.disableAutoSelect();
        }
    }, []);
    
    const handleUpdateMistakes = (mistakes: MistakeItem[]) => {
        // ... existing mistake update logic
    }
    
    const handleUpdateVocabularyReview = useCallback((word: string, performance: 'again' | 'good' | 'easy') => {
        // ... existing vocab update logic
    }, [selectedLanguage]);

    const handleUpdateFlashcardDecks = useCallback((decks: FlashcardDeck[]) => {
        if (!user || !selectedLanguage) return;
        const langId = selectedLanguage.id;
        setUserProgress(prev => ({
            ...prev,
            [langId]: {
                ...prev[langId],
                flashcardDecks: decks,
            }
        }));
    }, [user, selectedLanguage]);

    const handleSkipPlacementTest = useCallback(() => {
        setPage(Page.Dashboard);
    }, []);

    const handleCompletePlacementTest = useCallback((completedTopics: string[]) => {
        if (selectedLanguage) {
            const xpGained = completedTopics.length * 10;
            setUserProgress(prev => ({
                ...prev,
                [selectedLanguage.id]: {
                    ...(prev[selectedLanguage.id] || { xp: 0, streak: 0, completedTopics: [], mistakes: [], learnedVocabulary: [], league: LeagueTier.Bronze, unlockedAchievements: [], practiceSessions: 0, perfectLessons: 0, activityLog: [], flashcardDecks: [] }),
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
        const currentUserEmail = user?.email;
        if (!currentUserEmail) return;
    
        // Update the session user state using a functional update
        setUser(prevUser => ({ ...prevUser!, ...updatedUser }));
    
        // Update the master list of users using a functional update to prevent stale state
        setRegisteredUsers(prevRegisteredUsers => 
            prevRegisteredUsers.map(ru => {
                if (ru.user.email === currentUserEmail) {
                    // Merge with the user object from the PREVIOUS state (`ru.user`), not a stale closure.
                    const updatedRuUser = { ...ru.user, ...updatedUser };
                    return { ...ru, user: updatedRuUser };
                }
                return ru;
            })
        );
    }, [user?.email]);

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
                    const updatedFriends = [...(ru.friends || []), fromEmail];
                    const updatedRequests = (ru.friendRequests || []).filter(req => req.from !== fromEmail);
                    return { ...ru, friends: updatedFriends, friendRequests: updatedRequests };
                }
                // Add current user to the sender's friend list
                if (ru.user.email === fromEmail) {
                    const updatedFriends = [...(ru.friends || []), currentUserEmail];
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
        if (!user && (page !== Page.LanguageSelection)) {
             // If user is logged out, but not on the language selection page, force them there.
             // This avoids getting stuck on a page that requires a user.
            if(![Page.Home, Page.About, Page.Features, Page.Testimonials].includes(page)) {
                 setPage(Page.LanguageSelection);
                 return null;
            }
        }

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
                    return <PracticeHubPage language={selectedLanguage} progress={currentProgress} user={user} onStartPractice={handleStartPractice} onNavigate={handleNavigate} />;
                }
                break;
             case Page.PracticeSession:
                if (selectedLanguage && practiceMode) {
                    return <PracticeSessionPage mode={practiceMode} language={selectedLanguage} progress={currentProgress} onEndPractice={handleEndPractice} onUpdateMistakes={handleUpdateMistakes} onUpdateVocabularyReview={handleUpdateVocabularyReview} selectedFlashcardDeck={selectedFlashcardDeck} onUpdateFlashcardDecks={handleUpdateFlashcardDecks} />;
                }
                break;
            case Page.FlashcardDecks:
                if (selectedLanguage && currentProgress) {
                    return <FlashcardDecksPage language={selectedLanguage} progress={currentProgress} onUpdateDecks={handleUpdateFlashcardDecks} onStartPractice={handleStartFlashcardPractice} onBack={() => setPage(Page.PracticeHub)} />;
                }
                break;
            case Page.Profile:
                return <ProfilePage user={user} userProgress={userProgress} languages={LANGUAGES} onUpdateUser={handleUpdateUser} />;
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
                return <SettingsPage appSettings={appSettings} onUpdateSettings={handleUpdateSettings} onLogout={handleLogout} />;
            case Page.Help:
                return <HelpPage />;
            case Page.About:
                return <AboutPage onBack={() => setPage(Page.Home)} />;
            case Page.Features:
                return <FeaturesPage onBack={() => setPage(Page.Home)} />;
            case Page.Testimonials:
                return <TestimonialsPage onBack={() => setPage(Page.Home)} />;
            default:
                 // Fallback for any unhandled page state
                break;
        }
        
        // If a page requires a selected language but none is present, redirect to language selection.
        if (user) {
            setPage(Page.LanguageSelection);
        }
        return null;
    };
    
    if (page === Page.Home) {
        return <HomePage onGetStarted={() => setPage(Page.LanguageSelection)} onNavigate={(p) => setPage(p)} />;
    }

    const isMainView = [Page.Dashboard, Page.PracticeHub, Page.PracticeSession, Page.Profile, Page.Leaderboard, Page.Dictionary, Page.Quests, Page.Achievements, Page.Settings, Page.Help, Page.Friends, Page.Messages, Page.FlashcardDecks].includes(page);
    const currentProgress = selectedLanguage ? userProgress[selectedLanguage.id] : null;

    return (
        <div className="min-h-screen transition-colors duration-500">
            {isMainView && <StaggeredMenu user={user} currentPage={page} onNavigate={handleNavigate} onChangeLanguage={handleChangeLanguage} onLogout={handleLogout} friendRequestCount={friendRequestCount} unreadMessageCount={unreadMessageCount} isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />}
            
            <div className="flex flex-col min-h-screen">
                {isMainView && <Header page={page} user={user} progress={currentProgress} selectedLanguage={selectedLanguage} onChangeLanguage={handleChangeLanguage} onOpenNav={() => setIsNavOpen(true)}/>}
                <main className={isMainView ? "flex-grow p-4 sm:p-6" : "container mx-auto max-w-7xl"}>
                    <div key={`${page}-${practiceMode}`} className="animate-fade-in">
                        {renderPageContent()}
                    </div>
                </main>
            </div>
            
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