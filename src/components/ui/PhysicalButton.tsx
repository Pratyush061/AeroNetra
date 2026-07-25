import React from 'react';

interface PhysicalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export function PhysicalButton({
  children,
  variant = 'secondary',
  fullWidth = false,
  className = '',
  ...props
}: PhysicalButtonProps) {
  const baseClasses = 'relative inline-flex items-center justify-center font-mono text-sm uppercase tracking-wider font-semibold transition-all duration-200 active:translate-y-[1px]';
  const widthClasses = fullWidth ? 'w-full' : 'px-6';

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'h-12 bg-graphite text-panel shadow-control border border-carbon/20 hover:bg-carbon focus:ring-2 focus:ring-amber focus:ring-offset-2 focus:ring-offset-chassis';
      case 'secondary':
        return 'h-12 bg-panel text-graphite shadow-raised border border-shadow/30 hover:bg-white focus:ring-2 focus:ring-graphite focus:ring-offset-2 focus:ring-offset-chassis';
      case 'ghost':
        return 'h-12 bg-transparent text-graphite hover:bg-shadow/10 border border-transparent hover:border-shadow/20';
    }
  };

  return (
    <button
      className={`${baseClasses} ${widthClasses} ${getVariantClasses()} ${className}`}
      {...props}
    >
      <span className="flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}
