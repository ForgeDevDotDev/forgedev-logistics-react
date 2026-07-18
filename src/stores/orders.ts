import { create } from 'zustand';
import { ordersApi } from '@/api';
import type { Order } from '@/vite-env.d';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  fetchOrders: (params?: { status?: string; customerId?: string; courierId?: string }) => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
  createOrder: (data: any) => Promise<Order>;
  updateOrder: (id: string, data: any) => Promise<Order>;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 20,

  fetchOrders: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await ordersApi.list({ ...params, page: get().page, limit: get().limit });
      set({ orders: res.data.data, total: res.data.total });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch orders' });
    } finally {
      set({ loading: false });
    }
  },

  fetchOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await ordersApi.get(id);
      set({ currentOrder: res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch order' });
    } finally {
      set({ loading: false });
    }
  },

  createOrder: async (data) => {
    set({ loading: true });
    try {
      const res = await ordersApi.create(data);
      set((state) => ({ orders: [res.data, ...state.orders] }));
      return res.data;
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to create order' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateOrder: async (id, data) => {
    try {
      const res = await ordersApi.update(id, data);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? res.data : o)),
        currentOrder: state.currentOrder?.id === id ? res.data : state.currentOrder,
      }));
      return res.data;
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to update order' });
      throw err;
    }
  },
}));
