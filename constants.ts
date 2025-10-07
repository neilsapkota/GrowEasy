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
];

export const LEARNING_PATH: Path = {
    id: 'main-path',
    title: 'Your Learning Path',
    sections: [
        {
            sectionNumber: 1,
            title: "Foundations",
            cefrLevel: "A1",
            phrase: "Hello! How are you?",
            units: [
                {
                    unitNumber: 1,
                    title: "Basic Greetings",
                    lessons: [{ id: 'greetings', title: 'Greetings', icon: '👋' }],
                    color: { bg: 'bg-green-500', border: 'border-green-700', text: 'text-green-700', shadow: 'shadow-green-500/50' }
                },
                {
                    unitNumber: 2,
                    title: "People & Family",
                    lessons: [{ id: 'family', title: 'Family', icon: '👨‍👩‍👧‍👦' }],
                    color: { bg: 'bg-sky-500', border: 'border-sky-700', text: 'text-sky-700', shadow: 'shadow-sky-500/50' }
                },
                {
                    unitNumber: 3,
                    title: "Food & Drink",
                    lessons: [{ id: 'food', title: 'Food', icon: '🍕' }],
                    color: { bg: 'bg-rose-500', border: 'border-rose-700', text: 'text-rose-700', shadow: 'shadow-rose-500/50' }
                },
                {
                    unitNumber: 4,
                    title: "Daily Activities",
                    lessons: [{ id: 'hobbies', title: 'Hobbies', icon: '🎨' }],
                    color: { bg: 'bg-amber-500', border: 'border-amber-700', text: 'text-amber-700', shadow: 'shadow-amber-500/50' }
                }
            ]
        },
        {
            sectionNumber: 2,
            title: "Building Blocks",
            cefrLevel: "A2",
            phrase: "I would like to order a coffee.",
            units: [
                {
                    unitNumber: 5,
                    title: "Navigating the World",
                    lessons: [
                        { id: 'travel', title: 'Travel', icon: '✈️' },
                        { id: 'directions', title: 'Directions', icon: '🗺️' }
                    ],
                    color: { bg: 'bg-purple-500', border: 'border-purple-700', text: 'text-purple-700', shadow: 'shadow-purple-500/50' }
                },
                {
                    unitNumber: 6,
                    title: "Work & Shopping",
                    lessons: [
                        { id: 'work', title: 'Work', icon: '💼' },
                        { id: 'shopping', title: 'Shopping', icon: '🛍️' }
                    ],
                    color: { bg: 'bg-fuchsia-500', border: 'border-fuchsia-700', text: 'text-fuchsia-700', shadow: 'shadow-fuchsia-500/50' }
                },
                {
                    unitNumber: 7,
                    title: "Home Life",
                    lessons: [
                        { id: 'home', title: 'Home', icon: '🏠' },
                        { id: 'weather', title: 'Weather', icon: '☀️' }
                    ],
                    color: { bg: 'bg-cyan-500', border: 'border-cyan-700', text: 'text-cyan-700', shadow: 'shadow-cyan-500/50' }
                },
                {
                    unitNumber: 8,
                    title: "Education & Tech",
                    lessons: [
                        { id: 'school', title: 'School', icon: '🏫' },
                        { id: 'tech', title: 'Technology', icon: '💻' }
                    ],
                    color: { bg: 'bg-lime-500', border: 'border-lime-700', text: 'text-lime-700', shadow: 'shadow-lime-500/50' }
                }
            ]
        },
        {
            sectionNumber: 3,
            title: "Expressing Yourself",
            cefrLevel: "B1",
            phrase: "Yesterday, I went to the park.",
            units: [
                {
                    unitNumber: 9,
                    title: "Health & Feelings",
                    lessons: [
                        { id: 'health', title: 'Health', icon: '🩺' },
                        { id: 'emotions', title: 'Emotions', icon: '😊' }
                    ],
                    color: { bg: 'bg-teal-500', border: 'border-teal-700', text: 'text-teal-700', shadow: 'shadow-teal-500/50' }
                },
                {
                    unitNumber: 10,
                    title: "Culture & Nature",
                    lessons: [
                        { id: 'culture', title: 'Culture', icon: '🎭' },
                        { id: 'nature', title: 'Nature', icon: '🌳' }
                    ],
                    color: { bg: 'bg-orange-500', border: 'border-orange-700', text: 'text-orange-700', shadow: 'shadow-orange-500/50' }
                },
                {
                    unitNumber: 11,
                    title: "Talking About Time",
                    lessons: [
                        { id: 'past', title: 'Past Tense', icon: '📜' },
                        { id: 'future', title: 'Future Tense', icon: '🔮' }
                    ],
                    color: { bg: 'bg-indigo-500', border: 'border-indigo-700', text: 'text-indigo-700', shadow: 'shadow-indigo-500/50' }
                }
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