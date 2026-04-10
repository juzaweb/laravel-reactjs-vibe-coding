export interface BannerAd {
  id: string;
  name: string;
  active: boolean;
  url: string | null;
  size: string | null;
  type: string;
  views: number;
  click: number;
  body: string | null;
  position: string | null;
  created_at: string;
  updated_at: string;
}

export interface BannerAdFormData {
  name: string;
  type: string;
  body_image?: string;
  body_html?: string;
  url?: string;
  active: number;
  position: string;
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
