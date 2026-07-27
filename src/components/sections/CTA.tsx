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
    <section ref={containerRef} className="py-32 px-6 md:px-12 lg:px-24 bg-amber/90 backdrop-blur-md border-b-8 border-graphite relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[60vh]">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="cta-text max-w-4xl relative z-10">
        <div className="font-mono text-sm text-chassis uppercase font-bold tracking-widest mb-6">
          [ DEPLOYMENT READY ]
        </div>
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-chassis mb-12">
          Build Systems That <br/>
          Understand What <br/>
          They See.
        </h2>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="bg-graphite text-amber px-10 py-5 font-mono text-sm uppercase tracking-wider font-bold hover:bg-carbon hover:text-white transition-colors">
            Initialize Platform
          </button>
          <button className="bg-transparent border-2 border-graphite text-chassis px-10 py-5 font-mono text-sm uppercase tracking-wider font-bold hover:bg-graphite hover:text-amber transition-colors">
            View Documentation
          </button>
        </div>
      </div>
    </section>
  );
}
