import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../utils/axiosClient';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { fetchSettings as fetchGlobalSettings } from '../../store/settingSlice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchSettings = async (): Promise<any> => {
  const response = await axiosClient.get('/v1/settings/configs');
  return response.data?.data || {};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateSettings = async (data: Record<string, any>): Promise<any> => {
  // Use the bulk update endpoint
  const response = await axiosClient.put('/v1/settings', data);
  return response.data?.data || null;
};

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings_form'],
    queryFn: fetchSettings,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings_form'] });
      dispatch(fetchGlobalSettings());
    },
  });
};
