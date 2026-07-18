import type { Courier } from '@/vite-env.d';

interface CourierCardProps {
  courier: Courier;
}

export default function CourierCard({ courier }: CourierCardProps) {
  // NOTE: Using a different color scheme than StatusBadge for courier status
  // This is inconsistent — should use the same StatusBadge component
  // FIXME: Inconsistent status colors between components
  const statusColors: Record<string, string> = {
    available: '#d4edda',
    on_delivery: '#cce5ff',
    offline: '#e2e3e5',
  };

  const statusColor = statusColors[courier.status] || '#e2e3e5';

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{courier.name}</span>
        <span
          className="badge"
          style={{ background: statusColor }}
        >
          {courier.status}
        </span>
      </div>
      <div className="courier-info">
        <p><strong>Vehicle:</strong> {courier.vehicle}</p>
        {courier.company && <p><strong>Company:</strong> {courier.company}</p>}
        {courier.city && <p><strong>City:</strong> {courier.city}</p>}
        <p><strong>Phone:</strong> {courier.phone}</p>
        {courier.orders && courier.orders.length > 0 && (
          <p><strong>Active orders:</strong> {courier.orders.length}</p>
        )}
      </div>
    </div>
  );
}
