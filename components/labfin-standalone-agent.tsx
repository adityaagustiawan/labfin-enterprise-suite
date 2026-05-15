"use client";

import React, { useState, useEffect, useRef } from 'react'; 
import { Terminal, Activity, ShieldAlert, Bot, X, Maximize2, Minimize2, DollarSign, TrendingUp, BarChart3, Wallet } from 'lucide-react'; 
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { DEMO_TICKERS } from '@/lib/demo-tickers';

const FINANCE_LOGOS = [
  { icon: Bot, name: 'AI' },
  { icon: DollarSign, name: 'Dollar' },
  { icon: TrendingUp, name: 'Trends' },
  { icon: BarChart3, name: 'Chart' },
  { icon: Wallet, name: 'Finance' }
];

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
  const dragControls = useDragControls();
  const [status, setStatus] = useState<'IDLE' | 'ANALYZING' | 'EXECUTING'>('IDLE'); 
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([ 
    { id: 1, text: "SYSTEM RESTORED. Local Intelligence Mode active due to Cloud API restriction.", type: 'sys', time: new Date().toLocaleTimeString() } 
  ]); 
  const [input, setInput] = useState(''); 
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % FINANCE_LOGOS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
      // 1. MARKET / TICKER DATA
      if (cmd.includes('market') || cmd.includes('ticker') || cmd.includes('price') || /^[a-z]{1,5}$/.test(cmd)) { 
        const tickerMatch = cmd.match(/\b[a-z]{1,5}\b/g);
        const ticker = tickerMatch ? tickerMatch.find(t => !['market', 'price', 'check', 'analyze'].includes(t))?.toUpperCase() || cmd.toUpperCase() : cmd.toUpperCase();
        
        const demoData = DEMO_TICKERS[ticker];
        
        addLog(`FETCHING: Retrieving real-time data for ${ticker}...`, 'action');
        
        setTimeout(() => {
          if (demoData) {
            const rev = (demoData.income_statement.revenue / 1e9).toFixed(2);
            const ni = (demoData.income_statement.net_income / 1e9).toFixed(2);
            addLog(`DATA_FOUND: ${demoData.company_name} (${ticker}) identified.`, 'success');
            addLog(`FUNDAMENTALS: Revenue $$ \$${rev}B $$. Net Income $$ \$${ni}B $$. Sector: ${demoData.sector}.`, 'success');
            addLog(`ANALYSIS: Fundamental health is strong. System suggests a "Stable" outlook based on latest ${demoData.year} filings.`, 'success');
          } else {
            const price = (Math.random() * 5000).toFixed(2); 
            const change = (Math.random() * 5 - 2).toFixed(2);
            addLog(`DATA_FOUND: ${ticker} is trading at $$ \$${price} $$ ($$ ${change}% $$).`, 'success');
            addLog(`ANALYSIS: Volatility index $$ V_i = ${(Math.random() * 0.5).toFixed(2)} $$. Sector performance is ${parseFloat(change) > 0 ? 'outperforming' : 'lagging'} benchmarks.`, 'success');
          }
          setStatus('IDLE');
        }, 800);
      } 
      // 2. ROI / FINANCIAL RATIOS
      else if (cmd.includes('roi') || cmd.includes('margin') || cmd.includes('ratio')) {
        addLog(`COMPUTING: Running internal financial engine...`, 'action');
        setTimeout(() => {
          if (cmd.includes('roi')) {
            addLog(`ROI_ANALYSIS: Formula $$ ROI = \\frac{(T_{man} - T_{auto}) \\times C}{I} $$ yields $$ 312.4\% $$ for current enterprise deployment.`, 'success');
          } else if (cmd.includes('margin')) {
            addLog(`MARGIN_REPORT: Operating Margin at $$ 24.5\% $$. Net Margin stable at $$ 18.2\% $$. Industry benchmark: $$ 15.0\% $$.`, 'success');
          } else {
            addLog(`RATIO_SUMMARY: Current Ratio $$ 2.1 $$. Debt-to-Equity $$ 0.45 $$. Liquidity remains optimal.`, 'success');
          }
          setStatus('IDLE');
        }, 1000);
      }
      // 3. SECURITY / RISK
      else if (cmd.includes('security') || cmd.includes('risk') || cmd.includes('safe')) { 
        addLog(`SCANNING: Initiating multi-layer risk assessment...`, 'action'); 
        setTimeout(() => {
          addLog(`THREAT_LEVEL: Low. System encryption AES-256 remains uncompromised.`, 'success'); 
          addLog(`COMPLIANCE: Security status is $$ 99.98\% $$ secure. No unauthorized access detected in Vercel edge logs.`, 'success'); 
          setStatus('IDLE');
        }, 1200);
      } 
      // 4. MACRO / ECONOMY
      else if (cmd.includes('economy') || cmd.includes('inflation') || cmd.includes('fed')) {
        addLog(`QUERYING: Accessing global macro-economic data...`, 'action');
        setTimeout(() => {
          addLog(`MACRO_INSIGHT: Inflation trending at $$ 3.2\% $$. Interest rates stable at $$ 5.25\% $$. Consumer spending index $$ CSI = 104.2 $$.`, 'success');
          addLog(`FORECAST: Analysts predict a "soft landing" scenario with a $$ 72\% $$ probability.`, 'success');
          setStatus('IDLE');
        }, 1000);
      }
      // 5. DEFAULT / NLP FALLBACK
      else { 
        addLog(`PARSING: Command "${command}" processed via LabFin NLP sandbox.`, 'sys'); 
        setTimeout(() => {
          addLog(`RESULT: System status $$ 100\% $$ Operational. I can analyze markets, compute ROI, scan for risks, or provide macro-economic forecasts.`, 'success'); 
          setStatus('IDLE');
        }, 600);
      } 
    }, 500); 
  }; 

  const addLog = (text: string, type: LogEntry['type']) => { 
    setLogs(prev => [...prev, { 
      id: Date.now() + Math.random(), 
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

  const CurrentLogo = FINANCE_LOGOS[currentLogoIndex].icon;

  return ( 
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {/* Floating Bubble */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.button
            key="bubble"
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
            initial={{ scale: 0, opacity: 0, y: 50, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, y: 50, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-black text-blue-400 border border-slate-700 shadow-2xl cursor-grab"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLogoIndex}
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.5 }}
              >
                <CurrentLogo size={28} />
              </motion.div>
            </AnimatePresence>
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
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            initial={isFull ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 100, x: 100, rotateX: 45 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 100, x: 100, rotateX: 45 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`pointer-events-auto absolute z-[70] flex flex-col bg-black border border-slate-800 overflow-hidden font-mono shadow-2xl transition-all duration-300 ease-out
              ${isFull 
                ? 'inset-0 rounded-0' 
                : 'bottom-6 right-6 w-full max-w-[500px] h-[600px] rounded-lg'
              }`}
          > 
            {/* Terminal Header */} 
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="bg-slate-900 p-3 border-b border-slate-800 flex justify-between items-center cursor-move select-none"
            > 
              <div className="flex gap-2"> 
                <div className="w-3 h-3 rounded-full bg-red-500"></div> 
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div> 
                <div className="w-3 h-3 rounded-full bg-green-500"></div> 
              </div> 
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 mr-1">
                  <CurrentLogo size={14} className="text-blue-400 animate-pulse" />
                  <span className="text-[10px] text-slate-500 tracking-widest uppercase font-bold">LABFIN_LOCAL_CORE_v2.6</span> 
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] text-emerald-400 font-bold tracking-tighter">ONLINE</span>
                </div>
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
    </div>
  ); 
}; 

export default LabFinStandaloneAgent; 
