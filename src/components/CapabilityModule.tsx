import React from 'react';
import { IndustrialPanel } from './ui/IndustrialPanel';
import { StatusLED } from './ui/StatusLED';
import { TechnicalLabel } from './ui/TechnicalLabel';

interface CapabilityModuleProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

export function CapabilityModule({ id, title, description, icon, isActive = false }: CapabilityModuleProps) {
  return (
    <IndustrialPanel withFasteners className="p-6 h-full flex flex-col hover:bg-white transition-colors duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-recessed shadow-recessed rounded-sm flex items-center justify-center text-graphite">
          {icon}
        </div>
        <div className="flex flex-col items-end gap-2">
          <TechnicalLabel type="identifier">{id}</TechnicalLabel>
          <StatusLED status={isActive ? 'active' : 'inactive'} />
        </div>
      </div>

      <h3 className="text-xl font-medium text-graphite mb-3">{title}</h3>
      <p className="text-metal text-sm leading-relaxed flex-1">
        {description}
      </p>

      {/* Vents */}
      <div className="flex gap-1.5 mt-8 justify-end opacity-20 hidden md:flex">
        <div className="w-1 h-4 bg-carbon shadow-recessed rounded-full" />
        <div className="w-1 h-4 bg-carbon shadow-recessed rounded-full" />
        <div className="w-1 h-4 bg-carbon shadow-recessed rounded-full" />
      </div>
    </IndustrialPanel>
  );
}
