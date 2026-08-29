import React from 'react';
import { BrandIcon } from './BrandIcon';

export type SocialBrand = 'whatsapp' | 'linkedin' | 'instagram' | 'github' | 'email' | 'call' | 'calendar';

interface SocialIconProps {
  brand: SocialBrand;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

/**
 * Renders verified official vector brand marks for social platforms (WhatsApp, LinkedIn, Instagram, GitHub),
 * and Material Symbols Outlined exclusively for generic communication channels (Email, Call, Calendar).
 */
export const SocialIcon: React.FC<SocialIconProps> = ({
  brand,
  size = 20,
  className = '',
  ariaLabel,
}) => {
  switch (brand) {
    case 'whatsapp':
      return <BrandIcon brand="whatsapp" size={size} className={className} ariaLabel={ariaLabel} />;
    case 'linkedin':
      return <BrandIcon brand="linkedin" size={size} className={className} ariaLabel={ariaLabel} />;
    case 'instagram':
      return <BrandIcon brand="instagram" size={size} className={className} ariaLabel={ariaLabel} />;
    case 'github':
      return <BrandIcon brand="github" size={size} className={className} ariaLabel={ariaLabel} />;
    case 'email':
      return (
        <span
          className={`material-symbols-outlined shrink-0 ${className}`}
          style={{ fontSize: `${size}px` }}
          aria-hidden={!ariaLabel}
          aria-label={ariaLabel}
        >
          mail
        </span>
      );
    case 'call':
      return (
        <span
          className={`material-symbols-outlined shrink-0 ${className}`}
          style={{ fontSize: `${size}px` }}
          aria-hidden={!ariaLabel}
          aria-label={ariaLabel}
        >
          call
        </span>
      );
    case 'calendar':
      return (
        <span
          className={`material-symbols-outlined shrink-0 ${className}`}
          style={{ fontSize: `${size}px` }}
          aria-hidden={!ariaLabel}
          aria-label={ariaLabel}
        >
          calendar_month
        </span>
      );
    default:
      return null;
  }
};
