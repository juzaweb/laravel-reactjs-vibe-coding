import React, { forwardRef, useId } from 'react';
import { FieldWrapper } from './FieldWrapper';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'options'> {
  label?: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, description, error, required, className = '', wrapperClassName = '', id, options, ...props }, ref) => {
    const uniqueId = useId();
    const selectId = id || props.name || uniqueId;

    return (
      <FieldWrapper
        label={label}
        description={description}
        error={error}
        required={required}
        htmlFor={selectId}
        className={wrapperClassName}
      >
        <select
          id={selectId}
          ref={ref}
          required={required}
          className={`
            w-full px-3 py-2 bg-transparent border rounded-lg text-sm
            focus:outline-none focus:ring-2 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none
            ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900 dark:text-red-400'
                : 'border-[var(--border-color)] focus:border-blue-500 focus:ring-blue-500/20 text-[var(--text-main)]'
            }
            ${className}
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: `right 0.5rem center`,
            backgroundRepeat: `no-repeat`,
            backgroundSize: `1.5em 1.5em`,
            paddingRight: `2.5rem`,
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      </FieldWrapper>
    );
  }
);

Select.displayName = 'Select';
