import React, { useEffect, useState } from 'react';
import { getOccupiedSlotDetails } from '../api/parkingApi';

function Badge({ type }) {
  const map = {
    CAR: '🚗',
    BIKE: '🏍️',
    TRUCK: '🚚',
  };
  return <span style={{ fontSize: 22 }}>{map[type] || '🅿️'}</span>;
}

export default function OccupiedSlots() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const fetch = () => {
    setError('');
    setLoading(true);
    getOccupiedSlotDetails()
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error('getOccupiedSlotDetails error', err);
        setError('Failed to fetch occupied slot details');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
  }, []);

  // normalize into a flat list of occupied slots
  const slotsList = () => {
    if (!data) return [];
    const list = [];
    // common known arrays
    if (Array.isArray(data.carSpots)) {
      data.carSpots.forEach((s) => list.push({ ...s, vehicleType: s?.parkedVehicle?.vehicleType || 'CAR' }));
    }
    if (Array.isArray(data.bikeSpots)) {
      data.bikeSpots.forEach((s) => list.push({ ...s, vehicleType: s?.parkedVehicle?.vehicleType || 'BIKE' }));
    }
    // fallback: if API returns a map of arrays
    if (!list.length && data.spotsByType && typeof data.spotsByType === 'object') {
      Object.keys(data.spotsByType).forEach((k) => {
        const arr = data.spotsByType[k];
        if (Array.isArray(arr)) arr.forEach((s) => list.push({ ...s, vehicleType: k.toUpperCase() }));
      });
    }

    // filter occupied only
    return list.filter((s) => s?.occupied);
  };

  const filtered = slotsList().filter((s) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (s?.parkedVehicle?.vehicleNumber || '').toLowerCase().includes(q) || (String(s?.slotNumber) || '').includes(q);
  });

  return (
    <div style={{ padding: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h3 style={{ margin: 0, color: '#233044' }}>Occupied Slots</h3>
          <div style={{ fontSize: 13, color: '#6b7a89' }}>Live list of currently occupied parking slots</div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            placeholder="Search by vehicle number or slot"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e3e8ee' }}
          />
          <button onClick={fetch} style={{ padding: '8px 12px', borderRadius: 8, background: '#BCE7FF', border: 'none', cursor: 'pointer' }}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <div style={{ color: '#b00020', marginBottom: 12 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        {filtered.length === 0 && !loading && (
          <div style={{ padding: 18, borderRadius: 12, background: 'linear-gradient(180deg,#FFFFFF,#FBFBFF)', boxShadow: '0 8px 30px rgba(39,54,64,0.04)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#233044' }}>No occupied slots found</div>
            <div style={{ marginTop: 8, color: '#6b7a89' }}>Either no vehicles are parked or your filter returned no results.</div>
          </div>
        )}

        {filtered.map((s) => (
          <div key={`${s.slotNumber}-${s?.parkedVehicle?.vehicleNumber || ''}`} style={{ padding: 14, borderRadius: 12, background: 'linear-gradient(135deg,#F6F8FF,#FFF7F9)', boxShadow: '0 8px 24px rgba(35,48,68,0.06)', display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(34,44,60,0.06)' }}>
              <Badge type={s.vehicleType} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#6b7a89' }}>{s.vehicleType || s?.parkedVehicle?.vehicleType || '—'}</div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#233044' }}>{s?.parkedVehicle?.vehicleNumber || '—'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#6b7a89' }}>Slot</div>
                  <div style={{ fontWeight: 800, color: '#2c3e50' }}>{s.slotNumber}</div>
                </div>
              </div>

              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: '#6b7a89' }}>In Time</div>
                <div style={{ fontWeight: 600 }}>{s.intime || s.inTime ? new Date(s.intime || s.inTime).toLocaleString() : '—'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* developer raw response */}
      {data && (
        <div style={{ marginTop: 14 }}>
          <details style={{ color: '#6b7a89' }}>
            <summary style={{ cursor: 'pointer' }}>View raw response</summary>
            <pre style={{ background: '#f4f6f8', padding: 10, borderRadius: 8, marginTop: 8, overflowX: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}
