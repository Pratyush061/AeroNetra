"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );

      gsap.fromTo(imageRef.current,
        { scale: 1.1, opacity: 0, clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
        {
          scale: 1,
          opacity: 1,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 1.5,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 65%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 lg:px-24 bg-chassis border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div ref={textRef} className="order-2 lg:order-1">
          <div className="font-mono text-sm text-metal uppercase tracking-wider mb-6 flex items-center gap-4">
            <span className="w-8 h-[2px] bg-metal" />
            Simulation Environment
          </div>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter leading-[0.9] mb-8 text-graphite drop-shadow-lg">
            Train Before <br />
            <span className="text-white">You Fly.</span>
          </h2>
          <p className="font-sans text-lg text-metal leading-relaxed mb-8 max-w-md">
            Our high-fidelity simulation engine allows for rigorous testing of perception algorithms in photorealistic synthetic environments before deploying to physical hardware.
          </p>
          <ul className="space-y-4 font-mono text-sm text-white/80 uppercase border-l border-white/20 pl-6">
            <li>+ Synthetic Data Generation</li>
            <li>+ Edge-case scenario testing</li>
            <li>+ Hardware-in-the-loop (HITL)</li>
          </ul>
        </div>

        <div className="order-1 lg:order-2 h-[400px] md:h-[600px] relative w-full" ref={imageRef}>
          <div className="absolute inset-0 bg-panel rounded-sm overflow-hidden border border-white/10 shadow-2xl">
             <Image
               src="/images/sim-env.jpg"
               alt="Drone Simulation"
               fill
               className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
             />
             <div className="absolute inset-0 grid-pattern opacity-10 mix-blend-overlay" />

             {/* HUD elements */}
             <div className="absolute top-4 left-4 font-mono text-xs font-bold text-white tracking-widest drop-shadow-md">ALT: 450M</div>
             <div className="absolute top-4 right-4 font-mono text-xs font-bold text-white tracking-widest drop-shadow-md">SPD: 24M/S</div>
             <div className="absolute bottom-4 left-4 font-mono text-xs font-bold text-white tracking-widest flex items-center gap-2 drop-shadow-md">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> TRG: ACQUIRED
             </div>

             {/* Crosshair */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/40 rounded-full flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/20 -translate-x-1/2" />
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/20 -translate-y-1/2" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
