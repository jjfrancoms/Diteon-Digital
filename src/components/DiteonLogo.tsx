import React from 'react';

export type IsotypeVariant = 
  | 'azul_coral' // 07_isotipo_degradado_azul_coral.png (Navbar / Logo principal)
  | 'multicolor' // 09_isotipo_multicolor.png (Hero & Bloques destacados)
  | 'blanco_hueso' // 05_isotipo_blanco_hueso.png (Icono pequeño / light)
  | 'azul_electrico' // 02_isotipo_azul_electrico.png (Favicon / acento)
  | 'violeta' // 03_isotipo_violeta.png
  | 'coral' // 04_isotipo_coral.png
  | 'azul_violeta' // 06_isotipo_degradado_azul_violeta.png
  | 'violeta_coral' // 08_isotipo_violeta_coral.png
  | 'navy'; // 01_isotipo_navy.png

const VARIANT_FILES: Record<IsotypeVariant, string> = {
  azul_coral: '/isotipos/07_isotipo_degradado_azul_coral.png',
  multicolor: '/isotipos/09_isotipo_multicolor.png',
  blanco_hueso: '/isotipos/05_isotipo_blanco_hueso.png',
  azul_electrico: '/isotipos/02_isotipo_azul_electrico.png',
  violeta: '/isotipos/03_isotipo_violeta.png',
  coral: '/isotipos/04_isotipo_coral.png',
  azul_violeta: '/isotipos/06_isotipo_degradado_azul_violeta.png',
  violeta_coral: '/isotipos/08_isotipo_violeta_coral.png',
  navy: '/isotipos/01_isotipo_navy.png',
};

interface IsotypeProps {
  className?: string;
  size?: number | string;
  glow?: boolean;
  variant?: IsotypeVariant;
  alt?: string;
}

/**
 * Official DITEON Triangular Connected-Nodes Isotype
 * Uses official PNG assets from DITEON_isotipos_variaciones
 * Navbar / Logo principal: 07_isotipo_degradado_azul_coral.png
 * Hero / Destacados: 09_isotipo_multicolor.png
 * Favicon / Iconos: 05_isotipo_blanco_hueso.png o 02_isotipo_azul_electrico.png
 */
export const DiteonIsotype: React.FC<IsotypeProps> = ({ 
  className = '', 
  size = 32,
  glow = false,
  variant = 'azul_coral',
  alt = 'DITEON Isotipo'
}) => {
  const dimension = typeof size === 'number' ? `${size}px` : size;
  const imageSrc = VARIANT_FILES[variant] || VARIANT_FILES.azul_coral;

  return (
    <div 
      style={{ width: dimension, height: dimension }} 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
    >
      {glow && (
        <div className="absolute inset-0 bg-[#1C6FE0]/25 rounded-full blur-md -z-10" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-200"
        loading="eager"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: IsotypeVariant;
  theme?: 'light' | 'dark';
}

/**
 * Main DITEON Brand Logo (Isotype + Typography)
 * Uses 07_isotipo_degradado_azul_coral.png by default for Navbar & Header
 */
export const DiteonLogo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'azul_coral',
  theme = 'dark'
}) => {
  const pixelSize = size === 'sm' ? 28 : size === 'lg' ? 42 : 34;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const textColor = theme === 'light' ? 'text-[#14142B]' : 'text-[#F7F7F5]';

  return (
    <div className={`flex items-center gap-[11px] font-bold select-none ${className}`}>
      <DiteonIsotype size={pixelSize} variant={variant} />
      <span className={`${textSize} font-black tracking-tight ${textColor} font-['Space_Grotesk'] leading-none`}>
        DITEON
      </span>
    </div>
  );
};

/**
 * Ambient watermark background pattern derived from DITEON official geometry
 */
export const DiteonAmbientPattern: React.FC<{ size?: number; className?: string }> = ({ 
  size = 380, 
  className = '' 
}) => {
  return (
    <div 
      style={{ width: size, height: size }}
      className={`pointer-events-none select-none opacity-[0.035] ${className}`}
    >
      <img 
        src="/isotipos/05_isotipo_blanco_hueso.png" 
        alt="" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};
