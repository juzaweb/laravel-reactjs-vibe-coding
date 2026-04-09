export interface Language {
  id: string;
  code: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface LanguageFormData {
  code: string;
  name: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface SingleResponse<T> {
  data: T;
  success: boolean;
}
