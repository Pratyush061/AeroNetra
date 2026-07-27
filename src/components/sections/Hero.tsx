"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DroneCanvas } from "@/components/3d/DroneCanvas";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const chars = textRef.current.querySelectorAll('.char');

    gsap.fromTo(chars,
      { y: 100, opacity: 0, rotateX: -90 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.05,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2
      }
    );

    // Scroll animation for parallax effect
    gsap.to(containerRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
      y: 100,
      opacity: 0,
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center pb-24 pt-32 px-6 md:px-12 lg:px-24 overflow-hidden border-b border-white/10 bg-chassis"
    >
      <DroneCanvas />

      {/* Dark gradient overlay for readability, fading out towards top for 3D visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-chassis/40 to-chassis z-0 pointer-events-none" />

      <div className="absolute top-32 left-6 md:left-12 lg:left-24 font-mono text-xs md:text-sm tracking-widest text-metal uppercase flex items-center gap-4 z-10 pointer-events-none">
        <span className="w-2 h-2 bg-amber rounded-full animate-pulse" />
        AeroNetra Systems // V 2.4.0
      </div>

      <div className="max-w-7xl relative z-10 w-full mt-20 pointer-events-none">
        <h1
          ref={textRef}
          className="font-display text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.85] uppercase mb-12 flex flex-wrap gap-x-6 gap-y-4"
          style={{ perspective: "1000px" }}
        >
          {["VISION,", "ELEVATED."].map((word, i) => (
            <span key={i} className="inline-flex overflow-hidden text-graphite drop-shadow-2xl">
              {word.split('').map((char, j) => (
                <span key={j} className="char inline-block origin-bottom">{char}</span>
              ))}
            </span>
          ))}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end pointer-events-auto">
          <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-lg md:text-xl text-metal font-sans leading-relaxed mb-8 backdrop-blur-sm bg-chassis/30 p-4 rounded-xl border border-white/5"
            >
              We build computer-vision, perception and simulation software for UAVs—transforming aerial imagery into structured intelligence for autonomous systems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex items-center gap-6"
            >
              <button className="group relative flex items-center justify-center gap-2 bg-graphite text-chassis px-8 py-4 font-mono text-sm uppercase tracking-wider overflow-hidden rounded-sm hover:bg-white transition-colors cursor-pointer">
                <span className="relative z-10 flex items-center gap-2 font-bold">
                  Initialize <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </button>

              <div className="font-mono text-xs text-metal uppercase flex flex-col gap-1 bg-panel/50 px-4 py-2 border border-white/5 rounded-sm">
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Status: Active</span>
                <span>Latency: 12ms</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
