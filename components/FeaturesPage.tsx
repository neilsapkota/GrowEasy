import React from 'react';
import { BackIcon, SparklesIcon, MicrophoneIcon, BookOpenIcon, UsersIcon, TrophyIcon, PracticeIcon } from './icons';
import { NewHomePageIllustrations } from './NewHomePageIllustrations';

interface FeaturesPageProps {
    onBack: () => void;
}

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, description: string, illustration?: React.ReactNode }> = ({ icon: Icon, title, description, illustration }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col">
        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-slate-700 rounded-lg">
                <Icon className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-slate-400 flex-grow">{description}</p>
        {illustration && <div className="mt-6">{illustration}</div>}
    </div>
);

const FeaturesPage: React.FC<FeaturesPageProps> = ({ onBack }) => {
    const features = [
        {
            icon: MicrophoneIcon,
            title: "Real Conversations, Not Just Sentences",
            description: "Practice speaking in real-world scenarios with our AI tutor. From ordering coffee to booking a taxi, build confidence for the conversations that matter.",
            illustration: <NewHomePageIllustrations.LiveConversation />,
        },
        {
            icon: BookOpenIcon,
            title: "Master Vocabulary That Sticks",
            description: "Create custom flashcard decks or use our AI-generated cards based on your weak spots. Our smart review system uses spaced repetition to maximize retention.",
            illustration: <NewHomePageIllustrations.Flashcards />,
        },
        {
            icon: UsersIcon,
            title: "Learn Through Culture, Not Just Words",
            description: "Go beyond grammar with Culture Quests. Explore traditions, etiquette, and history to truly understand the language and its people.",
            illustration: <NewHomePageIllustrations.CultureQuest />,
        },
        {
            icon: PracticeIcon,
            title: "AI-Powered Pronunciation Feedback",
            description: "Get instant, actionable feedback on your pronunciation. Our AI analyzes your speech and gives you a score and tips to sound more like a native speaker.",
        },
        {
            icon: TrophyIcon,
            title: "Gamified Learning Path",
            description: "Stay motivated by earning XP, completing daily quests, unlocking achievements, and climbing the leaderboards. Learning a language has never been so fun!",
        },
        {
            icon: SparklesIcon,
            title: "Personalized For You",
            description: "Vocal AI adapts to your learning style. From the placement test that finds your level to the practice sessions that focus on your mistakes, your journey is unique.",
        },
    ];

    return (
        <div className="bg-slate-900 min-h-screen text-white">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
                <button onClick={onBack} className="flex items-center gap-2 font-bold text-sky-400 mb-8 hover:underline">
                    <BackIcon className="w-5 h-5" />
                    Back to Home
                </button>

                <header className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                        Features
                    </h1>
                    <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
                        Discover the powerful, AI-driven tools that make Vocal AI the most effective way to learn a language.
                    </p>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map(feature => (
                        <FeatureCard key={feature.title} {...feature} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesPage;