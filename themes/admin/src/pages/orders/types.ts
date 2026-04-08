export interface Order {
  id: string;
  code: string;
  address: string | null;
  country_code: string | null;
  quantity: number;
  total_price: number;
  total: number;
  payment_method_id: number | null;
  payment_method_name: string;
  note: string | null;
  payment_status: string;
  delivery_status: string;
  module: string | null;
  created_at: string;
  updated_at: string;
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
