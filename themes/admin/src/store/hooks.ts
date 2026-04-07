import { useDispatch, useSelector, useStore } from 'react-redux'
import type { AppDispatch, RootState } from './index'
import { store } from './index'
import { useCallback } from 'react';
import axiosClient from '../utils/axiosClient';
import type { ApiResponse, PaginatedData, NotificationData } from '../types';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<typeof store>()

export const usePermissions = () => {
  const user = useAppSelector((state) => state.auth.user);

  const hasPermission = useCallback((permission: string) => {
    if (!user) return false;

    // Check if user has all permissions
    if (user.has_all_permissions) {
      return true;
    }

    // Check specific permission
    if (user.permissions && Array.isArray(user.permissions)) {
      return user.permissions.includes(permission);
    }

    return false;
  }, [user]);

  return { hasPermission, user };
};

export const notificationService = {
  getNotifications: async () => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<NotificationData>>>('/v1/notifications');
    return response.data;
  },
};
