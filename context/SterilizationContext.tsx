'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { calculateGermKillRate } from '../utils/sterilizationLogic';
import { generateCycleInsight } from '../services/aiService';
import { Cycle, SensorDataPoint } from '../types';



interface SterilizationContextType {
    current: { temperature: number; pressure: number };
    history: SensorDataPoint[];
    cycleHistory: Cycle[];
    killPercentage: number;
    aiInsight: string;
    isSimulating: boolean;
    startSimulation: () => void;
    stopSimulation: () => void;
    toggleDataSource: () => void;
    useApi: boolean;
}

const SterilizationContext = createContext<SterilizationContextType | undefined>(undefined);

export function SterilizationProvider({ children }: { children: React.ReactNode }) {
    // Sensor Data State
    const [data, setData] = useState<SensorDataPoint[]>([]);
    const [current, setCurrent] = useState({ temperature: 20, pressure: 100 });
    const [killPercentage, setKillPercentage] = useState(0);

    // Refs to hold latest values for the interval closure without resetting it
    const currentRef = useRef(current);
    useEffect(() => { currentRef.current = current; }, [current]);

    // Cycle History State
    const [cycleHistory, setCycleHistory] = useState<Cycle[]>([]);
    const [aiInsight, setAiInsight] = useState<string>("System Ready. Waiting for cycle data...");
    const [isSimulating, setIsSimulating] = useState(false);
    const [useApi, setUseApi] = useState(true);

    // Simulation Refs
    const phase = useRef<'HEATING' | 'HOLDING' | 'COOLING'>('HEATING');
    const killAccumulator = useRef(0);
    const cycleStartTime = useRef<string | null>(null);
    const maxTempRef = useRef(0);
    const minPressureRef = useRef(100);

    const TARGET_KILL_POINTS = 300;

    const startSimulation = () => {
        setIsSimulating(true);
        setUseApi(false);
    };
    const stopSimulation = () => setIsSimulating(false);
    const toggleDataSource = () => setUseApi(prev => !prev);

    // Cycle Management Logic (Shared)
    const handleCycleLogic = (temp: number, timeDelta: number) => {
        // Track Min/Max
        if (temp > maxTempRef.current) maxTempRef.current = temp;

        const tickKill = calculateGermKillRate(temp, timeDelta);
        killAccumulator.current += tickKill;

        if (!cycleStartTime.current && temp > 50) {
            cycleStartTime.current = new Date().toISOString();
            killAccumulator.current = 0;
        }

        if (cycleStartTime.current && killAccumulator.current >= TARGET_KILL_POINTS) {
            const newCycle: Cycle = {
                id: Math.random().toString(36).substr(2, 9),
                startTime: cycleStartTime.current!,
                endTime: new Date().toISOString(),
                maxTemp: maxTempRef.current,
                minPressure: 0,
                status: 'COMPLETED',
                killPercentage: 100
            };
            setCycleHistory(prev => [...prev, newCycle]);
            generateCycleInsight([...cycleHistory, newCycle]).then(setAiInsight);

            // Reset
            cycleStartTime.current = null;
            maxTempRef.current = 0;
            killAccumulator.current = 0;
        }

        return Math.min((killAccumulator.current / TARGET_KILL_POINTS) * 100, 100);
    };

    useEffect(() => {
        const fetchData = async () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            let newTemp = currentRef.current.temperature;
            let newPressure = currentRef.current.pressure;

            if (useApi) {
                try {
                    const res = await fetch('/api/sensors');
                    if (res.ok) {
                        const json = await res.json();
                        // console.log("API Fetch Success:", json); 

                        let t = 0;
                        if (typeof json.value === 'number') t = json.value;
                        else if (typeof json.temperature === 'number') t = json.temperature;
                        else if (json.data && typeof json.data.temperature === 'number') t = json.data.temperature;
                        else if (json.lm35Temp) t = Number(json.lm35Temp);

                        newTemp = t || newTemp; // Keep status quo if 0? Or allow 0.
                        newPressure = 100;
                    } else {
                        console.warn("API Fetch Failed:", res.status);
                    }
                } catch (e) {
                    console.error("API fetch failed", e);
                }
            } else if (isSimulating) {
                let t = currentRef.current.temperature;
                let p = currentRef.current.pressure;

                if (!cycleStartTime.current) {
                    cycleStartTime.current = new Date().toISOString();
                    phase.current = 'HEATING';
                    killAccumulator.current = 0;
                }

                switch (phase.current) {
                    case 'HEATING':
                        if (t < 121) t += 2 + Math.random();
                        if (p < 205) p += 5 + Math.random();
                        if (t >= 121 && p >= 205) phase.current = 'HOLDING';
                        break;
                    case 'HOLDING':
                        t = 121 + Math.random() * 2;
                        p = 205 + Math.random() * 5;
                        if (killAccumulator.current >= TARGET_KILL_POINTS) phase.current = 'COOLING';
                        break;
                    case 'COOLING':
                        if (t > 20) t -= 3 + Math.random();
                        if (p > 100) p -= 5 + Math.random();
                        if (t <= 25) {
                            phase.current = 'HEATING';
                            cycleStartTime.current = null;
                        }
                        break;
                }
                newTemp = t;
                newPressure = p;
            }

            setCurrent({ temperature: newTemp, pressure: newPressure });
            const kP = handleCycleLogic(newTemp, 1 || 2); // 1 or 2 seconds? Interval is 2s now.
            setKillPercentage(kP);

            const newPoint: SensorDataPoint = {
                time: timeString,
                temperature: newTemp,
                pressure: newPressure,
            };

            setData(prevData => {
                const newData = [...prevData, newPoint];
                if (newData.length > 60) return newData.slice(newData.length - 60);
                return newData;
            });
        };

        // Run immediately on mount/change? No, let's wait 2s.
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, [useApi, isSimulating]); // Removed 'current' dependency to prevent interval reset

    return (
        <SterilizationContext.Provider value={{
            current,
            history: data,
            cycleHistory,
            killPercentage,
            aiInsight,
            isSimulating,
            startSimulation,
            stopSimulation,
            toggleDataSource,
            useApi
        }}>
            {children}
        </SterilizationContext.Provider>
    );
}

export const useSterilization = () => {
    const context = useContext(SterilizationContext);
    if (!context) throw new Error('useSterilization must be used within SterilizationProvider');
    return context;
};
