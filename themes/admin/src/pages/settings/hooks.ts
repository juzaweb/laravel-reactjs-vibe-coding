import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../utils/axiosClient';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { fetchSettings as fetchGlobalSettings } from '../../store/settingSlice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchSettings = async (): Promise<any> => {
  const response = await axiosClient.get('/v1/settings?limit=100');
  const data = response.data?.data || [];
  // Convert array of {code, value} to object {code: value}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.reduce((acc: any, item: any) => {
    acc[item.code] = item.value;
    return acc;
  }, {});
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateSettings = async (data: Record<string, any>): Promise<any> => {
  // We need the setting IDs to update them.
  // We fetch the current settings to map code to ID.
  const settingsResponse = await axiosClient.get('/v1/settings?limit=100');
  const currentSettings = settingsResponse.data?.data || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const codeToIdMap = currentSettings.reduce((acc: any, item: any) => {
    acc[item.code] = item.id;
    return acc;
  }, {});

  // Update existing settings one by one using the existing update API
  const promises = Object.entries(data).map(([code, value]) => {
    const id = codeToIdMap[code];
    if (id) {
      return axiosClient.put(`/v1/settings/${id}`, { code, value });
    }
    return Promise.resolve();
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
