import { create } from 'zustand';
import { couriersApi } from '@/api';
import type { Courier } from '@/vite-env.d';

interface CouriersState {
  couriers: Courier[];
  currentCourier: Courier | null;
  loading: boolean;
  error: string | null;
  fetchCouriers: (params?: { status?: string }) => Promise<void>;
  fetchCourier: (id: string) => Promise<void>;
  createCourier: (data: any) => Promise<Courier>;
  updateCourier: (id: string, data: any) => Promise<Courier>;
}

export const useCouriersStore = create<CouriersState>((set) => ({
  couriers: [],
  currentCourier: null,
  loading: false,
  error: null,

  fetchCouriers: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await couriersApi.list(params);
      set({ couriers: res.data.data });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch couriers' });
    } finally {
      set({ loading: false });
    }
  },

  fetchCourier: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await couriersApi.get(id);
      set({ currentCourier: res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch courier' });
    } finally {
      set({ loading: false });
    }
  },

  createCourier: async (data) => {
    set({ loading: true });
    try {
      const res = await couriersApi.create(data);
      set((state) => ({ couriers: [...state.couriers, res.data] }));
      return res.data;
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to create courier' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateCourier: async (id, data) => {
    try {
      const res = await couriersApi.update(id, data);
      set((state) => ({
        couriers: state.couriers.map((c) => (c.id === id ? res.data : c)),
        currentCourier: state.currentCourier?.id === id ? res.data : state.currentCourier,
      }));
      return res.data;
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to update courier' });
      throw err;
    }
  },
}));
