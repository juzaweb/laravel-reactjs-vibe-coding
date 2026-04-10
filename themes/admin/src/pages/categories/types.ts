export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormData {
  locale?: string;
  name: string;
  slug?: string;
  description?: string;
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
