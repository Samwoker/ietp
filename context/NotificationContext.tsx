'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

interface NotificationContextType {
    notify: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const notify = useCallback((message: string, type: NotificationType = 'info') => {
        const id = Math.random().toString(36).substring(7);
        setNotifications(prev => [...prev, { id, message, type }]);

        // Auto dismiss
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }, []);

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
                {notifications.map(n => (
                    <div
                        key={n.id}
                        className={`
              flex items-center gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl border w-80 animate-in slide-in-from-right fade-in duration-300
              ${n.type === 'success' ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200' : ''}
              ${n.type === 'error' ? 'bg-rose-950/80 border-rose-500/30 text-rose-200' : ''}
              ${n.type === 'info' ? 'bg-slate-900/80 border-slate-700/50 text-slate-200' : ''}
            `}
                    >
                        {n.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                        {n.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
                        {n.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}

                        <p className="text-sm font-medium flex-1">{n.message}</p>

                        <button
                            onClick={() => removeNotification(n.id)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 opacity-70" />
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotification must be used within NotificationProvider');
    return context;
};
