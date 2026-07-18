/// <reference types="vite/client" />

// Domain types
export interface Order {
  id: string;
  trackingCode: string;
  status: string;
  customerId: string;
  customer?: Customer;
  courierId?: string | null;
  courier?: Courier | null;
  pickupAddress: string;
  deliveryAddress: string;
  pickupLatitude?: number | null;
  pickupLongitude?: number | null;
  deliveryLatitude?: number | null;
  deliveryLongitude?: number | null;
  weight?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  statusHistory?: StatusHistory[];
  delivery?: Delivery | null;
  route?: Route | null;
  notifications?: Notification[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface Courier {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  status: string;
  company?: string | null;
  city?: string | null;
  orders?: Order[];
}

export interface Delivery {
  id: string;
  orderId: string;
  courierId: string;
  status: string;
  pickupTime?: string | null;
  deliveryTime?: string | null;
  estimatedTime?: string | null;
  actualTime?: string | null;
  notes?: string | null;
}

export interface Route {
  id: string;
  orderId: string;
  courierId?: string | null;
  waypoints: string;
  distance?: number | null;
  estimatedDuration?: number | null;
  actualDuration?: number | null;
  status: string;
}

export interface Notification {
  id: string;
  orderId: string;
  customerId: string;
  type: string;
  message: string;
  status: string;
  sentAt?: string | null;
  createdAt: string;
}

export interface StatusHistory {
  id: string;
  orderId: string;
  status: string;
  previousStatus?: string | null;
  changedBy?: string | null;
  note?: string | null;
  createdAt: string;
}
