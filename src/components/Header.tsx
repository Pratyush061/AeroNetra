"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function MagneticNavItem({ href, label }: { href: string; label: string }) {
  const itemRef = useRef<HTMLAnchorElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(itemRef.current, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.4,
      ease: "power3.out",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!itemRef.current) return;
    gsap.to(itemRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  }, []);

  return (
    <a
      ref={itemRef}
      href={href}
      className="relative font-mono text-xs uppercase font-bold text-metal hover:text-white transition-colors duration-300 py-2 px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {label}
      <span
        ref={underlineRef}
        className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-white group-hover:w-full transition-all duration-300 ease-out"
      />
    </a>
  );
}

export function Header() {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    // Entrance animation
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(headerRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    // Logo shimmer on load
    if (logoRef.current) {
      tl.fromTo(logoRef.current,
        { backgroundPosition: "-200% center" },
        { backgroundPosition: "200% center", duration: 1.5, ease: "power2.inOut" },
        "-=0.5"
      );
    }

    // Scroll-aware frosted glass background
    if (bgRef.current) {
      gsap.set(bgRef.current, { opacity: 0 });

      ScrollTrigger.create({
        trigger: document.body,
        start: "top -80px",
        end: "top -81px",
        onEnter: () => {
          gsap.to(bgRef.current, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(bgRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
          });
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  const navItems = [
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Simulation', href: '#simulation' },
    { label: 'Open Source', href: '#open-source' },
    { label: 'About', href: '#about' },
  ];

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-24 py-5 flex items-center justify-between pointer-events-none" style={{ opacity: 0 }}>
      {/* Scroll-aware frosted background */}
      <div
        ref={bgRef}
        className="absolute inset-0 glass-strong border-b border-white/5"
        style={{ opacity: 0 }}
      />

      <div
        ref={logoRef}
        className="relative font-display text-xl font-black uppercase tracking-tighter text-graphite pointer-events-auto px-4 py-2 rounded-sm cursor-pointer hover:tracking-normal transition-all duration-500"
        style={{
          background: "linear-gradient(90deg, #fafafa 0%, #fafafa 40%, rgba(255,255,255,0.6) 50%, #fafafa 60%, #fafafa 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        AeroNetra.
      </div>

      <nav className="hidden lg:flex items-center gap-8 pointer-events-auto relative z-10">
        {navItems.map((item) => (
          <MagneticNavItem key={item.label} href={item.href} label={item.label} />
        ))}
      </nav>

      <div className="flex items-center gap-4 pointer-events-auto relative z-10">
        <button className="hidden md:flex relative bg-graphite text-chassis px-6 py-3 font-mono text-xs uppercase font-bold rounded-sm overflow-hidden group btn-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          <span className="relative z-10 transition-colors duration-300 group-hover:text-chassis">Explore Platform</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-200 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
        </button>
        <button aria-label="Toggle menu" className="lg:hidden bg-graphite text-chassis p-3 hover:bg-white transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white btn-lift">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
