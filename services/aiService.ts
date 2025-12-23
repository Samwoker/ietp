import { Cycle } from '../types';

export const generateCycleInsight = async (history: Cycle[]): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (history.length === 0) {
        return "No historical data available. Complete a full cycle to generate insights.";
    }

    const lastCycle = history[history.length - 1];
    const successfulCycles = history.filter(c => c.status === 'COMPLETED').length;
    const avgDuration = history.reduce((acc, c) => acc + (new Date(c.endTime).getTime() - new Date(c.startTime).getTime()), 0) / history.length / 1000;

    if (lastCycle.status === 'FAILED') {
        return "Analysis: The last cycle failed to reach target kill parameters. Suggest checking pressure valve seal integrity.";
    }

    if (successfulCycles > 3 && avgDuration < 120) {
        return "Efficiency Note: System is performing above baseline. Heat distribution appears optimal.";
    }

    return `Cycle #${history.length} complete. Parameters within nominal range. Next maintenance check recommended in ${10 - (history.length % 10)} cycles.`;
};
