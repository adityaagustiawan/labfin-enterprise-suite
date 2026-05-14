"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LOCAL_MARKETING_CLIPS } from "@/lib/marketing-videos";

/** Optional single override (full URL or path like `/marketing/foo.mp4`). */

function shuffleStartOrder<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function MarketingVideoBackdrop() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const queueRef = useRef<string[]>([]);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [queue, setQueue] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const envSrc = useMemo(() => {
    const v = process.env.NEXT_PUBLIC_MARKETING_VIDEO_URL;
    return v && v.trim().length > 0 ? v.trim() : null;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    if (envSrc) {
      setQueue([envSrc]);
    } else {
      setQueue(shuffleStartOrder(LOCAL_MARKETING_CLIPS));
    }
    setActiveIndex(0);
    setVideoFailed(false);
  }, [envSrc, reduceMotion]);

  queueRef.current = queue;
  const src = queue[activeIndex] ?? null;
  const playlistLen = queue.length;
  const usePlaylistAdvance = playlistLen > 1;

  const onLoadedMetadata = useCallback(() => {
    const el = videoRef.current;
    if (!el || !Number.isFinite(el.duration) || el.duration <= 0) return;
    const path = queue[activeIndex] ?? "";
    if (path.startsWith("/")) {
      el.currentTime = 0;
      return;
    }
    const jitter = 0.15 + Math.random() * 0.55;
    el.currentTime = Math.min(el.duration * jitter, Math.max(0, el.duration - 2));
  }, [queue, activeIndex]);

  const onVideoError = useCallback(() => {
    setActiveIndex((i) => {
      const q = queueRef.current;
      const next = i + 1;
      if (next < q.length) return next;
      setVideoFailed(true);
      return i;
    });
  }, []);

  const onEnded = useCallback(() => {
    if (!usePlaylistAdvance) return;
    setActiveIndex((i) => {
      const len = queueRef.current.length;
      if (len <= 1) return 0;
      return (i + 1) % len;
    });
  }, [usePlaylistAdvance]);

  if (reduceMotion || videoFailed || !src) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,#1e3a5f_0%,#0a0f14_45%,#05080c_100%)]"
      />
    );
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <video
        key={`${activeIndex}-${src}`}
        ref={videoRef}
        className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-55"
        src={src}
        autoPlay
        muted
        loop={!usePlaylistAdvance}
        playsInline
        preload="auto"
        onLoadedMetadata={onLoadedMetadata}
        onError={onVideoError}
        onEnded={usePlaylistAdvance ? onEnded : undefined}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f14]/80 via-[#0a0f14]/88 to-[#05080c]/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,rgba(56,189,248,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0f14_78%)] opacity-90" />
    </div>
  );
}
