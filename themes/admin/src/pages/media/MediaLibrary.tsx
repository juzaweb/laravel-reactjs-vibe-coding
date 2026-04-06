import React, { useState, useMemo } from 'react';
import { MOCK_MEDIA } from './types';
import type { MediaType, MediaItem } from './types';
import { MediaToolbar } from './MediaToolbar';
import { MediaGrid } from './MediaGrid';
import { MediaList } from './MediaList';
import { MediaSidebar } from './MediaSidebar';
import { MediaUploadDropzone } from './MediaUploadDropzone';

export const MediaLibrary: React.FC = () => {
  const [items, setItems] = useState<MediaItem[]>(MOCK_MEDIA);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<MediaType>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showUpload, setShowUpload] = useState(false);

  // Track the item currently being viewed in the sidebar
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);

  // Filter and search logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [items, searchQuery, filterType]);

  // Selection handlers
  const handleToggleSelect = (id: string, multi: boolean = false) => {
    setSelectedIds((prev) => {
      const newSet = new Set(multi ? prev : []);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredItems.map(item => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  // Item click handler (opens sidebar if not selecting multiple)
  const handleItemClick = (item: MediaItem) => {
    setActiveItem(item);
    // If we click an item without multi-select keys, we might want to clear selection
    // and just select this one, or just open the sidebar. Let's just open the sidebar for now.
    // If it's the only one selected, maybe we keep it selected.
  };

  // Delete handler
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      setItems((prev) => prev.filter(item => item.id !== id));
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      if (activeItem?.id === id) {
        setActiveItem(null);
      }
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete ${selectedIds.size} items?`)) {
      setItems((prev) => prev.filter(item => !selectedIds.has(item.id)));
      if (activeItem && selectedIds.has(activeItem.id)) {
         setActiveItem(null);
      }
      setSelectedIds(new Set());
    }
  };

  // Upload handler (mock)
  const handleUpload = (files: FileList) => {
    // Mock uploading: just add them to the list locally
    const newItems: MediaItem[] = Array.from(files).map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image'
          : file.type.startsWith('video/') ? 'video'
          : file.type.startsWith('audio/') ? 'audio'
          : 'document',
      url: URL.createObjectURL(file), // Generate local URL for preview
      thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      size: file.size,
      createdAt: new Date().toISOString(),
      mimeType: file.type || 'application/octet-stream',
    }));

    setItems((prev) => [...newItems, ...prev]);
    setShowUpload(false);
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
        setFilterType={setFilterType}
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
          {viewMode === 'grid' ? (
            <MediaGrid
              items={filteredItems}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onItemClick={handleItemClick}
            />
          ) : (
            <MediaList
              items={filteredItems}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onItemClick={handleItemClick}
              onSelectAll={handleSelectAll}
            />
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
