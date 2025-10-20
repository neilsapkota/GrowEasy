
import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { NewHomePageIllustrations } from './NewHomePageIllustrations';
import { GlobeAltIcon, StarIcon } from './icons';
import { Page } from '../types';
import AnimatedParrot from './AnimatedParrot';

// === START ANIMATED GLOBE BACKGROUND ===

function Globe() {
    const globeRef = useRef<THREE.Group>(null!);

    useFrame(() => {
        if (globeRef.current) {
            globeRef.current.rotation.y += 0.001;
            globeRef.current.rotation.x += 0.0005;
        }
    });

    const arcs = useMemo(() => {
        const points = [];
        const radius = 5;
        for (let i = 0; i < 30; i++) {
            // Get two random points on a sphere
            const start = new THREE.Vector3().setFromSphericalCoords(radius, Math.acos(1 - 2 * Math.random()), Math.random() * 2 * Math.PI);
            const end = new THREE.Vector3().setFromSphericalCoords(radius, Math.acos(1 - 2 * Math.random()), Math.random() * 2 * Math.PI);

            // Calculate midpoint for the curve's control point
            const mid = start.clone().lerp(end, 0.5);
            mid.normalize();
            mid.multiplyScalar(radius + 1 + Math.random() * 1.5);

            const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
            points.push(curve.getPoints(30));
        }
        return points;
    }, []);

    return (
        <group ref={globeRef}>
            <mesh>
                <sphereGeometry args={[5, 32, 32]} />
                <meshStandardMaterial color="#1f2937" transparent opacity={0.7} roughness={0.5} />
            </mesh>
            <mesh>
                <sphereGeometry args={[5.01, 32, 32]} />
                <meshStandardMaterial color="#38bdf8" wireframe />
            </mesh>
            {arcs.map((points, i) => (
                <Line
                    key={i}
                    points={points}
                    color="white"
                    lineWidth={1.5}
                    transparent
                    opacity={0.25}
                />
            ))}
        </group>
    );
}

const GlobeBackground = () => (
  <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
    <ambientLight intensity={0.2} />
    <pointLight position={[20, 20, 20]} intensity={1} color="#6366f1" />
    <pointLight position={[-20, -20, -10]} intensity={0.7} color="#38bdf8" />
    <Globe />
  </Canvas>
);

// === END ANIMATED GLOBE BACKGROUND ===


// Re-usable component for feature sections
const FeatureSection: React.FC<{
    title: string;
    description: string;
    illustration: React.ReactNode;
    reverse?: boolean;
}> = ({ title, description, illustration, reverse = false }) => {
    const direction = reverse ? 'lg:flex-row-reverse' : 'lg:flex-row';
    return (
        <div className={`flex flex-col ${direction} items-center justify-center gap-12 lg:gap-24 py-16 lg:py-24`}>
            <div className="lg:w-1/2 max-w-lg text-center lg:text-left">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-100 mb-4" style={{ color: '#6366f1' }}>{title}</h2>
                <p className="text-lg text-slate-400">{description}</p>
            </div>
            <div className="lg:w-1/2 max-w-md w-full">
                {illustration}
            </div>
        </div>
    );
};

