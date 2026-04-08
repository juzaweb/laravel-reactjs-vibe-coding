import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosClient from '../../utils/axiosClient'
import type { ApiResponse, PaginatedData } from '../../types'
import type { SubscriptionMethod, SubscriptionMethodFormData } from './types'
import toast from 'react-hot-toast'
import { isAxiosError } from 'axios'

const API_URL = '/v1/subscription/methods'

export const useSubscriptionMethods = (
  page: number = 1,
  limit: number = 10,
  keyword: string = '',
  locale: string = 'en',
) => {
  return useQuery({
    queryKey: ['subscription-methods', page, limit, keyword, locale],
    queryFn: async () => {
      const { data } = await axiosClient.get<ApiResponse<PaginatedData<SubscriptionMethod>>>(API_URL, {
        params: { page, limit, keyword, locale },
      })
      return data.data
    },
  })
}

export const useSubscriptionMethod = (id?: string, locale: string = 'en') => {
  return useQuery({
    queryKey: ['subscription-method', id, locale],
    queryFn: async () => {
      const { data } = await axiosClient.get<ApiResponse<SubscriptionMethod>>(`${API_URL}/${id}`, {
        params: { locale },
      })
      return data.data
    },
    enabled: !!id,
  })
}

export const useCreateSubscriptionMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: SubscriptionMethodFormData & { locale: string }) => {
      const { data } = await axiosClient.post<ApiResponse<SubscriptionMethod>>(API_URL, formData)
      return data
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Subscription method created successfully')
      queryClient.invalidateQueries({ queryKey: ['subscription-methods'] })
    },
    onError: (error) => {
      if (!isAxiosError(error) || error.response?.status !== 422) {
        toast.error('Failed to create subscription method')
      }
    },
  })
}

export const useUpdateSubscriptionMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SubscriptionMethodFormData & { locale: string } }) => {
      const response = await axiosClient.put<ApiResponse<SubscriptionMethod>>(`${API_URL}/${id}`, data)
      return response.data
    },
    onSuccess: (data, variables) => {
      toast.success(data.message || 'Subscription method updated successfully')
      queryClient.invalidateQueries({ queryKey: ['subscription-methods'] })
      queryClient.invalidateQueries({ queryKey: ['subscription-method', variables.id] })
    },
    onError: (error) => {
      if (!isAxiosError(error) || error.response?.status !== 422) {
        toast.error('Failed to update subscription method')
      }
    },
  })
}

export const useDeleteSubscriptionMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosClient.delete<ApiResponse<null>>(`${API_URL}/${id}`)
      return data
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Subscription method deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['subscription-methods'] })
    },
    onError: () => {
      toast.error('Failed to delete subscription method')
    },
  })
}
