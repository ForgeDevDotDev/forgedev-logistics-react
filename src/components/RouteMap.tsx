interface Waypoint {
  lat: number;
  lng: number;
  address: string;
}

interface RouteMapProps {
  waypoints?: Waypoint[];
}

// TODO: Integrate actual map (Leaflet, Google Maps, or Mapbox)
// For now this is just a placeholder
export default function RouteMap({ waypoints = [] }: RouteMapProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '300px',
        background: '#e8e8e8',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center', color: '#888' }}>
        <p>🗺️ Map Integration Coming Soon</p>
        {waypoints.length > 0 && (
          <p style={{ fontSize: '0.9rem', color: '#555' }}>
            {waypoints.length} waypoints on route
          </p>
        )}
      </div>
    </div>
  );
}
