import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/form/Select';
import { FiPlus, FiChevronDown, FiChevronRight, FiSave, FiTrash2 } from 'react-icons/fi';
import { useMenus, useMenu, useCreateMenu, useUpdateMenu, useDeleteMenu } from './hooks';
import { usePages } from '../pages/hooks';
import type { MenuItem } from './types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, type DragEndEvent, type DragStartEvent, type DragMoveEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableMenuItem } from './SortableMenuItem';
import { PageHeader } from '../../components/ui/PageHeader';

export const MenusManager: React.FC = () => {
  const { t } = useTranslation();

  const [isPagesOpen, setIsPagesOpen] = useState(true);
  const [isCustomLinkOpen, setIsCustomLinkOpen] = useState(false);

  const [selectedMenuId, setSelectedMenuId] = useState<string>('');
  const [menuName, setMenuName] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [projectedDepth, setProjectedDepth] = useState<number | null>(null);

  const [selectedPages, setSelectedPages] = useState<string[]>([]);

  const [customLinkLabel, setCustomLinkLabel] = useState('');
  const [customLinkUrl, setCustomLinkUrl] = useState('https://');

  const { data: menusData } = useMenus(1, 100);
  const { data: activeMenuData } = useMenu(selectedMenuId);
  const { data: pagesData, isLoading: isLoadingPages } = usePages(1, 100);

  const createMenuMutation = useCreateMenu();
  const updateMenuMutation = useUpdateMenu();
  const deleteMenuMutation = useDeleteMenu();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (menusData?.data && !selectedMenuId) {
      if (menusData.data.length > 0) {
        // Intentionally setting state in effect here for initial selection initialization
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedMenuId(menusData.data[0].id);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedMenuId('new');
      }
    }
  }, [menusData, selectedMenuId]);

  useEffect(() => {
    if (selectedMenuId === 'new') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMenuName('');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMenuItems([]);
    } else if (activeMenuData) {
      // Intentionally syncing local state with selected menu data
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMenuName(activeMenuData.name);

      // Flatten hierarchical menu items into flat list with depth for dnd-kit representation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapItems = (items: any[], depth: number = 0): MenuItem[] => {
        let result: MenuItem[] = [];
        items.forEach(item => {
           result.push({
             ...item,
             label: item.label || item.translations?.[0]?.label || item.name,
             is_custom: item.is_custom || false,
             depth: depth,
           });
           if (item.children && item.children.length > 0) {
             result = result.concat(mapItems(item.children, depth + 1));
           }
        });
        return result;
      };

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMenuItems(mapItems(activeMenuData.items || []));
    }
  }, [selectedMenuId, activeMenuData]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { delta } = event;
    // Calculate indentation roughly: 1 rem = 16px, depth = 2rem = 32px
    const projectedIndentation = Math.round(delta.x / 32);
    setProjectedDepth(projectedIndentation);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setMenuItems((items) => {
      let newItems = [...items];
      const activeIndex = items.findIndex(item => item.id === active.id);
      const overIndex = over ? items.findIndex(item => item.id === over.id) : activeIndex;

      if (activeIndex !== overIndex) {
        newItems = arrayMove(newItems, activeIndex, overIndex);
      }

      if (projectedDepth !== null) {
        const activeItem = newItems[overIndex];
        const previousItem = newItems[overIndex - 1];

        let newDepth = activeItem.depth || 0;
        newDepth += projectedDepth;

        // Boundaries
        if (newDepth < 0) newDepth = 0;
        if (previousItem) {
          const maxDepth = (previousItem.depth || 0) + 1;
          if (newDepth > maxDepth) newDepth = maxDepth;
        } else {
          newDepth = 0; // First item must be root
        }

        newItems[overIndex] = { ...activeItem, depth: newDepth };

        // Adjust children depths
        const depthDiff = newDepth - (activeItem.depth || 0);
        if (depthDiff !== 0) {
           for (let i = overIndex + 1; i < newItems.length; i++) {
             const item = newItems[i];
             // If we hit an item that is higher or at same level as original depth, we stop updating children
             if ((item.depth || 0) <= (activeItem.depth || 0)) {
               break;
             }
             newItems[i] = { ...item, depth: Math.max(0, (item.depth || 0) + depthDiff) };
           }
        }
      }

      return newItems;
    });

    setActiveId(null);
    setProjectedDepth(null);
  };

  const handleAddPages = () => {
    if (!pagesData?.data) return;

    const newItems: MenuItem[] = selectedPages.map(pageId => {
      const page = pagesData.data.find(p => p.id === pageId);
      return {
        id: `temp-${Date.now()}-${pageId}`,
        menuable_type: 'Juzaweb\\Modules\\Core\\Models\\Page', // Typical polymorph class
        menuable_id: pageId,
        label: page?.title,
        is_custom: false,
      };
    });

    setMenuItems([...menuItems, ...newItems]);
    setSelectedPages([]);
  };

  const handleAddCustomLink = () => {
    if (!customLinkLabel || !customLinkUrl) return;

    const newItem: MenuItem = {
      id: `temp-${Date.now()}`,
      label: customLinkLabel,
      link: customLinkUrl,
      is_custom: true,
      box_key: 'custom',
    };

    setMenuItems([...menuItems, newItem]);
    setCustomLinkLabel('');
    setCustomLinkUrl('https://');
  };

  const handleRemoveItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(menuItems.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const buildHierarchicalContent = (flatItems: MenuItem[]) => {
    const rootItems: MenuItem[] = [];
    const itemMap = new Map<number, MenuItem>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleanItem = (item: MenuItem): any => {
      return {
        ...item,
        id: item.id?.startsWith('temp-') ? undefined : item.id,
        children: item.children ? item.children.map(cleanItem) : []
      };
    };

    flatItems.forEach((item) => {
      const depth = item.depth || 0;
      const cleanNode = { ...item, children: [] };
      itemMap.set(depth, cleanNode);

      if (depth === 0) {
        rootItems.push(cleanNode);
      } else {
        const parent = itemMap.get(depth - 1);
        if (parent && parent.children) {
          parent.children.push(cleanNode);
        } else {
           // Fallback to root if structure is somehow invalid
           rootItems.push(cleanNode);
        }
      }
    });

    return JSON.stringify(rootItems.map(cleanItem));
  };

  const handleSaveMenu = async () => {
    if (!menuName) return alert('Menu name is required');

    const content = buildHierarchicalContent(menuItems);

    try {
      if (selectedMenuId === 'new') {
        const res = await createMenuMutation.mutateAsync({ name: menuName, content });
        setSelectedMenuId(res.data.id);
        alert('Menu created successfully!');
      } else {
        await updateMenuMutation.mutateAsync({ id: selectedMenuId, data: { name: menuName, content } });
        alert('Menu saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save menu', error);
      alert('Failed to save menu');
    }
  };

  const handleDeleteMenu = async () => {
    if (confirm('Are you sure you want to delete this menu?')) {
      await deleteMenuMutation.mutateAsync(selectedMenuId);
      setSelectedMenuId('');
      setMenuItems([]);
      setMenuName('');
    }
  };

  // Ensure we safely handle array mapping if data isn't loaded yet
  const menuOptions = Array.isArray(menusData?.data) ? menusData.data.map(m => ({ value: m.id, label: m.name })) : [];
  menuOptions.push({ value: 'new', label: '--- Create New Menu ---' });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title={t('menus', 'Menus')}
        breadcrumbs={[{ label: t('menus', 'Menus') }]}
      />

      {/* Top Header Section */}
      <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-[var(--border-color)]">
        <span className="text-sm font-medium text-[var(--text-main)]">
          {t('select_menu_to_edit', 'Select menu to edit:')}
        </span>
        <div className="w-64">
          <Select
            options={menuOptions}
            value={selectedMenuId}
            onChange={(e) => {
              setSelectedMenuId(e.target.value);
              if (e.target.value === 'new') {
                setMenuName('');
                setMenuItems([]);
              }
            }}
          />
        </div>
        <span className="text-sm text-[var(--text-muted)]">
          {t('or', 'or')}{' '}
          <button
            type="button"
            onClick={() => {
              setSelectedMenuId('new');
              setMenuName('');
              setMenuItems([]);
            }}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {t('create_new_menu', 'create a new menu')}
          </button>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Items */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-2">
            {t('items', 'Items')}
          </h2>

          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-sm">
            {/* Pages Accordion */}
            <button
              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-[var(--border-color)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => {
                setIsPagesOpen(!isPagesOpen);
                if (!isPagesOpen) {
                  setIsCustomLinkOpen(false);
                }
              }}
            >
              <span className="font-semibold text-[var(--text-main)]">{t('pages', 'Pages')}</span>
              {isPagesOpen ? <FiChevronDown className="text-[var(--text-muted)]" /> : <FiChevronRight className="text-[var(--text-muted)]" />}
            </button>

            {isPagesOpen && (
              <div className="p-4">
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2 mb-4">
                  {isLoadingPages ? (
                    <p className="text-sm text-gray-500">Loading pages...</p>
                  ) : (Array.isArray(pagesData?.data) ? pagesData.data : []).map((page) => (
                    <label key={page.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedPages.includes(page.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPages([...selectedPages, page.id]);
                          } else {
                            setSelectedPages(selectedPages.filter(id => id !== page.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
                      />
                      <span className="text-sm text-[var(--text-main)] group-hover:text-blue-600 transition-colors">
                        {page.title}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-end">
                  <Button variant="primary" size="sm" className="gap-1" onClick={handleAddPages} disabled={selectedPages.length === 0}>
                    <FiPlus className="w-4 h-4" />
                    {t('add_to_menu', 'Add to menu')}
                  </Button>
                </div>
              </div>
            )}

            {/* Custom Links Accordion */}
            <button
              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-[var(--border-color)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => {
                setIsCustomLinkOpen(!isCustomLinkOpen);
                if (!isCustomLinkOpen) {
                  setIsPagesOpen(false);
                }
              }}
            >
              <span className="font-semibold text-[var(--text-main)]">{t('custom_links', 'Custom Links')}</span>
              {isCustomLinkOpen ? <FiChevronDown className="text-[var(--text-muted)]" /> : <FiChevronRight className="text-[var(--text-muted)]" />}
            </button>

            {isCustomLinkOpen && (
              <div className="p-4 space-y-4">
                <Input
                  label="URL"
                  value={customLinkUrl}
                  onChange={(e) => setCustomLinkUrl(e.target.value)}
                />
                <Input
                  label="Link Text"
                  value={customLinkLabel}
                  onChange={(e) => setCustomLinkLabel(e.target.value)}
                />
                <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-end">
                  <Button variant="primary" size="sm" className="gap-1" onClick={handleAddCustomLink} disabled={!customLinkLabel || !customLinkUrl}>
                    <FiPlus className="w-4 h-4" />
                    {t('add_to_menu', 'Add to menu')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Structure */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-2">
            {t('structure', 'Structure')}
          </h2>

          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-sm flex flex-col">
            <div className="p-6 border-b border-[var(--border-color)] grid grid-cols-1 gap-6 bg-slate-50/50 dark:bg-slate-800/20">
              <Input
                label={t('menu_name', 'Menu name')}
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                className="bg-white dark:bg-slate-900"
              />
            </div>

            <div className="p-6 flex-grow min-h-[400px] bg-slate-50/30 dark:bg-slate-900/10">
              {menuItems.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <p>Add menu items from the column on the left.</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext items={menuItems.map(i => i.id || '')} strategy={verticalListSortingStrategy}>
                    {menuItems.map((item) => {
                      const isActive = item.id === activeId;
                      // Calculate active depth visualization
                      const itemWithProjectedDepth = isActive && projectedDepth !== null ? {
                        ...item,
                        depth: Math.max(0, (item.depth || 0) + projectedDepth)
                      } : item;

                      return (
                        <SortableMenuItem
                          key={item.id}
                          item={itemWithProjectedDepth}
                          onRemove={handleRemoveItem}
                          onUpdate={handleUpdateItem}
                        />
                      );
                    })}
                  </SortableContext>
                  <DragOverlay>
                    {activeId ? (
                      <div className="opacity-80">
                        <SortableMenuItem
                          item={menuItems.find(i => i.id === activeId)!}
                          onRemove={() => {}}
                          onUpdate={() => {}}
                        />
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-[var(--border-color)] flex items-center justify-between">
              {selectedMenuId && selectedMenuId !== 'new' && (
                <button onClick={handleDeleteMenu} className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors flex items-center gap-1">
                  <FiTrash2 /> {t('delete_menu', 'Delete menu')}
                </button>
              )}
              <div className="ml-auto">
                <Button variant="primary" className="gap-2 px-6" onClick={handleSaveMenu} disabled={createMenuMutation.isPending || updateMenuMutation.isPending}>
                  <FiSave className="w-4 h-4" />
                  {t('save', 'Save')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
