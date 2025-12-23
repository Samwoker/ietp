import React from 'react';
import { LayoutDashboard, Settings, Bell } from 'lucide-react';
import { AIAssistant } from './AIAssistant';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/20">
            {/* Texture/Background effect */}
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #e0e7ff 0%, #f1f5f9 100%)' }} />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <LayoutDashboard className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-black">
                            Biosense Autoclave
                        </h1>
                    </div>

                    {/* <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-slate-800 rounded-full transition-colors relative">
                            <Bell className="w-5 h-5 text-slate-400" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 border-2 border-slate-900" />
                    </div> */}
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 py-8">
                {children}
            </main>

            {/* AI Assistant */}
            <AIAssistant />
        </div>
    );
}
