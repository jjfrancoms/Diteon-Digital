import React, { useEffect, useRef } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  headerIcon?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  headerIcon,
  children,
  maxWidth = 'md',
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      // Focus modal content
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        } else if (e.key === 'Tab' && modalRef.current) {
          const focusables = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        if (previouslyFocusedElement.current) {
          previouslyFocusedElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-[640px]',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }[maxWidth];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop with subtle blur */}
      <div 
        className="fixed inset-0 bg-[#14142B]/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div 
        ref={modalRef}
        className={`relative w-full ${maxWidthClasses} max-h-[calc(100dvh-24px)] flex flex-col bg-white rounded-[8px] border border-[#14142B]/10 shadow-[0_24px_70px_rgba(20,20,43,0.16)] z-10 font-['Inter'] transition-all duration-200 motion-reduce:transition-none ${className}`}
      >
        {/* Modal Header */}
        {(title || subtitle) && (
          <div className="px-6 sm:px-8 pt-6 pb-5 sm:pt-6.5 sm:pb-5 border-b border-[#14142B]/8 flex items-start justify-between gap-4 shrink-0">
            <div className="flex items-start gap-3 sm:gap-3.5 pr-2">
              {headerIcon && (
                <span 
                  className="material-symbols-outlined text-[22px] sm:text-[24px] text-[#1C6FE0] shrink-0 mt-0.5" 
                  aria-hidden="true"
                >
                  {headerIcon}
                </span>
              )}
              <div>
                {title && (
                  <h3 id="modal-title" className="text-lg sm:text-[21px] font-bold text-[#14142B] font-['Space_Grotesk'] leading-tight tracking-tight">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs sm:text-[13px] text-[#14142B]/70 mt-1 leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-[6px] text-[#14142B]/50 hover:text-[#14142B] hover:bg-[#14142B]/[0.04] active:bg-[#14142B]/[0.08] flex items-center justify-center transition-colors cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C6FE0]"
              aria-label="Cerrar modal"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
