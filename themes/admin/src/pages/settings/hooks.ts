import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../utils/axiosClient';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { fetchSettings as fetchGlobalSettings } from '../../store/settingSlice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchSettings = async (): Promise<any> => {
  const response = await axiosClient.get('/v1/settings?limit=100');
  return response.data?.data || {};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateSettings = async (data: Record<string, any>): Promise<any> => {
  // Now that update works by code, we can just send parallel requests
  const promises = Object.entries(data).map(([code, value]) => {
    return axiosClient.put(`/v1/settings/${code}`, { code, value });
  });

  await Promise.all(promises);
  return data;
};

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      dispatch(fetchGlobalSettings());
    },
  });
};
