// FIX: Add react import to ensure JSX global types are loaded.
// import 'react';

// FIX: Removed circular dependency import from './constants'.
// FIX: Defined types locally and exported them.

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

export interface Quest {
    id: string;
    title: string;
    type: 'xp' | 'lesson' | 'practice' | 'perfect_lesson';
    target: number;
    reward: number;
}

export enum AchievementTier {
    Bronze = 'Bronze',
    Silver = 'Silver',
    Gold = 'Gold',
}

export interface Achievement {
    id:string;
    title: string;
    description: string;
    tier: AchievementTier;
    check: (p: UserProgress, all?: Record<string, UserProgress>) => boolean;
}

export interface MonthlyChallenge {
    id: string;
    title: string;
    description: string;
    target: number;
    icon: string;
}

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
    cefrLevel: string;
    phrase: string;
    units: Unit[];
}

export interface Path {
    id: string;
    title: string;
    sections: Section[];
}


// --- TYPE DEFINITIONS ---
// The following types are inferred from their usage across the application components.

export enum Page {
    Home = 'home',
    LanguageSelection = 'language-selection',
    Onboarding = 'onboarding',
    Dashboard = 'dashboard',
    Lesson = 'lesson',
    PracticeHub = 'practice-hub',
    PracticeSession = 'practice-session',
    Dictionary = 'dictionary',
    Quests = 'quests',
    Achievements = 'achievements',
    Settings = 'settings',
    Help = 'help',
    About = 'about',
    LivePlacementTest = 'live-placement-test',
    Friends = 'friends',
    Messages = 'messages',
    Leaderboard = 'leaderboard',
    Profile = 'profile',
    FlashcardDecks = 'flashcard-decks',
    Features = 'features',
    Testimonials = 'testimonials',
}

export type PracticeMode = 'conversation' | 'listening' | 'mistakes' | 'vocabulary' | 'stories' | 'pronunciation' | 'roleplay' | 'writing' | 'flashcards';

export interface Flashcard {
  front: string;
  back: string;
  exampleSentence?: string;
  // SRS Properties
  nextReview: string; // ISO String
  interval: number; // in days
  easeFactor: number; // SM-2 algorithm component
}

export interface FlashcardDeck {
  id: string; // uuid
  title: string;
  cards: Flashcard[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    joinDate: string;
    bio?: string;
    isPro?: boolean;
}

export interface MistakeItem {
    question: string;
    correctAnswer: string;
    topicId: string;
}

export interface VocabularyItem {
    word: string;
    translation: string;
    pronunciation: string;
    nextReview: string;
    interval: number;
}

export interface QuestProgress {
    questId: string;
    current: number;
    completed: boolean;
}

export interface QuestData {
    lastReset: string;
    activeQuests: QuestProgress[];
    completedTodayCount: number;
}

export enum LeagueTier {
    Bronze = 'Bronze',
    Silver = 'Silver',
    Gold = 'Gold',
}

export interface UserProgress {
  xp: number;
  streak: number;
  completedTopics: string[];
  mistakes: MistakeItem[];
  learnedVocabulary: VocabularyItem[];
  league: LeagueTier;
  unlockedAchievements: string[];
  practiceSessions: number;
  perfectLessons: number;
  activityLog: { date: string; xp: number }[];
  quests?: QuestData;
  completedMonthlyChallenges?: string[];
  flashcardDecks: FlashcardDeck[];
}

export interface RegisteredUser {
    user: User;
    progress: Record<string, UserProgress>;
    friends: string[]; // array of emails
    friendRequests: { from: string; status: 'pending' }[];
}

export type Theme = 'light' | 'dark' | 'system';

export interface AppSettings {
    theme: Theme;
    soundEffectsEnabled: boolean;
}

export interface Message {
    id: string;
    from: string; // email
    to: string; // email
    content: string;
    timestamp: string; // ISO string
    read: boolean;
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

export interface Story {
    id: string;
    title: string;
    content: string;
    level: 'beginner' | 'intermediate' | 'advanced';
}

export interface DictionaryEntry {
    word: string;
    translation: string;
    pronunciation: string;
    definition: string;
    exampleSentence: string;
    exampleTranslation: string;
}

export interface ChatMessage {
    author: 'user' | 'ai' | 'system';
    content: string;
    correction?: string | null;
}

export interface ChatResponse {
    reply: string;
    correction: string | null;
}

export interface PronunciationFeedback {
    score: number;
    feedback: string;
}

export interface PlacementTestQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    difficulty: string; // A1, A2, etc.
}

export interface PlacementTestResult {
    completedTopics: string[];
    summary: string;
}

export interface WritingFeedback {
    score: number;
    summary: string;
    suggestions: string[];
}

export interface VisionFeedback {
    feedback: string;
    correction: string | null;
}

export interface GrammarTip {
    tip: string;
    explanation: string;
    example: string;
}
