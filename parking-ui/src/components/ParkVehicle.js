import { useState } from "react";
import { parkVehicle, billTicket } from "../api/parkingApi";

function ParkVehicle() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("CAR");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [billing, setBilling] = useState(false);

  const isValidVehicleNumber = (s) => /^[A-Za-z0-9- ]+$/.test(s); // allow letters, digits, hyphen and space

  const submit = () => {
    setError("");
    setResponse(null);

    if (!vehicleNumber) {
      setError("Enter vehicle number");
      return;
    }

    if (!isValidVehicleNumber(vehicleNumber)) {
      setError("Vehicle number can contain only letters, digits, hyphen and spaces");
      return;
    }

    setLoading(true);
    parkVehicle({ vehicleNumber, vehicleType })
      .then((res) => {
        console.log("parkVehicle response:", res.data);
        setResponse(res.data);
      })
      .catch((err) => {
        console.error("parkVehicle error:", err);
        const serverData = err?.response?.data;
        if (serverData) setError(JSON.stringify(serverData));
        else setError(err?.message || "Unknown error");
      })
      .finally(() => setLoading(false));
  };

  const doBill = () => {
    if (!response) return;
    setBilling(true);
    const payload = { vehicleNumber: response.parkingSlot?.parkedVehicle?.vehicleNumber || vehicleNumber, vehicleType: response.parkingSlot?.parkedVehicle?.vehicleType || vehicleType };
    billTicket(payload)
      .then((res) => {
        console.log("billTicket response:", res.data);
        setResponse((prev) => ({ ...prev, billResponse: res.data }));
      })
      .catch((err) => {
        console.error("billTicket error:", err);
        const serverData = err?.response?.data;
        if (serverData) setError(JSON.stringify(serverData));
        else setError(err?.message || "Unknown error");
      })
      .finally(() => setBilling(false));
  };

  // helper to format date
  const fmt = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch (e) {
      return iso || "-";
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Roboto, sans-serif', padding: 18 }}>
      <h3 style={{ color: '#233044', marginTop: 0 }}>Park Vehicle / Get Ticket</h3>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ marginBottom: 6, color: '#556170' }}>Vehicle Number</span>
              <input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="e.g. MH15-78213" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e3e8ee' }} />
            </label>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ marginBottom: 6, color: '#556170' }}>Vehicle Type</span>
              <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e3e8ee' }}>
                <option>CAR</option>
                <option>BIKE</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button onClick={submit} disabled={loading} style={{ padding: '10px 14px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8 }}>
              {loading ? 'Processing...' : 'Get Ticket'}
            </button>

            <button onClick={() => { setVehicleNumber(''); setVehicleType('CAR'); setResponse(null); setError(''); }} style={{ padding: '10px 14px', background: '#f5f7fa', border: '1px solid #e3e8ee', borderRadius: 8 }}>
              Reset
            </button>
          </div>

          {error && <div style={{ marginTop: 12, color: '#b00020' }}>{error}</div>}
        </div>

        <div style={{ width: 360 }}>
          <div style={{ borderRadius: 12, padding: 14, background: 'linear-gradient(135deg,#F6F8FF,#FFF7F9)', boxShadow: '0 8px 24px rgba(35,48,68,0.06)' }}>
            <div style={{ fontSize: 12, color: '#6b7a89' }}>Preview (sanitized)</div>
            <div style={{ fontWeight: 700, marginTop: 8, fontSize: 16 }}>{vehicleNumber || <span style={{ color: '#999' }}>—</span>}</div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#6b7a89' }}>Type</div>
            <div style={{ fontWeight: 700 }}>{vehicleType}</div>
          </div>
        </div>
      </div>

      {/* Response display: stylized ticket card */}
      {response && (
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>

              {/* Ticket visual */}
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, padding: 18, background: 'linear-gradient(135deg,#E8F0FF,#FFF7F3)', boxShadow: '0 18px 48px rgba(37,55,77,0.08)' }}>

                {/* swoosh SVG top-right */}
                <svg viewBox="0 0 200 60" style={{ position: 'absolute', right: -20, top: -10, opacity: 0.18 }} width="220" height="80" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 30 C40 10, 80 0, 200 10 L200 60 L0 60 Z" fill="#FFD7E2" />
                </svg>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 90, height: 90, borderRadius: 12, background: 'linear-gradient(180deg,#FFFFFF,#F5F9FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(34,44,60,0.06)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 28, fontWeight: 900, color: '#233044' }}>{response.slotNumber ?? response.parkingSlot?.slotNumber}</div>
                      <div style={{ fontSize: 11, color: '#6b7a89' }}>Slot</div>
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#233044' }}>Ticket</div>
                        <div style={{ fontSize: 12, color: '#6b7a89' }}>In Time</div>
                        <div style={{ fontWeight: 700 }}>{fmt(response.inTime ?? response.parkingSlot?.intime)}</div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, color: '#6b7a89' }}>Type</div>
                        <div style={{ fontWeight: 800 }}>{response.parkingSlot?.parkedVehicle?.vehicleType || '—'}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#6b7a89' }}>Vehicle</div>
                        <div style={{ fontWeight: 800, fontSize: 16 }}>{response.parkingSlot?.parkedVehicle?.vehicleNumber || '—'}</div>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={doBill} disabled={billing} style={{ padding: '8px 12px', background: '#388e3c', color: '#fff', border: 'none', borderRadius: 8 }}>
                          {billing ? 'Billing...' : 'Bill Ticket'}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* bill result small */}
              {response.billResponse && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ borderRadius: 12, padding: 12, background: 'linear-gradient(180deg,#FFF9F3,#FFFFFF)', boxShadow: '0 8px 24px rgba(37,55,77,0.04)' }}>
                    <div style={{ fontSize: 13, color: '#6b7a89' }}>Bill</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>₹{Number(response.billResponse.amount).toLocaleString()}</div>
                      <div style={{ color: '#556170' }}>{response.billResponse.billDetails}</div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* raw response for debugging */}
            <div style={{ width: 320 }}>
              <div style={{ borderRadius: 12, padding: 12, background: '#fff', boxShadow: '0 8px 20px rgba(35,48,68,0.04)' }}>
                <div style={{ fontSize: 12, color: '#6b7a89', marginBottom: 8 }}>Raw Response</div>
                <pre style={{ background: '#f4f4f4', padding: 10, borderRadius: 8, maxHeight: 260, overflow: 'auto' }}>{JSON.stringify(response, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ParkVehicle;
