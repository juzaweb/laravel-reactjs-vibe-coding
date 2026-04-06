import React, { forwardRef, useId } from 'react';
import { FieldWrapper } from './FieldWrapper';

export interface ColorPickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
}

export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(
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
        <div className="flex items-center space-x-3">
          <input
            id={inputId}
            type="color"
            ref={ref}
            required={required}
            className={`
              h-9 w-14 p-1 cursor-pointer bg-transparent border rounded-lg
              focus:outline-none focus:ring-2 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-[var(--border-color)] focus:border-blue-500 focus:ring-blue-500/20'
              }
              ${className}
            `}
            {...props}
          />
          {props.value && (
             <span className="text-sm text-[var(--text-main)] uppercase">{String(props.value)}</span>
          )}
        </div>
      </FieldWrapper>
    );
  }
);

ColorPicker.displayName = 'ColorPicker';
