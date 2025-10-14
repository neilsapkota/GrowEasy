import React from 'react';
import { SparklesIcon, MicrophoneIcon, BookOpenIcon, UsersIcon, BackIcon } from './icons';
import Mascot from './Mascot';

const FeatureHighlight: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <Icon className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{children}</p>
        </div>
    </div>
);

const AboutPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="bg-slate-900 min-h-screen text-white">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
                <button onClick={onBack} className="flex items-center gap-2 font-bold text-sky-400 mb-8 hover:underline">
                    <BackIcon className="w-5 h-5" />
                    Back to Home
                </button>

                <header className="text-center mb-12">
                    <Mascot className="w-32 h-32 mx-auto mb-4" />
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                        About NovaLingo
                    </h1>
                    <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
                        We're building the future of language learning, making fluency accessible, engaging, and effective for everyone.
                    </p>
                </header>

                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 space-y-8">
                    <h2 className="text-2xl font-bold text-white">Our Mission</h2>
                    <p className="text-slate-300">
                        At NovaLingo, we believe that language is the ultimate bridge between cultures. Our mission is to break down communication barriers by creating a learning experience that is not only educational but also genuinely fun and immersive. We go beyond simple vocabulary drills to help you build real-world conversational skills and cultural understanding, empowering you to connect with people, not just words.
                    </p>
                    
                    <h2 className="text-2xl font-bold text-white border-t border-slate-700 pt-8">What Makes Us Different</h2>
                    <div className="space-y-6">
                        <FeatureHighlight icon={SparklesIcon} title="AI at the Core">
                            NovaLingo is built from the ground up with cutting-edge AI. From generating personalized lessons to providing real-time pronunciation feedback, our technology adapts to you, creating a learning path that's as unique as you are.
                        </FeatureHighlight>
                         <FeatureHighlight icon={MicrophoneIcon} title="Focus on Conversation">
                            Fluency isn't about memorizing flashcards; it's about speaking with confidence. Our AI-powered conversation and role-play scenarios provide a safe, pressure-free environment to practice speaking from day one.
                        </FeatureHighlight>
                         <FeatureHighlight icon={UsersIcon} title="Community and Culture">
                            We believe you learn a language best when you understand its culture. Our unique Culture Quests and social features help you connect with the heart of the language and a global community of fellow learners.
                        </FeatureHighlight>
                         <FeatureHighlight icon={BookOpenIcon} title="Built on Learning Science">
                            Features like our 'Smart Review' are based on proven learning techniques like Spaced Repetition. We combine the best of learning science with the power of AI to help you learn faster and remember longer.
                        </FeatureHighlight>
                    </div>
                </div>

                <footer className="text-center mt-12 text-slate-500">
                    <p>Thank you for being a part of the NovaLingo journey.</p>
                </footer>
            </div>
        </div>
    );
};

export default AboutPage;