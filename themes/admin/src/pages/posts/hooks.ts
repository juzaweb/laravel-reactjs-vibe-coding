import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../utils/axiosClient';
import type { Post, PostFormData, PaginatedResponse, SingleResponse } from './types';

export const usePosts = (page: number = 1, limit: number = 10, keyword: string = '') => {
  return useQuery({
    queryKey: ['posts', { page, limit, keyword }],
    queryFn: async () => {
      const response = await axiosClient.get<PaginatedResponse<Post>>('/v1/posts', {
        params: { page, limit, keyword }
      });
      return response.data;
    },
  });
};

export const useBulkPosts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { ids: string[], action: string }) => {
      const response = await axiosClient.post('/v1/posts/bulk', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: async () => {
      const response = await axiosClient.get<SingleResponse<Post>>(`/v1/posts/${id}`);
      return response.data.data;
    },
    enabled: !!id && id !== 'create',
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PostFormData) => {
      const response = await axiosClient.post<SingleResponse<Post>>('/v1/posts', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PostFormData }) => {
      const response = await axiosClient.put<SingleResponse<Post>>(`/v1/posts/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', variables.id] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.delete(`/v1/posts/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
