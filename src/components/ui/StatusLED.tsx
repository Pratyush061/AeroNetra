import React from 'react';

interface StatusLEDProps {
  status: 'active' | 'inactive' | 'warning';
  label?: string;
  className?: string;
}

export function StatusLED({ status, label, className = '' }: StatusLEDProps) {
  const getStatusClasses = () => {
    switch (status) {
      case 'active':
        return 'bg-amber shadow-[0_0_8px_rgba(232,137,0,0.6)]';
      case 'warning':
        return 'bg-signal shadow-[0_0_8px_rgba(245,160,0,0.6)]';
      case 'inactive':
      default:
        return 'bg-metal opacity-50';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <span className="font-mono text-xs tracking-wider uppercase text-metal">
          {label}
        </span>
      )}
      <div
        className={`w-2 h-2 rounded-full border border-graphite/20 ${getStatusClasses()}`}
        role="status"
        aria-label={`Status: ${status}`}
      />
    </div>
  );
}
