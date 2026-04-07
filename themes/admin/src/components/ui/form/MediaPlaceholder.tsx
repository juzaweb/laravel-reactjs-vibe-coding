import React, { forwardRef, useId, useState } from 'react';
import { FieldWrapper } from './FieldWrapper';
import { FiImage, FiX } from 'react-icons/fi';
import { MediaModal } from '../media/MediaModal';
import type { MediaItem } from '../../../pages/media/types';

export interface MediaPlaceholderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
  required?: boolean;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const MediaPlaceholder = forwardRef<HTMLDivElement, MediaPlaceholderProps>(
  ({ label, description, error, required, className = '', wrapperClassName = '', id, name, value, onChange, ...props }, ref) => {
    const uniqueId = useId();
    const mediaId = id || name || uniqueId;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState<string | undefined>(value);

    // Update internal state if value prop changes
    React.useEffect(() => {
      setSelectedUrl(value);
    }, [value]);

    const handleSelect = (item: MediaItem) => {
      setSelectedUrl(item.url);
      if (onChange) {
        onChange(item.url);
      }
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedUrl(undefined);
      if (onChange) {
        onChange('');
      }
    };

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
            relative w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg text-sm
            transition-colors cursor-pointer overflow-hidden group
            hover:bg-gray-50 dark:hover:bg-gray-800
            ${
              error
                ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/10'
                : 'border-[var(--border-color)] text-[var(--text-muted)] bg-transparent'
            }
            ${className}
          `}
          onClick={() => setIsModalOpen(true)}
          {...props}
        >
          {selectedUrl ? (
            <>
              <img src={selectedUrl} alt="Selected Media" className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                 <span className="text-white">Change Image</span>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <FiX />
              </button>
            </>
          ) : (
            <>
              <FiImage className="w-8 h-8 mb-2 text-gray-400" />
              <span>Click to select image</span>
            </>
          )}
        </div>

        {isModalOpen && (
          <MediaModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelect={handleSelect}
          />
        )}
      </FieldWrapper>
    );
  }
);

MediaPlaceholder.displayName = 'MediaPlaceholder';
