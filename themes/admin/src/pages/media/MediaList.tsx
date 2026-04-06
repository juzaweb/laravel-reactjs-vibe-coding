import React from 'react';
import { formatBytes, formatDate } from './types';
import type { MediaItem } from './types';
import { FiImage, FiVideo, FiFileText, FiMusic } from 'react-icons/fi';

interface MediaListProps {
  items: MediaItem[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string, multi: boolean) => void;
  onItemClick: (item: MediaItem) => void;
  onSelectAll: (checked: boolean) => void;
}

export const MediaList: React.FC<MediaListProps> = ({
  items,
  selectedIds,
  onToggleSelect,
  onItemClick,
  onSelectAll,
}) => {
  const getIconForType = (type: string) => {
    switch (type) {
      case 'video': return <FiVideo className="w-6 h-6 text-[var(--text-muted)]" />;
      case 'document': return <FiFileText className="w-6 h-6 text-[var(--text-muted)]" />;
      case 'audio': return <FiMusic className="w-6 h-6 text-[var(--text-muted)]" />;
      default: return <FiImage className="w-6 h-6 text-[var(--text-muted)]" />;
    }
  };

  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < items.length;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)] bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
        <FiImage className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg">No media items found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border-color)]">
          <thead className="bg-[var(--bg-main)]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={allSelected}
                  ref={input => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                File
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider hidden md:table-cell">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider hidden lg:table-cell">
                Size
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {items.map((item) => {
              const isSelected = selectedIds.has(item.id);

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={(e) => {
                     if (e.shiftKey || e.metaKey || e.ctrlKey) {
                        onToggleSelect(item.id, true);
                      } else {
                        onItemClick(item);
                      }
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={isSelected}
                      onChange={() => onToggleSelect(item.id, true)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded overflow-hidden mr-3">
                        {item.type === 'image' && item.thumbnailUrl ? (
                          <img src={item.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          getIconForType(item.type)
                        )}
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-medium text-[var(--text-main)] truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                      {item.mimeType.split('/')[1] || item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)] hidden md:table-cell">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)] hidden lg:table-cell">
                    {formatBytes(item.size)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
