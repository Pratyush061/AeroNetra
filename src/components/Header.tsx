"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Menu } from "lucide-react";

export function Header() {
  const headerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
    );
  }, []);

  const navItems = [
    'Capabilities',
    'Simulation',
    'Open Source',
    'About'
  ];

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-24 py-6 flex items-center justify-between pointer-events-none">
      <div className="font-display text-xl font-black uppercase tracking-tighter text-graphite pointer-events-auto bg-panel/70 backdrop-blur-md px-4 py-2 border border-white/10 shadow-lg rounded-sm">
        AeroNetra.
      </div>

      <nav className="hidden lg:flex items-center gap-8 pointer-events-auto bg-panel/70 backdrop-blur-md px-8 py-3 border border-white/10 shadow-lg rounded-sm">
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(' ', '-')}`}
            className="font-mono text-xs uppercase font-bold text-metal hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {item}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4 pointer-events-auto">
        <button className="hidden md:flex bg-graphite text-chassis px-6 py-3 font-mono text-xs uppercase font-bold hover:bg-white transition-colors rounded-sm shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          Explore Platform
        </button>
        <button aria-label="Toggle menu" className="lg:hidden bg-graphite text-chassis p-3 hover:bg-white transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
