import { useState } from 'react';
import { useOrdersStore } from '@/stores/orders';
import { useCouriersStore } from '@/stores/couriers';
import { useDeliveriesStore } from '@/stores/deliveries';

export default function AssignCourierForm() {
  const ordersStore = useOrdersStore();
  const couriersStore = useCouriersStore();
  const deliveriesStore = useDeliveriesStore();

  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedCourierId, setSelectedCourierId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const pendingOrders = ordersStore.orders.filter(
    (o) => o.status === 'pending' || o.status === 'PENDING'
  );

  const availableCouriers = couriersStore.couriers.filter(
    (c) => c.status === 'available'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !selectedCourierId) return;

    // BUG: submitting is set but never checked — button isn't disabled
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await deliveriesStore.assignCourier(selectedOrderId, selectedCourierId);
      setSuccess('Courier assigned successfully!');
      setSelectedOrderId('');
      setSelectedCourierId('');
      ordersStore.fetchOrders();
    } catch (err: any) {
      setError(deliveriesStore.error || 'Failed to assign courier');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h3 className="card-title">Assign Courier</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Order</label>
          <select
            className="form-select"
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            required
          >
            <option value="">Select an order...</option>
            {pendingOrders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.trackingCode} — {order.deliveryAddress}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Courier</label>
          <select
            className="form-select"
            value={selectedCourierId}
            onChange={(e) => setSelectedCourierId(e.target.value)}
            required
          >
            <option value="">Select a courier...</option>
            {availableCouriers.map((courier) => (
              <option key={courier.id} value={courier.id}>
                {courier.name} ({courier.vehicle})
              </option>
            ))}
          </select>
        </div>

        {/* BUG: Button should be disabled while submitting but it's not */}
        <button type="submit" className="btn btn-primary">
          {submitting ? 'Assigning...' : 'Assign Courier'}
        </button>
        {/* FIXME: Add disabled={submitting} to prevent double-submit */}
      </form>

      {error && <div className="error" style={{ marginTop: '1rem' }}>{error}</div>}
      {success && (
        <div style={{ marginTop: '1rem', color: '#155724', background: '#d4edda', padding: '0.75rem', borderRadius: '4px' }}>
          {success}
        </div>
      )}
    </div>
  );
}
