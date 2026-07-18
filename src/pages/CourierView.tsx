import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCouriersStore } from '@/stores/couriers';
import { useDeliveriesStore } from '@/stores/deliveries';
import CourierCard from '@/components/CourierCard';
import OrderCard from '@/components/OrderCard';
import type { Order } from '@/vite-env.d';

export default function CourierView() {
  const navigate = useNavigate();
  const params = useParams();
  const couriersStore = useCouriersStore();
  const deliveriesStore = useDeliveriesStore();

  const [selectedCourierId, setSelectedCourierId] = useState(params.id || '');
  const [statusUpdates, setStatusUpdates] = useState<Record<string, string>>({});
  const [statusNotes, setStatusNotes] = useState<Record<string, string>>({});

  const loadCourierData = async () => {
    if (selectedCourierId) {
      await couriersStore.fetchCourier(selectedCourierId);
    }
  };

  const updateStatus = async (orderId: string) => {
    const status = statusUpdates[orderId];
    if (!status) return;

    const note = statusNotes[orderId] || undefined;
    const delivery = deliveriesStore.deliveries.find((d) => d.orderId === orderId);

    if (delivery) {
      await deliveriesStore.updateDeliveryStatus(delivery.id, status, note);
      await loadCourierData();
    } else {
      // FIXME: If delivery doesn't exist in the store, we can't update
      // Should fetch deliveries for this courier first
      console.warn('Delivery not found for order', orderId);
    }

    setStatusUpdates((prev) => ({ ...prev, [orderId]: '' }));
    setStatusNotes((prev) => ({ ...prev, [orderId]: '' }));
  };

  useEffect(() => {
    couriersStore.fetchCouriers();
  }, []);

  useEffect(() => {
    if (selectedCourierId) {
      loadCourierData();
    }
  }, [selectedCourierId]);

  const goToOrder = (order: Order) => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Courier Dashboard</h1>

      <div className="filter-bar">
        <select
          value={selectedCourierId}
          onChange={(e) => setSelectedCourierId(e.target.value)}
        >
          <option value="">Select a courier...</option>
          {couriersStore.couriers.map((courier) => (
            <option key={courier.id} value={courier.id}>
              {courier.name} — {courier.status}
            </option>
          ))}
        </select>
      </div>

      {!selectedCourierId && <div className="loading">Please select a courier above.</div>}
      {couriersStore.loading && <div className="loading">Loading courier data...</div>}

      {couriersStore.currentCourier && (
        <div>
          <CourierCard courier={couriersStore.currentCourier} />

          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Assigned Deliveries</h2>
          {(!couriersStore.currentCourier.orders || couriersStore.currentCourier.orders.length === 0) && (
            <div className="loading">No assigned deliveries</div>
          )}

          {couriersStore.currentCourier.orders?.map((order) => (
            <div key={order.id}>
              <OrderCard order={order} onClick={goToOrder} />
              <div style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '4px', marginBottom: '1rem' }}>
                <label className="form-label">Update Status:</label>
                <select
                  className="form-select"
                  value={statusUpdates[order.id] || ''}
                  onChange={(e) => setStatusUpdates((prev) => ({ ...prev, [order.id]: e.target.value }))}
                >
                  <option value="">Select status...</option>
                  <option value="PICKED_UP">Picked Up</option>
                  <option value="in_transit">In Transit</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="failed">Failed</option>
                </select>
                <input
                  className="form-input"
                  style={{ marginTop: '0.5rem' }}
                  placeholder="Note (optional)"
                  value={statusNotes[order.id] || ''}
                  onChange={(e) => setStatusNotes((prev) => ({ ...prev, [order.id]: e.target.value }))}
                />
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '0.5rem' }}
                  onClick={() => updateStatus(order.id)}
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
