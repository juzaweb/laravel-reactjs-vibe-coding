import axiosClient from '../../utils/axiosClient';
import type { MediaItem, PaginationMeta, PaginationLinks } from '../../pages/media/types';

export interface GetMediaParams {
  page?: number;
  limit?: number;
  keyword?: string;
  folder_id?: number;
  type?: string;
}

export interface MediaResponse {
  data: MediaItem[];
  meta: PaginationMeta;
  links: PaginationLinks;
  success: boolean;
}

export const fetchMedia = async (params: GetMediaParams = {}): Promise<MediaResponse> => {
  const { data } = await axiosClient.get('/v1/media', { params });
  return data;
};

export const uploadMedia = async (files: FileList | File[], folderId?: number): Promise<MediaItem[]> => {
  const fileArray = Array.from(files);
  const uploadPromises = fileArray.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId !== undefined) {
      formData.append('folder_id', folderId.toString());
    }

    // Axios will automatically set the correct Content-Type (multipart/form-data) with the boundary when a FormData object is passed.
    const { data } = await axiosClient.post<{ data: MediaItem }>('/v1/media', formData);
    return data.data;
  });

  return Promise.all(uploadPromises);
};

export const deleteMedia = async (id: string | number): Promise<void> => {
  await axiosClient.delete(`/v1/media/${id}`);
};

export const updateMedia = async (id: string | number, payload: { name?: string; folder_id?: number }): Promise<MediaItem> => {
  const { data } = await axiosClient.put<{ data: MediaItem }>(`/v1/media/${id}`, payload);
  return data.data;
};
