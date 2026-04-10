export interface SubscriptionMethod {
  id: string
  name: string
  description: string
  driver: string
  config: Record<string, unknown>
  active: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionMethodFormData {
  name: string
  description: string
  driver: string
  config: Record<string, unknown>
  active: boolean
}

export interface SubscriptionDriverConfig {
  type: string
  label: string
  required?: boolean
  data?: Record<string, string>
}

export interface SubscriptionDriver {
  name: string
  label: string
  configs: Record<string, SubscriptionDriverConfig>
}
