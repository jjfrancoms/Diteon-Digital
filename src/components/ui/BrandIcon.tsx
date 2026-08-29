import React from 'react';

export type BrandName =
  | 'react'
  | 'nextjs'
  | 'typescript'
  | 'nodejs'
  | 'postgresql'
  | 'supabase'
  | 'tailwind'
  | 'whatsapp'
  | 'linkedin'
  | 'instagram'
  | 'github';

const brandAssetMap: Record<BrandName, string> = {
  react: '/brands/react.svg',
  nextjs: '/brands/nextjs.svg',
  typescript: '/brands/typescript.svg',
  nodejs: '/brands/nodejs.svg',
  postgresql: '/brands/postgresql.svg',
  supabase: '/brands/supabase.svg',
  tailwind: '/brands/tailwind.svg',
  whatsapp: '/brands/whatsapp.svg',
  linkedin: '/brands/linkedin.svg',
  instagram: '/brands/instagram.svg',
  github: '/brands/github.svg',
};

interface BrandIconProps {
  brand: BrandName;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

/**
 * BrandIcon Component:
 * Consumes strictly verified official vector brand marks from /public/brands/
 * Ensures a single source of truth for all brand assets without duplicated or approximate inline SVGs.
 */
export const BrandIcon: React.FC<BrandIconProps> = ({
  brand,
  size = 24,
  className = '',
  ariaLabel,
}) => {
  const assetSrc = brandAssetMap[brand];

  return (
    <img
      src={assetSrc}
      width={size}
      height={size}
      alt={ariaLabel || ''}
      aria-hidden={!ariaLabel}
      className={`shrink-0 object-contain select-none pointer-events-none ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      loading="lazy"
      decoding="async"
    />
  );
};
