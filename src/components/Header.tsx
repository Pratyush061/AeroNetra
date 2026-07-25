import React from 'react';
import Image from 'next/image';
import { PhysicalButton } from './ui/PhysicalButton';
import { StatusLED } from './ui/StatusLED';

export function Header() {
  const navItems = [
    'Platform',
    'Capabilities',
    'Simulation',
    'Open Source',
    'About'
  ];

  return (
    <header className="sticky top-4 z-50 px-4 md:px-8 w-full max-w-7xl mx-auto">
      <div className="bg-panel shadow-raised rounded-sm border border-white/50 px-6 py-4 flex items-center justify-between">

        {/* Logo Area */}
        <div className="flex items-center gap-6">
          <div className="relative w-8 h-8 md:w-10 md:h-10">
            {/* The real logo would go here, we'll simulate the layout block */}
            <Image
              src="/logo.png"
              alt="AeroNetra Logo"
              fill
              className="object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]"
              priority
            />
          </div>
          <div className="hidden lg:flex items-center h-6 w-px bg-shadow/30 mx-2" />
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-recessed shadow-recessed rounded-sm">
            <StatusLED status="active" label="PERCEPTION SYSTEM // ACTIVE" className="text-[10px]" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-sm font-medium text-graphite hover:text-amber transition-colors"
            >
              {item}
            </a>
          ))}
          <div className="h-4 w-px bg-shadow/30" />
          <a href="#github" className="text-sm font-medium text-graphite hover:text-amber transition-colors flex items-center gap-2">
            GitHub
          </a>
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <PhysicalButton variant="primary" className="hidden md:inline-flex px-4 py-2 h-10 text-xs">
            Explore Platform
          </PhysicalButton>
          <button className="lg:hidden p-2 text-graphite hover:bg-shadow/10 rounded-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
}
