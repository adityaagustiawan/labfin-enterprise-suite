"use client";

import { motion } from "framer-motion";
import { NewsletterReport } from "@/lib/analyst-agent";
import { Newspaper, TrendingUp, TrendingDown, Globe, Link2 } from "lucide-react";

export function NewsletterPanel({ report }: { report: NewsletterReport }) {
  const isBullish = report.marketSentiment === "bullish";
  const isBearish = report.marketSentiment === "bearish";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-[#0a0f14]/80 p-6 backdrop-blur-xl shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
          <Newspaper size={20} />
        </div>
        <h2 className="text-lg font-bold tracking-tight text-white">{report.title}</h2>
      </div>

      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Headline</span>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              isBullish ? "bg-emerald-500/20 text-emerald-400" : 
              isBearish ? "bg-rose-500/20 text-rose-400" : 
              "bg-zinc-500/20 text-zinc-400"
            }`}>
              {isBullish ? <TrendingUp size={10} /> : isBearish ? <TrendingDown size={10} /> : null}
              {report.marketSentiment}
            </div>
          </div>
          <p className="text-sm font-medium text-zinc-200 leading-relaxed">
            {report.headline}
          </p>
        </div>

        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
            <TrendingUp size={12} /> Key Takeaways
          </h3>
          <ul className="space-y-2">
            {report.keyTakeaways.map((item, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-xs text-zinc-400 flex items-start gap-2"
              >
                <span className="h-1 w-1 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-white/5">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
            <Globe size={12} /> Global Context
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed italic">
            {report.globalContext}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] text-zinc-600 uppercase tracking-tighter font-mono">
            <Link2 size={10} />
            {report.sourceReference}
          </div>
          <div className="text-[10px] text-zinc-600 font-mono">
            GENERATED IN REAL-TIME
          </div>
        </div>
      </div>
    </motion.div>
  );
}
