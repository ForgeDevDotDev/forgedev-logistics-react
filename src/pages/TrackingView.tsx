import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { trackingApi } from '@/api';
import StatusBadge from '@/components/StatusBadge';
import TrackingTimeline from '@/components/TrackingTimeline';

// BUG: This page has a broken status display
// It shows all statuses as "pending" regardless of the actual status
// See getStatusDisplay function below

function getStatusDisplay(status: string): string {
  // FIXME: This function always returns "pending"
  // The switch statement below has a bug — all cases fall through
  // Should have break statements or use return properly
  switch (status.toLowerCase()) {
    case 'pending':
      return 'pending';
    case 'assigned':
    case 'picked_up':
    case 'in_transit':
    case 'delivered':
    case 'failed':
    case 'cancelled':
      // BUG: all these cases fall through to 'pending'
      // Missing break statements means it doesn't match correctly
      return 'pending';
    default:
      return 'pending';
  }
  // FIXME: The switch above is completely broken
  // Each case should return the actual status, not 'pending'
  // e.g. case 'delivered': return 'Delivered';
}

export default function TrackingView() {
  const params = useParams();
  const [trackingCode, setTrackingCode] = useState(params.code || '');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackOrder = async () => {
    if (!trackingCode.trim()) return;

    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const res = await trackingApi.track(trackingCode.trim());
      setTrackingData(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Tracking code not found. Please check and try again.');
      } else {
        setError('Failed to fetch tracking information.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackingCode) {
      trackOrder();
    }
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Track Your Order</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          className="form-input"
          style={{ flex: 1 }}
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          placeholder="Enter tracking code (e.g., TRK-001-MAD)"
          onKeyDown={(e) => e.key === 'Enter' && trackOrder()}
        />
        <button onClick={trackOrder} className="btn btn-primary">
          Track
        </button>
      </div>

      {loading && <div className="loading">Searching for your order...</div>}
      {error && <div className="error">{error}</div>}

      {trackingData && (
        <div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">{trackingData.trackingCode}</span>
              {/* BUG: Uses getStatusDisplay which always returns 'pending' */}
              <StatusBadge status={getStatusDisplay(trackingData.status)} />
              {/* Should be: <StatusBadge status={trackingData.status} /> */}
            </div>
            <div className="tracking-info">
              <p><strong>From:</strong> {trackingData.pickupAddress}</p>
              <p><strong>To:</strong> {trackingData.deliveryAddress}</p>
              {trackingData.courier && (
                <p><strong>Courier:</strong> {trackingData.courier.name}</p>
              )}
              {/* BUG: Shows raw timestamp */}
              <p>Created: {trackingData.createdAt}</p>
              {/* FIXME: Should use new Date(trackingData.createdAt).toLocaleDateString() */}

              {/* BUG: Shows customer PII on public tracking page */}
              {trackingData.customer && (
                <div>
                  <p><strong>Customer:</strong> {trackingData.customer.name}</p>
                  <p><strong>Phone:</strong> {trackingData.customer.phone}</p>
                </div>
              )}
            </div>
          </div>

          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Tracking History</h2>
          {trackingData.statusHistory && (
            <TrackingTimeline history={trackingData.statusHistory} />
          )}
        </div>
      )}

      {!loading && !error && !trackingData && (
        <div className="loading">Enter a tracking code to see your order status.</div>
      )}
    </div>
  );
}
