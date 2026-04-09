import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../utils/axiosClient';
import type { Language, LanguageFormData, PaginatedResponse, SingleResponse } from './types';

export const useLanguages = (page: number = 1, limit: number = 10, keyword: string = '') => {
  return useQuery({
    queryKey: ['languages', { page, limit, keyword }],
    queryFn: async () => {
      const response = await axiosClient.get<PaginatedResponse<Language>>('/v1/languages', {
        params: { page, limit, keyword }
      });
      return response.data;
    },
  });
};

export const useBulkLanguages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { ids: string[], action: string }) => {
      const response = await axiosClient.post('/v1/languages/bulk', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    },
  });
};

export const useLanguage = (id: string) => {
  return useQuery({
    queryKey: ['languages', id],
    queryFn: async () => {
      const response = await axiosClient.get<SingleResponse<Language>>(`/v1/languages/${id}`);
      return response.data.data;
    },
    enabled: !!id && id !== 'create',
  });
};

export const useCreateLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LanguageFormData) => {
      const response = await axiosClient.post<SingleResponse<Language>>('/v1/languages', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    },
  });
};

export const useUpdateLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LanguageFormData }) => {
      const response = await axiosClient.put<SingleResponse<Language>>(`/v1/languages/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      queryClient.invalidateQueries({ queryKey: ['languages', variables.id] });
    },
  });
};

export const useLocales = () => {
  return useQuery({
    queryKey: ['locales'],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: { code: string; name: string }[] }>('/v1/locales');
      return response.data.data;
    },
  });
};

export const useDeleteLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.delete(`/v1/languages/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    },
  });
};
