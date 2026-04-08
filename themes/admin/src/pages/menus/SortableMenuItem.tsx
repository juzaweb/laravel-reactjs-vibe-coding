import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import type { MenuItem } from './types';
import { Input } from '../../components/ui/Input';

interface SortableMenuItemProps {
  item: MenuItem;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<MenuItem>) => void;
}

export const SortableMenuItem: React.FC<SortableMenuItemProps> = ({ item, onRemove, onUpdate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id || '' });

  const depth = item.depth || 0;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
    marginLeft: `${depth * 2}rem`,
  };

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-slate-800 border border-[var(--border-color)] rounded-md shadow-sm mb-2"
    >
      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-move text-slate-400 hover:text-slate-600">
            <FiMenu />
          </div>
          <span className="font-medium text-[var(--text-main)]">{item.label || 'Unnamed Item'}</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs text-[var(--text-muted)] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
             {item.is_custom ? 'Custom Link' : 'Page'}
           </span>
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
          >
            <FiChevronDown className={`text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 border-t border-[var(--border-color)] space-y-4">
          <Input
            label="Navigation Label"
            value={item.label || ''}
            onChange={(e) => onUpdate(item.id || '', { label: e.target.value })}
          />
          {item.is_custom && (
            <Input
              label="URL"
              value={item.link || ''}
              onChange={(e) => onUpdate(item.id || '', { link: e.target.value })}
            />
          )}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => onRemove(item.id || '')}
              className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
            >
              <FiX /> Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
