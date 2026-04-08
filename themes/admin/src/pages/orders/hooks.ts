import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../utils/axiosClient';
import type { Order, PaginatedResponse } from './types';

const fetchOrders = async (page: number, limit: number): Promise<PaginatedResponse<Order>> => {
  const response = await axiosClient.get(`/v1/orders?page=${page}&limit=${limit}`);
  return response.data;
};

export const useOrders = (page: number, limit: number) => {
  return useQuery({
    queryKey: ['orders', page, limit],
    queryFn: () => fetchOrders(page, limit),
  });
};

const fetchOrder = async (id: string): Promise<{ data: Order; success: boolean }> => {
  const response = await axiosClient.get(`/v1/orders/${id}`);
  return response.data;
};

export const useOrder = (id?: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id!),
    enabled: !!id,
  });
};
