import React from 'react';
import { FiGrid, FiList, FiSearch, FiUpload, FiTrash2 } from 'react-icons/fi';
import type { MediaType } from './types';

interface MediaToolbarProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: MediaType;
  setFilterType: (type: MediaType) => void;
  onAddNew: () => void;
  selectedCount: number;
  onBulkDelete?: () => void;
  onClearSelection?: () => void;
}

export const MediaToolbar: React.FC<MediaToolbarProps> = ({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  onAddNew,
  selectedCount,
  onBulkDelete,
  onClearSelection,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-color)]">

      {/* Left side: Add New and Bulk Actions */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          <FiUpload />
          Add New
        </button>

        {selectedCount > 0 && (
          <div className="flex items-center gap-2 border-l border-[var(--border-color)] pl-3">
            <span className="text-sm text-[var(--text-muted)]">
              {selectedCount} selected
            </span>
            <button
              onClick={onBulkDelete}
              className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Delete Selected"
            >
              <FiTrash2 size={18} />
            </button>
            <button
              onClick={onClearSelection}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Right side: Filters, Search, View Toggle */}
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">

        {/* Filter Dropdown */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as MediaType)}
          className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2"
        >
          <option value="all">All Media Items</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="document">Documents</option>
        </select>

        {/* Search */}
        <div className="relative flex-grow sm:flex-grow-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-[var(--text-muted)]" />
          </div>
          <input
            type="text"
            className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* View Toggle */}
        <div className="flex bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md overflow-hidden">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="List View"
          >
            <FiList size={18} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Grid View"
          >
            <FiGrid size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};
