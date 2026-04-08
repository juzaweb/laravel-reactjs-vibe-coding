import { useQuery } from '@tanstack/react-query'
import axiosClient from '../../utils/axiosClient'
import type { PaginatedData } from '../../types'
import type { SubscriptionHistory } from './types'

export const useSubscriptionHistories = (page: number = 1, limit: number = 10) => {
  return useQuery<PaginatedData<SubscriptionHistory>>({
    queryKey: ['subscription-histories', page, limit],
    queryFn: async () => {
      const response = await axiosClient.get('/api/v1/subscription/histories', {
        params: { page, limit }
      })
      return response.data
    }
  })
}
