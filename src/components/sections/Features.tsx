"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Target, Layers, Cpu, Radio } from "lucide-react";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Precision Targeting",
    desc: "Sub-centimeter accuracy for drone landings and payload delivery using advanced computer vision.",
    num: "01",
    img: "/images/drone-vision.jpg"
  },
  {
    icon: <Layers className="w-8 h-8" />,
    title: "Spatial Mapping",
    desc: "Real-time 3D environment reconstruction and obstacle avoidance in complex terrain.",
    num: "02",
    img: "/images/tech-grid.jpg"
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "Edge Processing",
    desc: "Low-latency neural network inference running directly on companion computers.",
    num: "03",
    img: "/images/uav.jpg"
  },
  {
    icon: <Radio className="w-8 h-8" />,
    title: "Swarm Logic",
    desc: "Decentralized communication protocols for multi-agent autonomous coordination.",
    num: "04",
    img: "/images/drone-vision.jpg",
    status: "Research"
  }
];

/* ---------- Smooth tilt + spotlight card ---------- */
function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  const target = useRef({ rx: 0, ry: 0, lx: 50, ly: 50 });
  const current = useRef({ rx: 0, ry: 0, lx: 50, ly: 50 });
  const hovering = useRef(false);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  useEffect(() => {
    let running = true;
    // Track last applied values to prevent unnecessary DOM updates
    const lastApplied = { rx: -999, ry: -999, lx: -999, ly: -999, hover: false };

    const tick = () => {
      if (!running) return;
      const c = current.current;
      const t = target.current;
      const ease = 0.08;

      // If we are close enough to the target and not moving much, skip computation
      const dRx = Math.abs(t.rx - c.rx);
      const dRy = Math.abs(t.ry - c.ry);
      const dLx = Math.abs(t.lx - c.lx);
      const dLy = Math.abs(t.ly - c.ly);

      const isMoving = dRx > 0.01 || dRy > 0.01 || dLx > 0.01 || dLy > 0.01;
      const hoverChanged = lastApplied.hover !== hovering.current;

      if (isMoving || hoverChanged) {
        c.rx = isMoving ? lerp(c.rx, t.rx, ease) : t.rx;
        c.ry = isMoving ? lerp(c.ry, t.ry, ease) : t.ry;
        c.lx = isMoving ? lerp(c.lx, t.lx, ease) : t.lx;
        c.ly = isMoving ? lerp(c.ly, t.ly, ease) : t.ly;

        if (cardRef.current && (Math.abs(lastApplied.rx - c.rx) > 0.01 || Math.abs(lastApplied.ry - c.ry) > 0.01)) {
          cardRef.current.style.transform =
            `perspective(800px) rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg)`;
          lastApplied.rx = c.rx;
          lastApplied.ry = c.ry;
        }

        if (lightRef.current) {
          const opacity = hovering.current ? 1 : 0;
          if (hoverChanged) {
            lightRef.current.style.opacity = String(opacity);
            lastApplied.hover = hovering.current;
          }

          if (opacity > 0 && (Math.abs(lastApplied.lx - c.lx) > 0.1 || Math.abs(lastApplied.ly - c.ly) > 0.1)) {
            lightRef.current.style.background =
              `radial-gradient(600px circle at ${c.lx.toFixed(1)}% ${c.ly.toFixed(1)}%, rgba(255,255,255,0.06), transparent 40%)`;
            lastApplied.lx = c.lx;
            lastApplied.ly = c.ly;
          }
        }
      }

      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(raf.current); };
  }, []);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    target.current.ry = (nx - 0.5) * 10;
    target.current.rx = -(ny - 0.5) * 7;
    target.current.lx = nx * 100;
    target.current.ly = ny * 100;
    hovering.current = true;
  }, []);

  const onLeave = useCallback(() => {
    target.current.rx = 0;
    target.current.ry = 0;
    hovering.current = false;
  }, []);

  return (
    <div
      ref={cardRef}
      className="will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
      {/* Cursor-following spotlight */}
      <div
        ref={lightRef}
        className="absolute inset-0 z-30 pointer-events-none rounded-sm opacity-0 transition-opacity duration-300"
      />
    </div>
  );
}

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(headingRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 90%",
              end: "top 50%",
              scrub: 1,
            }
          }
        );
      }

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const xOffset = i % 2 === 0 ? -30 : 30;
        gsap.fromTo(card,
          { opacity: 0, y: 60, x: xOffset },
          {
            opacity: 1,
            y: 0,
            x: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              end: "top 55%",
              scrub: 1,
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 md:px-12 lg:px-24 bg-panel text-graphite border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8" style={{ opacity: 0 }}>
          <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none max-w-2xl text-graphite">
            Core <br />Capabilities
          </h2>
          <p className="font-mono text-sm text-metal uppercase max-w-xs">
            Engineered for reliability in GPS-denied environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((f, i) => (
            <div
              key={i}
              ref={el => { cardsRef.current[i] = el; }}
              className="perspective-card"
              style={{ opacity: 0 }}
            >
              <TiltCard>
                <div className="group relative overflow-hidden rounded-sm border border-white/5 bg-chassis flex flex-col justify-between h-[450px] transition-shadow duration-500 hover:border-white/20 hover:glow-sm">
                  <Image
                    src={f.img}
                    alt={f.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-30 group-hover:opacity-60 transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105 blur-[2px] group-hover:blur-0 mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-chassis via-chassis/60 to-transparent z-10" />

                  <div className="relative z-20 flex justify-between items-start p-8">
                    <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:border-white/40 group-hover:glow-sm">
                      {f.icon}
                    </div>
                    <span className="font-mono text-xs text-white/30 group-hover:text-white/60 transition-colors duration-500">{f.num}</span>
                  </div>

                  <div className="relative z-20 p-8">
                    <h3 className="font-display text-2xl font-bold uppercase mb-4 text-white drop-shadow-md group-hover:translate-x-1 transition-transform duration-500 flex items-center gap-3">
                      {f.title}
                      {f.status && (
                        <span className="font-mono text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-sm uppercase tracking-wider border border-white/20">
                          {f.status}
                        </span>
                      )}
                    </h3>
                    <p className="font-sans text-sm text-white/70 leading-relaxed max-w-sm drop-shadow-sm group-hover:text-white/90 transition-colors duration-500">{f.desc}</p>
                  </div>

                  <div className="absolute inset-0 rounded-sm border border-white/0 group-hover:border-white/10 transition-all duration-700 pointer-events-none z-30" />
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
