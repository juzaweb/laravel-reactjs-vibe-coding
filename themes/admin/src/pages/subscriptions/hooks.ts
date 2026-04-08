import { useQuery } from '@tanstack/react-query'
import axiosClient from '../../utils/axiosClient'
import type { PaginatedData } from '../../types'
import type { Subscription } from './types'

export const useSubscriptions = (page: number = 1, limit: number = 10) => {
  return useQuery<PaginatedData<Subscription>>({
    queryKey: ['subscriptions', page, limit],
    queryFn: async () => {
      const response = await axiosClient.get('/api/v1/subscription/subscriptions', {
        params: { page, limit }
      })
      return response.data
    }
  })
}
