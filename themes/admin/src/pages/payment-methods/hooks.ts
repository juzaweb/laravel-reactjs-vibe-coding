import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../utils/axiosClient';
import type { PaymentMethod, PaymentMethodFormData, PaginatedResponse, SingleResponse } from './types';

export const usePaymentMethods = (page: number = 1, limit: number = 10, keyword: string = '') => {
  return useQuery({
    queryKey: ['payment-methods', { page, limit, keyword }],
    queryFn: async () => {
      const response = await axiosClient.get<PaginatedResponse<PaymentMethod>>('/v1/payment-methods', {
        params: { page, limit, keyword }
      });
      return response.data;
    },
  });
};

export const useBulkPaymentMethods = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { ids: string[], action: string }) => {
      const response = await axiosClient.post('/v1/payment-methods/bulk', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};

export const usePaymentMethod = (id: string) => {
  return useQuery({
    queryKey: ['payment-methods', id],
    queryFn: async () => {
      const response = await axiosClient.get<SingleResponse<PaymentMethod>>(`/v1/payment-methods/${id}`);
      return response.data.data;
    },
    enabled: !!id && id !== 'create',
  });
};

export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PaymentMethodFormData) => {
      const response = await axiosClient.post<SingleResponse<PaymentMethod>>('/v1/payment-methods', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};

export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PaymentMethodFormData }) => {
      const response = await axiosClient.put<SingleResponse<PaymentMethod>>(`/v1/payment-methods/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      queryClient.invalidateQueries({ queryKey: ['payment-methods', variables.id] });
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.delete(`/v1/payment-methods/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};
