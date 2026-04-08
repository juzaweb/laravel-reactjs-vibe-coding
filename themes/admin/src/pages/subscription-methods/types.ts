export interface SubscriptionMethod {
  id: string
  name: string
  description: string
  driver: string
  config: Record<string, any>
  active: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionMethodFormData {
  name: string
  description: string
  driver: string
  config: Record<string, any>
  active: boolean
}
