import React from 'react';
import { Language, UserProgress, PracticeMode } from '../types';
import { MicrophoneIcon, HeadphonesIcon, TargetIcon, CardsIcon, BookOpenIcon } from './icons';

interface PracticeHubPageProps {
    language: Language;
    progress: UserProgress | null;
    onStartPractice: (mode: PracticeMode) => void;
}

interface PracticeCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    count?: number;
    onClick: () => void;
    disabled?: boolean;
}

const PracticeCard: React.FC<PracticeCardProps> = ({ title, description, icon: Icon, color, count, onClick, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`relative p-6 rounded-2xl text-left transition-all duration-300 transform hover:-translate-y-1 w-full overflow-hidden ${disabled ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed' : 'bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl'}`}
        >
            {disabled && <div className="absolute inset-0 bg-slate-200/50 dark:bg-slate-900/50 z-10"></div>}
            <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full ${color} opacity-20`}></div>
            <div className="relative z-0">
                <div className={`p-3 rounded-lg inline-block mb-4 ${color}`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${disabled ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-white'}`}>{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">{description}</p>
                {count !== undefined && (
                    <span className="font-bold text-sm text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full">
                        {count} item{count !== 1 ? 's' : ''}
                    </span>
                )}
                 {disabled && count === 0 && (
                     <span className="font-bold text-sm text-slate-500 dark:text-slate-400">
                        Nothing to practice yet!
                    </span>
                 )}
            </div>
        </button>
    );
};


const PracticeHubPage: React.FC<PracticeHubPageProps> = ({ language, progress, onStartPractice }) => {
    const mistakeCount = progress?.mistakes?.length ?? 0;
    const vocabularyCount = progress?.learnedVocabulary?.length ?? 0;

    const practiceOptions: Omit<PracticeCardProps, 'onClick'>[] = [
        {
            title: 'Conversation',
            description: 'Improve your speaking skills with phrases.',
            icon: MicrophoneIcon,
            color: 'bg-sky-500',
        },
        {
            title: 'Listening',
            description: 'Boost your listening with audio-only sessions.',
            icon: HeadphonesIcon,
            color: 'bg-violet-500',
        },
        {
            title: 'Your Mistakes',
            description: 'Practice the concepts you\'ve struggled with.',
            icon: TargetIcon,
            color: 'bg-rose-500',
            count: mistakeCount,
            disabled: mistakeCount === 0,
        },
        {
            title: 'Vocabulary',
            description: 'Review your learned words with flashcards.',
            icon: CardsIcon,
            color: 'bg-amber-500',
            count: vocabularyCount,
            disabled: vocabularyCount === 0,
        },
        {
            title: 'Stories',
            description: 'Reread a story to review words in context.',
            icon: BookOpenIcon,
            color: 'bg-emerald-500',
        },
    ];

    return (
        <div className="px-4 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Practice Hub</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10">Sharpen your {language.name} skills!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {practiceOptions.map(opt => (
                    <PracticeCard
                        key={opt.title}
                        {...opt}
                        onClick={() => onStartPractice(opt.title.toLowerCase().replace('your ', '') as PracticeMode)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PracticeHubPage;