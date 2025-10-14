import React from 'react';
import { User, UserProgress } from '../types';
import { StarIcon, FireIcon, LogoutIcon } from './icons';

interface HeaderProps {
    user: User | null;
    progress: UserProgress | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, progress, onLogout }) => {
    return (
        <header className="flex justify-between items-center mb-8 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    NovaLingo
                </h1>
                {user && <p className="text-slate-500 dark:text-slate-400">Welcome back, {user.name}!</p>}
            </div>
            {user && progress ? (
                <div className="flex items-center space-x-4 sm:space-x-6">
                    <div className="flex items-center space-x-2 text-amber-500">
                        <StarIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="text-lg sm:text-xl font-bold">{progress.xp}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-orange-500">
                        <FireIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="text-lg sm:text-xl font-bold">{progress.streak}</span>
                    </div>
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-indigo-500" />
                     <button
                        onClick={onLogout}
                        className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                        aria-label="Log Out"
                        title="Log Out"
                    >
                        <LogoutIcon className="w-6 h-6" />
                    </button>
                </div>
            ) : (
                 null
            )}
        </header>
    );
};

export default Header;