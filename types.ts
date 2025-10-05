export enum Page {
    LanguageSelection,
    Dashboard,
    Lesson
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
}

export interface Quiz {
    question: string;
    options: string[];
    correctAnswer: string;
    type: 'translate' | 'fill-in-the-blank' | 'multiple-choice';
}

export interface LessonContent {
    topic: string;
    vocabulary: VocabularyItem[];
    examples: string[];
    quiz: Quiz;
}

export interface Feedback {
    isCorrect: boolean;
    explanation: string;
    suggestion?: string;
}

export interface UserProgress {
    xp: number;
    streak: number;
    completedTopics: string[];
    lastCompletedDate?: string;
}