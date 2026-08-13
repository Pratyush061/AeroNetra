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
  const innerImageRef = useRef<HTMLImageElement>(null);
  const hudAltRef = useRef<HTMLDivElement>(null);
  const hudSpdRef = useRef<HTMLDivElement>(null);
  const hudTrgRef = useRef<HTMLDivElement>(null);
  const listItemsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveal from left (scrubbed)
      gsap.fromTo(textRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "top 45%",
            scrub: 1,
          }
        }
      );

      // List items stagger in (scrubbed, staggered across scroll)
      listItemsRef.current.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(item,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: `top ${80 - i * 4}%`,
              end: `top ${45 - i * 4}%`,
              scrub: 1,
            }
          }
        );
      });

      // Image clip-path reveal with scale (scrubbed)
      gsap.fromTo(imageRef.current,
        { scale: 1.1, opacity: 0, clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
        {
          scale: 1,
          opacity: 1,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          }
        }
      );

      // HUD counter animations — typewriter/counter effect
      const animateCounter = (ref: React.RefObject<HTMLDivElement | null>, text: string, delay: number) => {
        if (!ref.current) return;
        ref.current.textContent = "";
        const chars = text.split('');
        chars.forEach((char, i) => {
          gsap.delayedCall(delay + i * 0.06, () => {
            if (ref.current) ref.current.textContent += char;
          });
        });
      };

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 60%",
        once: true,
        onEnter: () => {
          animateCounter(hudAltRef, "ALT: 450M", 0.5);
          animateCounter(hudSpdRef, "SPD: 24M/S", 0.8);
          animateCounter(hudTrgRef, "TRG: ACQUIRED", 1.1);
        },
      });

      // Image parallax on scroll
      if (innerImageRef.current && imageRef.current) {
        gsap.to(innerImageRef.current, {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const listItems = [
    "+ Synthetic Data Generation",
    "+ Edge-case scenario testing",
    "+ Hardware-in-the-loop (HITL)",
  ];

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 lg:px-24 bg-chassis border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div ref={textRef} className="order-2 lg:order-1" style={{ opacity: 0 }}>
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
            {listItems.map((item, i) => (
              <li key={i} ref={el => { listItemsRef.current[i] = el; }} style={{ opacity: 0 }}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="order-1 lg:order-2 h-[400px] md:h-[600px] relative w-full" ref={imageRef}>
          <div className="absolute inset-0 bg-panel rounded-sm overflow-hidden border border-white/10 shadow-2xl group">
             <Image
               ref={innerImageRef}
               src="/images/sim-env.jpg"
               alt="Drone Simulation"
               fill
               className="object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:opacity-75 group-hover:scale-105"
             />
             <div className="absolute inset-0 grid-pattern opacity-10 mix-blend-overlay" />

             {/* Scanline overlay */}
             <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 opacity-[0.03]">
               <div className="absolute inset-0 w-full h-[2px] bg-white/60 animate-scanline" />
             </div>

             {/* HUD elements — animated counter */}
             <div ref={hudAltRef} className="absolute top-4 left-4 font-mono text-xs font-bold text-white tracking-widest drop-shadow-md z-10" />
             <div ref={hudSpdRef} className="absolute top-4 right-4 font-mono text-xs font-bold text-white tracking-widest drop-shadow-md z-10" />
             <div className="absolute bottom-4 left-4 font-mono text-xs font-bold text-white tracking-widest flex items-center gap-2 drop-shadow-md z-10">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-breathe" />
               <span ref={hudTrgRef} />
             </div>

             {/* Crosshair — rotating */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 pointer-events-none z-10">
               <div className="absolute inset-0 border border-white/30 rounded-full animate-rotate-slow" />
               <div className="absolute inset-2 border border-white/15 rounded-full" style={{ animation: "rotate-slow 20s linear infinite reverse" }} />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/80 rounded-full" />
               <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/20 -translate-x-1/2" />
               <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/20 -translate-y-1/2" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
