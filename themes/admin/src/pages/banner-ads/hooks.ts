import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../utils/axiosClient';
import type { BannerAd, BannerAdFormData, PaginatedResponse, SingleResponse } from './types';

export const useBannerAds = (page: number = 1, limit: number = 10, keyword: string = '') => {
  return useQuery({
    queryKey: ['banner-ads', { page, limit, keyword }],
    queryFn: async () => {
      const response = await axiosClient.get<PaginatedResponse<BannerAd>>('/v1/banner-ads', {
        params: { page, limit, keyword }
      });
      return response.data;
    },
  });
};

export const useBulkBannerAds = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { ids: string[], action: string }) => {
      const response = await axiosClient.post('/v1/banner-ads/bulk', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banner-ads'] });
    },
  });
};

export const useBannerAd = (id: string) => {
  return useQuery({
    queryKey: ['banner-ads', id],
    queryFn: async () => {
      const response = await axiosClient.get<SingleResponse<BannerAd>>(`/v1/banner-ads/${id}`);
      return response.data.data;
    },
    enabled: !!id && id !== 'create',
  });
};

export const useCreateBannerAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: BannerAdFormData) => {
      const response = await axiosClient.post<SingleResponse<BannerAd>>('/v1/banner-ads', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banner-ads'] });
    },
  });
};

export const useUpdateBannerAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BannerAdFormData }) => {
      const response = await axiosClient.put<SingleResponse<BannerAd>>(`/v1/banner-ads/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['banner-ads'] });
      queryClient.invalidateQueries({ queryKey: ['banner-ads', variables.id] });
    },
  });
};

export const useDeleteBannerAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.delete(`/v1/banner-ads/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banner-ads'] });
    },
  });
};
