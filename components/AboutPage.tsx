import React from 'react';
import { SparklesIcon, MicrophoneIcon, BookOpenIcon, UsersIcon } from './icons';
import Mascot from './Mascot';

const FeatureHighlight: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <Icon className="w-6 h-6 text-teal-500" />
        </div>
        <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{children}</p>
        </div>
    </div>
);

const AboutPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            <header className="text-center mb-12">
                <Mascot className="w-24 h-24 mx-auto mb-4" />
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-slate-100">
                    About <span className="gradient-text">WordVine</span>
                </h1>
                <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                    More than an app. It's your personal path to fluency.
                </p>
            </header>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-center mb-6">Our Mission</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto">
                    We believe that learning a new language should be an adventure, not a chore. Our mission is to make language acquisition intuitive, fun, and highly effective by moving beyond simple memorization. We focus on building real-world conversational skills and cultural understanding, empowering you to connect with people, not just words.
                </p>
            </section>

            <section className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-8">What Makes Us Different?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FeatureHighlight icon={SparklesIcon} title="AI-Powered Learning">
                        Our app is built on cutting-edge generative AI. This allows for dynamic, interactive experiences like our live conversation practice, smart vocabulary review, and personalized feedback that adapts to your learning style.
                    </FeatureHighlight>
                    <FeatureHighlight icon={MicrophoneIcon} title="Focus on Conversation">
                        Confidence comes from practice. Our role-play scenarios and live conversation mode let you practice speaking in realistic situations without fear of judgment, preparing you for the interactions that matter most.
                    </FeatureHighlight>
                    <FeatureHighlight icon={BookOpenIcon} title="Cultural Immersion">
                        Language is inseparable from culture. We integrate cultural insights and etiquette into our lessons, helping you understand the context behind the words and communicate with respect and nuance.
                    </FeatureHighlight>
                    <FeatureHighlight icon={UsersIcon} title="Engaging & Motivating">
                        Stay on track with a learning path that feels like a game. Earn XP, complete daily quests, unlock achievements, and compete with friends on the leaderboard to make your learning journey consistently rewarding.
                    </FeatureHighlight>
                </div>
            </section>
            
             <footer className="mt-12 text-center text-sm text-slate-400 dark:text-slate-500">
                <p>WordVine is powered by Google's Gemini models.</p>
                <p>&copy; {new Date().getFullYear()} WordVine. Happy learning!</p>
            </footer>

        </div>
    );
};

export default AboutPage;