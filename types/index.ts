export interface SensorDataPoint {
    time: string;
    temperature: number;
    pressure: number;
}

export interface Cycle {
    id: string;
    startTime: string;
    endTime: string;
    maxTemp: number;
    minPressure: number;
    status: 'COMPLETED' | 'FAILED' | 'ABORTED';
    killPercentage: number;
}
