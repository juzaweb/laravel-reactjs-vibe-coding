import { forwardRef, useId } from 'react';
import { FieldWrapper } from './FieldWrapper';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import type { IAllProps } from '@tinymce/tinymce-react';

export interface EditorProps extends Omit<IAllProps, 'id'> {
  label?: string;
  description?: string;
  error?: string;
  className?: string;
  wrapperClassName?: string;
  required?: boolean;
  id?: string;
  name?: string;
}

export const Editor = forwardRef<TinyMCEEditor, EditorProps>(
  ({ label, description, error, required, className = '', wrapperClassName = '', id, name, ...props }, ref) => {
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
        `}>
          <TinyMCEEditor
            id={editorId}
            ref={ref}
            init={{
              height: 400,
              menubar: false,
              promotion: false,
              branding: false,
              remove_script_host: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              ...props.init
            }}
            {...props}
          />
        </div>
      </FieldWrapper>
    );
  }
);

Editor.displayName = 'Editor';