// Re-usable component for testimonial cards
const TestimonialCard: React.FC<{ quote: string; name: string; country: string; avatar: string; }> = ({ quote, name, country, avatar }) => (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-full flex flex-col">
        <div className="flex mb-2">
            {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5 text-yellow-400" />)}
        </div>
        <p className="text-slate-300 italic flex-grow">"{quote}"</p>
        <div className="flex items-center mt-4">
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover mr-4" />
            <div>
                <p className="font-bold text-slate-100">{name}</p>
                <p className="text-sm text-slate-400">{country}</p>
            </div>
        </div>
    </div>
);


const HomePage: React.FC<{ onGetStarted: () => void; onNavigate: (page: Page) => void; }> = ({ onGetStarted, onNavigate }) => {
    const [originUrl, setOriginUrl] = useState('');
    const [isHoveringButton, setIsHoveringButton] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOriginUrl(window.location.origin);
        }
    }, []);

    return (
        <div className="bg-slate-900 text-white font-sans">
            {/* New animated globe background, fixed behind everything */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-40">
                <GlobeBackground />
            </div>

            {/* All page content goes here, with a relative position to create a stacking context */}
            <div className="relative">
                {/* --- TEMPORARY BOX TO SHOW THE URL --- */}
                {originUrl && (
                    <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-black p-4 z-[100] text-center shadow-lg">
                        <h2 className="font-extrabold text-lg">COPY THIS URL FOR GOOGLE SIGN-IN:</h2>
                        <p 
                            className="font-mono text-xl bg-white p-2 rounded mt-2 select-all"
                        >
                            {originUrl}
                        </p>
                        <p className="text-sm mt-2">Paste this into your Google Cloud Console's "Authorized JavaScript origins".</p>
                    </div>
                )}
                
                {/* --- Navbar --- */}
                <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 mt-[115px]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            <div className="flex-shrink-0">
                                <h1 className="text-3xl font-extrabold text-indigo-400">Vocal AI</h1>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <button onClick={() => onNavigate(Page.Features)} className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Features</button>
                                    <button onClick={() => onNavigate(Page.Testimonials)} className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Testimonials</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* --- Hero Section --- */}
                <header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden p-4 pt-10 pb-20">
                    <AnimatedParrot onHoverTarget={isHoveringButton} />

                    <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 sm:px-6 lg:px-8">
                        <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
                            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                                Learn any language, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">your way.</span>
                            </h1>
                            <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-slate-300">
                                Master practical, real-world conversations with an AI-powered learning experience designed just for you. Fun, effective, and free to start.
                            </p>
                            <button
                                onClick={onGetStarted}
                                onMouseEnter={() => setIsHoveringButton(true)}
                                onMouseLeave={() => setIsHoveringButton(false)}
                                className="px-8 py-4 text-lg font-bold text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-800 transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 shadow-2xl hover:shadow-indigo-500/40"
                            >
                                Start Learning Now
                            </button>
                        </div>
                        <div className="animate-fade-in-up animation-delay-300">
                            <NewHomePageIllustrations.HeroAppMockup />
                        </div>
                    </div>
                </header>

                {/* --- Features Section --- */}
                <main id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FeatureSection
                        title="Real Conversations, Not Just Sentences."
                        description="Practice speaking in real-world scenarios with our AI tutor. From ordering coffee to booking a taxi, build confidence for the conversations that matter."
                        illustration={<NewHomePageIllustrations.LiveConversation />}
                    />
                    <FeatureSection
                        title="Master Vocabulary That Sticks."
                        description="Create custom flashcard decks or use our AI-generated cards based on your weak spots. Our smart review system uses spaced repetition to maximize retention."
                        illustration={<NewHomePageIllustrations.Flashcards />}
                        reverse
                    />
                    <FeatureSection
                        title="Learn Through Culture, Not Just Words."
                        description="Go beyond grammar with Culture Quests. Explore traditions, etiquette, and history to truly understand the language and its people."
                        illustration={<NewHomePageIllustrations.CultureQuest />}
                    />
                </main>

                {/* --- Social Proof / Testimonials --- */}
                <section id="testimonials" className="py-16 lg:py-24 bg-slate-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-100">Loved by learners worldwide</h2>
                            <p className="mt-4 text-lg text-slate-400">See what our community is saying about Vocal AI.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <TestimonialCard
                                quote="The AI conversation is a game-changer. It's the first time I've felt confident practicing speaking without pressure. So much more practical than just matching words!"
                                name="Aarav Sharma"
                                country="Mumbai, India"
                                avatar="https://api.dicebear.com/8.x/avataaars/svg?seed=Aarav"
                            />
                            <TestimonialCard
                                quote="I love the flashcard system! Being able to create my own decks and have the AI generate them from my mistakes has supercharged my vocabulary learning."
                                name="Sofia Rossi"
                                country="Bogotá, Colombia"
                                avatar="https://api.dicebear.com/8.x/avataaars/svg?seed=Sofia"
                            />
                            <TestimonialCard
                                quote="Finally, an app that focuses on culture. The Culture Quests for Japanese are so interesting and make learning feel like exploring a new world."
                                name="Kenji Tanaka"
                                country="Kathmandu, Nepal"
                                avatar="https://api.dicebear.com/8.x/avataaars/svg?seed=Kenji"
                            />
                        </div>
                    </div>
                </section>

                {/* --- Final CTA --- */}
                <section className="py-20 lg:py-32">
                    <div className="text-center max-w-3xl mx-auto px-4">
                        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8">Ready to start your adventure?</h2>
                        <p className="text-lg text-slate-300 mb-10">Join millions of learners and take the first step towards fluency today. Your first lesson is just a click away.</p>
                        <button
                            onClick={onGetStarted}
                            className="px-10 py-5 text-xl font-bold text-slate-900 bg-[#FFD700] rounded-xl hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-700 transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 shadow-2xl hover:shadow-yellow-400/40"
                        >
                            Try Vocal AI for Free
                        </button>
                    </div>
                </section>

                {/* --- Footer --- */}
                <footer className="bg-slate-900 border-t border-slate-800">
                    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-slate-400 text-center">
                        <div className="flex justify-center items-center gap-4 text-sm">
                            <p>&copy; {new Date().getFullYear()} Vocal AI. All rights reserved.</p>
                            <button onClick={() => onNavigate(Page.About)} className="hover:text-white hover:underline transition-colors">
                                About
                            </button>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default HomePage;