import React, { forwardRef, useId } from 'react';
import { FieldWrapper } from './FieldWrapper';

export interface TextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Text = forwardRef<HTMLInputElement, TextProps>(
  ({ label, description, error, required, className = '', wrapperClassName = '', id, ...props }, ref) => {
    const uniqueId = useId();
    const inputId = id || props.name || uniqueId;

    return (
      <FieldWrapper
        label={label}
        description={description}
        error={error}
        required={required}
        htmlFor={inputId}
        className={wrapperClassName}
      >
        <input
          id={inputId}
          ref={ref}
          required={required}
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
      </FieldWrapper>
    );
  }
);

Text.displayName = 'Text';
