import React from 'react';
import { TechnicalLabel } from './TechnicalLabel';

interface TelemetryRowProps {
  label: string;
  value: string;
  className?: string;
  highlight?: boolean;
}

export function TelemetryRow({ label, value, className = '', highlight = false }: TelemetryRowProps) {
  return (
    <div className={`flex justify-between items-center py-1 border-b border-white/5 last:border-0 ${className}`}>
      <TechnicalLabel className="text-amber/70">{label}</TechnicalLabel>
      <TechnicalLabel className={highlight ? 'text-highlight font-bold' : 'text-amber'}>
        {value}
      </TechnicalLabel>
    </div>
  );
}
