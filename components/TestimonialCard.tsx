import React from 'react';
import { StarIcon } from './icons';

export interface TestimonialCardProps {
    quote: string;
    name: string;
    country: string;
    avatar: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, country, avatar }) => (
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