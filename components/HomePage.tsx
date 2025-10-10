import React from 'react';

const FloatingWord: React.FC<{ word: string; className: string; style?: React.CSSProperties }> = ({ word, className, style }) => (
    <div
        className={`absolute text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm py-2 px-4 rounded-full shadow-lg animate-fade-in ${className}`}
        style={style}
    >
        {word}
    </div>
);

// New Illustration Components
const EffectiveIllustration = () => (
    <svg viewBox="0 0 400 400" className="w-full h-auto">
        {/* Phone */}
        <rect x="100" y="50" width="200" height="350" rx="30" fill="#2d3748" />
        <rect x="115" y="65" width="170" height="320" rx="15" fill="#1a202c" />
        {/* Screen Content */}
        <circle cx="200" cy="150" r="40" fill="#48bb78" />
        <path d="M 185 150 L 195 160 L 215 140" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="140" y="220" width="120" height="20" rx="10" fill="#4a5568" />
        <rect x="140" y="260" width="120" height="20" rx="10" fill="#4a5568" />
        <rect x="140" y="300" width="80" height="20" rx="10" fill="#4a5568" />
        {/* Character */}
        <g transform="translate(300, 300)">
            <circle cx="0" cy="0" r="30" fill="#e53e3e" />
            <circle cx="0" cy="-5" r="15" fill="#f6e05e" />
            <circle cx="-8" cy="-8" r="3" fill="black" />
            <circle cx="8" cy="-8" r="3" fill="black" />
        </g>
    </svg>
);

const ScienceIllustration = () => (
    <svg viewBox="0 0 400 400" className="w-full h-auto">
        {/* Head silhouette */}
        <path d="M150 350 C 50 300, 50 100, 150 50 S 250 0, 300 100 S 350 300, 250 350 Z" fill="#2d3748" />
        {/* Brain */}
        <path d="M200 150 C 150 150, 150 100, 200 100 S 250 100, 250 150 C 250 200, 200 200, 200 150" fill="#48bb78" />
        <path d="M220 180 C 180 190, 170 160, 210 140" stroke="#a7c957" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M180 180 C 220 190, 230 160, 190 140" stroke="#a7c957" strokeWidth="10" fill="none" strokeLinecap="round" />
        {/* Gears */}
        <circle cx="150" cy="250" r="20" fill="#718096" />
        <circle cx="250" cy="250" r="30" fill="#a0aec0" />
    </svg>
);

const MotivatedIllustration = () => (
    <svg viewBox="0 0 400 400" className="w-full h-auto">
        {/* Character */}
        <circle cx="200" cy="200" r="50" fill="#4299e1" />
        <rect x="175" y="250" width="50" height="80" fill="#4299e1" />
        <circle cx="190" cy="190" r="5" fill="white" />
        <circle cx="210" cy="190" r="5" fill="white" />
        {/* Trophy */}
        <path d="M150 100 C 150 50, 250 50, 250 100 L 230 150 L 170 150 Z" fill="#f6e05e" />
        <rect x="190" y="150" width="20" height="30" fill="#f6e05e" />
        {/* Streaks */}
        <path d="M300 150 C 350 100, 350 200, 300 250" stroke="#f56565" strokeWidth="15" fill="none" strokeLinecap="round" />
        <path d="M100 150 C 50 100, 50 200, 100 250" stroke="#f56565" strokeWidth="15" fill="none" strokeLinecap="round" />
    </svg>
);

const PersonalizedIllustration = () => (
    <svg viewBox="0 0 400 400" className="w-full h-auto">
        <rect x="100" y="50" width="200" height="300" rx="20" fill="#2d3748" />
        <path d="M120 100 H 280" stroke="#4a5568" strokeWidth="10" strokeLinecap="round" />
        <path d="M120 150 H 280" stroke="#4299e1" strokeWidth="10" strokeLinecap="round" />
        <path d="M120 200 H 280" stroke="#4a5568" strokeWidth="10" strokeLinecap="round" />
        <circle cx="200" cy="150" r="20" fill="white" />
        <circle cx="150" cy="100" r="20" fill="#4a5568" />
    </svg>
);

