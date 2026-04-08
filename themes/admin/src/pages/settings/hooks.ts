import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../utils/axiosClient';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchSettings = async (): Promise<any> => {
  const response = await axiosClient.get('/v1/app/settings');
  return response.data?.data || null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateSettings = async (data: Record<string, any>): Promise<any> => {
  const response = await axiosClient.post('/v1/app/settings', data);
  return response.data?.data || null;
};

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
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
