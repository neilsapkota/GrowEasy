import React, { useState } from 'react';

interface LoginPageProps {
    onLogin: (name: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onLogin(name.trim());
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen -mt-20">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl text-center">
                <div className="space-y-2">
                     <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                        Vocal AI
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">Your journey to fluency starts here.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="What's your name?"
                        className="w-full px-4 py-3 text-lg bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        required
                    />
                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="w-full px-4 py-3 text-lg font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
                    >
                        Start Learning
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;