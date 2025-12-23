import React from 'react';
import { History, CheckCircle, XCircle } from 'lucide-react';
import { Cycle } from '../types';

interface HistoryListProps {
    cycles: Cycle[];
}

export function HistoryList({ cycles }: HistoryListProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white backdrop-blur-sm p-6 overflow-hidden h-full flex flex-col shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-800">Cycle History</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {cycles.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-sm">
                        No cycles recorded yet.
                    </div>
                ) : (
                    cycles.slice().reverse().map((cycle) => (
                        <div
                            key={cycle.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                {cycle.status === 'COMPLETED' ? (
                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-rose-500" />
                                )}
                                <div>
                                    <p className="text-sm font-medium text-slate-800">
                                        Cycle #{cycle.id.toUpperCase()}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {new Date(cycle.endTime).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-800">
                                    {cycle.maxTemp.toFixed(1)}°C
                                </p>
                                <p className="text-xs text-slate-500">
                                    Max Temp
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
