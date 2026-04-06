export type MediaType = 'image' | 'video' | 'document' | 'audio' | 'all';

export interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  thumbnailUrl: string;
  size: number; // in bytes
  dimensions?: string;
  createdAt: string;
  mimeType: string;
}

export const MOCK_MEDIA: MediaItem[] = [
  {
    id: '1',
    name: 'hero-banner.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2000&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=400&auto=format&fit=crop',
    size: 2450000,
    dimensions: '2000x1333',
    createdAt: '2024-03-15T10:30:00Z',
    mimeType: 'image/jpeg'
  },
  {
    id: '2',
    name: 'logo-transparent.png',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop',
    size: 450000,
    dimensions: '500x500',
    createdAt: '2024-03-14T14:20:00Z',
    mimeType: 'image/png'
  },
  {
    id: '3',
    name: 'product-presentation.pdf',
    type: 'document',
    url: '#',
    thumbnailUrl: '', // Will use an icon fallback
    size: 5200000,
    createdAt: '2024-03-10T09:15:00Z',
    mimeType: 'application/pdf'
  },
  {
    id: '4',
    name: 'promo-video.mp4',
    type: 'video',
    url: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=400&auto=format&fit=crop',
    size: 15400000,
    createdAt: '2024-03-08T16:45:00Z',
    mimeType: 'video/mp4'
  },
  {
    id: '5',
    name: 'team-photo.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&auto=format&fit=crop',
    size: 3200000,
    dimensions: '2400x1600',
    createdAt: '2024-03-05T11:20:00Z',
    mimeType: 'image/jpeg'
  },
  {
    id: '6',
    name: 'background-pattern.svg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2000&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=400&auto=format&fit=crop',
    size: 120000,
    dimensions: '800x800',
    createdAt: '2024-03-01T08:00:00Z',
    mimeType: 'image/svg+xml'
  }
];

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
