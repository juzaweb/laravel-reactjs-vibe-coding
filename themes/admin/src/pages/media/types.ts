export type MediaType = 'image' | 'video' | 'document' | 'audio' | 'all';

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface MediaItem {
  id: string; // The ID from backend is integer, but frequently stored/used as string in frontend. Changing to number to match backend exactly, but need to check existing usage. Backend uses integer.
  name: string;
  type: string; // The backend uses "image", "video", "document", "audio"
  url: string;
  thumbnailUrl?: string; // We will use URL or conversions for thumbnail
  size: number; // in bytes
  readable_size?: string;
  dimensions?: string;
  created_at: string;
  updated_at: string;
  mime_type: string;
  path: string;
  extension: string;
  disk: string;
  is_directory: boolean;
  is_image: boolean;
  is_video: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conversions?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
