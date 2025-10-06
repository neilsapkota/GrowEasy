export enum Page {
    Home,
    LanguageSelection,
    Dashboard,
    Lesson,
    PracticeHub,
    PracticeSession,
    Profile,
    Leaderboard,
    Dictionary,
}

export interface User {
    name: string;
    avatarUrl: string;
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
    type: 'xp' | 'lesson' | 'practice';
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
    };
    unlockedAchievements?: string[];
    practiceSessions?: number;
    perfectLessons?: number;
}

export interface Story {
    id: string;
    title: string;
    content: string;
    level: string;
}

export interface RegisteredUser {
    user: User;
    progress: Record<string, UserProgress>;
}

export type PracticeMode = 'conversation' | 'listening' | 'mistakes' | 'vocabulary' | 'stories';

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