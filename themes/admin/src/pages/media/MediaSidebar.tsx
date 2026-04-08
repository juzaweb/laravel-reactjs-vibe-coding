import React from 'react';
import { formatBytes, formatDate } from './types';
import type { MediaItem } from './types';
import { FiX, FiTrash2, FiExternalLink, FiCopy } from 'react-icons/fi';

interface MediaSidebarProps {
  item: MediaItem | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const MediaSidebar: React.FC<MediaSidebarProps> = ({ item, onClose, onDelete }) => {
  if (!item) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(item.url);
    // In a real app, show a toast notification here
  };

  return (
    <div className="w-full md:w-80 bg-[var(--bg-card)] border-l border-[var(--border-color)] flex flex-col h-full overflow-hidden absolute md:relative right-0 top-0 bottom-0 z-20 shadow-xl md:shadow-none transition-transform duration-300">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
        <h3 className="font-semibold text-[var(--text-main)] truncate pr-2">Attachment Details</h3>
        <button
          onClick={onClose}
          className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* Preview */}
        <div className="bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center min-h-[160px] border border-[var(--border-color)]">
          {item.is_image && item.url ? (
            <img src={item.url} alt={item.name} className="max-w-full max-h-[200px] object-contain" />
          ) : (
            <div className="text-[var(--text-muted)] p-8 text-center">
               <p className="text-sm">Preview not available</p>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-3 text-sm">
          <div>
            <span className="block text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">File name</span>
            <span className="text-[var(--text-main)] break-all font-medium">{item.name}</span>
          </div>

          <div>
            <span className="block text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">File type</span>
            <span className="text-[var(--text-main)]">{item.is_directory || item.type === 'dir' ? 'Folder' : (item.mime_type || 'File')}</span>
          </div>

          <div>
            <span className="block text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">Uploaded on</span>
            <span className="text-[var(--text-main)]">{item.created_at ? formatDate(item.created_at) : 'N/A'}</span>
          </div>

          <div>
            <span className="block text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">File size</span>
            <span className="text-[var(--text-main)]">{item.readable_size || formatBytes(item.size)}</span>
          </div>

          {item.dimensions && (
            <div>
              <span className="block text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">Dimensions</span>
              <span className="text-[var(--text-main)]">{item.dimensions}</span>
            </div>
          )}
        </div>

        {/* URL Field */}
        <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
          <label className="block text-[var(--text-muted)] text-xs uppercase tracking-wider">File URL</label>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={item.url}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] text-xs rounded-l-md p-2 outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 border border-l-0 border-[var(--border-color)] text-[var(--text-main)] px-3 rounded-r-md transition-colors"
              title="Copy URL"
            >
              <FiCopy size={14} />
            </button>
          </div>
          {item.url && item.url !== '#' && (
             <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-blue-600 hover:underline mt-1"
            >
              View attachment page <FiExternalLink className="ml-1" size={12} />
            </a>
          )}
        </div>

      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-main)]">
        <button
          onClick={() => onDelete(item.id.toString())}
          className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 rounded-md transition-colors font-medium text-sm"
        >
          <FiTrash2 size={16} />
          Delete Permanently
        </button>
      </div>

    </div>
  );
};
