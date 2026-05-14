"use client";

import { useState } from "react";
import { analystReply } from "@/lib/analyst-agent";
import type { FullAnalysis } from "@/lib/types";

import { useAuth } from "@/lib/auth-context";

const SUGGESTIONS = ["Why is the ROE at this level?", "What is the biggest risk?", "How is liquidity?"];

export function AnalystChat({ analysis }: { analysis: FullAnalysis }) {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "analyst"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function send(text?: string) {
    const question = (text ?? q).trim();
    if (!question) return;
    
    setLoading(true);
    setMessages((m) => [...m, { role: "user", text: question }]);
    setQ("");

    try {
      const answer = await analystReply(question, analysis);
      setMessages((m) => [...m, { role: "analyst", text: answer }]);
    } catch {
      setMessages((m) => [...m, { role: "analyst", text: "Error connecting to AI analyst." }]);
    } finally {
      setLoading(false);
    }
  }

  const isLocked = false; // Always unlocked for demo

  return (
    <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 sm:p-5 relative overflow-hidden">
      <h3 className="text-sm font-semibold text-zinc-100 sm:text-base">Ask the AI analyst</h3>
      <p className="mt-1 text-xs text-zinc-500">
        Grounded on the active statement pack — swap <code className="font-mono text-[10px]">analystReply</code> for your
        model.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="rounded-full border border-zinc-700 bg-zinc-900/80 px-2.5 py-1 text-[11px] text-zinc-300 hover:border-sky-500/40 hover:text-sky-100"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="mt-4 max-h-64 space-y-3 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
        {messages.length === 0 && (
          <p className="text-xs text-zinc-500">Try a prompt above, or type your own question.</p>
        )}
        {messages.map((m, i) => (
          <div
            key={`${i}-${m.role}`}
            className={`text-sm leading-relaxed ${m.role === "user" ? "text-sky-200" : "text-zinc-200"}`}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
              {m.role === "user" ? "You" : "Analyst"}
            </span>
            <p className="mt-0.5 whitespace-pre-wrap">{m.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about this company…"
          className="min-h-[44px] flex-1 rounded-xl border border-zinc-700 bg-zinc-950/80 px-3 text-sm outline-none focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/30"
        />
        <button
          type="button"
          onClick={() => send()}
          disabled={loading || !q.trim()}
          className="shrink-0 rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </section>
  );
}
