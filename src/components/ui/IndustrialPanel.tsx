import React from 'react';

interface IndustrialPanelProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 'level-0' | 'level-1' | 'level-2';
  withFasteners?: boolean;
}

export function IndustrialPanel({
  children,
  className = '',
  elevation = 'level-1',
  withFasteners = false
}: IndustrialPanelProps) {
  const getElevationClasses = () => {
    switch (elevation) {
      case 'level-0':
        return 'bg-chassis shadow-none';
      case 'level-1':
        return 'bg-panel shadow-raised border border-white/50';
      case 'level-2':
        return 'bg-white shadow-ambient border border-white/80';
    }
  };

  return (
    <div className={`relative rounded-sm overflow-hidden ${getElevationClasses()} ${className}`}>
      {withFasteners && (
        <>
          <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-recessed shadow-recessed opacity-60 hidden md:block" />
          <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-recessed shadow-recessed opacity-60 hidden md:block" />
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-recessed shadow-recessed opacity-60 hidden md:block" />
          <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-recessed shadow-recessed opacity-60 hidden md:block" />
        </>
      )}
      {children}
    </div>
  );
}
