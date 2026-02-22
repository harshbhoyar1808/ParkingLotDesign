import { useState } from "react";
import { getParkingStatus } from "../api/parkingApi";

function SlotStatus() {
  const [type, setType] = useState("All");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const normalizeStr = (v) => (v || "").toString().toLowerCase();

  const extractArraysByKey = (obj) => {
    const carArrays = [];
    const bikeArrays = [];
    const otherArrays = [];

    Object.entries(obj).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        const key = k.toLowerCase();
        if (key.includes("car")) carArrays.push(v);
        else if (key.includes("bike") || key.includes("bikes")) bikeArrays.push(v);
        else otherArrays.push(v);
      }
    });

    return { carArrays, bikeArrays, otherArrays };
  };

  const filterArrayByType = (arr, targetType) =>
    arr.filter((item) => {
      if (!item || typeof item !== "object") return false;
      const t = normalizeStr(item.vehicleType || item.type || item.slotType || item.vehicle || item.vehicle_type || item.category || "");
      return t.includes(targetType.toLowerCase());
    });

  const fetchSlotStatus = () => {
    setError("");
    setResult(null);
    getParkingStatus()
      .then((res) => {
        const data = res.data;
        console.debug("SlotStatus: raw response", data);

        // If backend provides explicit keys carSpots/bikeSpots use them deterministically
        if (data && typeof data === "object" && (Array.isArray(data.carSpots) || Array.isArray(data.bikeSpots))) {
          const car = Array.isArray(data.carSpots) ? data.carSpots : [];
          const bike = Array.isArray(data.bikeSpots) ? data.bikeSpots : [];

          if (type === "All") {
            // return an object containing both arrays for labeled rendering
            setResult({ carSpots: car, bikeSpots: bike });
          } else if (type === "Car") {
            setResult(car);
          } else if (type === "Bike") {
            setResult(bike);
          }

          console.debug("SlotStatus: using explicit carSpots/bikeSpots", { car, bike });
          return;
        }

        // Fallback to previous heuristics
        let final = null;

        if (type === "All") {
          if (Array.isArray(data)) final = data;
          else if (data && typeof data === "object") {
            const { carArrays, bikeArrays, otherArrays } = extractArraysByKey(data);
            const combined = [];
            carArrays.forEach((a) => combined.push(...a));
            bikeArrays.forEach((a) => combined.push(...a));
            otherArrays.forEach((a) => combined.push(...a));
            final = combined.length ? combined : data;
          } else {
            final = data;
          }
        } else {
          if (Array.isArray(data)) {
            final = filterArrayByType(data, type);
          } else if (data && typeof data === "object") {
            const { carArrays, bikeArrays, otherArrays } = extractArraysByKey(data);
            const preferred = type === "Car" ? carArrays : bikeArrays;
            if (preferred.length) {
              final = preferred.flat();
            } else if (otherArrays.length) {
              const filteredFromOther = otherArrays.flatMap((arr) => filterArrayByType(arr, type));
              final = filteredFromOther;
            } else {
              const arr = Object.values(data).find((v) => Array.isArray(v));
              if (arr) final = filterArrayByType(arr, type);
              else final = [];
            }
          } else {
            final = [];
          }
        }

        console.debug("SlotStatus: extracted result", final);
        setResult(final);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to fetch slot status");
      });
  };

  const renderResult = () => {
    if (result == null) return null;

    // If backend returned labeled object containing both arrays
    if (result && typeof result === "object" && (Array.isArray(result.carSpots) || Array.isArray(result.bikeSpots))) {
      const car = result.carSpots || [];
      const bike = result.bikeSpots || [];
      return (
        <div>
          <h4>Car Spots ({car.length})</h4>
          <pre style={{ background: "#f4f4f4", padding: "10px" }}>{JSON.stringify(car, null, 2)}</pre>
          <h4>Bike Spots ({bike.length})</h4>
          <pre style={{ background: "#f4f4f4", padding: "10px" }}>{JSON.stringify(bike, null, 2)}</pre>
        </div>
      );
    }

    if (Array.isArray(result)) {
      return (
        <div>
          <p>Found {result.length} item{result.length !== 1 ? "s" : ""}.</p>
          <pre style={{ background: "#f4f4f4", padding: "10px", marginTop: 8 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      );
    }

    return (
      <pre style={{ background: "#f4f4f4", padding: "10px", marginTop: 8 }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    );
  };

  return (
    <div>
      <h3>Get Slot Status</h3>

      <label>
        Vehicle Type:&nbsp;
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>All</option>
          <option>Car</option>
          <option>Bike</option>
        </select>
      </label>

      <div style={{ marginTop: 8 }}>
        <button onClick={fetchSlotStatus}>🔎 Get Slot Status</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {renderResult()}
    </div>
  );
}

export default SlotStatus;
