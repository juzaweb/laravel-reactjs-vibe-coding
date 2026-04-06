export interface Page {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  template: string | null;
  status: string;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface PageFormData {
  title: string;
  slug?: string;
  description?: string;
  content?: string;
  template?: string;
  status: string;
  locale: string;
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
