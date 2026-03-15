import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api, { setToken } from '../services/api';

function colorIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:14px;height:14px;border-radius:50%"></div>`,
  });
}

export default function MapView() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    (async () => {
      setToken(localStorage.getItem('adminToken'));
      const [locations, reports, assignments] = await Promise.all([
        api.get('/locations'),
        api.get('/reports'),
        api.get('/assignments'),
      ]);

      const completedIds = new Set(reports.data.map((r) => r.location_id));
      const assignedIds = new Set(assignments.data.map((a) => a.location_id));

      setPoints(
        locations.data.map((loc) => ({
          ...loc,
          status: completedIds.has(loc.id) ? 'completed' : assignedIds.has(loc.id) ? 'assigned' : 'pending',
        })),
      );
    })();
  }, []);

  return (
    <MapContainer center={[0, 0]} zoom={2} className="h-[600px] w-full rounded">
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {points.map((p) => (
        <Marker
          key={p.id}
          position={[p.latitude, p.longitude]}
          icon={colorIcon(p.status === 'completed' ? 'green' : p.status === 'assigned' ? 'yellow' : 'red')}
        >
          <Popup>
            {p.location_name} ({p.status})
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
