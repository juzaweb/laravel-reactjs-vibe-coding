import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../utils/axiosClient';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchGlobalSettings = async (): Promise<any> => {
  const response = await axiosClient.get('/v1/app/settings');
  return response.data?.data || null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchSettings = async (): Promise<any> => {
  const response = await axiosClient.get('/v1/settings');
  return response.data?.data || null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateSettings = async (data: Record<string, any>): Promise<any> => {
  const response = await axiosClient.put('/v1/settings', data);
  return response.data?.data || null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendTestEmail = async (data: Record<string, any>): Promise<any> => {
  const response = await axiosClient.post('/v1/settings/test-email', data);
  return response.data;
};

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: fetchGlobalSettings,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

export const useSendTestEmail = () => {
  return useMutation({
    mutationFn: sendTestEmail,
  });
};
