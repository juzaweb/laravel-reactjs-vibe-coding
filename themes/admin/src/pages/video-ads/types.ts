export interface VideoAd {
  id: string;
  name: string;
  title: string;
  url: string;
  video: string;
  position: string;
  offset: number;
  options?: Record<string, any>;
  active: boolean;
  views: number;
  click: number;
  created_at?: string;
  updated_at?: string;
}

export interface VideoAdFormData {
  name: string;
  title: string;
  url: string;
  video: string;
  position: string;
  offset: number;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  success: boolean;
}

export interface SingleResponse<T> {
  data: T;
  success: boolean;
}
