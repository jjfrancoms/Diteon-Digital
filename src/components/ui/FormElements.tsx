import React from 'react';

// ================= INPUT =================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  iconLeft?: string;
  iconRight?: string;
  optionalLabel?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  iconLeft,
  iconRight,
  optionalLabel,
  id,
  className = '',
  disabled,
  ...props
}) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  const helperId = helperText && inputId ? `${inputId}-helper` : undefined;

  return (
    <div className="space-y-[7px] text-left w-full font-['Inter']">
      {label && (
        <div className="flex items-center justify-between">
          <label 
            htmlFor={inputId} 
            className="block text-[12px] sm:text-[13px] font-semibold text-[#14142B] tracking-tight"
          >
            {label} {props.required && <span className="text-[#FF6B35] font-normal text-xs">*</span>}
          </label>
          {optionalLabel && (
            <span className="text-[11px] text-[#14142B]/45 font-normal">
              {optionalLabel}
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center">
        {iconLeft && (
          <span 
            className="material-symbols-outlined absolute left-3.5 text-[18px] text-[#14142B]/40 pointer-events-none"
            aria-hidden="true"
          >
            {iconLeft}
          </span>
        )}

        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId || helperId}
          disabled={disabled}
          className={`w-full h-12 rounded-[6px] border bg-white px-3.5 sm:px-4 text-xs sm:text-sm text-[#14142B] placeholder:text-[#14142B]/35 transition-all duration-150 focus:outline-none disabled:bg-[#14142B]/5 disabled:cursor-not-allowed ${
            iconLeft ? 'pl-10' : ''
          } ${iconRight ? 'pr-10' : ''} ${
            error 
              ? 'border-[#FF6B35] focus:border-[#FF6B35] focus:ring-[2px] focus:ring-[#FF6B35]/10' 
              : 'border-[rgba(20,20,43,0.16)] hover:border-[rgba(20,20,43,0.30)] focus:border-[#1C6FE0] focus:ring-[2px] focus:ring-[#1C6FE0]/10'
          } ${className}`}
          {...props}
        />

        {iconRight && (
          <span 
            className="material-symbols-outlined absolute right-3.5 text-[18px] text-[#14142B]/40 pointer-events-none"
            aria-hidden="true"
          >
            {iconRight}
          </span>
        )}
      </div>

      {error && (
        <p id={errorId} className="text-xs text-[#FF6B35] font-medium flex items-center gap-1.5 pt-0.5">
          <span className="material-symbols-outlined text-[15px] shrink-0">error</span>
          <span>{error}</span>
        </p>
      )}

      {helperText && !error && (
        <p id={helperId} className="text-xs text-[#14142B]/60">
          {helperText}
        </p>
      )}
    </div>
  );
};

// ================= TEXTAREA =================
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  optionalLabel?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  helperText,
  error,
  optionalLabel,
  id,
  className = '',
  disabled,
  rows = 3,
  ...props
}) => {
  const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const errorId = error && textareaId ? `${textareaId}-error` : undefined;
  const helperId = helperText && textareaId ? `${textareaId}-helper` : undefined;

  return (
    <div className="space-y-[7px] text-left w-full font-['Inter']">
      {label && (
        <div className="flex items-center justify-between">
          <label 
            htmlFor={textareaId} 
            className="block text-[12px] sm:text-[13px] font-semibold text-[#14142B] tracking-tight"
          >
            {label} {props.required && <span className="text-[#FF6B35] font-normal text-xs">*</span>}
          </label>
          {optionalLabel && (
            <span className="text-[11px] text-[#14142B]/45 font-normal">
              {optionalLabel}
            </span>
          )}
        </div>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId || helperId}
        disabled={disabled}
        className={`w-full min-h-[90px] rounded-[6px] border bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#14142B] placeholder:text-[#14142B]/35 transition-all duration-150 focus:outline-none resize-y disabled:bg-[#14142B]/5 disabled:cursor-not-allowed ${
          error 
            ? 'border-[#FF6B35] focus:border-[#FF6B35] focus:ring-[2px] focus:ring-[#FF6B35]/10' 
            : 'border-[rgba(20,20,43,0.16)] hover:border-[rgba(20,20,43,0.30)] focus:border-[#1C6FE0] focus:ring-[2px] focus:ring-[#1C6FE0]/10'
        } ${className}`}
        {...props}
      />

      {error && (
        <p id={errorId} className="text-xs text-[#FF6B35] font-medium flex items-center gap-1.5 pt-0.5">
          <span className="material-symbols-outlined text-[15px] shrink-0">error</span>
          <span>{error}</span>
        </p>
      )}

      {helperText && !error && (
        <p id={helperId} className="text-xs text-[#14142B]/60">
          {helperText}
        </p>
      )}
    </div>
  );
};

// ================= CUSTOM ACCESSIBLE SELECT =================
export interface CustomSelectOption<T extends string = string> {
  value: T;
  label: string;
}

export interface CustomSelectProps<T extends string = string> {
  id?: string;
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly CustomSelectOption<T>[] | CustomSelectOption<T>[];
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export function CustomSelect<T extends string = string>({
  id = 'custom-select',
  label,
  value,
  onChange,
  options,
  helperText,
  error,
  required,
  disabled
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(() => {
    const idx = options.findIndex((opt) => opt.value === value);
    return idx >= 0 ? idx : 0;
  });

  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listboxRef = React.useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Sync highlightedIndex when value changes or menu opens
  React.useEffect(() => {
    const idx = options.findIndex((opt) => opt.value === value);
    if (idx >= 0) setHighlightedIndex(idx);
  }, [value, options]);

  // Click outside to close
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (isOpen && listboxRef.current) {
      const activeEl = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, highlightedIndex]);

  const selectOption = (opt: CustomSelectOption<T>) => {
    onChange(opt.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        }
        break;
      }
      case 'Home': {
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(0);
        }
        break;
      }
      case 'End': {
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(options.length - 1);
        }
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (options[highlightedIndex]) {
          selectOption(options[highlightedIndex]);
        }
        break;
      }
      case 'Escape': {
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
          triggerRef.current?.focus();
        }
        break;
      }
      case 'Tab': {
        if (isOpen) {
          setIsOpen(false);
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className="space-y-[7px] text-left w-full font-['Inter'] relative">
      {label && (
        <label 
          id={`${id}-label`}
          htmlFor={`${id}-trigger`} 
          className="block text-[12px] sm:text-[13px] font-semibold text-[#14142B] tracking-tight cursor-pointer"
          onClick={() => triggerRef.current?.focus()}
        >
          {label} {required && <span className="text-[#FF6B35] font-normal text-xs">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          ref={triggerRef}
          id={`${id}-trigger`}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id}-listbox`}
          aria-labelledby={label ? `${id}-label ${id}-trigger` : `${id}-trigger`}
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          className={`w-full min-h-[48px] h-auto py-2.5 rounded-[6px] border bg-white px-3.5 sm:px-4 text-xs sm:text-sm text-[#14142B] flex items-center justify-between gap-2.5 transition-all duration-150 cursor-pointer focus:outline-none disabled:bg-[#14142B]/5 disabled:cursor-not-allowed ${
            error 
              ? 'border-[#FF6B35] focus:border-[#FF6B35] focus:ring-[2px] focus:ring-[#FF6B35]/10' 
              : isOpen
                ? 'border-[#1C6FE0] ring-[2px] ring-[#1C6FE0]/10'
                : 'border-[rgba(20,20,43,0.16)] hover:border-[rgba(20,20,43,0.30)] focus:border-[#1C6FE0] focus:ring-[2px] focus:ring-[#1C6FE0]/10'
          }`}
        >
          <span className="font-medium text-left whitespace-normal break-words leading-snug sm:leading-5 flex-1 pr-1">
            {selectedOption.label}
          </span>
          <span 
            className={`material-symbols-outlined text-[20px] text-[#14142B]/50 transition-transform duration-200 shrink-0 self-center ml-1 pointer-events-none ${
              isOpen ? 'rotate-180 text-[#1C6FE0]' : ''
            }`}
            aria-hidden="true"
          >
            expand_more
          </span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <ul
            ref={listboxRef}
            id={`${id}-listbox`}
            role="listbox"
            aria-labelledby={label ? `${id}-label` : undefined}
            tabIndex={-1}
            className="absolute top-[calc(100%+6px)] left-0 sm:left-auto sm:right-0 w-full sm:w-[380px] sm:min-w-[360px] sm:max-w-[440px] max-w-[calc(100vw-32px)] z-50 bg-white rounded-[6px] border border-[rgba(20,20,43,0.12)] shadow-[0_18px_45px_rgba(20,20,43,0.16)] max-h-[320px] overflow-y-auto py-1 font-['Inter'] animate-in fade-in slide-in-from-top-1 duration-150 motion-reduce:animate-none"
          >
            {options.map((opt, index) => {
              const isSelected = opt.value === value;
              const isHighlighted = index === highlightedIndex;

              return (
                <li
                  key={opt.value}
                  id={`${id}-opt-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => selectOption(opt)}
                  className={`min-h-[44px] px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 text-xs sm:text-sm cursor-pointer transition-colors duration-100 select-none rounded-none ${
                    isSelected 
                      ? 'bg-[#1C6FE0]/[0.075] text-[#14142B] font-semibold' 
                      : isHighlighted 
                        ? 'bg-[#1C6FE0]/[0.045] text-[#14142B]' 
                        : 'text-[#14142B]/85 hover:bg-[#1C6FE0]/[0.045]'
                  }`}
                >
                  <span className="whitespace-normal break-words leading-snug sm:leading-5 flex-1 pr-1 text-left">
                    {opt.label}
                  </span>
                  {isSelected && (
                    <span 
                      className="material-symbols-outlined text-[18px] text-[#1C6FE0] shrink-0 self-center"
                      aria-hidden="true"
                    >
                      check
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && (
        <p className="text-xs text-[#FF6B35] font-medium flex items-center gap-1.5 pt-0.5">
          <span className="material-symbols-outlined text-[15px] shrink-0">error</span>
          <span>{error}</span>
        </p>
      )}

      {helperText && !error && (
        <p className="text-xs text-[#14142B]/60">
          {helperText}
        </p>
      )}
    </div>
  );
}

// ================= NATIVE SELECT (BACKWARD COMPATIBLE) =================
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  helperText,
  error,
  id,
  className = '',
  disabled,
  ...props
}) => {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const errorId = error && selectId ? `${selectId}-error` : undefined;

  return (
    <div className="space-y-[7px] text-left w-full font-['Inter']">
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-xs font-semibold text-[#14142B] tracking-tight"
        >
          {label} {props.required && <span className="text-[#FF6B35] font-normal">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          disabled={disabled}
          className={`w-full h-12 appearance-none rounded-[10px] border bg-white px-3.5 sm:px-4 pr-10 text-xs sm:text-sm text-[#14142B] transition-all duration-150 focus:outline-none disabled:bg-[#14142B]/5 cursor-pointer ${
            error 
              ? 'border-[#FF6B35] focus:border-[#FF6B35] focus:ring-[3px] focus:ring-[#FF6B35]/10' 
              : 'border-[rgba(20,20,43,0.16)] hover:border-[rgba(20,20,43,0.28)] focus:border-[#1C6FE0] focus:ring-[3px] focus:ring-[#1C6FE0]/10'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <span 
          className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-[20px] text-[#14142B]/45 pointer-events-none"
          aria-hidden="true"
        >
          expand_more
        </span>
      </div>

      {error && (
        <p id={errorId} className="text-xs text-[#FF6B35] font-medium flex items-center gap-1.5 pt-0.5">
          <span className="material-symbols-outlined text-[15px] shrink-0">error</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

// ================= PROGRESS =================
export interface ProgressProps {
  value: number; // 0 to 100
  label?: string;
  theme?: 'blue' | 'coral' | 'navy';
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  label,
  theme = 'blue',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const colorClasses = {
    blue: 'bg-[#1C6FE0]',
    coral: 'bg-[#FF6B35]',
    navy: 'bg-[#14142B]'
  }[theme];

  return (
    <div className={`w-full space-y-1 ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs font-semibold text-[#14142B]">
          <span>{label}</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div 
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full h-1.5 bg-[#14142B]/10 rounded-full overflow-hidden"
      >
        <div 
          className={`h-full transition-all duration-300 rounded-full ${colorClasses}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
