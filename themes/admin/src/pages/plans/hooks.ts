import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosClient from '../../utils/axiosClient'
import type { Plan, PlanListResponse, PlanResponse } from './types'
export interface BulkActionResponse {
  message: string;
}

export const usePlans = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['plans', params],
    queryFn: async () => {
      const response = await axiosClient.get<PlanListResponse>('/v1/subscription/plans', { params })
      return response.data
    },
  })
}

export const usePlan = (id?: string) => {
  return useQuery({
    queryKey: ['plans', id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosClient.get<PlanResponse>(`/v1/subscription/plans/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export const useCreatePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Plan>) => {
      const response = await axiosClient.post<PlanResponse>('/v1/subscription/plans', data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
    },
  })
}

export const useUpdatePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Plan> }) => {
      const response = await axiosClient.put<PlanResponse>(`/v1/subscription/plans/${id}`, data)
      return response.data.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      queryClient.invalidateQueries({ queryKey: ['plans', id] })
    },
  })
}

export const useDeletePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.delete(`/v1/subscription/plans/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
    },
  })
}

export const useBulkPlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ ids, action }: { ids: string[]; action: string }) => {
      const response = await axiosClient.post<BulkActionResponse>('/v1/subscription/plans/bulk', {
        ids,
        action,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
    },
  })
}
