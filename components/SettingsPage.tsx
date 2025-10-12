
import React from 'react';
import { AppSettings, Theme } from '../types';

interface SettingsPageProps {
    appSettings: AppSettings;
    onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
    onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ appSettings, onUpdateSettings, onLogout }) => {
    
    const handleThemeChange = (theme: Theme) => {
        onUpdateSettings({ theme });
    };

    const handleSoundToggle = () => {
        onUpdateSettings({ soundEffectsEnabled: !appSettings.soundEffectsEnabled });
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">Settings</h2>

            <div className="space-y-10">
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
                
                {/* Account Section */}
                <section>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Account</h3>
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
                        <button onClick={onLogout} className="text-sm font-semibold text-rose-500 hover:underline">
                            Log Out
                        </button>
                     </div>
                </section>
            </div>
        </div>
    );
};

export default SettingsPage;
