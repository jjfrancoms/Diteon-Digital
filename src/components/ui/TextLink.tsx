import React from 'react';

export type TextLinkVariant = 'cta' | 'nav' | 'content' | 'subtle';

export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: TextLinkVariant;
  arrow?: boolean;
}

export const TextLink: React.FC<TextLinkProps> = ({
  children,
  variant = 'cta',
  arrow = true,
  className = '',
  ...props
}) => {
  const baseClasses = "inline-flex items-center gap-1.5 font-medium transition-all duration-150 cursor-pointer select-none font-['Inter'] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C6FE0] focus-visible:ring-offset-2 rounded-xs";

  const variantClasses: Record<TextLinkVariant, string> = {
    cta: "text-xs sm:text-sm font-semibold text-[#14142B] hover:text-[#1C6FE0] group",
    nav: "text-xs sm:text-sm text-[#14142B]/80 hover:text-[#1C6FE0] font-normal",
    content: "text-xs sm:text-sm text-[#1C6FE0] underline underline-offset-4 decoration-[#1C6FE0]/40 hover:decoration-[#1C6FE0]",
    subtle: "text-xs text-[#14142B]/60 hover:text-[#14142B]"
  };

  return (
    <a className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      <span>{children}</span>
      {arrow && (
        <span 
          className="material-symbols-outlined text-[16px] transition-transform duration-150 group-hover:translate-x-1"
          aria-hidden="true"
        >
          arrow_forward
        </span>
      )}
    </a>
  );
};
