import React from 'react';
import { User, Language, UserProgress, LessonTopic } from '../types';
import { LESSON_TOPICS } from '../constants';
import Header from './Header';
import ProgressBar from './ProgressBar';
import { CheckCircleIcon, GreetingsIcon, FoodIcon, TravelIcon, FamilyIcon, HobbiesIcon, WorkIcon } from './icons';

interface DashboardPageProps {
    user: User | null;
    language: Language;
    progress: UserProgress | null;
    onStartLesson: (topic: LessonTopic) => void;
    onChangeLanguage: () => void;
    onLoginClick: () => void;
    onLogout: () => void;
}

const TopicIcon: React.FC<{ topicId: string, className?: string }> = ({ topicId, className }) => {
    switch (topicId) {
        case 'greetings': return <GreetingsIcon className={className} />;
        case 'food': return <FoodIcon className={className} />;
        case 'travel': return <TravelIcon className={className} />;
        case 'family': return <FamilyIcon className={className} />;
        case 'hobbies': return <HobbiesIcon className={className} />;
        case 'work': return <WorkIcon className={className} />;
        default: return <span></span>;
    }
};

const DashboardPage: React.FC<DashboardPageProps> = ({ user, language, progress, onStartLesson, onChangeLanguage, onLoginClick, onLogout }) => {
    return (
        <div>
            <Header user={user} progress={progress} onLoginClick={onLoginClick} onLogout={onLogout} />
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">
                        Learning {language.name} {language.flag}
                    </h2>
                     <button
                        onClick={onChangeLanguage}
                        className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                    >
                        Change Language
                    </button>
                </div>
                {progress ? (
                    <ProgressBar
                        value={progress.completedTopics.length}
                        max={LESSON_TOPICS.length}
                        label="Overall Progress"
                    />
                ) : (
                    <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <p className="font-semibold text-slate-600 dark:text-slate-300">
                            <button onClick={onLoginClick} className="font-bold text-teal-600 dark:text-teal-400 hover:underline">Sign in</button> to save and track your progress!
                        </p>
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Your Learning Path</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {LESSON_TOPICS.map((topic) => {
                        const isCompleted = progress?.completedTopics.includes(topic.id) ?? false;
                        return (
                            <div
                                key={topic.id}
                                className={`p-5 rounded-xl transition-all duration-300 ${
                                    isCompleted 
                                    ? 'bg-teal-100 dark:bg-teal-900/50 border-2 border-teal-500' 
                                    : 'bg-white dark:bg-slate-800 shadow-md'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                            <TopicIcon topicId={topic.id} className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">{topic.title}</h4>
                                            {isCompleted && <p className="text-sm text-teal-600 dark:text-teal-400 font-semibold flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1" /> Completed</p>}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onStartLesson(topic)}
                                        className={`px-6 py-2 rounded-lg font-bold text-white transition-transform transform hover:scale-105 ${
                                            isCompleted
                                            ? 'bg-teal-500 hover:bg-teal-600'
                                            : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                    >
                                        {isCompleted ? 'Review' : 'Start'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;