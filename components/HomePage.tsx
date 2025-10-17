import React, { useState, useEffect } from 'react';
import { NewHomePageIllustrations } from './NewHomePageIllustrations';
import { GlobeAltIcon, StarIcon } from './icons'; // Assuming StarIcon is available for ratings
import { Page } from '../types';

// Re-usable component for feature sections
const FeatureSection: React.FC<{
    title: string;
    description: string;
    illustration: React.ReactNode;
    reverse?: boolean;
}> = ({ title, description, illustration, reverse = false }) => {
    const direction = reverse ? 'lg:flex-row-reverse' : 'lg:flex-row';
    return (
        <section className={`flex flex-col ${direction} items-center justify-center gap-12 lg:gap-24 py-16 lg:py-24`}>
            <div className="lg:w-1/2 max-w-lg text-center lg:text-left">
                <h2 className="text-responsive-4xl font-extrabold text-slate-100 mb-4" style={{ color: '#6366f1' }}>{title}</h2>
                <p className="text-responsive-lg text-slate-400">{description}</p>
            </div>
            <div className="lg:w-1/2 max-w-md w-full">
                {illustration}
            </div>
        </section>
    );
};

// Re-usable component for testimonial cards
const TestimonialCard: React.FC<{ quote: string; name: string; country: string; avatar: string; }> = ({ quote, name, country, avatar }) => (
    <article className="card-hover bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl h-full flex flex-col shadow-lg">
        <div className="flex mb-2" role="img" aria-label="5 star rating">
            {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5 text-yellow-400 hover-scale" aria-hidden="true" />)}
        </div>
        <blockquote className="text-slate-300 italic flex-grow">"{quote}"</blockquote>
        <div className="flex items-center mt-4">
            <img src={avatar} alt={`${name} from ${country}`} className="w-12 h-12 rounded-full object-cover mr-4 hover-scale" />
            <div>
                <p className="font-bold text-slate-100">{name}</p>
                <p className="text-sm text-slate-400">{country}</p>
            </div>
        </div>
    </article>
);


const HomePage: React.FC<{ onGetStarted: () => void; onNavigate: (page: Page) => void; }> = ({ onGetStarted, onNavigate }) => {
    const [originUrl, setOriginUrl] = useState('');

    useEffect(() => {
        // This code runs when the page loads and gets the URL from the browser window itself.
        if (typeof window !== 'undefined') {
            setOriginUrl(window.location.origin);
        }
    }, []);

    return (
        <div className="bg-[#1e293b] text-white font-sans">
            {/* --- TEMPORARY BOX TO SHOW THE URL --- */}
            {originUrl && (
                <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-black p-4 z-[100] text-center shadow-lg">
                    <h2 className="font-extrabold text-lg">COPY THIS URL FOR GOOGLE SIGN-IN:</h2>
                    <p 
                        className="font-mono text-xl bg-white p-2 rounded mt-2 select-all"
                    >
                        {originUrl}
                    </p>
                    <p className="text-sm mt-2">Paste this into your Google Cloud Console's "Authorized JavaScript origins".</p>
                </div>
            )}
            
            {/* --- Navbar --- */}
            <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700 mt-[115px]" role="navigation" aria-label="Main navigation">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex-shrink-0">
                            <h1 className="text-responsive-2xl font-extrabold text-indigo-400">NovaLingo</h1>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4" role="list">
                                <button 
                                    onClick={() => onNavigate(Page.Features)} 
                                    className="nav-link text-slate-300 px-3 py-2 rounded-md text-sm font-medium focus-ring"
                                    role="listitem"
                                >
                                    Features
                                </button>
                                <button 
                                    onClick={() => onNavigate(Page.Testimonials)} 
                                    className="nav-link text-slate-300 px-3 py-2 rounded-md text-sm font-medium focus-ring"
                                    role="listitem"
                                >
                                    Testimonials
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden p-4 pt-10 pb-20" role="banner">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-50"></div>
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-900/50 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-900/50 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-pulse animation-delay-4000"></div>

                <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 sm:px-6 lg:px-8">
                    <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
                        <h1 className="text-responsive-5xl font-extrabold leading-tight">
                            Learn any language, <span className="gradient-text-animated">your way.</span>
                        </h1>
                        <p className="max-w-xl mx-auto lg:mx-0 text-responsive-lg text-slate-300">
                            Master practical, real-world conversations with an AI-powered learning experience designed just for you. Fun, effective, and free to start.
                        </p>
                        <button
                            onClick={onGetStarted}
                            className="btn-primary px-8 py-4 text-responsive-lg font-bold rounded-xl focus-ring hover-lift hover-glow shadow-2xl"
                            aria-label="Start learning languages with NovaLingo"
                        >
                            Start Learning Now
                        </button>
                    </div>
                    <div className="animate-fade-in-up animation-delay-300">
                        <NewHomePageIllustrations.HeroAppMockup />
                    </div>
                </div>
            </header>

            {/* --- Features Section --- */}
            <main id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FeatureSection
                    title="Real Conversations, Not Just Sentences."
                    description="Practice speaking in real-world scenarios with our AI tutor. From ordering coffee to booking a taxi, build confidence for the conversations that matter."
                    illustration={<NewHomePageIllustrations.LiveConversation />}
                />
                <FeatureSection
                    title="Master Vocabulary That Sticks."
                    description="Create custom flashcard decks or use our AI-generated cards based on your weak spots. Our smart review system uses spaced repetition to maximize retention."
                    illustration={<NewHomePageIllustrations.Flashcards />}
                    reverse
                />
                <FeatureSection
                    title="Learn Through Culture, Not Just Words."
                    description="Go beyond grammar with Culture Quests. Explore traditions, etiquette, and history to truly understand the language and its people."
                    illustration={<NewHomePageIllustrations.CultureQuest />}
                />
            </main>

            {/* --- Social Proof / Testimonials --- */}
            <section id="testimonials" className="py-16 lg:py-24 bg-slate-900/50" aria-labelledby="testimonials-heading">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                         <h2 id="testimonials-heading" className="text-responsive-4xl font-extrabold text-slate-100">Loved by learners worldwide</h2>
                         <p className="mt-4 text-responsive-lg text-slate-400">See what our community is saying about NovaLingo.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
                        <TestimonialCard
                            quote="The AI conversation is a game-changer. It's the first time I've felt confident practicing speaking without pressure. So much more practical than just matching words!"
                            name="Aarav Sharma"
                            country="Mumbai, India"
                            avatar="https://api.dicebear.com/8.x/avataaars/svg?seed=Aarav"
                        />
                         <TestimonialCard
                            quote="I love the flashcard system! Being able to create my own decks and have the AI generate them from my mistakes has supercharged my vocabulary learning."
                            name="Sofia Rossi"
                            country="Bogotá, Colombia"
                            avatar="https://api.dicebear.com/8.x/avataaars/svg?seed=Sofia"
                        />
                         <TestimonialCard
                            quote="Finally, an app that focuses on culture. The Culture Quests for Japanese are so interesting and make learning feel like exploring a new world."
                            name="Kenji Tanaka"
                            country="Kathmandu, Nepal"
                            avatar="https://api.dicebear.com/8.x/avataaars/svg?seed=Kenji"
                        />
                    </div>
                </div>
            </section>

            {/* --- Final CTA --- */}
            <section className="py-20 lg:py-32" aria-labelledby="cta-heading">
                 <div className="text-center max-w-3xl mx-auto px-4">
                    <h2 id="cta-heading" className="text-responsive-4xl font-extrabold text-white mb-8">Ready to start your adventure?</h2>
                    <p className="text-responsive-lg text-slate-300 mb-10">Join millions of learners and take the first step towards fluency today. Your first lesson is just a click away.</p>
                     <button
                        onClick={onGetStarted}
                        className="btn-accent px-10 py-5 text-responsive-xl font-bold rounded-xl focus-ring hover-lift hover-glow shadow-2xl"
                        aria-label="Try NovaLingo for free and start learning"
                    >
                        Try NovaLingo for Free
                    </button>
                 </div>
            </section>

             {/* --- Footer --- */}
             <footer className="bg-slate-900 border-t border-slate-800" role="contentinfo">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-slate-400 text-center">
                    <div className="flex justify-center items-center gap-4 text-sm">
                        <p>&copy; {new Date().getFullYear()} NovaLingo. All rights reserved.</p>
                        <button 
                            onClick={() => onNavigate(Page.About)} 
                            className="hover:text-white hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
                        >
                            About
                        </button>
                    </div>
                </div>
             </footer>
        </div>
    );
};

export default HomePage;