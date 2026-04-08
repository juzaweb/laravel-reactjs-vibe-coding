import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../utils/axiosClient';
import type { PaymentHistory, PaginatedResponse } from './types';

const fetchPaymentHistories = async (page: number, limit: number): Promise<PaginatedResponse<PaymentHistory>> => {
  const response = await axiosClient.get(`/v1/payment-histories?page=${page}&limit=${limit}`);
  return response.data;
};

export const usePaymentHistories = (page: number, limit: number) => {
  return useQuery({
    queryKey: ['payment-histories', page, limit],
    queryFn: () => fetchPaymentHistories(page, limit),
  });
};
