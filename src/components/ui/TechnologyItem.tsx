import React from 'react';
import { BrandIcon, BrandName } from './BrandIcon';

export type TechnologyType =
  | { kind: 'brand'; brand: BrandName }
  | { kind: 'system'; iconName: string };

export interface TechnologyItemProps {
  tech: TechnologyType;
  name: string;
  category?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * TechnologyItem Component:
 * Strict Hierarchy:
 * - Level 1: Official Vector Logo (22-24px desktop / 20-22px mobile)
 * - Level 2: Technology Name (Inter, ~14px, font-weight 600, high-contrast Navy #14142B)
 * - Level 3: Category (Inter, 10-11px, font-weight 500, uppercase, small letter-spacing, muted #14142B/40)
 * Open Layout (No cards, no background borders, no nested boxes).
 */
export const TechnologyItem: React.FC<TechnologyItemProps> = ({
  tech,
  name,
  category,
  size = 'md',
  className = '',
}) => {
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 26 : 24;

  return (
    <div
      className={`inline-flex items-center gap-[9px] py-0.5 px-0 text-left select-none transition-transform duration-150 ease-out hover:-translate-y-[1px] cursor-default ${className}`}
    >
      {/* LEVEL 1: Authentic Official Brand Logo or System Material Symbol */}
      <div className="shrink-0 flex items-center justify-center">
        {tech.kind === 'brand' ? (
          <BrandIcon brand={tech.brand} size={iconSize} ariaLabel={name} />
        ) : (
          <span
            className="material-symbols-outlined text-[#1C6FE0] shrink-0"
            style={{ fontSize: `${iconSize}px` }}
            aria-hidden="true"
          >
            {tech.iconName}
          </span>
        )}
      </div>

      {/* LEVEL 2: Technology Name & LEVEL 3: Muted Category */}
      <div className="flex flex-col leading-[1.15]">
        <span className="text-[13px] sm:text-[14px] font-semibold text-[#14142B] font-['Inter'] whitespace-nowrap tracking-[-0.01em]">
          {name}
        </span>
        {category && (
          <span className="text-[10px] font-medium tracking-[0.05em] uppercase text-[#14142B]/40 font-['Inter'] whitespace-nowrap mt-[1px]">
            {category}
          </span>
        )}
      </div>
    </div>
  );
};

