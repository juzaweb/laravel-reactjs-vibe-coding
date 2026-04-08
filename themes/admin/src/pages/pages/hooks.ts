import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../utils/axiosClient';
import type { Page, PageFormData, PaginatedResponse, SingleResponse } from './types';

export const usePages = (page: number = 1, limit: number = 10, keyword: string = '') => {
  return useQuery({
    queryKey: ['pages', { page, limit, keyword }],
    queryFn: async () => {
      const response = await axiosClient.get<PaginatedResponse<Page>>('/v1/pages', {
        params: { page, limit, keyword }
      });
      return response.data;
    },
  });
};

export const usePageTemplates = () => {
  return useQuery({
    queryKey: ['pages', 'templates'],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: { key: string; label: string }[] }>('/v1/pages/templates');
      return response.data.data;
    },
  });
};

export const useBulkPages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { ids: string[], action: string }) => {
      const response = await axiosClient.post('/v1/pages/bulk', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};

export const usePage = (id: string) => {
  return useQuery({
    queryKey: ['pages', id],
    queryFn: async () => {
      const response = await axiosClient.get<SingleResponse<Page>>(`/v1/pages/${id}`);
      return response.data.data;
    },
    enabled: !!id && id !== 'create',
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PageFormData) => {
      const response = await axiosClient.post<SingleResponse<Page>>('/v1/pages', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PageFormData }) => {
      const response = await axiosClient.put<SingleResponse<Page>>(`/v1/pages/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['pages', variables.id] });
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.delete(`/v1/pages/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};
