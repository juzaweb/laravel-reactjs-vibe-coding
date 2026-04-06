import React, { useCallback, useState } from 'react';
import { FiUploadCloud, FiX } from 'react-icons/fi';

interface MediaUploadDropzoneProps {
  onClose: () => void;
  onUpload: (files: FileList) => void;
}

export const MediaUploadDropzone: React.FC<MediaUploadDropzoneProps> = ({ onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  }, [onUpload]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
    }
  };

  return (
    <div className="mb-6 bg-[var(--bg-card)] rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 p-6 relative transition-colors duration-200">

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <FiX size={20} />
      </button>

      <div
        className={`flex flex-col items-center justify-center py-10 rounded-lg ${isDragging ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full mb-4">
          <FiUploadCloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text-main)] mb-2">
          Drag and drop files to upload
        </h3>
        <p className="text-[var(--text-muted)] text-sm mb-6">
          or click below to browse your computer
        </p>

        <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium cursor-pointer transition-colors">
          Select Files
          <input
            type="file"
            className="hidden"
            multiple
            onChange={handleFileInput}
          />
        </label>

        <p className="mt-4 text-xs text-[var(--text-muted)] max-w-md text-center">
          Maximum upload file size: 50 MB. Allowed types: jpg, png, gif, pdf, mp4, docx.
        </p>
      </div>
    </div>
  );
};
