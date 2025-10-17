import React, { useState, useMemo } from 'react';
import { User, Language, UserProgress, LessonTopic, Unit, Section } from '../types';
import { LEARNING_PATH } from '../constants';
import Mascot from './Mascot';
import { CheckCircleIcon, BackIcon } from './icons';
import ProgressBar from './ProgressBar';
import GrammarTipCard from './GrammarTipCard';
import { Button, Card, Badge } from './ui/Button';

interface DashboardPageProps {
    user: User | null;
    language: Language;
    progress: UserProgress | null;
    onStartLesson: (topic: LessonTopic) => void;
}

type NodeStatus = 'active' | 'completed';

const LessonNode: React.FC<{
    topic: LessonTopic;
    status: NodeStatus;
    onStart: () => void;
    color: Unit['color'];
    isLast: boolean;
    isNext: boolean;
}> = ({ topic, status, onStart, isLast, isNext }) => {

    const nodeColorClasses = {
        active: {
            base: 'bg-gradient-to-r from-sky-600 to-sky-700',
            top: 'bg-gradient-to-r from-sky-400 to-sky-500',
        },
        completed: {
            base: 'bg-gradient-to-r from-indigo-600 to-indigo-700',
            top: 'bg-gradient-to-r from-indigo-400 to-indigo-500',
        },
    };

    const buttonLabel = status === 'completed' ? 'Review' : 'Start';

    return (
        <div className="relative flex flex-col items-center group">
            {!isLast && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1 h-full bg-slate-700 -z-10 mt-6" />}
            
            <button
                onClick={onStart}
                className={`w-24 h-24 rounded-full relative transition-all duration-200 transform group-hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900`}
                aria-label={`${buttonLabel} lesson: ${topic.title}`}
            >
                <div className={`absolute inset-0 rounded-full ${nodeColorClasses[status].base}`}></div>
                <div className={`absolute inset-0 -translate-y-2 rounded-full border-4 border-slate-900/50 ${nodeColorClasses[status].top} flex items-center justify-center`}>
                    <div className="text-white">
                        {status === 'completed' ? <CheckCircleIcon className="w-10 h-10" aria-hidden="true" /> : <span className="text-4xl" aria-hidden="true">{topic.icon}</span>}
                    </div>
                </div>
                {isNext && status === 'active' && <div className="absolute inset-0 rounded-full animate-pulse-glow"></div>}
            </button>
            <div className={`absolute -bottom-20 w-48 text-center p-2 rounded-lg bg-slate-800/90 backdrop-blur-sm shadow-lg border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10`}>
                 <p className="font-bold text-slate-100">{topic.title}</p>
                 <Button 
                    onClick={onStart} 
                    variant={status === 'completed' ? 'secondary' : 'primary'}
                    size="sm"
                    className="mt-2 w-full"
                >
                    {buttonLabel}
                </Button>
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
        if (completedTopics.includes(topicId)) {
            return 'completed';
        }
        return 'active';
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
            <Button onClick={onBackToSections} variant="ghost" icon={<BackIcon className="w-5 h-5" />} className="mb-6">
                Back to Sections
            </Button>
            <div className="flex flex-col items-center space-y-12">
                <div key={section.sectionNumber} className="w-full">
                    <Card className="w-full max-w-2xl mx-auto mb-8 py-4 border-b-2 border-slate-700">
                        <h2 className="text-responsive-3xl font-extrabold text-center text-slate-100">Section {section.sectionNumber}</h2>
                        <p className="text-center text-responsive-xl font-bold text-teal-400">{section.title}</p>
                    </Card>
                    
                    <div className="flex flex-col items-center space-y-8">
                        {section.units.map((unit) => (
                            <section key={unit.unitNumber} className="w-full max-w-sm">
                                <Card className={`p-4 mb-8 ${unit.color.bg} ${unit.color.shadow}`}>
                                    <h3 className="text-responsive-xl font-extrabold text-white">Unit {unit.unitNumber}: {unit.title}</h3>
                                    <p className="text-white/80">Learn the basics of {unit.title.toLowerCase()}.</p>
                                </Card>
                                <div className="space-y-16 flex flex-col items-center">
                                    {unit.lessons.map((topic, index) => (
                                        <LessonNode
                                            key={topic.id}
                                            topic={topic}
                                            status={getTopicStatus(topic.id)}
                                            isNext={allLessons.findIndex(l => l.id === topic.id) === activeLessonIndex}
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
                    
                    const cardColor = isActive ? 'bg-gradient-to-r from-sky-900/50 to-indigo-900/50' : isCompleted ? 'bg-gradient-to-r from-emerald-900/30 to-green-900/30' : 'bg-slate-800/50';
                    const buttonColor = isActive ? 'primary' : isCompleted ? 'secondary' : 'ghost';
                    const buttonText = isActive ? 'Continue' : isCompleted ? 'Review' : 'Start Here';

                    return (
                        <Card 
                            key={section.sectionNumber} 
                            className={`w-full transition-all duration-300 hover:-translate-y-1 border border-slate-800 ${cardColor}`}
                            hover
                        >
                            <button 
                                onClick={() => onSelectSection(section)}
                                className="w-full text-left"
                                aria-label={`${buttonText} section ${section.sectionNumber}: ${section.title}`}
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-2 text-sm font-bold uppercase text-sky-400 mb-2">
                                            <Badge variant={isActive ? 'info' : isCompleted ? 'success' : 'default'} size="sm">
                                                SECTION {section.sectionNumber}
                                            </Badge>
                                            <span>•</span>
                                            <span>{section.cefrLevel}</span>
                                        </div>
                                        <h3 className={`text-responsive-2xl font-extrabold text-white mt-1`}>{section.title}</h3>
                                        
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
                                            <Button 
                                                variant={buttonColor as any}
                                                size="md"
                                                fullWidth
                                                className="uppercase"
                                            >
                                                {buttonText}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="relative w-32 h-32 flex-shrink-0">
                                        <Mascot className="w-full h-full" />
                                        <div className="absolute -top-4 -right-4 sm:-right-10 bg-slate-800/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
                                            <p className="font-bold text-center text-white text-sm">{section.phrase}</p>
                                            <div className="absolute left-2 -bottom-2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-slate-800"></div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
};


const DashboardPage: React.FC<DashboardPageProps> = (props) => {
    const [viewMode, setViewMode] = useState<'sections' | 'path'>('sections');
    const [selectedSectionNumber, setSelectedSectionNumber] = useState<number | null>(null);

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
        setSelectedSectionNumber(section.sectionNumber);
        setViewMode('path');
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
        </>
    );
};

export default DashboardPage;