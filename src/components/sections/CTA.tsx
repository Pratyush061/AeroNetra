"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CTA() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".cta-text",
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 lg:px-24 bg-chassis border-t border-b-8 border-white/20 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[60vh]">
      <div className="absolute inset-0 grid-pattern opacity-10" />

      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="cta-text max-w-4xl relative z-10">
        <div className="font-mono text-sm text-metal uppercase font-bold tracking-widest mb-6">
          [ DEPLOYMENT READY ]
        </div>
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white mb-12 drop-shadow-2xl">
          Build Systems That <br/>
          Understand What <br/>
          They See.
        </h2>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="bg-white text-black px-10 py-5 font-mono text-sm uppercase tracking-wider font-bold hover:bg-gray-200 transition-colors rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Initialize Platform
          </button>
          <button className="bg-transparent border border-white/30 text-white px-10 py-5 font-mono text-sm uppercase tracking-wider font-bold hover:bg-white/10 transition-colors rounded-sm">
            View Documentation
          </button>
        </div>
      </div>
    </section>
  );
}
