"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readWatchlist, writeWatchlist } from "@/lib/watchlist-storage";

export default function WatchlistPage() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(readWatchlist());
  }, []);

  function clear() {
    writeWatchlist([]);
    setItems([]);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">Watchlist</h1>
          <p className="mt-1 text-sm text-zinc-400">Stored locally in your browser (FinScope-style placeholder).</p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="rounded-lg border border-zinc-600 px-3 py-2 text-xs text-zinc-300 hover:border-red-500/40 hover:text-red-200"
          >
            Clear all
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/40 p-6 text-sm text-zinc-400">
          No tickers yet — open a company and tap <span className="font-semibold text-zinc-200">Watch</span>.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((t) => (
            <li key={t}>
              <Link
                href={`/companies/${encodeURIComponent(t)}`}
                className="flex items-center justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-4 py-3 text-sm hover:border-sky-500/40"
              >
                <span className="font-mono text-sky-200">{t}</span>
                <span className="text-xs text-zinc-500">View →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
