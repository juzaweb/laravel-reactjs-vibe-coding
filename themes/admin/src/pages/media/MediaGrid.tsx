import React from 'react';
import type { MediaItem } from './types';
import { FiImage, FiVideo, FiFileText, FiMusic, FiCheck, FiFolder } from 'react-icons/fi';

interface MediaGridProps {
  items: MediaItem[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string, multi: boolean) => void;
  onItemClick: (item: MediaItem) => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  items,
  selectedIds,
  onToggleSelect,
  onItemClick,
}) => {
  const getIconForType = (item: MediaItem) => {
    if (item.is_directory || item.type === 'dir') return <FiFolder className="w-12 h-12 text-[var(--text-muted)]" />;
    if (item.is_video || item.mime_type?.startsWith('video/')) return <FiVideo className="w-12 h-12 text-[var(--text-muted)]" />;
    if (item.mime_type?.startsWith('audio/')) return <FiMusic className="w-12 h-12 text-[var(--text-muted)]" />;
    if (item.is_image || item.mime_type?.startsWith('image/')) return <FiImage className="w-12 h-12 text-[var(--text-muted)]" />;
    return <FiFileText className="w-12 h-12 text-[var(--text-muted)]" />;
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
        <FiImage className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg">No media items found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => {
        const isSelected = selectedIds.has(item.id.toString());
        const thumbnailUrl = item.is_image ? item.url : null;

        return (
          <div
            key={item.id}
            className={`group relative aspect-square bg-[var(--bg-card)] border rounded-lg overflow-hidden cursor-pointer transition-all ${
              isSelected
                ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                : 'border-[var(--border-color)] hover:border-blue-300 dark:hover:border-blue-700'
            }`}
            onClick={(e) => {
              // If holding shift or cmd/ctrl, toggle selection
              if (e.shiftKey || e.metaKey || e.ctrlKey) {
                onToggleSelect(item.id.toString(), true);
              } else {
                onItemClick(item);
              }
            }}
          >
            {/* Checkbox for explicit selection */}
            <div
              className={`absolute top-2 right-2 z-10 w-6 h-6 rounded bg-white dark:bg-slate-800 border flex items-center justify-center transition-opacity ${
                isSelected ? 'border-blue-500 opacity-100' : 'border-gray-300 opacity-0 group-hover:opacity-100'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect(item.id.toString(), true);
              }}
            >
              {isSelected && <FiCheck className="text-blue-500 w-4 h-4" />}
            </div>

            {/* Thumbnail */}
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-slate-800">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                getIconForType(item)
              )}
            </div>

            {/* Filename overlay on hover */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs truncate" title={item.name}>
                {item.name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
