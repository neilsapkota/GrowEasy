
import React, { useState, useMemo } from 'react';
import { User, RegisteredUser, Language, LeagueTier } from '../types';
import { TrophyIcon, ArrowUpIcon, ArrowDownIcon } from './icons';

const LeaderboardRow: React.FC<{
    rank: number;
    user: User;
    xp: number;
    isCurrentUser: boolean;
    isPromotion: boolean;
    isDemotion: boolean;
}> = ({ rank, user, xp, isCurrentUser, isPromotion, isDemotion }) => {
    return (
        <tr className={`transition-colors ${isCurrentUser ? 'bg-sky-100 dark:bg-sky-900/50' : ''}`}>
            <td className="p-3 sm:p-4 text-center font-bold text-slate-500 dark:text-slate-400">{rank}</td>
            <td className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                    <span className="font-bold text-slate-700 dark:text-slate-200">{user.name}</span>
                </div>
            </td>
            <td className="p-3 sm:p-4 text-right font-bold text-amber-600 dark:text-amber-400">{xp} XP</td>
            <td className="p-3 sm:p-4 text-center">
                {isPromotion && <ArrowUpIcon className="w-5 h-5 text-green-500 mx-auto" title="Promotion Zone" />}
                {isDemotion && <ArrowDownIcon className="w-5 h-5 text-red-500 mx-auto" title="Demotion Zone" />}
            </td>
        </tr>
    );
};

const LeaderboardPage: React.FC<{
    user: User | null;
    registeredUsers: RegisteredUser[];
    selectedLanguage: Language | null;
}> = ({ user, registeredUsers, selectedLanguage }) => {
    const [tab, setTab] = useState<'global' | 'friends'>('global');

    const leagues = useMemo(() => {
        if (!selectedLanguage) return {};

        const usersInLanguage = registeredUsers
            .map(ru => ({
                ...ru.user,
                progress: ru.progress[selectedLanguage.id],
                friends: ru.friends,
            }))
            .filter(u => u.progress && u.progress.xp > 0)
            .sort((a, b) => b.progress.xp - a.progress.xp);
        
        const friendsList = registeredUsers.find(ru => ru.user.email === user?.email)?.friends ?? [];
        
        const friendsAndMe = usersInLanguage.filter(u => friendsList.includes(u.email) || u.email === user?.email);

        const globalLeagues = {
            [LeagueTier.Gold]: usersInLanguage.slice(0, 10),
        };
        const friendLeagues = {
            [LeagueTier.Gold]: friendsAndMe.sort((a,b) => b.progress.xp - a.progress.xp),
        };

        return tab === 'global' ? globalLeagues : friendLeagues;

    }, [registeredUsers, selectedLanguage, user, tab]);

    if (!user) {
         return (
             <div className="p-4 sm:p-6 lg:p-8 text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Leaderboard</h2>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                    <p className="text-lg">Please log in to see your ranking!</p>
                </div>
            </div>
        )
    }

    if (!selectedLanguage) {
         return (
             <div className="p-4 sm:p-6 lg:p-8 text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Leaderboard</h2>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                    <p className="text-lg">Please select a language to view the leaderboard.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">Leaderboard</h2>
            
            <div className="flex justify-center mb-6">
                <div className="relative flex p-1 bg-slate-200 dark:bg-slate-700 rounded-full">
                    <button
                        onClick={() => setTab('global')}
                        className={`relative w-28 py-2 text-sm font-bold rounded-full z-10 transition-colors ${tab === 'global' ? 'text-white' : 'text-slate-500'}`}
                        aria-pressed={tab === 'global'}
                    >
                        Global
                    </button>
                    <button
                        onClick={() => setTab('friends')}
                        className={`relative w-28 py-2 text-sm font-bold rounded-full z-10 transition-colors ${tab === 'friends' ? 'text-white' : 'text-slate-500'}`}
                        aria-pressed={tab === 'friends'}
                    >
                        Friends
                    </button>
                    <div 
                        className="absolute top-1 bottom-1 w-28 bg-teal-500 rounded-full transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(${tab === 'global' ? '0%' : '100%'})` }}
                    ></div>
                </div>
            </div>

            {Object.entries(leagues).map(([league, users]) => (
                <div key={league} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-4 bg-slate-100 dark:bg-slate-700/50 flex items-center gap-3 border-b border-slate-200 dark:border-slate-700">
                        <TrophyIcon className="w-8 h-8 text-amber-500" />
                        <div>
                            <h3 className="text-xl font-bold">{league} League</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Top 3 advance to the next league!</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                                <tr>
                                    <th className="p-3 sm:p-4 w-16">Rank</th>
                                    <th className="p-3 sm:p-4 text-left">Learner</th>
                                    <th className="p-3 sm:p-4 text-right">XP</th>
                                    <th className="p-3 sm:p-4 w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(users as any[]).map((u, index) => (
                                    <LeaderboardRow
                                        key={u.email}
                                        rank={index + 1}
                                        user={u}
                                        xp={u.progress.xp}
                                        isCurrentUser={u.email === user.email}
                                        isPromotion={index < 3}
                                        isDemotion={index > 6 && tab === 'global'}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LeaderboardPage;