"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Target, Layers, Cpu, Radio } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Precision Targeting",
    desc: "Sub-centimeter accuracy for drone landings and payload delivery using advanced computer vision.",
    num: "01"
  },
  {
    icon: <Layers className="w-8 h-8" />,
    title: "Spatial Mapping",
    desc: "Real-time 3D environment reconstruction and obstacle avoidance in complex terrain.",
    num: "02"
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "Edge Processing",
    desc: "Low-latency neural network inference running directly on companion computers.",
    num: "03"
  },
  {
    icon: <Radio className="w-8 h-8" />,
    title: "Swarm Logic",
    desc: "Decentralized communication protocols for multi-agent autonomous coordination.",
    num: "04"
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
    <section ref={sectionRef} className="py-32 px-6 md:px-12 lg:px-24 bg-transparent text-chassis backdrop-blur-sm border-b-2 border-amber grid-pattern-dark relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
          <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none max-w-2xl">
            Core <br />Capabilities
          </h2>
          <p className="font-mono text-sm text-recessed uppercase max-w-xs">
            Engineered for reliability in GPS-denied environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              ref={el => { cardsRef.current[i] = el; }}
              className="group border border-carbon bg-graphite/50 backdrop-blur-sm p-8 hover:bg-carbon/20 transition-colors duration-500 flex flex-col justify-between min-h-[320px]"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="p-3 bg-carbon/50 text-amber group-hover:scale-110 transition-transform duration-500">
                  {f.icon}
                </div>
                <span className="font-mono text-xs text-metal">{f.num}</span>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold uppercase mb-4 text-panel">{f.title}</h3>
                <p className="font-sans text-sm text-recessed/80 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
