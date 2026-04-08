import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../utils/axiosClient';
import type { Menu, MenuFormData, PaginatedResponse, SingleResponse } from './types';

export const useMenus = (page: number = 1, limit: number = 100, keyword: string = '') => {
  return useQuery({
    queryKey: ['menus', { page, limit, keyword }],
    queryFn: async () => {
      const response = await axiosClient.get<PaginatedResponse<Menu>>('/v1/menus', {
        params: { page, limit, keyword }
      });
      return response.data;
    },
  });
};

export const useMenu = (id: string) => {
  return useQuery({
    queryKey: ['menus', id],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await axiosClient.get<SingleResponse<Menu & { items: any[] }>>(`/v1/menus/${id}`);
      return response.data.data;
    },
    enabled: !!id && id !== 'new',
  });
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: MenuFormData) => {
      const response = await axiosClient.post<SingleResponse<Menu>>('/v1/menus', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
};

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MenuFormData }) => {
      const response = await axiosClient.put<SingleResponse<Menu>>(`/v1/menus/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
      queryClient.invalidateQueries({ queryKey: ['menus', variables.id] });
    },
  });
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.delete(`/v1/menus/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
};
