
import React from 'react';
import { AppSettings, Theme } from '../types';
import { AccessibilitySettings } from './ThemeProvider';

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
            <h1 className="text-responsive-3xl font-bold text-slate-100 mb-8">Settings</h1>

            <div className="space-y-8">
                {/* Appearance Section */}
                <section aria-labelledby="appearance-heading">
                    <h2 id="appearance-heading" className="text-responsive-xl font-bold text-slate-200 border-b border-slate-700 pb-2 mb-6">Appearance</h2>
                    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700">
                        <label className="block text-sm font-medium text-slate-300 mb-4">Theme Preference</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                           {(['light', 'dark', 'system'] as Theme[]).map(theme => (
                               <button 
                                key={theme}
                                onClick={() => handleThemeChange(theme)}
                                className={`p-4 rounded-xl font-semibold capitalize text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                                    appSettings.theme === theme 
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105' 
                                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white hover:scale-105'
                                }`}
                                aria-pressed={appSettings.theme === theme}
                                aria-label={`Set theme to ${theme}`}
                               >
                                <div className="flex items-center justify-center space-x-2">
                                    {theme === 'light' && <span aria-hidden="true">☀️</span>}
                                    {theme === 'dark' && <span aria-hidden="true">🌙</span>}
                                    {theme === 'system' && <span aria-hidden="true">💻</span>}
                                    <span>{theme}</span>
                                </div>
                               </button>
                           ))}
                        </div>
                        <p className="text-sm text-slate-400 mt-3">
                            {appSettings.theme === 'system' 
                                ? 'Theme follows your system preference' 
                                : `Using ${appSettings.theme} theme`}
                        </p>
                    </div>
                </section>

                {/* Accessibility Section */}
                <section aria-labelledby="accessibility-heading">
                    <h2 id="accessibility-heading" className="text-responsive-xl font-bold text-slate-200 border-b border-slate-700 pb-2 mb-6">Accessibility</h2>
                    <AccessibilitySettings />
                </section>

                {/* Audio Section */}
                <section aria-labelledby="audio-heading">
                    <h2 id="audio-heading" className="text-responsive-xl font-bold text-slate-200 border-b border-slate-700 pb-2 mb-6">Audio</h2>
                     <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-100 mb-1">Sound Effects</h3>
                                <p className="text-sm text-slate-400">Play sounds for correct/incorrect answers and interactions.</p>
                            </div>
                            <button
                                onClick={handleSoundToggle}
                                className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                                    appSettings.soundEffectsEnabled 
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                                    : 'bg-slate-600'
                                }`}
                                role="switch"
                                aria-checked={appSettings.soundEffectsEnabled}
                                aria-label={`${appSettings.soundEffectsEnabled ? 'Disable' : 'Enable'} sound effects`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                        appSettings.soundEffectsEnabled ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </section>
                
                {/* Account Section */}
                <section aria-labelledby="account-heading">
                    <h2 id="account-heading" className="text-responsive-xl font-bold text-slate-200 border-b border-slate-700 pb-2 mb-6">Account</h2>
                     <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-100 mb-1">Sign Out</h3>
                                <p className="text-sm text-slate-400">Sign out of your NovaLingo account</p>
                            </div>
                            <button 
                                onClick={onLogout} 
                                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-105"
                                aria-label="Sign out of your account"
                            >
                                Sign Out
                            </button>
                        </div>
                     </div>
                </section>
            </div>
        </div>
    );
};

export default SettingsPage;
