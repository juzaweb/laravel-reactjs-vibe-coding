import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { MediaType, MediaItem } from './types';
import { fetchMedia, uploadMedia, deleteMedia } from '../../services/api/media';
import { MediaToolbar } from './MediaToolbar';
import { MediaGrid } from './MediaGrid';
import { MediaList } from './MediaList';
import { MediaSidebar } from './MediaSidebar';
import { MediaUploadDropzone } from './MediaUploadDropzone';

export const MediaLibrary: React.FC = () => {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<MediaType>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showUpload, setShowUpload] = useState(false);
  const [page, setPage] = useState(1);

  // Debounce search query to avoid spamming API on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery((prev) => {
          if (prev !== searchQuery) {
              setPage(1); // Reset page safely when debounced search actually changes
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

  // Fetch Media
  const { data, isLoading, isError } = useQuery({
    queryKey: ['media', { page, keyword: debouncedSearchQuery, type: filterType === 'all' ? undefined : filterType }],
    queryFn: () => fetchMedia({
      page,
      keyword: debouncedSearchQuery || undefined,
      type: filterType === 'all' ? undefined : filterType,
    }),
  });

  const items = data?.data || [];

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: (files: FileList) => uploadMedia(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      setShowUpload(false);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => deleteMedia(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(deletedId.toString());
        return newSet;
      });
      if (activeItem?.id.toString() === deletedId.toString()) {
        setActiveItem(null);
      }
    },
    onError: (error) => {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  });

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
    setActiveItem(item);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete ${selectedIds.size} items?`)) {
      // In a real app, you might want a bulk delete endpoint. Here we'll delete one by one or Promise.all
      // Assuming a simple iteration for now since the backend might not have bulk delete
      const idsArray = Array.from(selectedIds);
      Promise.all(idsArray.map(id => deleteMedia(id)))
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['media'] });
          if (activeItem && selectedIds.has(activeItem.id.toString())) {
             setActiveItem(null);
          }
          setSelectedIds(new Set());
        })
        .catch(err => {
          console.error("Bulk delete error", err);
          alert("Error deleting some items.");
        });
    }
  };

  const handleUpload = (files: FileList) => {
    uploadMutation.mutate(files);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">Media Library</h1>
      </div>

      <MediaToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={handleSetFilterType}
        onAddNew={() => setShowUpload(!showUpload)}
        selectedCount={selectedIds.size}
        onBulkDelete={handleBulkDelete}
        onClearSelection={handleClearSelection}
      />

      {showUpload && (
        <MediaUploadDropzone
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
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

          {/* Pagination Controls - Simple implementation */}
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

      </div>
    </div>
  );
};
