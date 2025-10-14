import React from 'react';
import { BackIcon, StarIcon } from './icons';

interface TestimonialsPageProps {
    onBack: () => void;
}

// Re-usable component for testimonial cards, copied from HomePage.tsx
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

const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ onBack }) => {
    const testimonials = [
        {
            quote: "The AI conversation is a game-changer. It's the first time I've felt confident practicing speaking without pressure. So much more practical than just matching words!",
            name: "Aarav Sharma",
            country: "Mumbai, India",
            avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Aarav"
        },
        {
            quote: "I love the flashcard system! Being able to create my own decks and have the AI generate them from my mistakes has supercharged my vocabulary learning.",
            name: "Sofia Rossi",
            country: "Bogotá, Colombia",
            avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Sofia"
        },
        {
            quote: "Finally, an app that focuses on culture. The Culture Quests for Japanese are so interesting and make learning feel like exploring a new world.",
            name: "Kenji Tanaka",
            country: "Kathmandu, Nepal",
            avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Kenji"
        },
        {
            quote: "As a busy professional, the 10-minute daily goal is perfect. The lessons are bite-sized but effective. I've learned more Spanish in a month than I did in a year of high school.",
            name: "Emily Chen",
            country: "San Francisco, USA",
            avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Emily"
        },
        {
            quote: "The leaderboards add a fun, competitive edge. It's motivating to see my progress against my friends and other learners worldwide. Keeps me coming back every day!",
            name: "Lukas Müller",
            country: "Berlin, Germany",
            avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Lukas"
        },
        {
            quote: "The pronunciation practice is incredible. Getting an actual score and feedback helped me fix mistakes I didn't even know I was making. My French accent has improved so much.",
            name: "Chloé Dubois",
            country: "Lagos, Nigeria",
            avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Chloe"
        }
    ];

    return (
        <div className="bg-slate-900 min-h-screen text-white">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
                 <button onClick={onBack} className="flex items-center gap-2 font-bold text-sky-400 mb-8 hover:underline">
                    <BackIcon className="w-5 h-5" />
                    Back to Home
                </button>

                <header className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                        Loved by learners worldwide
                    </h1>
                    <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
                        See what our community is saying about their journey with WordVine.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map(testimonial => (
                        <TestimonialCard key={testimonial.name} {...testimonial} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestimonialsPage;
