import { forwardRef, useId } from 'react';
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
    SourceEditing
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

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

    return (
      <FieldWrapper
        label={label}
        description={description}
        error={error}
        required={required}
        htmlFor={editorId}
        className={wrapperClassName}
      >
        <div className={`
          w-full rounded-lg overflow-hidden
          ${error ? 'border border-red-500' : 'border border-[var(--border-color)]'}
          ${className}
        `} style={{ '--ck-border-radius': '0.5rem' } as React.CSSProperties}>
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
                Alignment, Indent, RemoveFormat, SourceEditing
              ],
              toolbar: [
                'undo', 'redo', '|',
                'heading', '|',
                'bold', 'italic', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
                'alignment', 'bulletedList', 'numberedList', 'outdent', 'indent', '|',
                'link', 'insertImage', 'mediaEmbed', 'insertTable', 'blockQuote', '|',
                'removeFormat', 'sourceEditing'
              ],
              ...config
            }}
            {...props}
          />
        </div>
      </FieldWrapper>
    );
  }
);

Editor.displayName = 'Editor';
