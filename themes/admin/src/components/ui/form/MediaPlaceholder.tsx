import React, { forwardRef, useId } from 'react';
import { FieldWrapper } from './FieldWrapper';
import { FiImage } from 'react-icons/fi';

export interface MediaPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
  required?: boolean;
  name?: string;
}

export const MediaPlaceholder = forwardRef<HTMLDivElement, MediaPlaceholderProps>(
  ({ label, description, error, required, className = '', wrapperClassName = '', id, name, ...props }, ref) => {
    const uniqueId = useId();
    const mediaId = id || name || uniqueId;

    return (
      <FieldWrapper
        label={label}
        description={description}
        error={error}
        required={required}
        htmlFor={mediaId}
        className={wrapperClassName}
      >
        <div
          id={mediaId}
          ref={ref}
          className={`
            w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg text-sm
            transition-colors cursor-pointer
            hover:bg-gray-50 dark:hover:bg-gray-800
            ${
              error
                ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/10'
                : 'border-[var(--border-color)] text-[var(--text-muted)] bg-transparent'
            }
            ${className}
          `}
          {...props}
        >
          <FiImage className="w-8 h-8 mb-2 text-gray-400" />
          <span>Click to upload image</span>
        </div>
      </FieldWrapper>
    );
  }
);

MediaPlaceholder.displayName = 'MediaPlaceholder';
