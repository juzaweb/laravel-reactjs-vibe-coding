import { forwardRef, useId, useState, useRef } from 'react';
import { FieldWrapper } from './FieldWrapper';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Essentials,
    Bold,
    Italic,
    Font,
    Paragraph,
    List,
    Link,
    Heading,
    Image,
    ImageUpload,
    MediaEmbed,
    Table,
    BlockQuote,
    Alignment,
    Indent,
    RemoveFormat,
    SourceEditing,
    ButtonView,
    Plugin
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { MediaModal } from '../media/MediaModal';
import type { MediaItem } from '../../../pages/media/types';

class InsertMediaPlugin extends Plugin {
    init() {
        const editor = this.editor;
        editor.ui.componentFactory.add('insertMedia', locale => {
            const view = new ButtonView(locale);
            view.set({
                label: 'Insert Media',
                withText: false,
                tooltip: true,
                icon: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4v12h15V4h-15zM1 2.5h18v15H1v-15zm4.5 4.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM15 14H5l3-4.5 2 2.5 3-4L15 14z"/></svg>'
            });
            view.on('execute', () => {
                editor.fire('openMediaModal');
            });
            return view;
        });
    }
}

export interface EditorProps {
  label?: string;
  description?: string;
  error?: string;
  className?: string;
  wrapperClassName?: string;
  required?: boolean;
  id?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Editor = forwardRef<any, EditorProps>(
  ({ label, description, error, required, className = '', wrapperClassName = '', id, name, value, onChange, config, ...props }, ref) => {
    const uniqueId = useId();
    const editorId = id || name || uniqueId;
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const editorInstanceRef = useRef<any>(null);

    const handleMediaSelect = (item: MediaItem) => {
      if (!editorInstanceRef.current) return;

      const editor = editorInstanceRef.current;
      if (item.type === 'image') {
        editor.execute('insertImage', { source: item.url });
      } else if (item.type === 'video') {
        editor.execute('mediaEmbed', { url: item.url });
      }
    };

    return (
      <FieldWrapper
        label={label}
        description={description}
        error={error}
        required={required}
        htmlFor={editorId}
        className={wrapperClassName}
      >
        <style>{`
          #${editorId}-wrapper .ck-editor__editable_inline {
            min-height: 400px;
          }
        `}</style>
        <div
          id={`${editorId}-wrapper`}
          className={`
            w-full rounded-lg overflow-hidden
            ${error ? 'border border-red-500' : 'border border-[var(--border-color)]'}
            ${className}
          `}
          style={{ '--ck-border-radius': '0.5rem' } as React.CSSProperties}
        >
          <CKEditor
            editor={ClassicEditor}
            data={value || ''}
            onChange={(_event, editor) => {
              if (onChange) {
                const data = editor.getData();
                onChange(data);
              }
            }}
            onReady={editor => {
              editorInstanceRef.current = editor;
              editor.on('openMediaModal', () => {
                setIsMediaModalOpen(true);
              });

              if (ref) {
                if (typeof ref === 'function') {
                  ref(editor);
                } else {
                  ref.current = editor;
                }
              }
            }}
            config={{
              licenseKey: 'GPL',
              plugins: [
                Essentials, Bold, Italic, Font, Paragraph, List, Link,
                Heading, Image, ImageUpload, MediaEmbed, Table, BlockQuote,
                Alignment, Indent, RemoveFormat, SourceEditing,
                InsertMediaPlugin
              ],
              toolbar: [
                'undo', 'redo', '|',
                'heading', '|',
                'bold', 'italic', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
                'alignment', 'bulletedList', 'numberedList', 'outdent', 'indent', '|',
                'link', 'insertMedia', 'mediaEmbed', 'insertTable', 'blockQuote', '|',
                'removeFormat', 'sourceEditing'
              ],
              ...config
            }}
            {...props}
          />
        </div>
        <MediaModal
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
          onSelect={handleMediaSelect}
        />
      </FieldWrapper>
    );
  }
);

Editor.displayName = 'Editor';
