import { Language, LessonTopic, Quest, Achievement, AchievementTier, UserProgress, MonthlyChallenge, Path } from './types';

export const LANGUAGES: Language[] = [
    { id: 'es', name: 'Spanish', flag: '🇪🇸' },
    { id: 'fr', name: 'French', flag: '🇫🇷' },
    { id: 'de', name: 'German', flag: '🇩🇪' },
    { id: 'it', name: 'Italian', flag: '🇮🇹' },
    { id: 'jp', name: 'Japanese', flag: '🇯🇵' },
    { id: 'kr', name: 'Korean', flag: '🇰🇷' },
    { id: 'cn', name: 'Mandarin', flag: '🇨🇳' },
    { id: 'in', name: 'Hindi', flag: '🇮🇳' },
    { id: 'sa', name: 'Arabic', flag: '🇸🇦' },
    { id: 'bd', name: 'Bengali', flag: '🇧🇩' },
    { id: 'ru', name: 'Russian', flag: '🇷🇺' },
    { id: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { id: 'pk', name: 'Urdu', flag: '🇵🇰' },
    { id: 'id', name: 'Indonesian', flag: '🇮🇩' },
    { id: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { id: 'tr', name: 'Turkish', flag: '🇹🇷' },
    { id: 'vn', name: 'Vietnamese', flag: '🇻🇳' },
    { id: 'th', name: 'Thai', flag: '🇹🇭' },
    { id: 'pl', name: 'Polish', flag: '🇵🇱' },
    { id: 'ro', name: 'Romanian', flag: '🇷🇴' },
    { id: 'gr', name: 'Greek', flag: '🇬🇷' },
    { id: 'se', name: 'Swedish', flag: '🇸🇪' },
    { id: 'no', name: 'Norwegian', flag: '🇳🇴' },
    { id: 'dk', name: 'Danish', flag: '🇩🇰' },
    { id: 'fi', name: 'Finnish', flag: '🇫🇮' },
    { id: 'il', name: 'Hebrew', flag: '🇮🇱' },
    { id: 'ke', name: 'Swahili', flag: '🇰🇪' },
    { id: 'cz', name: 'Czech', flag: '🇨🇿' },
    { id: 'hu', name: 'Hungarian', flag: '🇭🇺' },
    { id: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
    { id: 'hr', name: 'Croatian', flag: '🇭🇷' },
    { id: 'ua', name: 'Ukrainian', flag: '🇺🇦' },
    { id: 'sk', name: 'Slovak', flag: '🇸🇰' },
];

export const LESSON_TOPICS: LessonTopic[] = [
    // Original Topics
    { id: 'greetings', title: 'Greetings', icon: '👋' },
    { id: 'family', title: 'Family', icon: '👨‍👩‍👧‍👦' },
    { id: 'food', title: 'Food', icon: '🍕' },
    { id: 'travel', title: 'Travel', icon: '✈️' },
    { id: 'hobbies', title: 'Hobbies', icon: '🎨' },
    { id: 'work', title: 'Work', icon: '💼' },
    { id: 'shopping', title: 'Shopping', icon: '🛍️' },
    { id: 'directions', title: 'Directions', icon: '🗺️' },
    { id: 'weather', title: 'Weather', icon: '☀️' },
    { id: 'health', title: 'Health', icon: '🩺' },
    { id: 'emotions', title: 'Emotions', icon: '😊' },
    { id: 'tech', title: 'Technology', icon: '💻' },
    { id: 'home', title: 'Home', icon: '🏠' },
    { id: 'school', title: 'School', icon: '🏫' },
    { id: 'culture', title: 'Culture', icon: '🎭' },
    { id: 'nature', title: 'Nature', icon: '🌳' },
    { id: 'future', title: 'Future Tense', icon: '🔮' },
    { id: 'past', title: 'Past Tense', icon: '📜' },
    // New Topics
    { id: 'present_tense', title: 'Present Tense', icon: '🏃‍♀️' },
    { id: 'adjectives', title: 'Adjectives', icon: '✨' },
    { id: 'questions', title: 'Questions', icon: '❓' },
    { id: 'numbers', title: 'Numbers', icon: '🔢' },
    { id: 'clothing', title: 'Clothing', icon: '👕' },
    { id: 'animals', title: 'Animals', icon: '🐶' },
    { id: 'body_parts', title: 'Body Parts', icon: '💪' },
    { id: 'city', title: 'The City', icon: '🏙️' },
    { id: 'present_continuous', title: 'Present Continuous', icon: '🕺' },
    { id: 'possessives', title: 'Possessives', icon: '🤝' },
    { id: 'prepositions', title: 'Prepositions', icon: '👉' },
    { id: 'conjunctions', title: 'Conjunctions', icon: '🔗' },
    { id: 'conditional', title: 'Conditional', icon: '🤔' },
    { id: 'subjunctive', title: 'Subjunctive', icon: '🤯' },
    { id: 'idioms', title: 'Idioms', icon: '🤪' },
    { id: 'opinions', title: 'Opinions', icon: '💬' },
    { id: 'environment', title: 'Environment', icon: '🌍' },
    { id: 'politics', title: 'Politics', icon: '🏛️' },
    { id: 'history', title: 'History', icon: '🏺' },
    { id: 'media', title: 'Media', icon: '📺' },
    { id: 'finance', title: 'Finance', icon: '💰' },
    { id: 'science', title: 'Science', icon: '🔬' },
];

const colors = {
    green: { bg: 'bg-green-500', border: 'border-green-700', text: 'text-green-700', shadow: 'shadow-green-500/50' },
    sky: { bg: 'bg-sky-500', border: 'border-sky-700', text: 'text-sky-700', shadow: 'shadow-sky-500/50' },
    rose: { bg: 'bg-rose-500', border: 'border-rose-700', text: 'text-rose-700', shadow: 'shadow-rose-500/50' },
    amber: { bg: 'bg-amber-500', border: 'border-amber-700', text: 'text-amber-700', shadow: 'shadow-amber-500/50' },
    purple: { bg: 'bg-purple-500', border: 'border-purple-700', text: 'text-purple-700', shadow: 'shadow-purple-500/50' },
    fuchsia: { bg: 'bg-fuchsia-500', border: 'border-fuchsia-700', text: 'text-fuchsia-700', shadow: 'shadow-fuchsia-500/50' },
    cyan: { bg: 'bg-cyan-500', border: 'border-cyan-700', text: 'text-cyan-700', shadow: 'shadow-cyan-500/50' },
    lime: { bg: 'bg-lime-500', border: 'border-lime-700', text: 'text-lime-700', shadow: 'shadow-lime-500/50' },
    teal: { bg: 'bg-teal-500', border: 'border-teal-700', text: 'text-teal-700', shadow: 'shadow-teal-500/50' },
    orange: { bg: 'bg-orange-500', border: 'border-orange-700', text: 'text-orange-700', shadow: 'shadow-orange-500/50' },
    indigo: { bg: 'bg-indigo-500', border: 'border-indigo-700', text: 'text-indigo-700', shadow: 'shadow-indigo-500/50' },
    pink: { bg: 'bg-pink-500', border: 'border-pink-700', text: 'text-pink-700', shadow: 'shadow-pink-500/50' }
};

export const LEARNING_PATH: Path = {
    id: 'main-path',
    title: 'Your Learning Path',
    sections: [
        {
            sectionNumber: 1,
            title: "The Absolute Basics",
            cefrLevel: "A1",
            phrase: "Hello! My name is...",
            units: [
                { unitNumber: 1, title: "Greetings & Introductions", lessons: [{ id: 'greetings', title: 'Greetings', icon: '👋' }], color: colors.green },
                { unitNumber: 2, title: "Numbers & Counting", lessons: [{ id: 'numbers', title: 'Numbers', icon: '🔢' }], color: colors.sky },
                { unitNumber: 3, title: "Common Questions", lessons: [{ id: 'questions', title: 'Questions', icon: '❓' }], color: colors.rose },
            ]
        },
        {
            sectionNumber: 2,
            title: "People & Things",
            cefrLevel: "A1",
            phrase: "This is my family.",
            units: [
                { unitNumber: 4, title: "Family & Friends", lessons: [{ id: 'family', title: 'Family', icon: '👨‍👩‍👧‍👦' }], color: colors.amber },
                { unitNumber: 5, title: "Describing Things", lessons: [{ id: 'adjectives', title: 'Adjectives', icon: '✨' }], color: colors.purple },
                { unitNumber: 6, title: "Animals & Pets", lessons: [{ id: 'animals', title: 'Animals', icon: '🐶' }], color: colors.fuchsia },
            ]
        },
        {
            sectionNumber: 3,
            title: "Daily Life",
            cefrLevel: "A2",
            phrase: "I am eating a pizza.",
            units: [
                { unitNumber: 7, title: "Food & Drink", lessons: [{ id: 'food', title: 'Food', icon: '🍕' }], color: colors.cyan },
                { unitNumber: 8, title: "Clothing & Shopping", lessons: [{ id: 'clothing', title: 'Clothing', icon: '👕' }, { id: 'shopping', title: 'Shopping', icon: '🛍️' }], color: colors.lime },
                { unitNumber: 9, title: "Basic Verbs", lessons: [{ id: 'present_tense', title: 'Present Tense', icon: '🏃‍♀️' }], color: colors.teal },
                { unitNumber: 10, title: "Present Action", lessons: [{ id: 'present_continuous', title: 'Present Continuous', icon: '🕺' }], color: colors.orange },
            ]
        },
        {
            sectionNumber: 4,
            title: "Out and About",
            cefrLevel: "A2",
            phrase: "Where is the train station?",
            units: [
                { unitNumber: 11, title: "Places in the City", lessons: [{ id: 'city', title: 'The City', icon: '🏙️' }], color: colors.indigo },
                { unitNumber: 12, title: "Hobbies & Activities", lessons: [{ id: 'hobbies', title: 'Hobbies', icon: '🎨' }], color: colors.pink },
                { unitNumber: 13, title: "Giving Directions", lessons: [{ id: 'directions', title: 'Directions', icon: '🗺️' }], color: colors.green },
                { unitNumber: 14, title: "My Things", lessons: [{ id: 'possessives', title: 'Possessives', icon: '🤝' }], color: colors.sky },
            ]
        },
        {
            sectionNumber: 5,
            title: "Expanding Vocabulary",
            cefrLevel: "B1",
            phrase: "The weather is sunny today.",
            units: [
                { unitNumber: 15, title: "My Home", lessons: [{ id: 'home', title: 'Home', icon: '🏠' }], color: colors.rose },
                { unitNumber: 16, title: "Weather Talk", lessons: [{ id: 'weather', title: 'Weather', icon: '☀️' }], color: colors.amber },
                { unitNumber: 17, title: "Body & Health", lessons: [{ id: 'body_parts', title: 'Body Parts', icon: '💪' }, { id: 'health', title: 'Health', icon: '🩺' }], color: colors.purple },
                { unitNumber: 18, title: "School & Work", lessons: [{ id: 'school', title: 'School', icon: '🏫' }, { id: 'work', title: 'Work', icon: '💼' }], color: colors.fuchsia },
            ]
        },
        {
            sectionNumber: 6,
            title: "Talking About Time",
            cefrLevel: "B1",
            phrase: "Yesterday, I went to the park.",
            units: [
                { unitNumber: 19, title: "The Past", lessons: [{ id: 'past', title: 'Past Tense', icon: '📜' }], color: colors.cyan },
                { unitNumber: 20, title: "The Future", lessons: [{ id: 'future', title: 'Future Tense', icon: '🔮' }], color: colors.lime },
                { unitNumber: 21, title: "Connecting Ideas", lessons: [{ id: 'prepositions', title: 'Prepositions', icon: '👉' }, { id: 'conjunctions', title: 'Conjunctions', icon: '🔗' }], color: colors.teal },
                { unitNumber: 22, title: "Exploring Travel", lessons: [{ id: 'travel', title: 'Travel', icon: '✈️' }], color: colors.orange },
            ]
        },
        {
            sectionNumber: 7,
            title: "Complex Thoughts",
            cefrLevel: "B2",
            phrase: "If I had more time, I would travel.",
            units: [
                { unitNumber: 23, title: "Opinions & Emotions", lessons: [{ id: 'opinions', title: 'Opinions', icon: '💬' }, { id: 'emotions', title: 'Emotions', icon: '😊' }], color: colors.indigo },
                { unitNumber: 24, title: "Technology & Media", lessons: [{ id: 'tech', title: 'Technology', icon: '💻' }, { id: 'media', title: 'Media', icon: '📺' }], color: colors.pink },
                { unitNumber: 25, title: "What If?", lessons: [{ id: 'conditional', title: 'Conditional', icon: '🤔' }], color: colors.green },
                { unitNumber: 26, title: "Nature & Environment", lessons: [{ id: 'nature', title: 'Nature', icon: '🌳' }, { id: 'environment', title: 'Environment', icon: '🌍' }], color: colors.sky },
            ]
        },
        {
            sectionNumber: 8,
            title: "Advanced Topics",
            cefrLevel: "B2/C1",
            phrase: "It is important that we understand culture.",
            units: [
                { unitNumber: 27, title: "Culture & History", lessons: [{ id: 'culture', title: 'Culture', icon: '🎭' }, { id: 'history', title: 'History', icon: '🏺' }], color: colors.rose },
                { unitNumber: 28, title: "Money & Finance", lessons: [{ id: 'finance', title: 'Finance', icon: '💰' }], color: colors.amber },
                { unitNumber: 29, title: "Science & Politics", lessons: [{ id: 'science', title: 'Science', icon: '🔬' }, { id: 'politics', title: 'Politics', icon: '🏛️' }], color: colors.purple },
                { unitNumber: 30, title: "Advanced Moods", lessons: [{ id: 'subjunctive', title: 'Subjunctive', icon: '🤯' }, { id: 'idioms', title: 'Idioms', icon: '🤪' }], color: colors.fuchsia },
            ]
        }
    ]
};


export const XP_PER_CORRECT_ANSWER = 10;

export const DAILY_QUESTS: Quest[] = [
  { id: 'earn_10_xp', title: 'Earn 10 XP', type: 'xp', target: 10, reward: 5 },
  { id: 'earn_30_xp', title: 'Earn 30 XP', type: 'xp', target: 30, reward: 15 },
  { id: 'complete_1_lesson', title: 'Complete 1 lesson', type: 'lesson', target: 1, reward: 10 },
  { id: 'complete_2_lessons', title: 'Complete 2 lessons', type: 'lesson', target: 2, reward: 20 },
  { id: 'practice_1_session', title: 'Finish a practice session', type: 'practice', target: 1, reward: 15 },
  { id: 'perfect_lesson_1', title: 'Score 100% in 1 lesson', type: 'perfect_lesson', target: 1, reward: 25 },
];

export const ACHIEVEMENTS: Achievement[] = [
    // XP Achievements
    { id: 'xp_100', title: 'XP Collector', description: 'Earn 100 XP in a language.', tier: AchievementTier.Bronze, check: (p) => p.xp >= 100 },
    { id: 'xp_500', title: 'XP Enthusiast', description: 'Earn 500 XP in a language.', tier: AchievementTier.Silver, check: (p) => p.xp >= 500 },
    { id: 'xp_1000', title: 'XP Master', description: 'Earn 1000 XP in a language.', tier: AchievementTier.Gold, check: (p) => p.xp >= 1000 },
    // Streak Achievements
    { id: 'streak_3', title: 'On a Roll', description: 'Maintain a 3-day streak.', tier: AchievementTier.Bronze, check: (p) => p.streak >= 3 },
    { id: 'streak_7', title: 'Fire Starter', description: 'Maintain a 7-day streak.', tier: AchievementTier.Silver, check: (p) => p.streak >= 7 },
    { id: 'streak_14', title: 'Unstoppable', description: 'Maintain a 14-day streak.', tier: AchievementTier.Gold, check: (p) => p.streak >= 14 },
    // Lesson Achievements
    { id: 'lessons_1', title: 'First Steps', description: 'Complete your first lesson.', tier: AchievementTier.Bronze, check: (p) => p.completedTopics.length >= 1 },
    { id: 'lessons_5', title: 'Bookworm', description: 'Complete 5 different lessons.', tier: AchievementTier.Silver, check: (p) => p.completedTopics.length >= 5 },
    { id: 'lessons_all_unit1', title: 'Unit 1 Graduate', description: 'Complete all lessons in Unit 1.', tier: AchievementTier.Gold, check: (p) => {
        const unit1 = LEARNING_PATH.sections.flatMap(s => s.units).find(u => u.unitNumber === 1);
        if (!unit1) return false;
        return unit1.lessons.every(l => p.completedTopics.includes(l.id));
      }
    },
    // Practice Achievements
    { id: 'practice_1', title: 'Practice Makes Perfect', description: 'Complete a practice session.', tier: AchievementTier.Bronze, check: (p) => (p.practiceSessions ?? 0) >= 1 },
    { id: 'practice_10', title: 'Dedicated Learner', description: 'Complete 10 practice sessions.', tier: AchievementTier.Silver, check: (p) => (p.practiceSessions ?? 0) >= 10 },
    // Perfectionist
    { id: 'perfect_lesson_1', title: 'Perfectionist', description: 'Get a perfect score in a lesson without any mistakes.', tier: AchievementTier.Silver, check: (p) => (p.perfectLessons ?? 0) >= 1 },
    // Global Achievement
    { id: 'polyglot_starter', title: 'Language Explorer', description: 'Start learning a second language.', tier: AchievementTier.Silver, check: (p, all) => Object.keys(all).filter(langId => all[langId].xp > 0).length >= 2 },
];

export const MONTHLY_CHALLENGES: MonthlyChallenge[] = [
    { id: '2024-07', title: 'July Challenge', description: 'Complete 30 quests this month.', target: 30, icon: '☀️' },
    { id: '2024-08', title: 'August Adventure', description: 'Earn 1000 XP this month.', target: 1000, icon: '🏕️' },
    { id: '2024-09', title: 'September Scholar', description: 'Complete 15 perfect lessons.', target: 15, icon: '🍎' },
];