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
  const [isMobile, setIsMobile] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [queue, setQueue] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const envSrc = useMemo(() => {
    const v = process.env.NEXT_PUBLIC_MARKETING_VIDEO_URL;
    return v && v.trim().length > 0 ? v.trim() : null;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMq = window.matchMedia("(max-width: 768px)");
    
    setReduceMotion(mq.matches);
    setIsMobile(mobileMq.matches);

    const onMotionChange = () => setReduceMotion(mq.matches);
    const onMobileChange = () => setIsMobile(mobileMq.matches);

    mq.addEventListener("change", onMotionChange);
    mobileMq.addEventListener("change", onMobileChange);

    return () => {
      mq.removeEventListener("change", onMotionChange);
      mobileMq.removeEventListener("change", onMobileChange);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion || isMobile) return;
    if (envSrc) {
      setQueue([envSrc]);
    } else {
      setQueue(shuffleStartOrder(LOCAL_MARKETING_CLIPS));
    }
    setActiveIndex(0);
    setVideoFailed(false);
  }, [envSrc, reduceMotion, isMobile]);

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

  const backdropBase = (
    <div
      aria-hidden
      className="fixed inset-0 z-0 bg-[#05080c]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,#1e3a5f_0%,#0a0f14_45%,#05080c_100%)] opacity-80" />
      <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_20%_30%,#0c4a6e_0%,transparent_50%)] opacity-20" />
      <div className="absolute inset-0 animate-pulse delay-700 bg-[radial-gradient(circle_at_80%_70%,#065f46_0%,transparent_50%)] opacity-10" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
    </div>
  );

  if (reduceMotion || isMobile || videoFailed || !src) {
    return backdropBase;
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {backdropBase}
      <video
        key={`${activeIndex}-${src}`}
        ref={videoRef}
        className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-30 mix-blend-screen"
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
      <div className="absolute inset-0 bg-gradient-to-t from-[#05080c] via-transparent to-transparent opacity-60" />
    </div>
  );
}
