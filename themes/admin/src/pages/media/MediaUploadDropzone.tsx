import React, { useEffect, useRef, useState } from 'react';
import Resumable from 'resumablejs';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { useQueryClient } from '@tanstack/react-query';

interface MediaUploadDropzoneProps {
  onClose: () => void;
  folderId?: number;
}

export const MediaUploadDropzone: React.FC<MediaUploadDropzoneProps> = ({ onClose, folderId }) => {
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const browseRef = useRef<HTMLInputElement>(null);
  const resumableRef = useRef<Resumable | null>(null);
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadingFiles, setUploadingFiles] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (!dropzoneRef.current || !browseRef.current) return;

    const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
    const token = localStorage.getItem('accessToken');

    const r = new Resumable({
      target: `${baseURL}/v1/media/chunk`,
      chunkSize: 1000 * 1024, // 1000KB
      simultaneousUploads: 3,
      testChunks: false,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      query: folderId ? { folder_id: folderId } : {}
    });

    resumableRef.current = r;

    if (!r.support) {
      console.error('Resumable.js is not supported in this environment');
      return;
    }

    r.assignDrop(dropzoneRef.current);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.on('fileAdded', (file: any) => {
      setUploadingFiles((prev) => [...prev, { id: file.uniqueIdentifier, name: file.fileName }]);
      setUploadProgress((prev) => ({ ...prev, [file.uniqueIdentifier]: 0 }));
      r.upload();
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.on('fileProgress', (file: any) => {
      setUploadProgress((prev) => ({
        ...prev,
        [file.uniqueIdentifier]: Math.floor(file.progress(false) * 100),
      }));
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.on('fileSuccess', (file: any) => {
      // Remove from uploading list
      setUploadingFiles((prev) => prev.filter((f) => f.id !== file.uniqueIdentifier));
      // Invalidate queries to refresh media list
      queryClient.invalidateQueries({ queryKey: ['media'] });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.on('fileError', (file: any, message: string) => {
      console.error('Upload error', file, message);
      alert(`Error uploading ${file.fileName}`);
      setUploadingFiles((prev) => prev.filter((f) => f.id !== file.uniqueIdentifier));
    });

    const currentDropzone = dropzoneRef.current;

    return () => {
      if (currentDropzone) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (r as any).unAssignDrop(currentDropzone);
      }
      r.cancel();
    };
  }, [folderId, queryClient]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Let Resumable JS handle the drop event, it will catch it because we assigned it.
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
        ref={dropzoneRef}
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

        <input
          type="file"
          multiple
          className="hidden"
          ref={browseRef}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (resumableRef.current as any)?.addFiles(Array.from(e.target.files), e.nativeEvent);
              e.target.value = ''; // Reset to allow selecting the same file again
            }
          }}
        />
        <button
          onClick={() => browseRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium cursor-pointer transition-colors"
        >
          Select Files
        </button>

        <p className="mt-4 text-xs text-[var(--text-muted)] max-w-md text-center">
          Maximum upload file size: 50 MB. Allowed types: jpg, png, gif, pdf, mp4, docx.
        </p>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-[var(--text-main)] mb-2">Uploading Files...</h4>
          <div className="space-y-2">
            {uploadingFiles.map((file) => (
              <div key={file.id} className="flex items-center space-x-2">
                <div className="flex-1 text-sm text-[var(--text-muted)] truncate">{file.name}</div>
                <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress[file.id] || 0}%` }}
                  ></div>
                </div>
                <div className="text-xs text-[var(--text-muted)] w-8 text-right">
                  {uploadProgress[file.id] || 0}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
