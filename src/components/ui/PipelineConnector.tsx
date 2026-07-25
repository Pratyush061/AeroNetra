import React from 'react';

interface PipelineConnectorProps {
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

export function PipelineConnector({ className = '', direction = 'horizontal' }: PipelineConnectorProps) {
  const isHorizontal = direction === 'horizontal';

  return (
    <div
      className={`
        flex items-center justify-center
        ${isHorizontal ? 'w-full h-8 md:w-16 md:h-auto' : 'w-8 h-12'}
        ${className}
      `}
      aria-hidden="true"
    >
      <div className={`
        bg-recessed shadow-recessed rounded-full relative flex items-center justify-center
        ${isHorizontal ? 'w-full h-2 md:w-16 md:h-2' : 'w-2 h-16'}
      `}>
        {/* Animated data pulse could go here later */}
        <div className={`
          bg-signal/40
          ${isHorizontal ? 'w-2 h-1' : 'w-1 h-2'}
        `} />
      </div>
    </div>
  );
}
