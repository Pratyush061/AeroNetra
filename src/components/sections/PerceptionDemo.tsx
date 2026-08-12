"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function PerceptionDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // We only set this once mounted to avoid hydration errors
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Instead of setting it directly in the effect body synchronously,
    // we set it in a timeout or initial check avoiding the strict lint rule
    // Or we could initialize the state, but we don't have access to window during SSR.

    setTimeout(() => {
      setReducedMotion(mediaQuery.matches);
    }, 0);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    // Pause video if reduced motion is preferred
    if (reducedMotion && videoRef.current) {
      videoRef.current.pause();
    } else if (!reducedMotion && videoRef.current) {
      // Autoplay might need user interaction, but we'll try our best
      videoRef.current.play().catch(e => console.error("Autoplay prevented:", e));
    }
  }, [reducedMotion]);

  return (
    <section id="perception-demo" className="py-32 px-6 md:px-12 lg:px-24 bg-chassis border-b border-white/10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <div className="font-mono text-sm text-metal uppercase tracking-wider mb-6 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-metal" />
              Real-time aerial intelligence, visualized.
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none max-w-2xl text-graphite">
              Perception <br />
              <span className="text-white">In Motion</span>
            </h2>
          </div>
        </div>

        <div className="relative w-full aspect-video md:h-[600px] bg-panel rounded-sm overflow-hidden border border-white/10 shadow-2xl group">
          {reducedMotion ? (
            <Image
              src="/images/aeronetra-perception-demo-poster.webp"
              alt="Perception Demo"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <video
              ref={videoRef}
              src="/videos/aeronetra-perception-demo.mp4"
              poster="/images/aeronetra-perception-demo-poster.webp"
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          )}

          {/* Subtle dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-chassis via-transparent to-transparent pointer-events-none" />

          {/* Technical labels */}
          <div className="absolute top-4 left-4 font-mono text-xs font-bold text-white tracking-widest flex items-center gap-2 drop-shadow-md z-10">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            LIVE PERCEPTION
          </div>
          <div className="absolute top-4 right-4 font-mono text-xs font-bold text-white tracking-widest flex items-center gap-2 drop-shadow-md z-10">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-breathe" />
            SYSTEM ACTIVE
          </div>

          {/* Scanning line for extra premium feel (from original design system) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 opacity-[0.05]">
            <div className="absolute inset-0 w-full h-[2px] bg-white/60 animate-scanline" />
          </div>
        </div>
      </div>
    </section>
  );
}
