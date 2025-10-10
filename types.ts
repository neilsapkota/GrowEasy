
export enum Page {
    Home,
    LanguageSelection,
    Onboarding, // New page for new user setup
    LivePlacementTest,
    Dashboard,
    Lesson,
    PracticeHub,
    PracticeSession,
    Profile,
    Leaderboard,
    Dictionary,
    Quests,
    Achievements,
    Settings,
    Help,
    Friends,
    Messages,
}

export interface User {
    name: string;
    email: string;
    avatarUrl: string;
    bio?: string;
}

export interface Language {
    id: string;
    name: string;
    flag: string;
}

export interface LessonTopic {
    id: string;
    title: string;
    icon: string;
}

export interface VocabularyItem {
    word: string;
    translation: string;
    pronunciation: string;
    nextReview: string; // ISO date string for next review
    interval: number; // Interval in days for next review
}

export interface Challenge {
    question: string;
    options: string[];
    correctAnswer: string;
    type: 'translate' | 'fill-in-the-blank' | 'multiple-choice';
}

export interface LessonContent {
    topic: string;
    vocabulary: Omit<VocabularyItem, 'nextReview' | 'interval'>[];
    challenges: Challenge[];
}

export interface Feedback {
    isCorrect: boolean;
    explanation: string;
    suggestion?: string;
}

export interface MistakeItem {
    question: string;
    correctAnswer: string;
    topicId: string;
}

export interface Quest {
    id: string;
    title: string;
    type: 'xp' | 'lesson' | 'practice' | 'perfect_lesson';
    target: number;
    reward: number; // in XP
}

export interface QuestProgress {
    questId: string;
    current: number;
    completed: boolean;
}

export enum LeagueTier {
    Bronze = 'Bronze',
    Silver = 'Silver',
    Gold = 'Gold',
    Diamond = 'Diamond',
}

export enum AchievementTier {
    Bronze = 'Bronze',
    Silver = 'Silver',
    Gold = 'Gold',
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    tier: AchievementTier;
    // The check function receives the progress for the current language, and the full progress object for all languages.
    check: (progress: UserProgress, allProgress: Record<string, UserProgress>) => boolean;
}

export interface MonthlyChallenge {
    id: string; // e.g., '2024-07'
    title: string;
    description: string;
    target: number; // e.g., 30 quests
    icon: string;
}

export interface Activity {
    id: string;
    timestamp: string; // ISO string
    description: string;
    icon: string; // emoji or icon component name
}

export interface UserProgress {
    xp: number;
    streak: number;
    completedTopics: string[];
    lastCompletedDate?: string;
    mistakes: MistakeItem[];
    learnedVocabulary: VocabularyItem[];
    league?: LeagueTier;
    quests?: {
        lastReset: string;
        activeQuests: QuestProgress[];
        completedTodayCount?: number;
    };
    unlockedAchievements?: string[];
    practiceSessions?: number;
    perfectLessons?: number;
    completedMonthlyChallenges?: string[]; // e.g., ['2024-06', '2024-07']
    activityLog: Activity[];
}

export interface Story {
    id: string;
    title: string;
    content: string;
    level: string;
}

export interface FriendRequest {
    from: string; // email of the user who sent the request
    status: 'pending';
}

export interface RegisteredUser {
    user: User; // The base user info
    password?: string; // Optional for Google sign-in users
    progress: Record<string, UserProgress>;
    friends: string[]; // array of user emails
    friendRequests?: FriendRequest[]; // array of incoming friend requests
}

export type PracticeMode = 'conversation' | 'listening' | 'mistakes' | 'vocabulary' | 'stories' | 'pronunciation' | 'roleplay' | 'writing' | 'vision';

export interface DictionaryEntry {
    word: string;
    translation: string;
    pronunciation: string;
    definition: string; // Definition in English
    exampleSentence: string; // Example in target language
    exampleTranslation: string; // Example translation in English
}

// Types for the new AI Conversation Practice
export interface ChatMessage {
    author: 'user' | 'ai' | 'system';
    content: string;
    correction?: string | null;
}

export interface ChatResponse {
    reply: string;
    correction: string | null;
}

// Types for Pronunciation Practice
export interface PronunciationFeedback {
    score: number;
    feedback: string;
}

// Types for Placement Test
export interface PlacementTestQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    difficulty: string; // e.g. A1, A2, B1
}

export interface PlacementTestResult {
    completedTopics: string[]; // e.g. ['greetings', 'family']
    summary: string;
}

// Settings
export type Theme = 'light' | 'dark' | 'system';

export interface AppSettings {
    theme: Theme;
    soundEffectsEnabled: boolean;
}

// Types for Writing Practice
export interface WritingFeedback {
    score: number; // Score out of 100
    summary: string; // A brief, positive summary.
    suggestions: string[]; // A list of specific suggestions for improvement.
}

// New types for structured learning path
export interface Unit {
    unitNumber: number;
    title: string;
    lessons: LessonTopic[];
    color: {
        bg: string;
        border: string;
        text: string;
        shadow: string;
    };
}

export interface Section {
    sectionNumber: number;
    title: string;
    units: Unit[];
    cefrLevel: string;
    phrase: string;
}

export interface Path {
    id: string;
    title: string;
    sections: Section[];
}

// New type for Vision Practice
export interface VisionFeedback {
    feedback: string;
    correction: string | null;
}

// New type for Messaging
export interface Message {
    id: string;
    from: string; // user email
    to: string; // user email
    content: string;
    timestamp: string; // ISO date string
    read: boolean;
}
