import React from 'react';

// ================= INPUT =================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  iconLeft?: string;
  iconRight?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  iconLeft,
  iconRight,
  id,
  className = '',
  disabled,
  ...props
}) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  const helperId = helperText && inputId ? `${inputId}-helper` : undefined;

  return (
    <div className="space-y-1.5 text-left w-full font-['Inter']">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-xs font-semibold text-[#14142B] tracking-tight"
        >
          {label} {props.required && <span className="text-[#FF6B35]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {iconLeft && (
          <span 
            className="material-symbols-outlined absolute left-3 text-[18px] text-[#14142B]/40 pointer-events-none"
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
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#14142B] placeholder:text-[#14142B]/40 transition-colors focus:outline-none focus:ring-2 disabled:bg-[#14142B]/5 disabled:cursor-not-allowed ${
            iconLeft ? 'pl-9' : ''
          } ${iconRight ? 'pr-9' : ''} ${
            error 
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
              : 'border-[#14142B]/15 focus:ring-[#1C6FE0]/20 focus:border-[#1C6FE0]'
          } ${className}`}
          {...props}
        />

        {iconRight && (
          <span 
            className="material-symbols-outlined absolute right-3 text-[18px] text-[#14142B]/40 pointer-events-none"
            aria-hidden="true"
          >
            {iconRight}
          </span>
        )}
      </div>

      {error && (
        <p id={errorId} className="text-xs text-red-600 font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
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
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  helperText,
  error,
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
    <div className="space-y-1.5 text-left w-full font-['Inter']">
      {label && (
        <label 
          htmlFor={textareaId} 
          className="block text-xs font-semibold text-[#14142B] tracking-tight"
        >
          {label} {props.required && <span className="text-[#FF6B35]">*</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId || helperId}
        disabled={disabled}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#14142B] placeholder:text-[#14142B]/40 transition-colors focus:outline-none focus:ring-2 disabled:bg-[#14142B]/5 disabled:cursor-not-allowed ${
          error 
            ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
            : 'border-[#14142B]/15 focus:ring-[#1C6FE0]/20 focus:border-[#1C6FE0]'
        } ${className}`}
        {...props}
      />

      {error && (
        <p id={errorId} className="text-xs text-red-600 font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
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

// ================= SELECT =================
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
    <div className="space-y-1.5 text-left w-full font-['Inter']">
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-xs font-semibold text-[#14142B] tracking-tight"
        >
          {label} {props.required && <span className="text-[#FF6B35]">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          disabled={disabled}
          className={`w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-9 text-xs sm:text-sm text-[#14142B] transition-colors focus:outline-none focus:ring-2 disabled:bg-[#14142B]/5 cursor-pointer ${
            error 
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
              : 'border-[#14142B]/15 focus:ring-[#1C6FE0]/20 focus:border-[#1C6FE0]'
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
          className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#14142B]/40 pointer-events-none"
          aria-hidden="true"
        >
          expand_more
        </span>
      </div>

      {error && (
        <p id={errorId} className="text-xs text-red-600 font-medium">
          {error}
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
