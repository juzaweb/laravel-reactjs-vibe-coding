import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosClient from '../../utils/axiosClient'
import type { PaginatedResponse, SingleResponse, VideoAd, VideoAdFormData } from './types'

const API_URL = '/v1/video-ads'

export const useVideoAds = (page = 1, limit = 10, keyword = '') => {
  return useQuery({
    queryKey: ['video-ads', page, limit, keyword],
    queryFn: async () => {
      const { data } = await axiosClient.get<PaginatedResponse<VideoAd>>(API_URL, {
        params: { page, limit, keyword }
      })
      return data
    }
  })
}

export const useVideoAd = (id?: string) => {
  return useQuery({
    queryKey: ['video-ads', id],
    queryFn: async () => {
      if (!id) return null
      const { data } = await axiosClient.get<SingleResponse<VideoAd>>(`${API_URL}/${id}`)
      return data.data
    },
    enabled: !!id
  })
}

export const useCreateVideoAd = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: VideoAdFormData) => {
      const { data } = await axiosClient.post<SingleResponse<VideoAd>>(API_URL, formData)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-ads'] })
    }
  })
}

export const useUpdateVideoAd = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: VideoAdFormData) => {
      const { data } = await axiosClient.put<SingleResponse<VideoAd>>(`${API_URL}/${id}`, formData)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-ads'] })
      queryClient.invalidateQueries({ queryKey: ['video-ads', id] })
    }
  })
}

export const useDeleteVideoAd = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.delete(`${API_URL}/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-ads'] })
    }
  })
}

export const useBulkVideoAds = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ids, action }: { ids: string[], action: string }) => {
      await axiosClient.post(`${API_URL}/bulk`, { ids, action })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-ads'] })
    }
  })
}
