export interface PaymentHistory {
  id: string;
  module: string;
  paymentable_type: string;
  paymentable_id: string;
  payer_type: string;
  payer_id: string;
  payment_id: string | null;
  method_id: string | null;
  payment_method: string | null;
  status: string;
  data: any | null;
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
