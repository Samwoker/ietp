'use client';

import React, { useEffect } from 'react';
import { Thermometer, Gauge } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { SensorCard } from '../components/SensorCard';
import { RealTimeChart } from '../components/RealTimeChart';
import { AIAgentCard } from '../components/AIAgentCard';
import { HistoryList } from '../components/HistoryList';
import { SterilizationProvider, useSterilization } from '../context/SterilizationContext';
import { NotificationProvider, useNotification } from '../context/NotificationContext';
import { getAIAnalysis } from '../utils/sterilizationLogic';

function DashboardContent() {
  const { current, history, killPercentage, cycleHistory, aiInsight, useApi, toggleDataSource } = useSterilization();
  const { notify } = useNotification();

  // Real-time analysis for the "current moment"
  const liveAnalysis = getAIAnalysis(current.temperature, current.pressure, killPercentage);

  // Trigger Notifications
  useEffect(() => {
    if (killPercentage >= 100) {
      notify('Sterilization Cycle Complete!', 'success');
    }
  }, [killPercentage, notify]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-100">Sterilization Monitor</h1>
        <button
          onClick={toggleDataSource}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border
             ${useApi
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
            }
           `}
        >
          ● Live API Data
        </button>
      </div>

      <div className="grid gap-6 mb-8 lg:grid-cols-4">
        {/* AI Agent Card */}
        <AIAgentCard
          analysis={liveAnalysis}
          killPercentage={killPercentage}
          insight={aiInsight}
        />

        <SensorCard
          title="Temperature"
          value={current.temperature}
          unit="°C"
          icon={Thermometer}
          color="rose"
          max={160}
        />
        <SensorCard
          title="Pressure"
          value={current.pressure}
          unit="kPa"
          icon={Gauge}
          color="cyan"
          max={300}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 h-[500px]">
        {/* Charts take up 2/3 */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          <div className="flex-1">
            <RealTimeChart
              title="Temperature Trends"
              data={history}
              dataKey="temperature"
              color="#fb7185" // rose-400
              unit="°C"
            />
          </div>
          <div className="flex-1">
            <RealTimeChart
              title="Pressure Trends"
              data={history}
              dataKey="pressure"
              color="#22d3ee" // cyan-400
              unit="kPa"
            />
          </div>
        </div>

        {/* History takes up 1/3 */}
        <div className="lg:col-span-1 h-full">
          <HistoryList cycles={cycleHistory} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function Home() {
  return (
    <NotificationProvider>
      <SterilizationProvider>
        <DashboardContent />
      </SterilizationProvider>
    </NotificationProvider>
  );
}
