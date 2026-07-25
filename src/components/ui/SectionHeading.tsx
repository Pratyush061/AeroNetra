import React from 'react';
import { TechnicalLabel } from './TechnicalLabel';

interface SectionHeadingProps {
  numberStr: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({ numberStr, title, subtitle, className = '' }: SectionHeadingProps) {
  return (
    <div className={`mb-12 md:mb-16 ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <TechnicalLabel type="identifier">{numberStr}</TechnicalLabel>
        <div className="h-[1px] flex-1 bg-shadow/20" />
      </div>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-graphite text-balance mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-metal max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
