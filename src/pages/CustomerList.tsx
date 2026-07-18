import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api';

// NOTE: This component fetches data directly via the API instead of using a store
// BUG: Should use a customers store, but there's no /customers endpoint on the backend
// So we extract customer info from orders

interface CustomerWithOrders {
  id: string;
  name: string;
  city: string;
  phone: string;
  email: string;
  orderCount: number;
}

export default function CustomerList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<CustomerWithOrders[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // BUG: Pagination is broken
  // The page state changes but the fetch doesn't use it correctly
  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // BUG: This fetches with limit 100 to get all orders, then paginates client-side
      // But it doesn't pass the page parameter correctly
      const res = await api.get('/orders', { limit: 100, page: page });
      const customerMap = new Map<string, CustomerWithOrders>();
      for (const order of res.data.data) {
        if (order.customer) {
          if (!customerMap.has(order.customer.id)) {
            customerMap.set(order.customer.id, {
              ...order.customer,
              orderCount: 0,
            });
          }
          const c = customerMap.get(order.customer.id)!;
          c.orderCount++;
        }
      }
      setCustomers(Array.from(customerMap.values()));
      // BUG: totalPages is calculated from orders, not customers
      // The pagination doesn't make sense here
      setTotalPages(Math.ceil(res.data.total / 100));
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const goToOrders = (customerId: string) => {
    // TODO: Filter orders by customer — currently just navigates to dispatch
    navigate('/dispatch');
  };

  if (loading && customers.length === 0) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Customers</h1>

      {customers.length === 0 ? (
        <div className="loading">No customers found.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            {/* BUG: Missing key prop on the <tr> below */}
            {/* FIXME: Should have key={customer.id} */}
            {customers.map((customer) => (
              <tr
                onClick={() => goToOrders(customer.id)}
                style={{ cursor: 'pointer' }}
              >
                <td>{customer.name}</td>
                <td>{customer.city}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{customer.orderCount}</td>
              </tr>
            ))}
            {/* The list items above are missing key props */}
            {/* React will warn about this in the console */}
          </tbody>
        </table>
      )}

      {/* BUG: Pagination controls don't work correctly */}
      {/* FIXME: The pagination is calculated from orders, not customers */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          className="btn btn-secondary"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="btn btn-secondary"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
