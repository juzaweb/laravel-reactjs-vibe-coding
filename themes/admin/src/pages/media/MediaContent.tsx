import React, { useState, useEffect } from 'react';
import type { MediaType, MediaItem } from './types';
import { useMedia, useDeleteMedia } from './hooks';
import { MediaToolbar } from './MediaToolbar';
import { MediaGrid } from './MediaGrid';
import { MediaList } from './MediaList';
import toast from 'react-hot-toast';
import { MediaSidebar } from './MediaSidebar';
import { MediaUploadDropzone } from './MediaUploadDropzone';
import { PageHeader } from '../../components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

export interface MediaContentProps {
  onSelect?: (item: MediaItem) => void;
  isSelectMode?: boolean;
}

export const MediaContent: React.FC<MediaContentProps> = ({ onSelect, isSelectMode = false }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<MediaType>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showUpload, setShowUpload] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 15; // default limit

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery((prev) => {
          if (prev !== searchQuery) {
              setPage(1);
              return searchQuery;
          }
          return prev;
      });
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Track the item currently being viewed in the sidebar
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);

  // Custom setter for filterType to reset page
  const handleSetFilterType = (type: MediaType) => {
    setFilterType(type);
    setPage(1);
  };

  // Hooks
  const { data, isLoading, isError } = useMedia(page, limit, debouncedSearchQuery, filterType);
  const deleteMediaMutation = useDeleteMedia();

  const items = data?.data || [];

  // Selection handlers
  const handleToggleSelect = (id: string, multi: boolean = false) => {
    setSelectedIds((prev) => {
      const newSet = new Set(multi ? prev : []);
      const strId = id.toString();
      if (newSet.has(strId)) {
        newSet.delete(strId);
      } else {
        newSet.add(strId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(items.map(item => item.id.toString())));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleItemClick = (item: MediaItem) => {
    if (isSelectMode && onSelect) {
      onSelect(item);
    } else {
      setActiveItem(item);
    }
  };

  const { t } = useTranslation();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      deleteMediaMutation.mutate(id, {
         onSuccess: () => {
            setSelectedIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(id.toString());
              return newSet;
            });
            if (activeItem?.id.toString() === id.toString()) {
              setActiveItem(null);
            }
         },
         onError: (error) => {
            console.error('Delete failed:', error);
            toast.error('Delete failed. Please try again.');
         }
      });
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete ${selectedIds.size} items?`)) {
      const idsArray = Array.from(selectedIds);
      Promise.all(idsArray.map(id => deleteMediaMutation.mutateAsync(id)))
        .then(() => {
          if (activeItem && selectedIds.has(activeItem.id.toString())) {
             setActiveItem(null);
          }
          setSelectedIds(new Set());
          toast.success('Deleted successfully');
        })
        .catch(err => {
          console.error("Bulk delete error", err);
          toast.error("Error deleting some items.");
        });
    }
  };

  return (
    <div className={`flex flex-col ${isSelectMode ? 'h-full' : 'h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8'}`}>
      {!isSelectMode && (
        <PageHeader
          title={t('media_library', 'Media Library')}
          breadcrumbs={[{ label: t('media_library', 'Media Library') }]}
        />
      )}

      <MediaToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={handleSetFilterType}
        onAddNew={() => setShowUpload(!showUpload)}
        selectedCount={selectedIds.size}
        onBulkDelete={!isSelectMode ? handleBulkDelete : undefined}
        onClearSelection={handleClearSelection}
      />

      {showUpload && (
        <MediaUploadDropzone
          onClose={() => setShowUpload(false)}
        />
      )}

      {/* Main Content Area: Grid/List + Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Media Container */}
        <div className={`flex-1 overflow-y-auto pr-2 custom-scrollbar transition-all duration-300 ${activeItem ? 'md:pr-4' : ''}`}>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : isError ? (
            <div className="text-red-500 flex justify-center py-10">Error loading media.</div>
          ) : viewMode === 'grid' ? (
            <MediaGrid
              items={items}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onItemClick={handleItemClick}
            />
          ) : (
            <MediaList
              items={items}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onItemClick={handleItemClick}
              onSelectAll={handleSelectAll}
            />
          )}

          {/* Pagination Controls */}
          {data?.meta && data.meta.last_page > 1 && (
             <div className="flex justify-center mt-6 gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm">Page {page} of {data.meta.last_page}</span>
                <button
                  disabled={page === data.meta.last_page}
                  onClick={() => setPage(p => Math.min(data.meta.last_page, p + 1))}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Next
                </button>
             </div>
          )}
        </div>

        {/* Sidebar */}
        {!isSelectMode && (
          <div
            className={`transition-all duration-300 ease-in-out ${
              activeItem ? 'w-full md:w-80 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full overflow-hidden'
            }`}
          >
            {activeItem && (
              <MediaSidebar
                item={activeItem}
                onClose={() => setActiveItem(null)}
                onDelete={handleDelete}
              />
            )}
          </div>
        )}

      </div>
    </div>
  );
};
