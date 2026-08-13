"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GitBranch, Code2, Terminal } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function OpenSource() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation (scrubbed)
      if (headingRef.current) {
        gsap.fromTo(headingRef.current,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              end: "top 45%",
              scrub: 1,
            }
          }
        );
      }

      // Cards with stagger (scrubbed — stagger unfolds as you scroll)
      gsap.fromTo(".os-card",
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 md:px-12 lg:px-24 bg-panel text-graphite border-b border-white/10 relative">
      <div className="absolute top-0 right-0 w-1/2 h-full grid-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div ref={headingRef} className="lg:col-span-5 flex flex-col justify-center relative z-10" style={{ opacity: 0 }}>
          <div className="font-mono text-sm text-metal uppercase tracking-wider mb-6 flex items-center gap-4">
            <GitBranch className="w-5 h-5 text-white" />
            03 // Open Source
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.9] mb-8 text-graphite">
            Built In <br />
            <span className="text-stroke-light">The Open.</span>
          </h2>
          <p className="font-sans text-lg text-white/80 leading-relaxed mb-8">
            Engineered for aerial problems. We believe the future of autonomous flight should be collaborative, transparent, and accessible to researchers and developers worldwide.
          </p>
          <div>
            <button className="group relative inline-flex items-center justify-center gap-2 bg-graphite text-chassis px-8 py-4 font-mono text-sm uppercase tracking-wider overflow-hidden rounded-sm border border-white/10 hover:border-white/50 transition-colors btn-lift">
              <span className="relative z-10 flex items-center gap-2 font-bold group-hover:text-black transition-colors duration-300">
                Visit GitHub
              </span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
          <div className="os-card group relative border border-white/10 bg-chassis/80 backdrop-blur-md p-8 flex flex-col justify-between rounded-sm shadow-xl transition-all duration-500 hover:border-white/30 hover:bg-white/5 hover:glow-sm" style={{ opacity: 0 }}>
            {/* Animated border gradient overlay */}
            <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)" }} />
            <Terminal className="w-8 h-8 text-white mb-12 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500" />
            <div className="relative z-10">
              <h3 className="font-mono text-lg uppercase font-bold mb-2 text-white">Aero-Perception</h3>
              <p className="font-sans text-sm text-metal mb-4 group-hover:text-white/70 transition-colors duration-300">Core computer vision pipeline for real-time object tracking in aerial footage.</p>
              <div className="flex gap-4 font-mono text-xs text-white/50">
                <span>C++ / Python</span>
                <span>Active Development</span>
              </div>
            </div>
          </div>

          <div className="os-card group relative border border-white/10 bg-chassis/80 backdrop-blur-md p-8 flex flex-col justify-between rounded-sm shadow-xl mt-0 sm:mt-12 transition-all duration-500 hover:border-white/30 hover:bg-white/5 hover:glow-sm" style={{ opacity: 0 }}>
            <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)" }} />
            <Code2 className="w-8 h-8 text-white mb-12 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500" />
            <div className="relative z-10">
              <h3 className="font-mono text-lg uppercase font-bold mb-2 text-white">Sim-Engine</h3>
              <p className="font-sans text-sm text-metal mb-4 group-hover:text-white/70 transition-colors duration-300">Photorealistic synthetic environments for training drone navigation models.</p>
              <div className="flex gap-4 font-mono text-xs text-white/50">
                <span>Unreal / C++</span>
                <span>850 Stars</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
