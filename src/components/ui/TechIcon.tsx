import React from 'react';
import { BrandIcon, BrandName } from './BrandIcon';

export type TechName =
  | 'react'
  | 'nextjs'
  | 'typescript'
  | 'nodejs'
  | 'postgresql'
  | 'supabase'
  | 'tailwind'
  | 'whatsapp'
  | 'github'
  | 'api'
  | 'cloud';

interface TechIconProps {
  name: TechName;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

/**
 * Official Brand Icons & Semantic Generic Symbols
 */
export const TechIcon: React.FC<TechIconProps> = ({
  name,
  size = 24,
  className = '',
  ariaLabel,
}) => {
  if (name === 'api') {
    return (
      <span
        className={`material-symbols-outlined text-[#1C6FE0] shrink-0 ${className}`}
        style={{ fontSize: `${size}px` }}
        aria-hidden={!ariaLabel}
        aria-label={ariaLabel}
      >
        api
      </span>
    );
  }

  if (name === 'cloud') {
    return (
      <span
        className={`material-symbols-outlined text-[#1C6FE0] shrink-0 ${className}`}
        style={{ fontSize: `${size}px` }}
        aria-hidden={!ariaLabel}
        aria-label={ariaLabel}
      >
        cloud
      </span>
    );
  }

  return <BrandIcon brand={name as BrandName} size={size} className={className} ariaLabel={ariaLabel} />;
};
