import React, { useState } from 'react';
import { HomeIcon, PracticeIcon, QuestsIcon, ShieldCheckIcon } from './icons';
import Mascot from './Mascot';

interface OnboardingPageProps {
    onComplete: (startWithTest: boolean) => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const nextStep = () => setStep(s => s + 1);

    const steps = [
        // Step 1: Welcome
        <div key={0} className="text-center animate-fade-in-up">
            <Mascot className="w-32 h-32 mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Welcome to Vocal AI!</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">We're excited to help you on your language learning journey.</p>
            <button onClick={nextStep} className="mt-8 w-full max-w-xs px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">Let's Go!</button>
        </div>,
        
        // Step 2: Goal Setting
        <div key={1} className="text-center animate-fade-in-up">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-4">Set your daily goal</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Learning a little each day is the best way to grow.</p>
            <div className="space-y-3 max-w-sm mx-auto">
                {['Casual (5 mins/day)', 'Regular (10 mins/day)', 'Serious (15 mins/day)', 'Intense (20 mins/day)'].map(goal => (
                    <button key={goal} onClick={nextStep} className="w-full text-left p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 font-bold transition-colors">
                        {goal}
                    </button>
                ))}
            </div>
        </div>,

        // Step 3: Feature Intro
        <div key={2} className="text-center animate-fade-in-up">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-8">How Vocal AI works</h2>
            <div className="space-y-6 max-w-md mx-auto">
                <div className="flex items-center gap-4 text-left p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <HomeIcon className="w-10 h-10 text-rose-500 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-lg">Learn the basics</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Follow our structured path to build a solid foundation from scratch.</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4 text-left p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <PracticeIcon className="w-10 h-10 text-sky-500 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-lg">Practice your skills</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Sharpen your speaking, listening, and writing with fun, AI-powered exercises.</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4 text-left p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <QuestsIcon className="w-10 h-10 text-amber-500 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-lg">Stay motivated</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Complete daily quests and climb the leaderboards to earn rewards.</p>
                    </div>
                </div>
            </div>
            <button onClick={nextStep} className="mt-8 w-full max-w-xs px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">Continue</button>
        </div>,

        // Step 4: Placement Test offer
        <div key={3} className="text-center animate-fade-in-up">
            <ShieldCheckIcon className="w-20 h-20 text-sky-500 mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Know some already?</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8 max-w-md mx-auto">Take our quick placement test to find your level and potentially skip ahead.</p>
            <div className="space-y-4 max-w-sm mx-auto">
                <button onClick={() => onComplete(true)} className="w-full px-6 py-4 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 transition-colors">Take Placement Test</button>
                <button onClick={() => onComplete(false)} className="w-full px-6 py-3 font-bold text-sky-600 dark:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Start from scratch</button>
            </div>
        </div>,
    ];

    return (
        <div className="min-h-[calc(100vh-2rem)] flex flex-col justify-center items-center p-4">
             {steps[step]}
        </div>
    );
};

export default OnboardingPage;