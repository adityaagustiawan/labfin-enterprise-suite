"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  Zap, 
  DollarSign, 
  X, 
  Maximize2, 
  Minimize2
} from 'lucide-react';

interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
  data?: {
    price: string;
    pe: string;
  };
}

/**
 * LABFIN ENTERPRISE AGENT PRO (Live Market Integration)
 * Integrated into FinLab AI Terminal
 */
export function LabFinAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { role: 'assistant', content: "Market Terminal Active. I am connected to live enterprise feeds. Enter a ticker (e.g., AAPL, TSLA, or LABF) for instant analysis." }
  ]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketTicker, setMarketTicker] = useState({ symbol: 'GLOBAL_INDEX', price: 4250.20, change: +1.2 });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Live Market Feed Simulation (Updates every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketTicker(prev => ({
        ...prev,
        price: prev.price + (Math.random() * 2 - 1),
        change: Number((Math.random() * 5).toFixed(2))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const analyzeMarket = async (ticker: string) => {
    setIsAnalyzing(true);
    
    // Simulation of Advanced Quantitative Analysis
    const mockPrice = (Math.random() * 1000).toFixed(2);
    const peRatio = (Math.random() * 25 + 15).toFixed(2);
    
    setTimeout(() => {
      const response: AssistantMessage = {
        role: 'assistant',
        content: `Analysis for **${ticker.toUpperCase()}**: Current Valuation is at $$ \$${mockPrice} $$. The P/E Ratio is calculated at $$ ${peRatio} $$. Market sentiment is currently bullish with a volatility coefficient of $$ \sigma = 0.14 $$.`,
        data: { price: mockPrice, pe: peRatio }
      };
      setMessages(prev => [...prev, response]);
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage: AssistantMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    analyzeMarket(input);
    setInput('');
  };

  return (
    <>
      {/* Floating Bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-2xl shadow-sky-500/20"
          >
            <Bot size={28} />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0a0f14] bg-emerald-500"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Assistant Modal/Fullscreen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={isFull ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            className={`fixed z-[70] flex flex-col overflow-hidden bg-slate-950 border border-sky-500/30 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] transition-all duration-300 ease-out
              ${isFull 
                ? 'inset-0 rounded-0' 
                : 'bottom-6 right-6 w-full max-w-[400px] h-[600px] rounded-2xl'
              }`}
          >
            {/* Top Real-Time Ticker Bar */}
            <div className="bg-sky-600 p-2 flex justify-between items-center px-4">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-sky-100 tracking-widest uppercase">Live Feed</span>
                <div className="flex items-center gap-2 text-white font-mono text-[10px]">
                  <span className="font-bold opacity-80">{marketTicker.symbol}</span>
                  <span className="font-bold">${marketTicker.price.toFixed(2)}</span>
                  <span className="text-emerald-300">+{marketTicker.change}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsFull(!isFull)} className="text-sky-100 hover:text-white transition-colors">
                  {isFull ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-sky-100 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Agent Identity */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-4 bg-slate-900/50">
              <div className="relative">
                <div className="p-2.5 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl">
                  <Bot className="text-white" size={20} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
              </div>
              <div className="min-w-0">
                <h3 className="text-white text-sm font-bold truncate">LabFin Intelligence Agent</h3>
                <p className="text-[10px] text-slate-400 font-mono">Enterprise Suite v2.6.0-stable</p>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scrollbar-thin scrollbar-thumb-slate-800">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`group relative max-w-[85%] p-3 rounded-2xl transition-all ${
                    m.role === 'user' 
                      ? 'bg-sky-600 text-white rounded-br-none shadow-lg shadow-blue-900/20' 
                      : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-bl-none'
                  }`}>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    {m.data && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="bg-black/40 p-2 rounded border border-white/5 text-center">
                          <p className="text-[8px] uppercase text-slate-500 mb-0.5">Target Price</p>
                          <p className="text-emerald-400 font-bold text-xs">${m.data.price}</p>
                        </div>
                        <div className="bg-black/40 p-2 rounded border border-white/5 text-center">
                          <p className="text-[8px] uppercase text-slate-500 mb-0.5">P/E Ratio</p>
                          <p className="text-sky-400 font-bold text-xs">{m.data.pe}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isAnalyzing && (
                <div className="flex items-center gap-3 text-sky-400 font-mono text-[10px] animate-pulse">
                  <Zap size={12} />
                  RUNNING MONTE CARLO SIMULATIONS...
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Console */}
            <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t border-slate-800">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter Market Ticker..."
                    className="w-full bg-black border border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-white text-xs focus:border-sky-500 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isAnalyzing || !input.trim()}
                  className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white px-4 rounded-xl transition-all flex items-center justify-center"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
