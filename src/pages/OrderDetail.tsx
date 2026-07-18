import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useOrdersStore } from '@/stores/orders';
import StatusBadge from '@/components/StatusBadge';
import TrackingTimeline from '@/components/TrackingTimeline';
import RouteMap from '@/components/RouteMap';

export default function OrderDetail() {
  const params = useParams();
  const ordersStore = useOrdersStore();

  useEffect(() => {
    if (params.id) {
      ordersStore.fetchOrder(params.id);
    }
  }, [params.id]);

  const order = ordersStore.currentOrder;

  const waypoints = useMemo(() => {
    if (!order?.route?.waypoints) return [];
    try {
      return JSON.parse(order.route.waypoints);
    } catch {
      return [];
    }
  }, [order]);

  if (!order && ordersStore.loading) {
    return <div className="loading">Loading order...</div>;
  }
  if (!order && ordersStore.error) {
    return <div className="error">{ordersStore.error}</div>;
  }
  if (!order) {
    return <div className="loading">Order not found.</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <span className="card-title">Order {order.trackingCode}</span>
          <StatusBadge status={order.status} />
        </div>
        <div className="order-info">
          <p><strong>From:</strong> {order.pickupAddress}</p>
          <p><strong>To:</strong> {order.deliveryAddress}</p>
          {order.customer && <p><strong>Customer:</strong> {order.customer.name}</p>}
          {order.courier && <p><strong>Courier:</strong> {order.courier.name}</p>}
          {order.weight && <p><strong>Weight:</strong> {order.weight} kg</p>}
          {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
          {/* BUG: Shows raw timestamp */}
          <p>Created: {order.createdAt}</p>
          <p>Updated: {order.updatedAt}</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Status History</h2>
          {order.statusHistory && <TrackingTimeline history={order.statusHistory} />}
        </div>

        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Route</h2>
          {waypoints.length > 0 ? (
            <RouteMap waypoints={waypoints} />
          ) : (
            <div className="loading">No route information available</div>
          )}
        </div>
      </div>

      {order.notifications && order.notifications.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Notifications ({order.notifications.length})
          </h2>
          {order.notifications.map((notif) => (
            <div key={notif.id} className="card">
              <div className="card-header">
                <span className="card-title">{notif.type}</span>
                <span className={`badge badge-${notif.status.toLowerCase()}`}>
                  {notif.status}
                </span>
              </div>
              <p>{notif.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
