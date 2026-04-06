import React, { forwardRef, useId } from 'react';
import { FieldWrapper } from './FieldWrapper';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, description, error, required, className = '', wrapperClassName = '', id, rows = 3, ...props }, ref) => {
    const uniqueId = useId();
    const textareaId = id || props.name || uniqueId;

    return (
      <FieldWrapper
        label={label}
        description={description}
        error={error}
        required={required}
        htmlFor={textareaId}
        className={wrapperClassName}
      >
        <textarea
          id={textareaId}
          ref={ref}
          required={required}
          rows={rows}
          className={`
            w-full px-3 py-2 bg-transparent border rounded-lg text-sm
            focus:outline-none focus:ring-2 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-y
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

Textarea.displayName = 'Textarea';
