import React from 'react';

export type BadgeVariant = 'neutral' | 'blue' | 'violet' | 'coral' | 'emerald' | 'amber' | 'dark' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  dotColor?: string;
  icon?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  dotColor,
  icon,
  className = '',
  ...props
}) => {
  const baseClasses = "inline-flex items-center font-medium font-['Inter'] rounded-full shrink-0 tracking-normal transition-colors select-none";

  const sizeClasses: Record<BadgeSize, string> = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5"
  };

  const variantClasses: Record<BadgeVariant, string> = {
    neutral: "bg-[#14142B]/6 text-[#14142B]/80 border border-[#14142B]/8",
    blue: "bg-[#1C6FE0]/10 text-[#1C6FE0] border border-[#1C6FE0]/20 font-semibold",
    violet: "bg-[#7B61FF]/10 text-[#7B61FF] border border-[#7B61FF]/20 font-semibold",
    coral: "bg-[#FF6B35]/12 text-[#FF6B35] border border-[#FF6B35]/25 font-semibold",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium",
    amber: "bg-amber-50 text-amber-800 border border-amber-200/80 font-medium",
    dark: "bg-white/10 text-white/90 border border-white/15",
    outline: "bg-transparent text-[#14142B]/75 border border-[#14142B]/15"
  };

  const dotClasses: Record<BadgeVariant, string> = {
    neutral: "bg-[#14142B]/50",
    blue: "bg-[#1C6FE0]",
    violet: "bg-[#7B61FF]",
    coral: "bg-[#FF6B35]",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    dark: "bg-white/80",
    outline: "bg-[#14142B]/50"
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} {...props}>
      {dot && (
        <span 
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor || dotClasses[variant]}`} 
          aria-hidden="true" 
        />
      )}
      {icon && (
        <span className="material-symbols-outlined text-[14px] shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};
