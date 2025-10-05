import React from 'react';
import { User, Language, UserProgress, LessonTopic } from '../types';
import { UNITS, LESSON_TOPICS, Unit } from '../constants';
import { CheckCircleIcon, GreetingsIcon, FoodIcon, TravelIcon, FamilyIcon, HobbiesIcon, WorkIcon, BookOpenIcon, ChestIcon, StarIcon } from './icons';

interface DashboardPageProps {
    user: User | null;
    language: Language;
    progress: UserProgress | null;
    onStartLesson: (topic: LessonTopic) => void;
}

const TopicIcon: React.FC<{ topicId: string, className?: string }> = ({ topicId, className }) => {
    switch (topicId) {
        case 'greetings': return <GreetingsIcon className={className} />;
        case 'food': return <FoodIcon className={className} />;
        case 'travel': return <TravelIcon className={className} />;
        case 'family': return <FamilyIcon className={className} />;
        case 'hobbies': return <HobbiesIcon className={className} />;
        case 'work': return <WorkIcon className={className} />;
        default: return <span className={className}></span>;
    }
};

type NodeStatus = 'locked' | 'active' | 'completed';

const LessonNode: React.FC<{
    topic: LessonTopic;
    status: NodeStatus;
    onStart: () => void;
    color: Unit['color'];
    isLast: boolean;
}> = ({ topic, status, onStart, color, isLast }) => {
    const isLocked = status === 'locked';

    const nodeColorClasses = {
        locked: 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600',
        active: `${color.bg} border-4 ${color.border}`,
        completed: 'bg-teal-500 border-4 border-teal-600',
    };

    const textColorClasses = {
        locked: 'text-slate-400 dark:text-slate-500',
        active: 'text-white',
        completed: 'text-white',
    };
    
    const buttonLabel = status === 'completed' ? 'Review' : 'Start';

    return (
         <div className="relative flex flex-col items-center group">
            {!isLast && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1 h-full bg-slate-200 dark:bg-slate-700 -z-10 mt-6" />}
            
            <button
                onClick={onStart}
                disabled={isLocked}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 relative focus:outline-none focus:ring-4 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                    nodeColorClasses[status]
                } ${
                    isLocked ? 'cursor-not-allowed' : 'transform group-hover:scale-110'
                } ${
                    status === 'active' ? 'animate-pulse-live' : ''
                }`}
                aria-label={`${buttonLabel} lesson: ${topic.title}`}
            >
                <div className={`${textColorClasses[status]}`}>
                    {status === 'completed' ? <CheckCircleIcon className="w-12 h-12" /> : <TopicIcon topicId={topic.id} className="w-10 h-10" />}
                </div>
            </button>
            <div className={`absolute -bottom-20 w-48 text-center p-2 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isLocked ? 'hidden' : ''}`}>
                 <p className="font-bold">{topic.title}</p>
                 <button 
                    onClick={onStart} 
                    className={`mt-2 w-full py-2 rounded-lg font-bold text-white uppercase text-sm ${status === 'completed' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-green-500 hover:bg-green-600 border-b-4 border-green-700'}`}
                >
                    {buttonLabel}
                </button>
            </div>
         </div>
    );
};


const DashboardPage: React.FC<DashboardPageProps> = ({ language, progress, onStartLesson }) => {
    
    const completedTopics = progress?.completedTopics ?? [];
    let activeTopicFound = false;

    const getTopicStatus = (topicId: string): NodeStatus => {
        if (completedTopics.includes(topicId)) {
            return 'completed';
        }
        if (!activeTopicFound) {
            activeTopicFound = true;
            return 'active';
        }
        return 'locked';
    };

    // Flatten all lessons to determine the active one correctly across units
    const allLessons = UNITS.flatMap(unit => unit.lessons);
    const activeLessonIndex = allLessons.findIndex(lesson => !completedTopics.includes(lesson.id));
    
    const isUnitActive = (unit: Unit) => {
        if(activeLessonIndex === -1) return false; // All completed
        const firstLessonOfUnitIndex = allLessons.findIndex(l => l.id === unit.lessons[0].id);
        const lastLessonOfUnitIndex = allLessons.findIndex(l => l.id === unit.lessons[unit.lessons.length -1].id);
        return activeLessonIndex >= firstLessonOfUnitIndex && activeLessonIndex <= lastLessonOfUnitIndex;
    };


    return (
        <div className="px-4">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Learning {language.name} {language.flag}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10">Select a lesson to start your journey!</p>

            <div className="flex flex-col items-center space-y-8">
                {UNITS.map((unit) => (
                    <section key={unit.unitNumber} className="w-full max-w-sm">
                        <div className={`p-4 rounded-xl mb-8 ${unit.color.bg} ${unit.color.shadow}`}>
                            <h3 className="text-xl font-extrabold text-white">Unit {unit.unitNumber}: {unit.title}</h3>
                            <p className="text-white/80">Learn the basics of {unit.title.toLowerCase()}.</p>
                        </div>
                        <div className="space-y-16 flex flex-col items-center">
                            {unit.lessons.map((topic, index) => {
                                 // We need to reset the flag for each render
                                activeTopicFound = false; 
                                return (
                                    <LessonNode
                                        key={topic.id}
                                        topic={topic}
                                        status={getTopicStatus(topic.id)}
                                        onStart={() => onStartLesson(topic)}
                                        color={unit.color}
                                        isLast={index === unit.lessons.length - 1}
                                    />
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;