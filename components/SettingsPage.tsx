import React, { useState } from 'react';
import { User, AppSettings, Theme } from '../types';

interface SettingsPageProps {
    user: User | null;
    appSettings: AppSettings;
    onUpdateUser: (updatedUser: Partial<User>) => void;
    onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
    onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, appSettings, onUpdateUser, onUpdateSettings, onLogout }) => {
    const [name, setName] = useState(user?.name || '');
    const [nameFeedback, setNameFeedback] = useState('');

    const handleNameSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && name.trim() !== user?.name) {
            onUpdateUser({ name: name.trim() });
            setNameFeedback('Name updated successfully!');
            setTimeout(() => setNameFeedback(''), 2000);
        }
    };
    
    const handleThemeChange = (theme: Theme) => {
        onUpdateSettings({ theme });
    };

    const handleSoundToggle = () => {
        onUpdateSettings({ soundEffectsEnabled: !appSettings.soundEffectsEnabled });
    };

    if (!user) {
         return (
             <div className="p-4 sm:p-6 lg:p-8 text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Settings</h2>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                    <p className="text-lg">Please log in to manage your settings.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">Settings</h2>

            <div className="space-y-10">
                {/* Account Section */}
                <section>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Account</h3>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
                        <form onSubmit={handleNameSave} className="flex items-center gap-4">
                            <div className="flex-grow">
                                <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Your Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 text-lg bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                            <button type="submit" className="self-end px-6 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors">Save</button>
                        </form>
                        {nameFeedback && <p className="text-sm text-green-600 mt-2">{nameFeedback}</p>}
                        <button onClick={onLogout} className="mt-6 text-sm text-rose-500 hover:underline">Log Out</button>
                    </div>
                </section>
                
                {/* Appearance Section */}
                <section>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Appearance</h3>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Theme</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                           {(['light', 'dark', 'system'] as Theme[]).map(theme => (
                               <button 
                                key={theme}
                                onClick={() => handleThemeChange(theme)}
                                className={`flex-1 p-3 rounded-lg font-semibold capitalize text-center transition-colors ${appSettings.theme === theme ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                               >
                                {theme}
                               </button>
                           ))}
                        </div>
                    </div>
                </section>

                {/* Audio Section */}
                <section>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Audio</h3>
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-lg font-semibold">Sound Effects</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Play sounds for correct/incorrect answers.</p>
                            </div>
                            <button
                                onClick={handleSoundToggle}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${appSettings.soundEffectsEnabled ? 'bg-teal-600' : 'bg-slate-200 dark:bg-slate-600'}`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${appSettings.soundEffectsEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                                />
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default SettingsPage;