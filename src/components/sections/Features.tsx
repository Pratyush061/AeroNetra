"use client";

import { useEffect, useRef } from "react";
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
    img: "/images/drone-vision.jpg" // Re-using image for demo
  }
];

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
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
              className="group relative overflow-hidden rounded-sm border border-white/5 bg-chassis flex flex-col justify-between h-[450px]"
            >
              <Image
                src={f.img}
                alt={f.title}
                fill
                className="object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-700 grayscale group-hover:grayscale-0 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-chassis via-chassis/60 to-transparent z-10" />

              <div className="relative z-20 flex justify-between items-start p-8">
                <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-sm group-hover:scale-110 transition-transform duration-500">
                  {f.icon}
                </div>
                <span className="font-mono text-xs text-white/50">{f.num}</span>
              </div>

              <div className="relative z-20 p-8">
                <h3 className="font-display text-2xl font-bold uppercase mb-4 text-white drop-shadow-md">{f.title}</h3>
                <p className="font-sans text-sm text-white/80 leading-relaxed max-w-sm drop-shadow-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
