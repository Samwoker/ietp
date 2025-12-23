export const calculateGermKillRate = (temperature: number, timeInSeconds: number): number => {
    // F0 Value Calculation Approximation
    // F0 = Delta_t * 10^((T - 121.1) / z)
    // Standard z-value is 10°C
    // This calculates "equivalent minutes at 121°C"
    // For this simulation, we'll accumulate "Kill Points"

    // Sterilization usually starts effective > 100°C
    if (temperature < 100) return 0;

    // Simple exponential kill model for simulation
    // At 121°C, it's very fast. At 100°C, it's slow.
    // Base kill rate per second
    const baseRate = 0.05;
    const tempFactor = Math.pow(10, (temperature - 100) / 20);

    return baseRate * tempFactor * timeInSeconds;
};

export const getAIAnalysis = (temperature: number, pressure: number, killPercentage: number): string => {
    if (killPercentage >= 100) {
        return "Sterilization cycle complete. Environment is pathogen-free. Start cooling phase.";
    }

    if (temperature > 120 && pressure > 200) {
        return "Optimal sterilization conditions reached. Bacteria destruction rate is maximal.";
    }

    if (temperature > 100 && pressure < 150) {
        return "Temperature is rising, but pressure is sub-optimal. Check seal integrity to ensure steam saturation.";
    }

    if (temperature < 50) {
        return "System inactive. Ready to begin sterilization cycle.";
    }

    return " Heating phase in progress. Monitoring parameters for optimal kill range.";
};

export const fetchSensorData = async () => {
    const res = await fetch(process.env.SERVER_URL + '/api/temperature');
    const data = await res.json();
    return data;
};