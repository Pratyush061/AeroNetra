import React from 'react';

interface TechnicalLabelProps {
  children: React.ReactNode;
  className?: string;
  type?: 'default' | 'value' | 'identifier';
}

export function TechnicalLabel({ children, className = '', type = 'default' }: TechnicalLabelProps) {
  const getTypeClasses = () => {
    switch (type) {
      case 'value':
        return 'text-graphite font-semibold';
      case 'identifier':
        return 'text-amber bg-carbon px-2 py-0.5 rounded-sm shadow-recessed';
      case 'default':
      default:
        return 'text-metal';
    }
  };

  return (
    <span className={`font-mono text-xs uppercase tracking-widest ${getTypeClasses()} ${className}`}>
      {children}
    </span>
  );
}
