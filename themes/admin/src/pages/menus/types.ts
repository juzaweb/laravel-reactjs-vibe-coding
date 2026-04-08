export interface Menu {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id?: string;
  menu_id?: string;
  parent_id?: string | null;
  menuable_type?: string | null;
  menuable_id?: string | null;
  link?: string | null;
  icon?: string | null;
  target?: string;
  display_order?: number;
  box_key?: string;
  label?: string | null;
  locale?: string;
  children?: MenuItem[];
  // Frontend specific
  is_custom?: boolean;
  depth?: number;
}

export interface MenuFormData {
  name: string;
  content?: string;
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
