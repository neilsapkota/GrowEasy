import React from 'react';

const FloatingWord: React.FC<{ word: string; className: string; style?: React.CSSProperties }> = ({ word, className, style }) => (
    <div
        className={`absolute text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm py-2 px-4 rounded-full shadow-lg animate-fade-in ${className}`}
        style={style}
    >
        {word}
    </div>
);

const HomePage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-teal-50 dark:bg-slate-900 p-4">
            {/* Background decorative shapes */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-200 dark:bg-emerald-900/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-200 dark:bg-sky-900/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
            <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-rose-200 dark:bg-rose-900/50 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse animation-delay-2000"></div>

            {/* Floating Words */}
            <FloatingWord word="Hola!" className="top-[10%] left-[15%] [animation:float_6s_ease-in-out_infinite]" />
            <FloatingWord word="你好" className="top-[20%] right-[10%] [animation:float_7s_ease-in-out_infinite_0.5s]" />
            <FloatingWord word="Bonjour!" className="bottom-[15%] left-[20%] [animation:float_8s_ease-in-out_infinite_1s]" />
            <FloatingWord word="Hello!" className="bottom-[25%] right-[15%] [animation:float_5s_ease-in-out_infinite_1.5s]" />
            <FloatingWord word="こんにちは" className="top-[40%] left-[5%] [animation:float_9s_ease-in-out_infinite_0.2s]" />
            <FloatingWord word="Guten Tag!" className="top-[60%] right-[5%] [animation:float_6s_ease-in-out_infinite_0.8s]" />

            <main className="relative z-10 text-center space-y-8">
                <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-800 dark:text-white leading-tight">
                        The <span className="text-teal-500">free, fun,</span> and
                        <br />
                        <span className="text-emerald-500">effective</span> way to learn.
                    </h1>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-300">
                        Join millions of learners and start speaking a new language today. Your journey to fluency begins here with GrowEasy.
                    </p>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                    <button
                        onClick={onGetStarted}
                        className="px-10 py-5 text-xl font-bold text-white bg-green-500 rounded-2xl border-b-4 border-green-700 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 uppercase tracking-wider shadow-2xl hover:shadow-green-500/40"
                    >
                        Get Started
                    </button>
                </div>
            </main>
        </div>
    );
};

export default HomePage;