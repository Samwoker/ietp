'use client';

import React from 'react';
import { Brain, Sparkles, ShieldCheck, Lightbulb } from 'lucide-react';

interface AIAgentCardProps {
    analysis: string;
    killPercentage: number;
    insight?: string;
}

export function AIAgentCard({ analysis, killPercentage, insight }: AIAgentCardProps) {
    const isComplete = killPercentage >= 100;

    return (
        <div className="relative overflow-hidden rounded-2xl border border-indigo-200/50 bg-white/70 backdrop-blur-xl p-8 col-span-1 md:col-span-2 flex flex-col justify-between shadow-sm">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />

            <div className="flex flex-col md:flex-row gap-8 items-start mb-6">

                {/* Avatar / Icon */}
                <div className="flex-shrink-0">
                    <div className={`
              h-16 w-16 rounded-2xl flex items-center justify-center
              bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20
              ${isComplete ? 'from-emerald-500 to-teal-500 shadow-emerald-500/20' : ''}
            `}>
                        {isComplete ? (
                            <ShieldCheck className="w-8 h-8 text-white" />
                        ) : (
                            <Brain className="w-8 h-8 text-white animate-pulse" />
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 w-full space-y-5">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Sterilization Analysis</h3>
                        </div>

                        <div className="min-h-[3rem]">
                            <p className="text-lg text-slate-800 leading-relaxed font-light">
                                "{analysis}"
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Pathogen Elimination</span>
                            <span className={`font-mono font-bold ${isComplete ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                {killPercentage.toFixed(1)}%
                            </span>
                        </div>

                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ease-out 
                    ${isComplete ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}
                  `}
                                style={{ width: `${Math.min(killPercentage, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Insight Section */}
            {insight && (
                <div className="mt-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                        <Lightbulb className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-indigo-200 mb-1">Process Insight</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                {insight}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
