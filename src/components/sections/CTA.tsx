"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label fade in (scrubbed)
      gsap.fromTo(labelRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            end: "top 60%",
            scrub: 1,
          }
        }
      );

      // Word-by-word reveal for headline (scrubbed, no blur for perf)
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.cta-word');
        gsap.fromTo(words,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              end: "top 40%",
              scrub: 1,
            }
          }
        );
      }

      // Buttons stagger in (scrubbed)
      if (buttonsRef.current) {
        gsap.fromTo(buttonsRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              end: "top 35%",
              scrub: 1,
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const headlineWords = "Build Systems That Understand What They See.".split(' ');

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 lg:px-24 bg-chassis border-t border-b-8 border-white/20 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[60vh]">
      <div className="absolute inset-0 grid-pattern opacity-10" />

      {/* Animated gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] pointer-events-none animate-float-orb" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/3 rounded-full blur-[80px] pointer-events-none animate-float-orb" style={{ animationDelay: "-7s", animationDuration: "25s" }} />

      <div className="max-w-4xl relative z-10">
        <div ref={labelRef} className="font-mono text-sm text-metal uppercase font-bold tracking-widest mb-6" style={{ opacity: 0 }}>
          [ DEPLOYMENT READY ]
        </div>
        <h2 ref={headlineRef} className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white mb-12 drop-shadow-2xl flex flex-wrap justify-center gap-x-[0.3em]">
          {headlineWords.map((word, i) => (
            <span key={i} className="cta-word inline-block overflow-hidden" style={{ opacity: 0 }}>
              {word}
            </span>
          ))}
        </h2>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="group relative bg-white text-black px-10 py-5 font-mono text-sm uppercase tracking-wider font-bold rounded-sm overflow-hidden btn-lift" style={{ opacity: 0 }}>
            <span className="relative z-10 transition-colors duration-300">Initialize Platform</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 shadow-[0_0_30px_rgba(255,255,255,0.4)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
          <button className="group border border-white/30 text-white px-10 py-5 font-mono text-sm uppercase tracking-wider font-bold rounded-sm transition-all duration-300 hover:bg-white/10 hover:border-white/50 btn-lift" style={{ opacity: 0 }}>
            View Documentation
          </button>
        </div>
      </div>
    </section>
  );
}
