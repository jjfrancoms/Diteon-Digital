import React from 'react';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'subtle' | 'strong' | 'node' | 'label';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  label?: string;
  theme?: 'light' | 'dark';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'subtle',
  label,
  theme = 'light',
  className = '',
  ...props
}) => {
  const isDark = theme === 'dark';
  const lineColor = isDark 
    ? (variant === 'strong' ? 'border-white/20' : 'border-white/10')
    : (variant === 'strong' ? 'border-[#14142B]/18' : 'border-[#14142B]/8');

  if (orientation === 'vertical') {
    return (
      <div 
        role="separator" 
        aria-orientation="vertical"
        className={`inline-block self-stretch w-px border-l ${lineColor} ${className}`}
        {...props}
      />
    );
  }

  if (variant === 'node') {
    return (
      <div 
        role="separator" 
        className={`relative flex items-center justify-center my-6 ${className}`}
        {...props}
      >
        <div className={`w-full border-t ${lineColor}`} />
        <div className="absolute flex items-center gap-1.5 px-3 bg-inherit">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1C6FE0]" />
          <span className="w-8 h-px bg-[#14142B]/20" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#7B61FF]" />
        </div>
      </div>
    );
  }

  if (label) {
    return (
      <div 
        role="separator" 
        className={`relative flex items-center my-6 ${className}`}
        {...props}
      >
        <div className={`w-full border-t ${lineColor}`} />
        <span className={`px-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-white/50 bg-[#14142B]' : 'text-[#14142B]/50 bg-[#F7F7F5]'}`}>
          {label}
        </span>
        <div className={`w-full border-t ${lineColor}`} />
      </div>
    );
  }

  return (
    <div 
      role="separator" 
      aria-orientation="horizontal"
      className={`w-full border-t ${lineColor} ${className}`}
      {...props}
    />
  );
};
