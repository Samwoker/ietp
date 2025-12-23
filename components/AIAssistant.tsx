'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Mic, MicOff, Send, X, Bot, User, Volume2, VolumeX } from 'lucide-react';
import { useSterilization } from '../context/SterilizationContext';
import { processChatMessage, ChatMessage } from '../services/chatService';

export function AIAssistant() {
    const { current, killPercentage } = useSterilization();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: "Hello! I'm your AI Sterilization Assistant. How can I help you today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [ttsEnabled, setTtsEnabled] = useState(true);

    const scrollRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    // Initialize Web Speech API (Recognition)
    useEffect(() => {
        if (typeof window !== 'undefined' && ('WebkitSpeechRecognition' in window || 'speechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                handleSendMessage(transcript);
            };

            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const speak = (text: string) => {
        if (!ttsEnabled || typeof window === 'undefined') return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const handleSendMessage = async (text: string = inputValue) => {
        if (!text.trim()) return;

        const userMsg: ChatMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        const response = await processChatMessage(text, {
            temperature: current.temperature,
            pressure: current.pressure,
            killPercentage
        }, messages);

        const assistantMsg: ChatMessage = { role: 'assistant', content: response };
        setMessages(prev => [...prev, assistantMsg]);

        if (ttsEnabled) {
            speak(response);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            try {
                recognitionRef.current?.start();
            } catch (e) {
                console.error("Speech recognition error:", e);
                setIsListening(false);
            }
        }
    };

    const clearChat = () => {
        setMessages([{ role: 'assistant', content: "Chat cleared. How can I help you now?" }]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110
                    ${isOpen ? 'bg-rose-500 rotate-90' : 'bg-indigo-600 hover:bg-indigo-700'}
                    text-white
                `}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed md:absolute bottom-0 right-0 md:bottom-20 w-full md:w-96 h-[80vh] md:h-auto max-h-[600px] bg-white rounded-t-3xl md:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Sterilization AI</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] opacity-80 uppercase tracking-tighter">Online</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={clearChat}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-xs font-medium uppercase tracking-wider"
                                title="Clear Chat"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setTtsEnabled(!ttsEnabled)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                {ttsEnabled ? <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-emerald-400' : ''}`} /> : <VolumeX className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div ref={scrollRef} className="flex-1 max-h-[400px] overflow-y-auto p-4 bg-slate-50 space-y-4 custom-scrollbar">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`
                                    max-w-[80%] p-3 rounded-2xl text-sm shadow-sm
                                    ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}
                                `}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
                        <button
                            onClick={toggleListening}
                            className={`p-2 rounded-xl transition-colors ${isListening ? 'bg-rose-100 text-rose-500 animate-pulse' : 'hover:bg-slate-100 text-slate-400'}`}
                        >
                            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask about status..."
                            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/50"
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim()}
                            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
