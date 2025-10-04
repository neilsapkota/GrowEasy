import { Language, LessonTopic } from './types';

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
    { id: 'food', title: 'Food', icon: '🍕' },
    { id: 'travel', title: 'Travel', icon: '✈️' },
    { id: 'family', title: 'Family', icon: '👨‍👩‍👧‍👦' },
    { id: 'hobbies', title: 'Hobbies', icon: '🎨' },
    { id: 'work', title: 'Work', icon: '💼' },
];

export const XP_PER_CORRECT_ANSWER = 10;