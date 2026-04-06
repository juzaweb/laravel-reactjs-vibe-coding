import React from 'react';

export interface FieldWrapperProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  description,
  error,
  required,
  htmlFor,
  children,
  className = '',
}) => {
  return (
    <div className={`w-full mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block mb-1.5 text-sm font-medium text-[var(--text-main)]"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {children}

      {description && !error && (
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">{description}</p>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
