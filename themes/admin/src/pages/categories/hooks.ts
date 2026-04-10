import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../utils/axiosClient';
import type { Category, CategoryFormData, PaginatedResponse, SingleResponse } from './types';

export const useCategories = (page: number = 1, limit: number = 10, keyword: string = '') => {
  return useQuery({
    queryKey: ['categories', { page, limit, keyword }],
    queryFn: async () => {
      const response = await axiosClient.get<PaginatedResponse<Category>>('/v1/categories', {
        params: { page, limit, keyword }
      });
      return response.data;
    },
  });
};

export const useBulkCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { ids: string[], action: string }) => {
      const response = await axiosClient.post('/v1/categories/bulk', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useCategory = (id: string, locale?: string) => {
  return useQuery({
    queryKey: ['categories', id, locale],
    queryFn: async () => {
      const response = await axiosClient.get<SingleResponse<Category>>(`/v1/categories/${id}`, {
        params: { locale }
      });
      return response.data.data;
    },
    enabled: !!id && id !== 'create',
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const response = await axiosClient.post<SingleResponse<Category>>('/v1/categories', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryFormData }) => {
      const response = await axiosClient.put<SingleResponse<Category>>(`/v1/categories/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', variables.id] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.delete(`/v1/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
