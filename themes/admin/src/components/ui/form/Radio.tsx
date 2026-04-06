import React, { forwardRef, useId } from 'react';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, error, className = '', wrapperClassName = '', id, ...props }, ref) => {
    const uniqueId = useId();
    const radioId = id || props.name || uniqueId;

    return (
      <div className={`flex items-start mb-4 ${wrapperClassName}`}>
        <div className="flex items-center h-5">
          <input
            id={radioId}
            type="radio"
            ref={ref}
            className={`
              w-4 h-4 border rounded-full bg-transparent focus:ring-2 focus:ring-offset-0 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                error
                  ? 'border-red-500 text-red-500 focus:ring-red-500/20'
                  : 'border-[var(--border-color)] text-blue-600 focus:ring-blue-500/20'
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="ml-3 text-sm">
            {label && (
              <label htmlFor={radioId} className="font-medium text-[var(--text-main)]">
                {label}
              </label>
            )}
            {description && !error && (
              <p className="text-[var(--text-muted)] mt-0.5">{description}</p>
            )}
            {error && (
              <p className="text-red-500 dark:text-red-400 mt-0.5">{error}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
