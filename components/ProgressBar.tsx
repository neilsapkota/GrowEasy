
import React from 'react';

interface ProgressBarProps {
    value: number;
    max: number;
    label: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, label }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{label}</span>
                <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{value} / {max}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div
                    className="bg-teal-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
