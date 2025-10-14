import React from 'react';

interface ProgressBarProps {
    value: number;
    max: number;
    label: string;
    labelColor?: string;
    valueColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, label, labelColor = 'text-slate-600 dark:text-slate-400', valueColor = 'text-sky-600 dark:text-sky-400' }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-semibold ${labelColor}`}>{label}</span>
                <span className={`text-sm font-bold ${valueColor}`}>{value} / {max}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div
                    className="bg-sky-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;