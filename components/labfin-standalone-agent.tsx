"use client";

import React, { useState, useEffect, useRef } from 'react'; 
import { Terminal, Activity, ShieldAlert, Bot, X, Maximize2, Minimize2 } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

/** 
 * LABFIN STANDALONE AGENT (No-API Version) 
 * This agent simulates "Agentic" behavior using local logic. 
 */ 

interface LogEntry {
  id: number;
  text: string;
  type: 'sys' | 'user' | 'success' | 'action';
  time: string;
}

const LabFinStandaloneAgent = () => { 
  const [isOpen, setIsOpen] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'ANALYZING' | 'EXECUTING'>('IDLE'); 
  const [logs, setLogs] = useState<LogEntry[]>([ 
    { id: 1, text: "System ready. Awaiting enterprise commands...", type: 'sys', time: new Date().toLocaleTimeString() } 
  ]); 
  const [input, setInput] = useState(''); 
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  // 1. Mock "Agentic" Tools (Logic inside the component) 
  const runAgenticTask = (command: string) => { 
    const cmd = command.toLowerCase(); 
    setStatus('ANALYZING'); 
    
    setTimeout(() => { 
      if (cmd.includes('market') || cmd.includes('ticker')) { 
        const price = (Math.random() * 5000).toFixed(2); 
        addLog(`FETCH_SUCCESS: Market data retrieved. Index at $$ ${price} $$`, 'success'); 
        addLog(`ACTION: Updating local dashboard cache...`, 'action'); 
      } 
      else if (cmd.includes('security') || cmd.includes('risk')) { 
        addLog(`SCANNING: Checking Vercel deployment protocols...`, 'action'); 
        addLog(`REPORT: Security status is $$ 99.9\% $$ secure.`, 'success'); 
      } 
      else { 
        addLog(`ANALYSIS: Command "${command}" processed via LabFin NLP.`, 'sys'); 
        addLog(`RESULT: No anomalies detected in the enterprise suite.`, 'success'); 
      } 
      setStatus('IDLE'); 
    }, 1500); 
  }; 

  const addLog = (text: string, type: LogEntry['type']) => { 
    setLogs(prev => [...prev, { 
      id: Date.now(), 
      text, 
      type, 
      time: new Date().toLocaleTimeString() 
    }]); 
  }; 

  const handleSubmit = (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (!input.trim()) return; 
    addLog(`USER_CMD: ${input}`, 'user'); 
    runAgenticTask(input); 
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
            className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-black text-blue-400 border border-slate-700 shadow-2xl"
          >
            <Bot size={28} />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0a0f14] bg-blue-500"
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={isFull ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            className={`fixed z-[70] flex flex-col bg-black border border-slate-800 overflow-hidden font-mono shadow-2xl transition-all duration-300 ease-out
              ${isFull 
                ? 'inset-0 rounded-0' 
                : 'bottom-6 right-6 w-full max-w-[500px] h-[600px] rounded-lg'
              }`}
          > 
            {/* Terminal Header */} 
            <div className="bg-slate-900 p-3 border-b border-slate-800 flex justify-between items-center"> 
              <div className="flex gap-2"> 
                <div className="w-3 h-3 rounded-full bg-red-500"></div> 
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div> 
                <div className="w-3 h-3 rounded-full bg-green-500"></div> 
              </div> 
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500 tracking-widest">LABFIN_INTERNAL_AGENT_v2.0</span> 
                <div className="flex items-center gap-2 ml-2">
                  <button onClick={() => setIsFull(!isFull)} className="text-slate-500 hover:text-white transition-colors">
                    {isFull ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div> 

            {/* Console Output */} 
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#050505] text-xs scrollbar-thin scrollbar-thumb-slate-800"> 
              {logs.map(log => ( 
                <div key={log.id} className="flex gap-2 items-start"> 
                  <span className="text-slate-600 shrink-0">[{log.time}]</span> 
                  <span className={`break-all 
                    ${log.type === 'user' ? 'text-blue-400' : ''} 
                    ${log.type === 'success' ? 'text-emerald-400' : ''} 
                    ${log.type === 'action' ? 'text-purple-400' : ''} 
                    ${log.type === 'sys' ? 'text-slate-400' : ''} 
                  `}> 
                    {log.type === 'user' && '> '} 
                    {log.text} 
                  </span> 
                </div> 
              ))} 
              {status === 'ANALYZING' && ( 
                <div className="text-yellow-500 animate-pulse flex items-center gap-2"> 
                  <Activity size={12} className="animate-spin" />
                  [SYSTEM]: AGENT_IS_THINKING... (Executing Monte Carlo Simulation) 
                </div> 
              )} 
              <div ref={scrollRef} />
            </div> 

            {/* Agentic Input */} 
            <form onSubmit={handleSubmit} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3 items-center"> 
              <Terminal size={18} className="text-blue-500 shrink-0" /> 
              <input 
                autoFocus 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Type 'analyze market' or 'check risk'..." 
                className="flex-1 bg-transparent border-none outline-none text-blue-100 text-sm placeholder:text-slate-700" 
              /> 
            </form> 

            {/* Bottom Status Bar */} 
            <div className="bg-blue-600 px-4 py-1.5 flex justify-between items-center"> 
              <div className="flex items-center gap-4"> 
                <div className="flex items-center gap-1.5 text-[10px] text-white font-bold"> 
                  <Activity size={10} /> STATUS: {status} 
                </div> 
                <div className="flex items-center gap-1.5 text-[10px] text-white font-bold"> 
                  <ShieldAlert size={10} /> ENCRYPTION: AES-256 
                </div> 
              </div> 
              <div className="text-[10px] text-blue-200 font-mono">May 15, 2026</div> 
            </div> 
          </motion.div> 
        )}
      </AnimatePresence>
    </>
  ); 
}; 

export default LabFinStandaloneAgent; 