const FinalIllustration = () => (
    <svg viewBox="0 0 400 400" className="w-full h-auto">
        <rect x="100" y="50" width="200" height="350" rx="30" fill="#2d3748" />
        <rect x="115" y="65" width="170" height="320" rx="15" fill="#1a202c" />
        <circle cx="200" cy="180" r="60" fill="#48bb78" />
        <path d="M180 180 Q 200 160, 220 180" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M180 200 Q 200 220, 220 200" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
        <circle cx="80" cy="250" r="20" fill="#f6e05e" />
        <circle cx="320" cy="150" r="30" fill="#4299e1" />
    </svg>
);


const FeatureSection: React.FC<{
    title: string;
    description: string;
    illustration: React.ReactNode;
    reverse?: boolean;
}> = ({ title, description, illustration, reverse = false }) => {
    const direction = reverse ? 'md:flex-row-reverse' : 'md:flex-row';
    return (
        <div className={`flex flex-col ${direction} items-center justify-center gap-12 md:gap-24 py-16 md:py-24`}>
            <div className="md:w-1/2 max-w-md">
                <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-400 mb-4">{title}</h2>
                <p className="text-lg text-slate-300">{description}</p>
            </div>
            <div className="md:w-1/2 max-w-sm">
                {illustration}
            </div>
        </div>
    );
};


const HomePage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
    return (
        <div className="bg-[#121212] text-white">
            {/* Original Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-4">
                <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-900/50 rounded-full mix-blend-screen filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-900/50 rounded-full mix-blend-screen filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
                <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-rose-900/50 rounded-full mix-blend-screen filter blur-2xl opacity-50 animate-pulse animation-delay-2000"></div>

                <main className="relative z-10 text-center space-y-8">
                    <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                            The <span className="text-teal-400">free, fun,</span> and
                            <br />
                            <span className="text-emerald-400">effective</span> way to learn.
                        </h1>
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300">
                            Join millions of learners and start speaking a new language today. Your journey to fluency begins here with GrowEasy.
                        </p>
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                        <button
                            onClick={onGetStarted}
                            className="px-10 py-5 text-xl font-bold text-white bg-green-500 rounded-2xl border-b-4 border-green-700 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-800 transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 uppercase tracking-wider shadow-2xl hover:shadow-green-500/40"
                        >
                            Get Started
                        </button>
                    </div>
                </main>
            </div>

            {/* New Feature Sections */}
            <div className="max-w-6xl mx-auto px-6">
                <FeatureSection
                    title="free. fun. effective."
                    description="Learning with GrowEasy is fun, and research shows that it works! With quick, bite-sized lessons, you’ll earn points and unlock new levels while gaining real-world communication skills."
                    illustration={<EffectiveIllustration />}
                />
                <FeatureSection
                    title="backed by science."
                    description="We use a combination of research-backed teaching methods and delightful content to create courses that effectively teach reading, writing, listening, and speaking skills!"
                    illustration={<ScienceIllustration />}
                    reverse
                />
                <FeatureSection
                    title="stay motivated."
                    description="We make it easy to form a habit of language learning with game-like features, fun challenges, and reminders from our friendly mascot, Sprout."
                    illustration={<MotivatedIllustration />}
                />
                <FeatureSection
                    title="personalized learning."
                    description="Combining the best of AI and language science, lessons are tailored to help you learn at just the right level and pace."
                    illustration={<PersonalizedIllustration />}
                    reverse
                />
            </div>
            
            {/* Final CTA Section */}
            <div className="relative mt-20">
                <div className="absolute bottom-0 w-full h-full bg-green-600">
                    <svg className="w-full text-green-600" fill="currentColor" viewBox="0 0 1440 120" preserveAspectRatio="none">
                        <path d="M1440,21.2101911 L1440,120 L0,120 L0,21.2101911 C120,35.0700637 240,42 360,42 C480,42 600,35.0700637 720,21.2101911 C840,7.35031847 960,0 1080,0 C1200,0 1320,7.35031847 1440,21.2101911 Z"></path>
                    </svg>
                </div>
                <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
                     <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8">learn a language with GrowEasy.</h2>
                     <div className="max-w-md mx-auto mb-8">
                        <FinalIllustration />
                     </div>
                     <button
                        onClick={onGetStarted}
                        className="px-10 py-5 text-xl font-bold text-green-600 bg-white rounded-2xl border-b-4 border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 uppercase tracking-wider shadow-2xl"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;