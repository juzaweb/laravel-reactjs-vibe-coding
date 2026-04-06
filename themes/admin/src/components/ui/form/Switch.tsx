import React, { forwardRef, useId } from 'react';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, error, className = '', wrapperClassName = '', id, ...props }, ref) => {
    const uniqueId = useId();
    const switchId = id || props.name || uniqueId;

    return (
      <div className={`flex items-start mb-4 ${wrapperClassName}`}>
        <div className="flex items-center h-5">
          <label htmlFor={switchId} className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id={switchId}
              ref={ref}
              className="sr-only peer"
              {...props}
            />
            <div className={`
              w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600
              ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${className}
            `}></div>
          </label>
        </div>
        {(label || description) && (
          <div className="ml-3 text-sm">
            {label && (
              <label htmlFor={switchId} className="font-medium text-[var(--text-main)] cursor-pointer">
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

Switch.displayName = 'Switch';
