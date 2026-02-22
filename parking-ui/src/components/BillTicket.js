import React, { useState } from "react";
import { billTicket } from "../api/parkingApi";

function BillTicket() {
  const [draftVehicleNumber, setDraftVehicleNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("CAR");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sanitizeVehicleNumber = (s) => (s || "").replace(/[^A-Za-z0-9]/g, "");

  const submit = () => {
    setError("");
    setResponse(null);

    if (!draftVehicleNumber) {
      setError("Enter vehicle number");
      return;
    }

    const cleaned = sanitizeVehicleNumber(draftVehicleNumber);
    if (!cleaned) {
      setError("Vehicle number must contain at least one alphanumeric character");
      return;
    }

    // persist canonical
    setVehicleNumber(cleaned);

    const payload = { vehicleNumber: cleaned, vehicleType };
    setLoading(true);
    billTicket(payload)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        console.error("billTicket error:", err);
        const serverData = err?.response?.data;
        if (serverData) setError(JSON.stringify(serverData));
        else setError(err?.message || "Unknown error");
      })
      .finally(() => setLoading(false));
  };

  // small UI helpers
  const Card = ({ title, children, style }) => (
    <div style={{ borderRadius: 10, padding: 14, background: '#fff', boxShadow: '0 6px 20px rgba(40,55,71,0.04)', ...style }}>
      {title && <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{title}</div>}
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily: 'Segoe UI, Roboto, sans-serif', padding: 18 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <Card title="Bill Ticket" style={{ background: 'linear-gradient(180deg,#F9FBFF,#FFFFFF)' }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#596974', marginBottom: 6 }}>Vehicle Number</label>
              <input
                value={draftVehicleNumber}
                onChange={(e) => setDraftVehicleNumber(e.target.value)}
                onBlur={() => setVehicleNumber(sanitizeVehicleNumber(draftVehicleNumber))}
                placeholder="e.g. MH15-78213"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e3e8ee' }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#596974', marginBottom: 6 }}>Vehicle Type</label>
              <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e3e8ee' }}>
                <option>CAR</option>
                <option>BIKE</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={submit} disabled={loading} style={{ padding: '10px 14px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8 }}>
                {loading ? 'Processing...' : 'Get Bill'}
              </button>

              <button onClick={() => { setDraftVehicleNumber(''); setVehicleNumber(''); setResponse(null); setError(''); }} style={{ padding: '10px 14px', background: '#f5f7fa', border: '1px solid #e3e8ee', borderRadius: 8 }}>
                Reset
              </button>
            </div>

            {error && <div style={{ marginTop: 12, color: '#b00020' }}>{error}</div>}
          </Card>

          {response && (
            <div style={{ marginTop: 14 }}>
              {response.amount >= 0 ? (
                <Card title="Bill Generated" style={{ background: 'linear-gradient(180deg,#FFF9F3,#FFFFFF)' }}>
                  <div style={{ fontSize: 14, marginBottom: 8 }}><strong>Amount to Pay</strong></div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#2c3e50' }}>₹{Number(response.amount).toLocaleString()}</div>
                  {response.billDetails && <div style={{ marginTop: 10, color: '#556170' }}>{response.billDetails}</div>}
                </Card>
              ) : (
                <Card title="Invalid Ticket" style={{ background: 'linear-gradient(180deg,#FFF0F0,#FFFFFF)' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#b00020' }}>Invalid Ticket</div>
                  <div style={{ marginTop: 8, color: '#556170' }}>{response.billDetails || 'The ticket provided is invalid or already billed.'}</div>
                </Card>
              )}
            </div>
          )}
        </div>

        <div style={{ width: 320 }}>
          <Card title="Preview (sent to API)" style={{ background: 'linear-gradient(180deg,#FBFCFF,#FFFFFF)' }}>
            <div style={{ fontSize: 12, color: '#6b7a89' }}>Raw (typing)</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{draftVehicleNumber || <span style={{ color: '#999' }}>—</span>}</div>
            <div style={{ fontSize: 12, color: '#6b7a89' }}>Sanitized (sent)</div>
            <div style={{ fontWeight: 700 }}>{sanitizeVehicleNumber(draftVehicleNumber || vehicleNumber) || <span style={{ color: '#999' }}>—</span>}</div>

            <div style={{ height: 12 }} />
            <div style={{ fontSize: 12, color: '#6b7a89' }}>Vehicle Type</div>
            <div style={{ fontWeight: 700 }}>{vehicleType}</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default BillTicket;
