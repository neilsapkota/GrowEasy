import React from 'react';

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
    <details className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group">
        <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
            {question}
            <span className="transition-transform duration-300 transform group-open:rotate-180">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </span>
        </summary>
        <div className="mt-4 text-slate-600 dark:text-slate-300">
            {children}
        </div>
    </details>
);

const HelpPage: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">Help Center</h2>
            
            <div className="space-y-4">
                <FaqItem question="How do Leaderboards work?">
                    <p>Leaderboards are weekly competitions where you can see how your XP compares to other learners in your league. The top performers at the end of the week get promoted to a higher league, while the bottom performers may be demoted. Keep learning to climb the ranks!</p>
                </FaqItem>

                <FaqItem question="How do I earn rewards from Quests?">
                    <p>Each day, you receive new Daily Quests. You can complete them by earning XP, finishing lessons, or doing practice sessions. Once you complete a quest's goal, you'll automatically receive an XP reward. Check the 'Quests' page to see your current quests and progress.</p>
                </FaqItem>
                
                <FaqItem question="What are Monthly Badges?">
                    <p>Monthly Badges are special rewards for your dedication! Each month, there's a unique challenge, like completing a certain number of quests. If you complete the challenge within the month, you'll earn a collectible badge for your profile to show off your hard work.</p>
                </FaqItem>

                <FaqItem question="What is 'Smart Review' in the Practice Hub?">
                    <p>Smart Review uses a Spaced Repetition System (SRS). This is an intelligent algorithm that shows you vocabulary words right before you're about to forget them. By reviewing at the perfect time, you strengthen your memory more efficiently. The more you review, the smarter it gets!</p>
                </FaqItem>
                
                <FaqItem question="How does Pronunciation Practice work?">
                    <p>Our Pronunciation Practice uses AI to give you feedback. Simply record yourself saying the given phrase, and our AI will analyze your speech. It provides a score and a helpful tip to help you sound more like a native speaker.</p>
                </FaqItem>
            </div>
        </div>
    );
};

export default HelpPage;