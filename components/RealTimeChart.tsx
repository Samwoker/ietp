'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SensorDataPoint } from '../types';

interface RealTimeChartProps {
    data: SensorDataPoint[];
    dataKey: 'temperature' | 'pressure';
    color: string;
    unit: string;
    title: string;
}

export function RealTimeChart({ data, dataKey, color, unit, title }: RealTimeChartProps) {
    return (
        <div className="h-full w-full rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">{title} History</h3>
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-${color}-400`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 bg-${color}-500`}></span>
                    </span>
                    <span className="text-xs font-medium text-slate-500">LIVE</span>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="time"
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            domain={['auto', 'auto']}
                            unit={unit}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                color: '#1e293b'
                            }}
                            itemStyle={{ color: '#334155' }}
                        />
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={2}
                            fill={`url(#gradient-${dataKey})`}
                            animationDuration={300}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
