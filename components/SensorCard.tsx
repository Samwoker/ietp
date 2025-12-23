import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
    title: string;
    value: number;
    unit: string;
    icon: LucideIcon;
    color?: 'indigo' | 'cyan' | 'rose' | 'amber';
    max?: number;
}

export function SensorCard({ title, value, unit, icon: Icon, color = 'indigo', max = 100 }: SensorCardProps) {
    const colorStyles = {
        indigo: 'text-indigo-500 stroke-indigo-500',
        cyan: 'text-cyan-400 stroke-cyan-400',
        rose: 'text-rose-500 stroke-rose-500',
        amber: 'text-amber-500 stroke-amber-500',
    };

    const activeColor = colorStyles[color];
    const percentage = Math.min((value / max) * 100, 100);

    // Circle Configuration
    const radius = 80;
    const strokeWidth = 12;
    const normalizedRadius = radius - strokeWidth * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl bg-white backdrop-blur-sm border border-slate-200/50 h-[320px] shadow-xl overflow-hidden aspect-square w-full">

            {/* Title */}
            <h3 className="text-sm uppercase tracking-widest text-slate-600 font-semibold mb-6 z-10">{title}</h3>

            {/* Central Gauge Container */}
            <div className="relative flex items-center justify-center mb-4 z-10">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90"
                >
                    {/* Background Track */}
                    <circle
                        stroke="#e2e8f0"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Progress Arc */}
                    <circle
                        className={`transition-all duration-700 ease-out ${activeColor.split(' ')[1]}`} // Get stroke class
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                </svg>

                {/* Central Value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className={`text-6xl font-bold tracking-tighter ${activeColor.split(' ')[0]}`}>
                        {value}
                    </span>
                    <span className="text-xl text-slate-600 font-medium mt-1">{unit}</span>
                </div>
            </div>

            {/* Icon Indicator (Subtle) */}
            <div className={`mt-auto p-2 rounded-full bg-slate-100 ${activeColor.split(' ')[0]}`}>
                <Icon className="w-5 h-5 opacity-70" />
            </div>

            {/* Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-current opacity-[0.03] blur-3xl pointer-events-none rounded-full" />
        </div>
    );
}
