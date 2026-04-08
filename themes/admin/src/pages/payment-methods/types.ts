export interface PaymentDriver {
  name: string;
  label: string;
  configs: Record<string, string> | [];
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string | null;
  driver: string;
  active: boolean;
  locale?: string;
  config?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethodFormData {
  name: string;
  description?: string;
  driver: string;
  active: boolean;
  locale?: string;
  config?: Record<string, string>;
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
