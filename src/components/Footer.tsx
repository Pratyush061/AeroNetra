import React from 'react';
import Image from 'next/image';
import { TechnicalLabel } from './ui/TechnicalLabel';

export function Footer() {
  const links = {
    product: ['Platform', 'Research', 'Simulation'],
    community: ['Open Source', 'GitHub'],
    company: ['Contact', 'Privacy']
  };

  return (
    <footer className="bg-graphite text-panel border-t-4 border-carbon pt-20 pb-12 px-6 md:px-12 relative overflow-hidden">
      {/* Abstract eye-reticle background detail */}
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-1/4 translate-y-1/4">
        <svg width="600" height="600" viewBox="0 0 100 100" className="text-white">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="8" fill="currentColor" />
          <line x1="10" y1="50" x2="30" y2="50" stroke="currentColor" strokeWidth="2" />
          <line x1="70" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="2" />
          <line x1="50" y1="10" x2="50" y2="30" stroke="currentColor" strokeWidth="2" />
          <line x1="50" y1="70" x2="50" y2="90" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-10 h-10 bg-white rounded-sm p-1">
                <Image
                  src="/logo.png"
                  alt="AeroNetra Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight">AeroNetra</span>
            </div>
            <TechnicalLabel type="identifier" className="inline-block mb-4">
              COMPUTER VISION AND AUTONOMY SOFTWARE FOR UAVs
            </TechnicalLabel>
          </div>

          <div>
            <h4 className="font-mono text-sm uppercase tracking-widest text-metal mb-6">Product</h4>
            <ul className="space-y-4">
              {links.product.map(link => (
                <li key={link}>
                  <a href="#" className="text-panel/80 hover:text-white hover:pl-2 transition-all duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-sm uppercase tracking-widest text-metal mb-6">Connect</h4>
            <ul className="space-y-4">
              {[...links.community, ...links.company].map(link => (
                <li key={link}>
                  <a href="#" className="text-panel/80 hover:text-white hover:pl-2 transition-all duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-carbon">
          <TechnicalLabel className="text-metal/60">
            ENGINEERED FROM INDIA // BUILT FOR GLOBAL AIRSPACE
          </TechnicalLabel>
          <div className="text-xs text-metal/40">
            &copy; {new Date().getFullYear()} AeroNetra. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
