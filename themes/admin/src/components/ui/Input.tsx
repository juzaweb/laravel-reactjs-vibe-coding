import React, { forwardRef, useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const uniqueId = useId();
    const inputId = id || props.name || uniqueId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-1.5 text-sm font-medium text-[var(--text-main)]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`
            w-full px-3 py-2 bg-transparent border rounded-lg text-sm
            focus:outline-none focus:ring-2 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900 dark:text-red-400 placeholder-red-300 dark:placeholder-red-700'
                : 'border-[var(--border-color)] focus:border-blue-500 focus:ring-blue-500/20 text-[var(--text-main)] placeholder-[var(--text-muted)]'
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
