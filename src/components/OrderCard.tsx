import type { Order } from '@/vite-env.d';
import StatusBadge from './StatusBadge';

interface OrderCardProps {
  order: Order;
  onClick?: (order: Order) => void;
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
  return (
    <div
      className="card"
      onClick={() => onClick?.(order)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="card-header">
        <span className="card-title">{order.trackingCode}</span>
        <StatusBadge status={order.status} />
      </div>
      <div className="order-info">
        <p><strong>From:</strong> {order.pickupAddress}</p>
        <p><strong>To:</strong> {order.deliveryAddress}</p>
        {order.customer && (
          <p><strong>Customer:</strong> {order.customer.name}</p>
        )}
        {order.courier && (
          <p><strong>Courier:</strong> {order.courier.name}</p>
        )}
        {/* BUG: Shows raw timestamp instead of formatted date */}
        <p style={{ color: '#888', fontSize: '0.85rem' }}>
          Created: {order.createdAt}
        </p>
        {/* FIXME: Should use new Date(order.createdAt).toLocaleDateString() */}
      </div>
    </div>
  );
}
