import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrdersStore } from '@/stores/orders';
import { useCouriersStore } from '@/stores/couriers';
import OrderCard from '@/components/OrderCard';
import CourierCard from '@/components/CourierCard';
import AssignCourierForm from '@/components/AssignCourierForm';

export default function DispatchDashboard() {
  const navigate = useNavigate();
  const ordersStore = useOrdersStore();
  const couriersStore = useCouriersStore();

  const [statusFilter, setStatusFilter] = useState('');

  const refresh = async () => {
    await ordersStore.fetchOrders();
    await couriersStore.fetchCouriers();
  };

  const applyFilter = () => {
    ordersStore.fetchOrders(
      statusFilter ? { status: statusFilter } : undefined
    );
  };

  // TODO: This should auto-refresh with WebSocket/SSE for real-time updates
  // FIXME: Currently only manual refresh — needs WebSocket connection
  // useEffect(() => {
  //   const ws = new WebSocket('ws://localhost:3000/ws');
  //   ws.onmessage = (event) => { ... refresh ... };
  //   return () => ws.close();
  // }, []);

  useEffect(() => {
    refresh();
    // BUG: This useEffect has no dependency array, so it runs on every render
    // It should have an empty dependency array to only run once on mount
    // FIXME: Add [] as second argument to useEffect
  });

  const handleOrderClick = (order: any) => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Dispatch Dashboard</h1>
        <button onClick={refresh} className="btn btn-primary">
          🔄 Refresh
        </button>
      </div>

      <div className="filter-bar">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="PICKED_UP">Picked Up</option>
          <option value="in_transit">In Transit</option>
          <option value="DELIVERED">Delivered</option>
        </select>
        <button onClick={applyFilter} className="btn btn-secondary">
          Apply Filter
        </button>
      </div>

      {ordersStore.loading && <div className="loading">Loading orders...</div>}
      {ordersStore.error && <div className="error">{ordersStore.error}</div>}

      <div className="grid grid-2">
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Orders ({ordersStore.orders.length})
          </h2>
          {ordersStore.orders.length === 0 && !ordersStore.loading && (
            <div className="loading">No orders found</div>
          )}
          {ordersStore.orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={handleOrderClick}
            />
          ))}
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Available Couriers ({couriersStore.couriers.filter(c => c.status === 'available').length})
          </h2>
          <AssignCourierForm />
          {couriersStore.loading && <div className="loading">Loading couriers...</div>}
          {couriersStore.couriers.map((courier) => (
            <CourierCard key={courier.id} courier={courier} />
          ))}
        </div>
      </div>
    </div>
  );
}
