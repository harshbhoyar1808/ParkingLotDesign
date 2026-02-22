import { useState } from "react";
import ParkingStatus from "../components/ParkingStatus";
import OccupiedSlots from "../components/OccupiedSlots";
import ParkVehicle from "../components/ParkVehicle";
import BillTicket from "../components/BillTicket";
import PropTypes from 'prop-types';

function NavButton({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '10px 14px',
                borderRadius: 999,
                border: active ? '2px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,0,0,0.06)',
                background: active ? 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))' : 'transparent',
                boxShadow: active ? '0 6px 18px rgba(57,76,96,0.06)' : 'none',
                cursor: 'pointer',
                fontWeight: 600,
                color: '#2c3e50',
                transition: 'transform 120ms ease, box-shadow 120ms ease',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(1px)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            {label}
        </button>
    );
}

NavButton.propTypes = {
    label: PropTypes.string.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func
};

function Dashboard() {
    const [view, setView] = useState("parking");

    const containerStyle = {
        minHeight: '100vh',
        padding: '32px',
        background: 'linear-gradient(180deg, #F8F9FF 0%, #F6FBFF 100%)',
        fontFamily: 'Inter, Roboto, "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial',
        color: '#2c3e50'
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18
    };

    const brandStyle = {
        display: 'flex',
        gap: 12,
        alignItems: 'center'
    };

    const cardStyle = {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,255,0.95))',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 8px 30px rgba(40, 55, 71, 0.06)',
        border: '1px solid rgba(30,40,60,0.04)'
    };

    const navBarStyle = {
        display: 'flex',
        gap: 10,
        alignItems: 'center'
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div style={brandStyle}>
                    <div style={{ width: 48, height: 48, borderRadius: 10, background: 'linear-gradient(135deg,#FFD7E2,#E7F6FD)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#2c3e50' }}>P</div>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 700 }}>Parking Lot Dashboard</div>
                        <div style={{ fontSize: 12, color: '#556170' }}>Soft pastel UI — view and manage parking</div>
                    </div>
                </div>

                <div style={navBarStyle}>
                    <NavButton label="Parking Status" active={view === 'parking'} onClick={() => setView('parking')} />
                    <NavButton label="Occupied Slots" active={view === 'occupied'} onClick={() => setView('occupied')} />
                    <NavButton label="Park Vehicle" active={view === 'park'} onClick={() => setView('park')} />
                    <NavButton label="Bill Ticket" active={view === 'bill'} onClick={() => setView('bill')} />
                </div>
            </div>

            <div style={cardStyle}>
                {/* content area */}
                <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{view === 'parking' ? 'Parking Overview' : view === 'occupied' ? 'Occupied Slots' : view === 'park' ? 'Park Vehicle' : 'Bill Ticket'}</div>
                    <div style={{ fontSize: 12, color: '#6b7a89' }}>Tip: Use the buttons above to switch views</div>
                </div>

                <div style={{ borderRadius: 10, padding: 14, background: 'linear-gradient(180deg, rgba(255,255,255,0.8), rgba(248,249,255,0.9))', minHeight: 360 }}>
                    {view === "parking" ? <ParkingStatus /> : view === "occupied" ? <OccupiedSlots /> : view === "park" ? <ParkVehicle /> : <BillTicket />}
                </div>

                <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <div style={{ fontSize: 12, color: '#8694A6' }}>Built with care · pastel theme</div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
