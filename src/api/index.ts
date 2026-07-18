import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// FIXME: No auth interceptor yet
// TODO: Add request interceptor for auth tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Orders
export const ordersApi = {
  list: (params?: { status?: string; customerId?: string; courierId?: string; page?: number; limit?: number }) =>
    api.get('/orders', { params }),
  get: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  update: (id: string, data: any) => api.put(`/orders/${id}`, data),
  delete: (id: string) => api.delete(`/orders/${id}`),
};

// Couriers
export const couriersApi = {
  list: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/couriers', { params }),
  get: (id: string) => api.get(`/couriers/${id}`),
  create: (data: any) => api.post('/couriers', data),
  update: (id: string, data: any) => api.put(`/couriers/${id}`, data),
  delete: (id: string) => api.delete(`/couriers/${id}`),
};

// Deliveries
export const deliveriesApi = {
  list: (params?: { status?: string; courierId?: string }) =>
    api.get('/deliveries', { params }),
  get: (id: string) => api.get(`/deliveries/${id}`),
  assign: (orderId: string, courierId: string) =>
    api.post('/deliveries/assign', { orderId, courierId }),
  updateStatus: (id: string, status: string, note?: string) =>
    api.put(`/deliveries/${id}/status`, { status, note }),
  getByTrackingCode: (code: string) =>
    api.get(`/deliveries/tracking/${code}`),
};

// Routes
export const routesApi = {
  list: (params?: { courierId?: string; status?: string }) =>
    api.get('/routes', { params }),
  get: (id: string) => api.get(`/routes/${id}`),
  create: (data: any) => api.post('/routes', data),
  update: (id: string, data: any) => api.put(`/routes/${id}`, data),
  optimize: (id: string) => api.put(`/routes/${id}/optimize`),
  delete: (id: string) => api.delete(`/routes/${id}`),
};

// Notifications
export const notificationsApi = {
  list: (params?: { orderId?: string; customerId?: string; status?: string }) =>
    api.get('/notifications', { params }),
  send: (orderId: string, type: string, message: string) =>
    api.post('/notifications/send', { orderId, type, message }),
  get: (id: string) => api.get(`/notifications/${id}`),
};

// Tracking
export const trackingApi = {
  track: (code: string) => api.get(`/tracking/${code}`),
};

export default api;
