
import React from 'react';

const HeroAppMockup: React.FC = () => (
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
        <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
        <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
        <div className="rounded-[2rem] overflow-hidden w-full h-full bg-slate-900">
            {/* Screen Content */}
            <div className="p-4 flex flex-col h-full animate-fade-in">
                 <div className="text-center p-4 rounded-xl bg-slate-800 mb-4">
                     <p className="font-bold text-lg text-white">Translate this sentence</p>
                 </div>
                 <div className="flex justify-center items-center my-4">
                     <span className="text-4xl">☕</span>
                     <p className="text-white text-2xl font-bold ml-4">I would like a coffee</p>
                 </div>
                 <div className="flex-grow flex flex-col justify-end space-y-3">
                     <div className="p-3 bg-slate-800 rounded-lg text-slate-300">Un café, por favor.</div>
                     <div className="p-3 bg-blue-500 rounded-lg text-white font-bold">Me gustaría un café.</div>
                     <div className="p-3 bg-slate-800 rounded-lg text-slate-300">Quiero un café ahora.</div>
                 </div>
                 <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
                     <span className="text-yellow-400 font-bold">XP: 230</span>
                     <span className="text-orange-400 font-bold">Streak: 7 🔥</span>
                 </div>
            </div>
        </div>
    </div>
);

const LiveConversation: React.FC = () => (
     <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-lg">
        <div className="flex justify-start">
            <div className="bg-slate-700 p-3 rounded-xl rounded-bl-none max-w-xs">
                <p className="text-slate-200">¡Hola! ¿Cómo te llamas?</p>
            </div>
        </div>
        <div className="flex justify-end">
             <div className="bg-blue-600 p-3 rounded-xl rounded-br-none max-w-xs">
                <p className="text-white">Me llamo Alex. Mucho gusto.</p>
            </div>
        </div>
        <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <p className="text-sm text-slate-400">Live recording...</p>
        </div>
    </div>
);

const Flashcards: React.FC = () => (
    <div className="relative w-full h-80" style={{ perspective: '1000px' }}>
        {/* Card 2 (Back) */}
        <div className="absolute w-full h-full bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center flex flex-col justify-center transform rotate-6 scale-95 transition-transform duration-300 hover:rotate-3">
            <h3 className="text-4xl font-bold text-slate-200">사과</h3>
            <p className="text-lg text-slate-400 mt-2">(sagwa)</p>
        </div>
        {/* Card 1 (Front) */}
        <div className="absolute w-full h-full bg-yellow-400 rounded-2xl p-6 text-center flex flex-col justify-center transform -rotate-6 transition-transform duration-300 hover:-rotate-2 hover:scale-105">
            <h3 className="text-4xl font-bold text-slate-900">Apple</h3>
            <p className="text-lg text-slate-700 mt-2">Click to flip</p>
        </div>
    </div>
);


const CultureQuest: React.FC = () => (
     <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg text-center">
        <span className="text-6xl">🏯</span>
        <h3 className="text-2xl font-bold text-white mt-4">Japanese Temple Etiquette</h3>
        <p className="text-slate-400 mt-2 mb-4">Learn how to show respect when visiting a sacred site.</p>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
        </div>
        <p className="text-sm text-slate-500 mt-2">45% complete</p>
    </div>
);


export const NewHomePageIllustrations = {
    HeroAppMockup,
    LiveConversation,
    Flashcards,
    CultureQuest
};
