const KEY = "lablens-watchlist-v1";

export function readWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function writeWatchlist(tickers: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify([...new Set(tickers.map((t) => t.toUpperCase()))]));
}

export function toggleWatchlist(ticker: string): boolean {
  const t = ticker.toUpperCase();
  const cur = readWatchlist();
  const has = cur.includes(t);
  const next = has ? cur.filter((x) => x !== t) : [...cur, t];
  writeWatchlist(next);
  return !has;
}

export function isInWatchlist(ticker: string): boolean {
  return readWatchlist().includes(ticker.toUpperCase());
}
