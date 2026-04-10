export interface SubscriptionHistory {
  id: string

  amount: number
  agreement_id: string
  end_date: string
  status: string
  created_at: string
  updated_at: string
  plan?: {
    id: string
    name: string
  }
  method?: {
    id: string
    name: string
  }
}
