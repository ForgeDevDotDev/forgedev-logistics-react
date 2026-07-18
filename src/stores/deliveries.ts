import { create } from 'zustand';
import { deliveriesApi } from '@/api';
import type { Delivery } from '@/vite-env.d';

interface DeliveriesState {
  deliveries: Delivery[];
  currentDelivery: Delivery | null;
  loading: boolean;
  error: string | null;
  fetchDeliveries: (params?: { status?: string; courierId?: string }) => Promise<void>;
  assignCourier: (orderId: string, courierId: string) => Promise<Delivery>;
  updateDeliveryStatus: (id: string, status: string, note?: string) => Promise<Delivery>;
  getTrackingInfo: (code: string) => Promise<any>;
}

export const useDeliveriesStore = create<DeliveriesState>((set) => ({
  deliveries: [],
  currentDelivery: null,
  loading: false,
  error: null,

  fetchDeliveries: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await deliveriesApi.list(params);
      set({ deliveries: res.data.data });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch deliveries' });
    } finally {
      set({ loading: false });
    }
  },

  assignCourier: async (orderId, courierId) => {
    set({ loading: true, error: null });
    try {
      const res = await deliveriesApi.assign(orderId, courierId);
      set((state) => ({ deliveries: [res.data, ...state.deliveries] }));
      return res.data;
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to assign courier' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateDeliveryStatus: async (id, status, note) => {
    set({ loading: true, error: null });
    try {
      const res = await deliveriesApi.updateStatus(id, status, note);
      set((state) => ({
        deliveries: state.deliveries.map((d) => (d.id === id ? res.data : d)),
      }));
      return res.data;
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to update status' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  getTrackingInfo: async (code) => {
    set({ loading: true, error: null });
    try {
      const res = await deliveriesApi.getByTrackingCode(code);
      set({ currentDelivery: res.data });
      return res.data;
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch tracking info' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
