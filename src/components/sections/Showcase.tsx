"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    <section ref={containerRef} className="py-32 px-6 md:px-12 lg:px-24 bg-graphite/90 backdrop-blur-md border-b-2 border-graphite overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div ref={textRef} className="order-2 lg:order-1">
          <div className="font-mono text-sm text-amber uppercase tracking-wider mb-6 flex items-center gap-4">
            <span className="w-8 h-[2px] bg-amber" />
            Simulation Environment
          </div>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter leading-[0.9] mb-8 text-chassis">
            Train Before <br />
            <span className="text-stroke">You Fly.</span>
          </h2>
          <p className="font-sans text-lg text-chassis/80 leading-relaxed mb-8 max-w-md">
            Our high-fidelity simulation engine allows for rigorous testing of perception algorithms in photorealistic synthetic environments before deploying to physical hardware.
          </p>
          <ul className="space-y-4 font-mono text-sm text-chassis uppercase border-l-2 border-graphite/20 pl-6">
            <li>+ Synthetic Data Generation</li>
            <li>+ Edge-case scenario testing</li>
            <li>+ Hardware-in-the-loop (HITL)</li>
          </ul>
        </div>

        <div className="order-1 lg:order-2 h-[400px] md:h-[600px] relative w-full" ref={imageRef}>
          <div className="absolute inset-0 bg-graphite rounded-sm overflow-hidden">
             {/* Placeholder for complex simulation image/video */}
             <div className="absolute inset-0 grid-pattern-dark opacity-30" />
             <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 text-metal font-mono text-xs">
                <div className="w-16 h-16 border border-metal/50 rounded-full flex items-center justify-center animate-spin-slow">
                  <div className="w-2 h-2 bg-amber rounded-full absolute top-0" />
                </div>
                <span>[ RENDER ENGINE ACTIVE ]</span>
             </div>

             {/* HUD elements */}
             <div className="absolute top-4 left-4 font-mono text-[10px] text-amber">ALT: 450M</div>
             <div className="absolute top-4 right-4 font-mono text-[10px] text-amber">SPD: 24M/S</div>
             <div className="absolute bottom-4 left-4 font-mono text-[10px] text-amber">TRG: ACQUIRED</div>

             {/* Crosshair */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-amber/30 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-amber rounded-full" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
