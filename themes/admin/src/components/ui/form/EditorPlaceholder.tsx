import React, { forwardRef, useId } from 'react';
import { FieldWrapper } from './FieldWrapper';

export interface EditorPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
  required?: boolean;
}

export const EditorPlaceholder = forwardRef<HTMLDivElement, EditorPlaceholderProps>(
  ({ label, description, error, required, className = '', wrapperClassName = '', id, ...props }, ref) => {
    const uniqueId = useId();
    const editorId = id || uniqueId;

    return (
      <FieldWrapper
        label={label}
        description={description}
        error={error}
        required={required}
        htmlFor={editorId}
        className={wrapperClassName}
      >
        <div
          id={editorId}
          ref={ref}
          className={`
            w-full min-h-[200px] flex flex-col border rounded-lg overflow-hidden text-sm bg-white dark:bg-gray-800
            ${
              error
                ? 'border-red-500'
                : 'border-[var(--border-color)]'
            }
            ${className}
          `}
          {...props}
        >
          {/* Toolbar Placeholder */}
          <div className="h-10 border-b border-[var(--border-color)] bg-gray-50 dark:bg-gray-900 flex items-center px-3 space-x-2">
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          {/* Editor Area Placeholder */}
          <div className="flex-1 p-4 flex items-center justify-center text-[var(--text-muted)] bg-transparent">
            Editor Placeholder (TinyMCE)
          </div>
        </div>
      </FieldWrapper>
    );
  }
);

EditorPlaceholder.displayName = 'EditorPlaceholder';
