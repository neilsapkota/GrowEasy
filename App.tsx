import React, { useState, useCallback, useEffect } from 'react';
import LanguageSelectionPage from './components/LanguageSelectionPage';
import DashboardPage from './components/DashboardPage';
import LessonPage from './components/LessonPage';
import AuthModal from './components/AuthModal';
import { Page, User, Language, LessonTopic, UserProgress } from './types';
import { LANGUAGES } from './constants';

const App: React.FC = () => {
    const [page, setPage] = useState<Page>(Page.LanguageSelection);
    const [user, setUser] = useState<User | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<LessonTopic | null>(null);
    const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [pendingTopic, setPendingTopic] = useState<LessonTopic | null>(null);

    const handleSelectLanguage = useCallback((language: Language) => {
        setSelectedLanguage(language);
        // For logged-in users, ensure progress is initialized
        if (user && !userProgress[language.id]) {
            setUserProgress(prev => ({
                ...prev,
                [language.id]: { xp: 0, streak: 0, completedTopics: [] }
            }));
        }
        setPage(Page.Dashboard);
    }, [user, userProgress]);

    const handleStartLesson = useCallback((topic: LessonTopic, forceStart = false) => {
        if (!user && !forceStart) {
            setPendingTopic(topic);
            setIsAuthModalOpen(true);
        } else {
            setSelectedTopic(topic);
            setPage(Page.Lesson);
        }
    }, [user]);

    const handleCompleteLesson = useCallback((xpGained: number) => {
        if (user && selectedLanguage && selectedTopic) {
            setUserProgress(prev => {
                const langProgress = prev[selectedLanguage.id] || { xp: 0, streak: 0, completedTopics: [] };
                
                const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
                const lastCompleted = langProgress.lastCompletedDate;

                let newStreak = langProgress.streak;

                if (!lastCompleted) {
                    // First lesson ever for this language
                    newStreak = 1;
                } else {
                    const lastDate = new Date(lastCompleted);
                    const todayDate = new Date(today);
                    
                    const diffTime = todayDate.getTime() - lastDate.getTime();
                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        // Completed yesterday, increment streak
                        newStreak += 1;
                    } else if (diffDays > 1) {
                        // Streak broken, reset to 1
                        newStreak = 1;
                    }
                    // if diffDays is 0, streak remains the same for today.
                }

                return {
                    ...prev,
                    [selectedLanguage.id]: {
                        xp: langProgress.xp + xpGained,
                        streak: newStreak,
                        completedTopics: [...new Set([...langProgress.completedTopics, selectedTopic.id])],
                        lastCompletedDate: today, // Always update the last completed date
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

        // If a language is selected, initialize progress for it
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

    // Effect to handle pending actions after login
    useEffect(() => {
        if (user && pendingTopic) {
            handleStartLesson(pendingTopic, true); // Bypass auth check and start lesson
            setPendingTopic(null); // Clear the pending topic
        }
    }, [user, pendingTopic, handleStartLesson]);


    const renderPage = () => {
        const currentProgress = user && selectedLanguage ? userProgress[selectedLanguage.id] : null;

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
                            onChangeLanguage={handleChangeLanguage}
                            onLoginClick={() => setIsAuthModalOpen(true)}
                            onLogout={handleLogout}
                        />
                    );
                }
                // Fallback if state is inconsistent
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
                 // Fallback if state is inconsistent
                setPage(Page.Dashboard);
                return null;
            default:
                 setPage(Page.LanguageSelection);
                 return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-500">
            <main className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
                {renderPage()}
            </main>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => {
                    setIsAuthModalOpen(false);
                    setPendingTopic(null); // Clear pending action if user closes modal
                }}
                onLoginSuccess={handleLoginSuccess}
            />
        </div>
    );
};

export default App;