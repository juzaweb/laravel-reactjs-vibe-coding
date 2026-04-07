import axiosClient from '../../utils/axiosClient';
import type { ApiResponse, PaginatedData } from '../../types';
import type { NotificationData } from './types';

export const notificationService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getNotifications: async (params?: Record<string, any>) => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<NotificationData>>>('/v1/notifications', { params });
    return response.data;
  },
  getNotification: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<NotificationData>>(`/v1/notifications/${id}`);
    return response.data;
  },
  markAsRead: async (id: string) => {
    const response = await axiosClient.put<ApiResponse<NotificationData>>(`/v1/notifications/${id}/read`);
    return response.data;
  },
};
