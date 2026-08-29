import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'coral' | 'dark' | 'white';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = "group inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer select-none font-['Inter'] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "text-xs px-3 py-1.5 gap-1.5 min-h-[32px]",
    md: "text-xs sm:text-sm px-4 py-2.5 gap-2 min-h-[40px]",
    lg: "text-sm sm:text-base px-6 py-3.5 gap-2.5 min-h-[48px]"
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-[#1C6FE0] text-white hover:bg-[#155ec4] active:bg-[#104fa8] focus-visible:ring-[#1C6FE0] shadow-2xs border border-transparent",
    secondary: "bg-transparent border border-[#14142B]/20 text-[#14142B] hover:bg-[#14142B]/5 active:bg-[#14142B]/10 focus-visible:ring-[#14142B]",
    outline: "bg-transparent border border-[#F7F7F5]/25 text-[#F7F7F5] hover:bg-white/10 active:bg-white/15 focus-visible:ring-white",
    ghost: "bg-transparent text-[#14142B] hover:bg-[#14142B]/5 active:bg-[#14142B]/10 focus-visible:ring-[#1C6FE0] border border-transparent",
    coral: "bg-[#FF6B35] text-white hover:bg-[#e85721] active:bg-[#cf4714] focus-visible:ring-[#FF6B35] shadow-2xs border border-transparent",
    dark: "bg-[#14142B] text-white hover:bg-[#1f1f3d] active:bg-[#0c0c1b] focus-visible:ring-[#14142B] shadow-2xs border border-transparent",
    white: "bg-white text-[#14142B] hover:bg-[#FAF9F6] active:bg-[#eae8e4] focus-visible:ring-white border border-[#14142B]/10 shadow-2xs"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
          <span>{children}</span>
        </span>
      ) : (
        <>
          {iconLeft && <span className="shrink-0 flex items-center justify-center">{iconLeft}</span>}
          <span>{children}</span>
          {iconRight && (
            <span className="shrink-0 flex items-center justify-center transition-transform duration-150 group-hover:translate-x-0.5">
              {iconRight}
            </span>
          )}
        </>
      )}
    </button>
  );
};
