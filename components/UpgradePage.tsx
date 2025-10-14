import React, { useState } from 'react';
import { SparklesIcon, CheckCircleIcon, UsersIcon, LockIcon } from './icons';

interface UpgradePageProps {
    onUpgrade: () => void;
    onBack: () => void;
}

const UpgradePage: React.FC<UpgradePageProps> = ({ onUpgrade, onBack }) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');

    const proFeatures = [
        { icon: SparklesIcon, text: 'Unlock all advanced AI practice modes' },
        { icon: CheckCircleIcon, text: 'Unlimited practice sessions' },
        { icon: UsersIcon, text: 'Access to exclusive community features' },
        { icon: LockIcon, text: 'Early access to new features' },
    ];
    
    const yearlyPrice = 4.99;
    const monthlyPrice = 9.99;
    const yearlyTotal = (yearlyPrice * 12).toFixed(2);
    const savings = (((monthlyPrice * 12) - (yearlyPrice * 12)) / (monthlyPrice * 12) * 100).toFixed(0);

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in-up">
            <button onClick={onBack} className="text-sm font-bold text-sky-500 hover:underline mb-6">
                &larr; Back to Dashboard
            </button>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8 bg-gradient-to-br from-amber-400 to-orange-600 text-white text-center">
                    <SparklesIcon className="w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-4xl font-extrabold">Go Pro</h2>
                    <p className="mt-2 text-lg text-white/80">Unlock your full learning potential with Fluentli Pro.</p>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Pro benefits include:</h3>
                            <ul className="space-y-4">
                                {proFeatures.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <feature.icon className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-slate-700 dark:text-slate-300">{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-center mb-4">
                                <div className="relative flex p-1 bg-slate-200 dark:bg-slate-700 rounded-full">
                                    <button
                                        onClick={() => setBillingCycle('monthly')}
                                        className={`relative w-28 py-2 text-sm font-bold rounded-full z-10 transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}
                                        aria-pressed={billingCycle === 'monthly'}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setBillingCycle('annually')}
                                        className={`relative w-28 py-2 text-sm font-bold rounded-full z-10 transition-colors ${billingCycle === 'annually' ? 'text-white' : 'text-slate-500'}`}
                                        aria-pressed={billingCycle === 'annually'}
                                    >
                                        Annually
                                    </button>
                                    <div 
                                        className="absolute top-1 bottom-1 w-28 bg-teal-500 rounded-full transition-transform duration-300 ease-in-out"
                                        style={{ transform: `translateX(${billingCycle === 'monthly' ? '0%' : '100%'})` }}
                                    ></div>
                                </div>
                            </div>
                            
                            <div className="text-center">
                                {billingCycle === 'annually' && (
                                     <p className="text-sm font-bold text-green-500">Save {savings}%!</p>
                                )}
                                <p className="my-2">
                                    <span className="text-5xl font-extrabold">${billingCycle === 'annually' ? yearlyPrice : monthlyPrice}</span>
                                    <span className="text-slate-500"> / month</span>
                                </p>
                                <p className="text-sm text-slate-500">
                                    {billingCycle === 'annually' ? `Billed as $${yearlyTotal} per year` : 'Billed monthly'}
                                </p>
                            </div>
                            
                            <button 
                                onClick={onUpgrade}
                                className="w-full mt-6 py-4 text-lg font-bold text-white bg-green-500 rounded-xl border-b-4 border-green-700 hover:bg-green-600 transition-all uppercase active:translate-y-0.5"
                            >
                                Upgrade Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradePage;