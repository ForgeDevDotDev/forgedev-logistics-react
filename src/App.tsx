import { Routes, Route, Link, useLocation } from 'react-router-dom';
import DispatchDashboard from './pages/DispatchDashboard';
import CourierView from './pages/CourierView';
import TrackingView from './pages/TrackingView';
import OrderDetail from './pages/OrderDetail';
import CustomerList from './pages/CustomerList';

export default function App() {
  const location = useLocation();
  const isTrackingPage = location.pathname.startsWith('/tracking');

  return (
    <div className="app">
      {!isTrackingPage && (
        <nav className="navbar">
          <Link to="/dispatch">Dispatch</Link>
          <Link to="/courier">Courier</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/tracking">Track Order</Link>
        </nav>
      )}
      <main className="container">
        <Routes>
          <Route path="/" element={<DispatchDashboard />} />
          <Route path="/dispatch" element={<DispatchDashboard />} />
          <Route path="/courier" element={<CourierView />} />
          <Route path="/courier/:id" element={<CourierView />} />
          <Route path="/tracking" element={<TrackingView />} />
          <Route path="/tracking/:code" element={<TrackingView />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/customers" element={<CustomerList />} />
        </Routes>
      </main>
    </div>
  );
}
