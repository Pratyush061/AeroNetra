"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

const DroneCanvas = dynamic(
  () => import("@/components/3d/DroneCanvas").then((mod) => mod.DroneCanvas),
  { ssr: false, loading: () => <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"><div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div></div> }
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const versionRef = useRef<HTMLDivElement>(null);
  const statusDotRef = useRef<HTMLSpanElement>(null);
  const statusTextRef = useRef<HTMLSpanElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);

  // Magnetic text hover effect
  const handleCharHover = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    gsap.to(el, {
      scale: 1.15,
      color: "#ffffff",
      textShadow: "0 0 20px rgba(255,255,255,0.3)",
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const handleCharLeave = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    gsap.to(el, {
      scale: 1,
      color: "#fafafa",
      textShadow: "none",
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    });
  }, []);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const chars = textRef.current!.querySelectorAll('.char');
      const words = descRef.current?.querySelectorAll('.word');

      // Master timeline for orchestrated entrance
      const tl = gsap.timeline({ delay: 0.6 });

      // Version tag slide in
      tl.fromTo(versionRef.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        0
      );

      // Characters: clip-mask reveal with blur
      tl.fromTo(chars,
        {
          y: "110%",
          opacity: 0,
          filter: "blur(8px)",
        },
        {
          y: "0%",
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.04,
          duration: 0.9,
          ease: "power4.out",
        },
        0.2
      );

      // Description: word-by-word reveal
      if (words && words.length > 0) {
        tl.fromTo(words,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.03,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.3"
        );
      }

      // Buttons slide in with stagger
      if (buttonsRef.current) {
        const buttons = buttonsRef.current.children;
        tl.fromTo(buttons,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.2"
        );
      }

      // Status dot breathing animation
      if (statusDotRef.current) {
        gsap.to(statusDotRef.current, {
          scale: 1.4,
          opacity: 0.5,
          duration: 1.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      // Layered parallax on scroll
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          // Text layer moves slower (parallax)
          if (textLayerRef.current) {
            gsap.set(textLayerRef.current, {
              y: p * 60,
              opacity: 1 - p * 0.7,
            });
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Split description into words for animation
  const descriptionText = "Open-source perception and autonomy software for UAVs.";
  const descWords = descriptionText.split(' ');

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center pb-24 pt-32 px-6 md:px-12 lg:px-24 overflow-hidden border-b border-white/10 bg-chassis"
    >
      <DroneCanvas />

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-chassis/20 via-chassis/50 to-chassis z-0 pointer-events-none" />

      <div
        ref={versionRef}
        className="absolute top-32 left-6 md:left-12 lg:left-24 font-mono text-xs md:text-sm tracking-widest text-metal uppercase flex items-center gap-4 z-10"
        style={{ opacity: 0 }}
      >
        <span ref={statusDotRef} className="w-2 h-2 bg-amber rounded-full" />
        AeroNetra Systems // V 2.4.0
      </div>

      <div ref={textLayerRef} className="max-w-7xl relative z-10 w-full mt-20 pointer-events-none">
        <h1
          ref={textRef}
          className="font-display text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.85] uppercase mb-12 flex flex-wrap gap-x-6 gap-y-4 pointer-events-auto"
        >
          {["VISION,", "ELEVATED."].map((word, i) => (
            <span key={i} className="inline-flex overflow-hidden text-graphite drop-shadow-2xl">
              {word.split('').map((char, j) => (
                <span
                  key={j}
                  className="char inline-block origin-bottom cursor-default"
                  onMouseEnter={handleCharHover}
                  onMouseLeave={handleCharLeave}
                  style={{ willChange: "transform, filter" }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            <p
              ref={descRef}
              className="text-lg md:text-xl text-metal font-sans leading-relaxed mb-8 backdrop-blur-sm bg-chassis/30 p-4 rounded-xl border border-white/5 pointer-events-auto"
            >
              {descWords.map((word, i) => (
                <span key={i} className="word inline-block mr-[0.3em]" style={{ opacity: 0 }}>
                  {word}
                </span>
              ))}
            </p>

            <div ref={buttonsRef} className="flex items-center gap-6 pointer-events-auto">
              <a href="#perception-demo" className="group relative flex items-center justify-center gap-2 bg-white text-black px-8 py-4 font-mono text-sm uppercase tracking-wider overflow-hidden rounded-sm btn-lift border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-shadow duration-500" style={{ opacity: 0 }}>
                <span className="relative z-10 flex items-center gap-2 font-bold transition-colors duration-300 group-hover:text-black">
                  Explore AeroNetra <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
              </a>

              <div className="font-mono text-xs text-metal uppercase flex flex-col gap-1.5 bg-panel/50 px-4 py-2.5 border border-white/5 rounded-sm" style={{ opacity: 0 }}>
                <span className="flex items-center gap-2">
                  <span ref={statusDotRef} className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span ref={statusTextRef}>Status: Active</span>
                </span>
                <span>Research Build</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
