import React from 'react';

interface RecessedScreenProps {
  children: React.ReactNode;
  className?: string;
  withBezel?: boolean;
}

export function RecessedScreen({ children, className = '', withBezel = true }: RecessedScreenProps) {
  const bezelClasses = withBezel
    ? 'p-2 md:p-4 bg-graphite rounded-md shadow-raised'
    : '';

  return (
    <div className={bezelClasses}>
      <div className={`
        bg-carbon text-amber
        shadow-recessed rounded-sm
        border border-black/40 border-t-black/60 border-l-black/60
        overflow-hidden relative
        ${className}
      `}>
        {/* Subtle scanline overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px]" />

        {/* Inner shadow for depth */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />

        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
