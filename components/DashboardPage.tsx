import React, { useState, useMemo } from 'react';
import { User, Language, UserProgress, LessonTopic, Unit, Section } from '../types';
import { LEARNING_PATH } from '../constants';
import Mascot from './Mascot';
import { CheckCircleIcon, BackIcon } from './icons';
import ProgressBar from './ProgressBar';
import GrammarTipCard from './GrammarTipCard';

interface DashboardPageProps {
    user: User | null;
    language: Language;
    progress: UserProgress | null;
    onStartLesson: (topic: LessonTopic) => void;
}

interface SkipConfirmModalProps {
    isOpen: boolean;
    sectionTitle: string;
    onConfirm: () => void;
    onClose: () => void;
}

const SkipConfirmModal: React.FC<SkipConfirmModalProps> = ({ isOpen, sectionTitle, onConfirm, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center animate-fade-in">
            <div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 text-center transform transition-all animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Skip Ahead?</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    You're about to jump to <strong>{`"${sectionTitle}"`}</strong>. We recommend completing sections in order, but you can skip ahead if you're ready.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 font-bold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                    >
                        Yes, Skip Ahead
                    </button>
                </div>
            </div>
        </div>
    );
};

type NodeStatus = 'locked' | 'active' | 'completed';

const LessonNode: React.FC<{
    topic: LessonTopic;
    status: NodeStatus;
    onStart: () => void;
    color: Unit['color'];
    isLast: boolean;
}> = ({ topic, status, onStart, isLast }) => {
    const isLocked = status === 'locked';

    const nodeColorClasses = {
        locked: {
            base: 'bg-slate-700',
            top: 'bg-slate-500',
        },
        active: {
            base: 'bg-green-700',
            top: 'bg-green-500',
        },
        completed: {
            base: 'bg-teal-700',
            top: 'bg-teal-500',
        },
    };

    const buttonLabel = status === 'completed' ? 'Review' : 'Start';

    return (
        <div className="relative flex flex-col items-center group">
            {!isLast && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1 h-full bg-slate-700 -z-10 mt-6" />}
            
            <button
                onClick={onStart}
                disabled={isLocked}
                className={`w-24 h-24 rounded-full relative transition-transform duration-200 ${isLocked ? 'cursor-not-allowed' : 'transform group-hover:-translate-y-1'}`}
                aria-label={`${buttonLabel} lesson: ${topic.title}`}
            >
                <div className={`absolute inset-0 rounded-full ${nodeColorClasses[status].base}`}></div>
                <div className={`absolute inset-0 -translate-y-2 rounded-full border-4 border-slate-900/50 ${nodeColorClasses[status].top} flex items-center justify-center`}>
                    <div className="text-white">
                        {status === 'completed' ? <CheckCircleIcon className="w-10 h-10" /> : <span className="text-4xl">{topic.icon}</span>}
                    </div>
                </div>
                {status === 'active' && <div className="absolute inset-0 rounded-full animate-pulse-glow"></div>}
            </button>
            <div className={`absolute -bottom-20 w-48 text-center p-2 rounded-lg bg-slate-800 shadow-lg border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isLocked ? 'hidden' : ''} z-10`}>
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

interface PathViewProps extends DashboardPageProps {
    selectedSectionNumber: number;
    onBackToSections: () => void;
}

const PathView: React.FC<PathViewProps> = ({ progress, onStartLesson, selectedSectionNumber, onBackToSections }) => {
    const section = LEARNING_PATH.sections.find(s => s.sectionNumber === selectedSectionNumber);

    const completedTopics = progress?.completedTopics ?? [];

    const allLessons = useMemo(() => LEARNING_PATH.sections.flatMap(s => s.units.flatMap(u => u.lessons)), []);

    const activeLessonIndex = useMemo(() => {
        return allLessons.findIndex(lesson => !completedTopics.includes(lesson.id));
    }, [allLessons, completedTopics]);

    const getTopicStatus = (topicId: string): NodeStatus => {
        if (completedTopics.includes(topicId)) return 'completed';
        
        const topicIndex = allLessons.findIndex(l => l.id === topicId);
        
        if (activeLessonIndex === -1) return 'completed'; // All lessons are done
        if (topicIndex < activeLessonIndex) return 'completed'; // Should be covered by the first check, but good for safety
        if (topicIndex === activeLessonIndex) return 'active';
        
        return 'locked';
    };

    if (!section) {
        return (
            <div className="p-4 text-center">
                <p className="text-red-500">Error: Could not find the selected section.</p>
                <button onClick={onBackToSections} className="mt-4 text-sky-400 hover:underline">
                    Back to Sections
                </button>
            </div>
        );
    }
    
    return (
        <div className="px-4">
            <button onClick={onBackToSections} className="flex items-center gap-2 font-bold text-sky-400 mb-6 hover:underline">
                <BackIcon className="w-5 h-5" />
                Back to Sections
            </button>
            <div className="flex flex-col items-center space-y-12">
                <div key={section.sectionNumber} className="w-full">
                    <div className="w-full max-w-2xl mx-auto mb-8 py-4 border-b-2 border-slate-700">
                        <h2 className="text-3xl font-extrabold text-center text-slate-100">Section {section.sectionNumber}</h2>
                        <p className="text-center text-xl font-bold text-teal-400">{section.title}</p>
                    </div>
                    
                    <div className="flex flex-col items-center space-y-8">
                        {section.units.map((unit) => (
                            <section key={unit.unitNumber} className="w-full max-w-sm">
                                <div className={`p-4 rounded-xl mb-8 ${unit.color.bg} ${unit.color.shadow}`}>
                                    <h3 className="text-xl font-extrabold text-white">Unit {unit.unitNumber}: {unit.title}</h3>
                                    <p className="text-white/80">Learn the basics of {unit.title.toLowerCase()}.</p>
                                </div>
                                <div className="space-y-16 flex flex-col items-center">
                                    {unit.lessons.map((topic, index) => (
                                        <LessonNode
                                            key={topic.id}
                                            topic={topic}
                                            status={getTopicStatus(topic.id)}
                                            onStart={() => onStartLesson(topic)}
                                            color={unit.color}
                                            isLast={index === unit.lessons.length - 1}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface SectionsViewProps {
    language: Language;
    sectionProgress: (Section & { completedUnits: number; totalUnits: number; })[];
    onSelectSection: (section: Section) => void;
    activeSectionIndex: number;
}

const SectionsView: React.FC<SectionsViewProps> = ({ language, sectionProgress, onSelectSection, activeSectionIndex }) => {
    
    const getSectionStatus = (index: number): 'completed' | 'active' | 'upcoming' => {
        if (activeSectionIndex === -1) return 'completed';
        if (index < activeSectionIndex) return 'completed';
        if (index === activeSectionIndex) return 'active';
        return 'upcoming';
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <GrammarTipCard language={language} />
            <div className="space-y-4">
                {sectionProgress.map((section, index) => {
                    const status = getSectionStatus(index);
                    const isActive = status === 'active';
                    const isCompleted = status === 'completed';
                    
                    const cardColor = isActive ? 'bg-sky-900/50' : isCompleted ? 'bg-emerald-900/30' : 'bg-slate-800/50';
                    const buttonColor = isActive ? 'bg-sky-500 border-sky-700 hover:bg-sky-600' : isCompleted ? 'bg-slate-500 border-slate-700 hover:bg-slate-600' : 'bg-slate-500 border-slate-700 hover:bg-slate-600';
                    const buttonText = isActive ? 'Continue' : isCompleted ? 'Review' : 'Start Here';

                    return (
                        <button 
                            key={section.sectionNumber} 
                            onClick={() => onSelectSection(section)}
                            className={`w-full p-4 rounded-2xl text-left transition-transform duration-300 hover:-translate-y-1 border border-slate-800 ${cardColor}`}
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex-1 w-full">
                                    <div className="flex items-center gap-2 text-sm font-bold uppercase text-sky-400">
                                        <span>SECTION {section.sectionNumber}</span>
                                        <span>•</span>
                                        <span>{section.cefrLevel}</span>
                                    </div>
                                    <h3 className={`text-2xl font-extrabold text-white mt-1`}>{section.title}</h3>
                                    
                                    <div className="mt-4">
                                        <ProgressBar 
                                            value={section.completedUnits} 
                                            max={section.totalUnits} 
                                            label="Units"
                                            labelColor="text-white/80"
                                            valueColor="text-white"
                                        />
                                    </div>
                                    
                                    <div className="mt-4 sm:hidden"> {/* Mobile Button */}
                                        <span className={`w-full block text-center px-10 py-3 font-bold rounded-xl border-b-4 text-white transition-all uppercase ${buttonColor}`}>
                                            {buttonText}
                                        </span>
                                    </div>
                                </div>
                                <div className="relative w-32 h-32 flex-shrink-0">
                                    <Mascot className="w-full h-full" />
                                    <div className="absolute -top-4 -right-4 sm:-right-10 bg-slate-800 p-2 rounded-lg shadow-lg">
                                        <p className="font-bold text-center text-white text-sm">{section.phrase}</p>
                                        <div className="absolute left-2 -bottom-2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-slate-800"></div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};


const DashboardPage: React.FC<DashboardPageProps> = (props) => {
    const [viewMode, setViewMode] = useState<'sections' | 'path'>('sections');
    const [selectedSectionNumber, setSelectedSectionNumber] = useState<number | null>(null);
    const [showSkipConfirm, setShowSkipConfirm] = useState(false);
    const [targetSection, setTargetSection] = useState<Section | null>(null);

    const completedTopics = useMemo(() => new Set(props.progress?.completedTopics ?? []), [props.progress]);
    
    const sectionProgress = useMemo(() => {
        return LEARNING_PATH.sections.map(section => {
            const totalUnits = section.units.length;
            const completedUnits = section.units.filter(unit => 
                unit.lessons.every(lesson => completedTopics.has(lesson.id))
            ).length;
            return { ...section, completedUnits, totalUnits };
        });
    }, [completedTopics]);

    const activeSectionIndex = sectionProgress.findIndex(s => s.completedUnits < s.totalUnits);

    const handleSelectSection = (section: Section) => {
        const sectionIndex = LEARNING_PATH.sections.findIndex(s => s.sectionNumber === section.sectionNumber);
        const isUpcoming = activeSectionIndex !== -1 && sectionIndex > activeSectionIndex;
        
        if (isUpcoming) {
            setTargetSection(section);
            setShowSkipConfirm(true);
        } else {
            setSelectedSectionNumber(section.sectionNumber);
            setViewMode('path');
        }
    };

    const handleConfirmSkip = () => {
        if (targetSection) {
            setSelectedSectionNumber(targetSection.sectionNumber);
            setViewMode('path');
        }
        setShowSkipConfirm(false);
        setTargetSection(null);
    };

    const handleCloseSkipModal = () => {
        setShowSkipConfirm(false);
        setTargetSection(null);
    };

    const handleBackToSections = () => {
        setViewMode('sections');
        setSelectedSectionNumber(null);
    };
    
    return (
        <>
            {viewMode === 'path' && selectedSectionNumber !== null ? (
                <PathView {...props} selectedSectionNumber={selectedSectionNumber} onBackToSections={handleBackToSections} />
            ) : (
                <SectionsView 
                    language={props.language}
                    sectionProgress={sectionProgress} 
                    onSelectSection={handleSelectSection} 
                    activeSectionIndex={activeSectionIndex}
                />
            )}
             <SkipConfirmModal
                isOpen={showSkipConfirm}
                onClose={handleCloseSkipModal}
                onConfirm={handleConfirmSkip}
                sectionTitle={targetSection?.title || ''}
            />
        </>
    );
};

export default DashboardPage;