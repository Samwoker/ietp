import { useState, useEffect, useRef } from 'react';
import { calculateGermKillRate } from '../utils/sterilizationLogic';
import { SensorDataPoint } from '../types';



export function useSensorData(updateInterval = 1000, historyLength = 60) {
    const [data, setData] = useState<SensorDataPoint[]>([]);
    const [current, setCurrent] = useState<{ temperature: number; pressure: number }>({ temperature: 20, pressure: 100 });
    const [killPercentage, setKillPercentage] = useState(0);

    // Simulation State
    const phase = useRef<'HEATING' | 'HOLDING' | 'COOLING'>('HEATING');
    const killAccumulator = useRef(0);
    // Total kill points needed (arbitrary units for simulation)
    // Let's say we need 300 "kill points"
    const TARGET_KILL_POINTS = 300;

    useEffect(() => {
        const generateData = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString();

            setCurrent(prev => {
                let { temperature, pressure } = prev;

                // Simulation Logic
                switch (phase.current) {
                    case 'HEATING':
                        // Ramp up to 121°C / 205 kPa
                        if (temperature < 121) temperature += 2 + Math.random();
                        if (pressure < 205) pressure += 5 + Math.random();

                        if (temperature >= 121 && pressure >= 205) {
                            phase.current = 'HOLDING';
                        }
                        break;

                    case 'HOLDING':
                        // Maintain around 121-123°C
                        temperature = 121 + Math.random() * 2;
                        pressure = 205 + Math.random() * 5;

                        // Check if killed enough
                        if (killAccumulator.current >= TARGET_KILL_POINTS) {
                            phase.current = 'COOLING';
                        }
                        break;

                    case 'COOLING':
                        // Cool down to 20°C
                        if (temperature > 20) temperature -= 3 + Math.random();
                        if (pressure > 100) pressure -= 5 + Math.random();
                        break;
                }

                // Add noise
                temperature += (Math.random() - 0.5) * 0.5;
                pressure += (Math.random() - 0.5) * 1;

                // Calculate Kill Rate for this tick
                const tickKill = calculateGermKillRate(temperature, updateInterval / 1000);
                killAccumulator.current += tickKill;

                const nextKillPercentage = Math.min((killAccumulator.current / TARGET_KILL_POINTS) * 100, 100);
                setKillPercentage(nextKillPercentage);

                return {
                    temperature: parseFloat(temperature.toFixed(1)),
                    pressure: parseFloat(pressure.toFixed(1))
                };
            });

            const newPoint: SensorDataPoint = {
                time: timeString,
                temperature: current.temperature,
                pressure: current.pressure,
            };

            setData(prevData => {
                const newData = [...prevData, newPoint];
                if (newData.length > historyLength) {
                    return newData.slice(newData.length - historyLength);
                }
                return newData;
            });
        };

        // Initial data
        generateData();

        const interval = setInterval(generateData, updateInterval);
        return () => clearInterval(interval);
    }, [updateInterval, historyLength]);

    return { current, history: data, killPercentage };
}
