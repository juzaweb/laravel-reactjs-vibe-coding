import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../utils/axiosClient';
import type { MediaItem, PaginatedResponse, SingleResponse } from './types';

export const useMedia = (page: number = 1, limit: number = 15, keyword: string = '', type: string = 'all') => {
  return useQuery({
    queryKey: ['media', { page, limit, keyword, type }],
    queryFn: async () => {
      const response = await axiosClient.get<PaginatedResponse<MediaItem>>('/v1/media', {
        params: {
          page,
          limit,
          keyword: keyword || undefined,
          file_type: type === 'all' ? undefined : type
        }
      });
      return response.data;
    },
  });
};

export const useMediaItem = (id: string) => {
  return useQuery({
    queryKey: ['media', id],
    queryFn: async () => {
      const response = await axiosClient.get<SingleResponse<MediaItem>>(`/v1/media/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ files, folderId }: { files: FileList | File[], folderId?: number }) => {
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        if (folderId !== undefined) {
          formData.append('folder_id', folderId.toString());
        }

        const response = await axiosClient.post<SingleResponse<MediaItem>>('/v1/media', formData);
        return response.data.data;
      });

      return Promise.all(uploadPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: { name?: string; folder_id?: number } }) => {
      const response = await axiosClient.put<SingleResponse<MediaItem>>(`/v1/media/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media', variables.id.toString()] });
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await axiosClient.delete(`/v1/media/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
};
