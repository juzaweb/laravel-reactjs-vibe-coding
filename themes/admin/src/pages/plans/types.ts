import type { PaginatedData } from '../../types'

export interface PlanFeature {
  name: string
  value: string | null
}

export interface Plan {
  id: string
  name: string
  price: number | null
  is_free: boolean
  duration: number | null
  duration_unit: 'day' | 'week' | 'month' | 'year' | null
  active: boolean
  module: string | null
  features: PlanFeature[]
  created_at?: string
  updated_at?: string
}

export interface PlanListResponse {
  data: Plan[];
  meta: Omit<PaginatedData<any>, 'data'>;
}

export interface PlanResponse {
  data: Plan
}
