import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { getParkingStatus } from "../api/parkingApi";

// Small pastel row component to look like a smooth "table"
const IncomeRow = ({ label, amount, index }) => {
    const pastel = index % 2 === 0
        ? 'linear-gradient(90deg, rgba(255, 241, 212, 0.6), rgba(255, 244, 230, 0.4))'
        : 'linear-gradient(90deg, rgba(230, 245, 255, 0.6), rgba(240, 250, 255, 0.4))';
    return (
        <div className="income-row fade-in" style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: 10,
            background: pastel,
            marginBottom: 8,
            boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.6)'
        }}>
            <div style={{ color: '#2c3e50', fontWeight: 600 }}>{label}</div>
            <div style={{ color: '#2c3e50', fontWeight: 700 }}>₹{Number(amount).toLocaleString()}</div>
        </div>
    );
};
IncomeRow.propTypes = {
    label: PropTypes.string.isRequired,
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    index: PropTypes.number
};

// card to display each vehicle type's summary
const TypeCard = ({ type, total, occupied, free }) => {
    const pastelBg = 'linear-gradient(180deg, rgba(255,255,255,0.85), rgba(250,255,255,0.95))';
    return (
        <div className="type-card fade-in" style={{ flex: '1 1 220px', borderRadius: 12, padding: 14, background: pastelBg, boxShadow: '0 8px 20px rgba(39,54,64,0.04)' }}>
            <div style={{ fontSize: 13, color: '#6b7a89', marginBottom: 6 }}>{type}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#233044' }}>{total ?? '—'}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <div style={{ padding: 8, borderRadius: 8, background: '#fff', flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#6b7a89' }}>Occupied</div>
                    <div style={{ fontWeight: 700, color: '#2c3e50' }}>{occupied ?? '—'}</div>
                </div>
                <div style={{ padding: 8, borderRadius: 8, background: '#fff', flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#6b7a89' }}>Free</div>
                    <div style={{ fontWeight: 700, color: '#2c3e50' }}>{free ?? '—'}</div>
                </div>
            </div>
        </div>
    );
};
TypeCard.propTypes = {
    type: PropTypes.string.isRequired,
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    occupied: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    free: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

function ParkingStatus() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchParkingStatus = () => {
        setError("");
        setLoading(true);
        getParkingStatus()
            .then(response => {
                console.log("Backend response:", response.data);
                setStatus(response.data);
            })
            .catch(err => {
                console.error("API Error:", err);
                setError("Failed to fetch parking status");
            })
            .finally(() => setLoading(false));
    };

    // helpers to compute counts from response structure
    const countOccupied = (arr) => (Array.isArray(arr) ? arr.filter(s => s?.occupied).length : 0);
    const countFree = (arr) => (Array.isArray(arr) ? arr.filter(s => !s?.occupied).length : 0);

    // Build a vehicle summary list that works for both new API (array of {vehicleType,totalSpots})
    // and existing API shapes that contain carSpots and bikeSpots arrays.
    const getVehicleSummaries = () => {
        if (!status) return [];

        // If backend sends an array of summaries: [{vehicleType, totalSpots}, ...]
        if (Array.isArray(status)) {
            // Aggregate entries by vehicleType so duplicate rows combine correctly.
            const map = new Map();
            status.forEach(s => {
                const type = (s.vehicleType || s.type || 'UNKNOWN').toString().toUpperCase();
                const total = Number(s.totalSpots ?? s.total ?? 0) || 0;
                // support both old and new naming conventions
                const occupiedVal = (typeof s.occupied === 'number') ? s.occupied : (typeof s.occupiedSpots === 'number' ? s.occupiedSpots : null);
                const freeVal = (typeof s.free === 'number') ? s.free : (typeof s.availableSpots === 'number' ? s.availableSpots : null);

                if (!map.has(type)) {
                    map.set(type, { vehicleType: type, totalSpots: total, occupied: occupiedVal ?? 0, free: freeVal ?? 0 });
                } else {
                    const prev = map.get(type);
                    prev.totalSpots = (Number(prev.totalSpots) || 0) + total;
                    prev.occupied = (Number(prev.occupied) || 0) + (occupiedVal ?? 0);
                    prev.free = (Number(prev.free) || 0) + (freeVal ?? 0);
                    map.set(type, prev);
                }
            });
            return Array.from(map.values());
        }

        // Backwards compatible: if carSpots / bikeSpots arrays exist, use them
        const list = [];
        if (Array.isArray(status.carSpots)) {
            list.push({ vehicleType: 'CAR', totalSpots: status.carSpots.length, occupied: countOccupied(status.carSpots), free: countFree(status.carSpots) });
        }
        if (Array.isArray(status.bikeSpots)) {
            list.push({ vehicleType: 'BIKE', totalSpots: status.bikeSpots.length, occupied: countOccupied(status.bikeSpots), free: countFree(status.bikeSpots) });
        }

        // If no known keys but status has a spotsByType object, support that too
        if (status.spotsByType && typeof status.spotsByType === 'object') {
            Object.keys(status.spotsByType).forEach(key => {
                const arr = status.spotsByType[key];
                if (Array.isArray(arr)) {
                    list.push({ vehicleType: key.toUpperCase(), totalSpots: arr.length, occupied: countOccupied(arr), free: countFree(arr) });
                } else if (typeof arr === 'number') {
                    list.push({ vehicleType: key.toUpperCase(), totalSpots: arr, occupied: null, free: null });
                }
            });
        }

        // If still nothing, but status has a summary array under different names, try them
        const alt = status.summary || status.vehicleSummary || status.summaryByType;
        if (Array.isArray(alt) && list.length === 0) {
            alt.forEach(s => list.push({ vehicleType: s.vehicleType || s.type || 'UNKNOWN', totalSpots: s.totalSpots ?? s.total ?? 0, occupied: s.occupied ?? null, free: s.free ?? null }));
        }

        return list;
    };

    const vehicleSummaries = getVehicleSummaries();

    // compute totals for summary panel
    const totalOccupied = vehicleSummaries.reduce((s, v) => s + (Number(v.occupied) || 0), 0);
    const totalFree = vehicleSummaries.reduce((s, v) => s + (Number(v.free) || 0), 0);
    const totalSpotsAll = vehicleSummaries.reduce((s, v) => s + (Number(v.totalSpots) || 0), 0);

    // Helper to detect income data in the response. We support multiple shapes:
    // - status.income -> number
    // - status.incomeSummary -> [{ label, amount }, ...]
    // - status.incomeData -> same as above
    const getIncomeRows = () => {
        if (!status) return null;
        if (typeof status.income === 'number') return [{ label: 'Total Income', amount: status.income }];
        const candidate = status.incomeSummary || status.incomeData || status.incomes || status.incomesSummary;
        if (Array.isArray(candidate)) return candidate.map(item => {
            if (typeof item === 'number') return { label: 'Amount', amount: item };
            if (typeof item === 'object') return { label: item.label || item.name || 'Item', amount: item.amount ?? item.value ?? 0 };
            return { label: String(item), amount: 0 };
        });
        return null;
    };

    const incomeRows = getIncomeRows();


    // Auto fetch once on mount
    useEffect(() => {
        fetchParkingStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ padding: 8 }}>
            <style>{`
                .fade-in { animation: fadeIn 360ms ease both; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity:1; transform: translateY(0);} }
                .type-card:hover { transform: translateY(-6px); box-shadow: 0 14px 40px rgba(39,54,64,0.06); }
                .income-row { transition: transform 220ms ease, box-shadow 220ms ease; }
            `}</style>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0, color: '#233044' }}>Parking Status</h3>
                <button
                    onClick={fetchParkingStatus}
                    style={{
                        marginLeft: 8,
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: 'none',
                        background: 'linear-gradient(90deg,#BCE7FF,#FDE2F3)',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : '🔄 Refresh'}
                </button>
            </div>

            {error && <p style={{ color: "#b00020" }}>{error}</p>}

            {/* Summary strip: Total / Occupied / Free / Utilization */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                <div style={{ padding: 12, borderRadius: 10, minWidth: 140, background: 'linear-gradient(180deg,#FFFFFF,#FFF8FF)', boxShadow: '0 6px 18px rgba(39,54,64,0.04)' }}>
                    <div style={{ fontSize: 12, color: '#6b7a89' }}>Total Spots</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#233044' }}>{totalSpotsAll}</div>
                </div>

                <div style={{ padding: 12, borderRadius: 10, minWidth: 140, background: 'linear-gradient(180deg,#FFF7F9,#FFFDF9)', boxShadow: '0 6px 18px rgba(39,54,64,0.04)' }}>
                    <div style={{ fontSize: 12, color: '#6b7a89' }}>Occupied</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#2c3e50' }}>{totalOccupied}</div>
                </div>

                <div style={{ padding: 12, borderRadius: 10, minWidth: 140, background: 'linear-gradient(180deg,#F8FFFC,#F5FFFB)', boxShadow: '0 6px 18px rgba(39,54,64,0.04)' }}>
                    <div style={{ fontSize: 12, color: '#6b7a89' }}>Free</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#2c3e50' }}>{totalFree}</div>
                </div>

                <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ fontSize: 12, color: '#6b7a89' }}>Utilization</div>
                        <div style={{ fontSize: 12, color: '#6b7a89' }}>{totalSpotsAll ? Math.round((totalOccupied / totalSpotsAll) * 100) : 0}%</div>
                    </div>
                    <div style={{ height: 12, borderRadius: 8, background: '#eef6ff', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${totalSpotsAll ? Math.round((totalOccupied / totalSpotsAll) * 100) : 0}%`, background: 'linear-gradient(90deg, #FFD7E2, #E7F6FD)' }} />
                    </div>
                </div>
            </div>

            {/* Vehicle type cards (dynamic) */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                {vehicleSummaries.length > 0 ? (
                    vehicleSummaries.map((v) => (
                        <TypeCard key={`${v.vehicleType}-${v.totalSpots}`} type={v.vehicleType} total={v.totalSpots} occupied={v.occupied} free={v.free} />
                    ))
                ) : (
                    // fallback to previous layout if no dynamic summaries found
                    <>
                        <div style={{ flex: 1, borderRadius: 12, padding: 14, background: 'linear-gradient(180deg,#FFF7F9,#FFFDF9)', boxShadow: '0 8px 20px rgba(39,54,64,0.04)' }}>
                            <div style={{ fontSize: 13, color: '#6b7a89', marginBottom: 8 }}>Car Slots</div>
                            <div style={{ display: 'flex', gap: 14 }}>
                                <div style={{ padding: 12, borderRadius: 10, background: '#fff', flex: 1 }}>
                                    <div style={{ fontSize: 12, color: '#6b7a89' }}>Occupied</div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: '#2c3e50' }}>{countOccupied(status?.carSpots)}</div>
                                </div>
                                <div style={{ padding: 12, borderRadius: 10, background: '#fff', flex: 1 }}>
                                    <div style={{ fontSize: 12, color: '#6b7a89' }}>Free</div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: '#2c3e50' }}>{countFree(status?.carSpots)}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ flex: 1, borderRadius: 12, padding: 14, background: 'linear-gradient(180deg,#F8FFFC,#F5FFFB)', boxShadow: '0 8px 20px rgba(39,54,64,0.04)' }}>
                            <div style={{ fontSize: 13, color: '#6b7a89', marginBottom: 8 }}>Bike Slots</div>
                            <div style={{ display: 'flex', gap: 14 }}>
                                <div style={{ padding: 12, borderRadius: 10, background: '#fff', flex: 1 }}>
                                    <div style={{ fontSize: 12, color: '#6b7a89' }}>Occupied</div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: '#2c3e50' }}>{countOccupied(status?.bikeSpots)}</div>
                                </div>
                                <div style={{ padding: 12, borderRadius: 10, background: '#fff', flex: 1 }}>
                                    <div style={{ fontSize: 12, color: '#6b7a89' }}>Free</div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: '#2c3e50' }}>{countFree(status?.bikeSpots)}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ width: 240, borderRadius: 12, padding: 14, background: 'linear-gradient(180deg,#FFF8E8,#FFFBF2)', boxShadow: '0 8px 20px rgba(39,54,64,0.04)' }}>
                            <div style={{ fontSize: 13, color: '#6b7a89', marginBottom: 8 }}>Summary</div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: '#2c3e50' }}>{(countOccupied(status?.carSpots) + countOccupied(status?.bikeSpots))} Occupied</div>
                            <div style={{ marginTop: 6, fontSize: 13, color: '#6b7a89' }}>{(countFree(status?.carSpots) + countFree(status?.bikeSpots))} Free</div>
                        </div>
                    </>
                )}
            </div>


            <div style={{ borderRadius: 12, padding: 14, background: 'linear-gradient(180deg,#FFFFFF,#FBFBFF)', boxShadow: '0 8px 30px rgba(39,54,64,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#233044' }}>Income</div>
                    <div style={{ fontSize: 12, color: '#6b7a89' }}>Soft rows — not an Excel table</div>
                </div>

                {/* If incomeRows exists, render them in the pastel rows. Otherwise show placeholder with a small hint. */}
                {incomeRows && incomeRows.length > 0 ? (
                    <div>
                        {incomeRows.map((r, i) => (
                            <IncomeRow key={`${r.label}-${r.amount}`} label={r.label} amount={r.amount} index={i} />
                        ))}
                        <div style={{ marginTop: 8, textAlign: 'right', color: '#6b7a89', fontSize: 13 }}>
                            Total: ₹{incomeRows.reduce((s, r) => s + Number(r.amount || 0), 0).toLocaleString()
                        }</div>
                    </div>
                ) : (
                    <div style={{ color: '#6b7a89' }}>
                        No income data available from the backend. If your API returns a field named <code>income</code> (number) or an array such as <code>incomeSummary</code>, it will be shown here.
                    </div>
                )}

                {/* Also show raw last response if developer needs it */}
                {status && (
                    <details style={{ marginTop: 12, color: '#6b7a89' }}>
                        <summary style={{ cursor: 'pointer' }}>View raw response</summary>
                        <pre style={{ background: '#f4f6f8', padding: 10, borderRadius: 8, marginTop: 8, overflowX: 'auto' }}>{JSON.stringify(status, null, 2)}</pre>
                    </details>
                )}
            </div>
        </div>
    );
}

export default ParkingStatus;
