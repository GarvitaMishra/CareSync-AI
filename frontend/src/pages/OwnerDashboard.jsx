import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import OwnerTopbar from "../components/OwnerTopbar";

export default function OwnerDashboard() {
  const [hospitals, setHospitals] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [serviceInputs, setServiceInputs] = useState({});

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchHospitals = async () => {
    try {
      const res = await API.get("/hospitals/my-hospitals", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setHospitals(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/owner", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setBookings(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHospitals();
    fetchBookings();
  }, []);

  const handleAddHospital = async () => {
    try {
      await API.post(
        "/hospitals",
        {
          name,
          address,
          lat: Number(lat),
          lng: Number(lng),
          services: []
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Hospital added ✅");

      setName("");
      setAddress("");
      setLat("");
      setLng("");

      fetchHospitals();

    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add hospital");
    }
  };

  const handleServiceInputChange = (hospitalId, field, value) => {
    setServiceInputs((prev) => ({
      ...prev,
      [hospitalId]: {
        ...prev[hospitalId],
        [field]: value
      }
    }));
  };

  const handleAddService = async (hospitalId) => {
    try {
      const input = serviceInputs[hospitalId];

      if (!input?.name || !input?.price) {
        alert("Enter service name and price");
        return;
      }

      await API.post(
        `/hospitals/${hospitalId}/services`,
        {
          name: input.name,
          price: Number(input.price)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Service added ✅");

      setServiceInputs((prev) => ({
        ...prev,
        [hospitalId]: {
          name: "",
          price: ""
        }
      }));

      fetchHospitals();

    } catch (err) {
      alert(err.response?.data?.msg || "Error adding service");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={layout}>

      {/* SIDEBAR */}
      <div style={sidebar}>

        <div>

          <div style={profileCircle}>
            👤
          </div>

          <h2 style={ownerName}>
            {user?.name || "Owner"}
          </h2>

          <p style={roleText}>
            Hospital Owner
          </p>

        </div>

        <div style={menu}>

          <button style={menuBtn}>
            🏥 Dashboard
          </button>

          <button
            style={menuBtn}
            onClick={() => navigate("/")}
          >
            🔍 Search
          </button>

          <button
            style={menuBtn}
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={mainContent}>

        <OwnerTopbar />

        {/* STATS */}
        <div style={statsRow}>

          <div style={miniCard}>
            <h4>Total Hospitals</h4>
            <h1>{hospitals.length}</h1>
          </div>

          <div style={miniCard}>
            <h4>Total Bookings</h4>
            <h1>{bookings.length}</h1>
          </div>

          <div style={miniCard}>
            <h4>Total Services</h4>
            <h1>
              {hospitals.reduce(
                (acc, h) => acc + h.services.length,
                0
              )}
            </h1>
          </div>

        </div>

        {/* ADD HOSPITAL */}
        <div style={card}>

          <h3 style={sectionTitle}>
            Add Hospital
          </h3>

          <input
            style={input}
            placeholder="Hospital Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            style={input}
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            style={input}
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />

          <input
            style={input}
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />

          <button style={mainBtn} onClick={handleAddHospital}>
            Add Hospital
          </button>

        </div>

        {/* HOSPITALS */}
        <h2 style={heading}>
          My Hospitals
        </h2>

        {hospitals.map((h, i) => (
          <div key={i} style={hospitalCard}>

            <h3>{h.name}</h3>

            <p>📍 {h.address}</p>

            <p>
              🌍 {h.lat} | {h.lng}
            </p>

            <h4 style={{ marginTop: "15px" }}>
              Services
            </h4>

            {h.services.map((s, idx) => (
              <div key={idx}>
                {s.name} - ₹{s.price}
              </div>
            ))}

            <div style={{ marginTop: "20px" }}>

              <input
                style={input}
                placeholder="Service Name"
                value={serviceInputs[h._id]?.name || ""}
                onChange={(e) =>
                  handleServiceInputChange(
                    h._id,
                    "name",
                    e.target.value
                  )
                }
              />

              <input
                style={input}
                placeholder="Price"
                type="number"
                value={serviceInputs[h._id]?.price || ""}
                onChange={(e) =>
                  handleServiceInputChange(
                    h._id,
                    "price",
                    e.target.value
                  )
                }
              />

              <button
                style={mainBtn}
                onClick={() => handleAddService(h._id)}
              >
                Add Service
              </button>

            </div>
          </div>
        ))}

        {/* BOOKINGS */}
        <h2 style={heading}>
          Recent Bookings
        </h2>

        {bookings.length === 0 ? (
          <div style={emptyCard}>
            No bookings yet
          </div>
        ) : (
          bookings.map((b, i) => (
            <div key={i} style={bookingCard}>

              <p>
                <strong>User:</strong> {b.userId?.name}
              </p>

              <p>
                <strong>Service:</strong> {b.serviceName}
              </p>

              <p>
                <strong>Date:</strong> {b.date}
              </p>

              <p>
                <strong>Slot:</strong> {b.slot}
              </p>

              <p>
                <strong>Price:</strong> ₹{b.price}
              </p>

            </div>
          ))
        )}

      </div>

      {/* RIGHT PANEL */}
      <div style={rightPanel}>

        <div style={statsCard}>

          <h3>Recent Activity</h3>

          <p style={activityText}>
            🏥 Hospitals Added: {hospitals.length}
          </p>

          <p style={activityText}>
            📅 Bookings Received: {bookings.length}
          </p>

        </div>

        <div style={tipsCard}>

          <h3>💡 Tips</h3>

          <ul style={{ paddingLeft: "18px" }}>
            <li>Add more services</li>
            <li>Keep prices updated</li>
            <li>Use accurate locations</li>
            <li>Respond quickly to bookings</li>
          </ul>

        </div>
      </div>
    </div>
  );
}

/* STYLES */

const layout = {
  display: "flex",
  width: "100%",
  height: "100vh",
  overflow: "hidden",
  background: "#f3f4f6"
};

const sidebar = {
  width: "260px",
  background: "#111827",
  color: "white",
  padding: "30px 20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  flexShrink: 0
};

const mainContent = {
  flex: 1,
  overflowY: "auto",
  padding: "30px"
};

const rightPanel = {
  width: "300px",
  background: "#eef2ff",
  padding: "25px",
  overflowY: "auto",
  flexShrink: 0
};

const profileCircle = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  background: "#6366f1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "35px",
  marginBottom: "20px"
};

const ownerName = {
  marginBottom: "5px"
};

const roleText = {
  color: "#9ca3af",
  fontSize: "14px"
};

const menu = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const menuBtn = {
  padding: "14px",
  border: "none",
  borderRadius: "10px",
  background: "#1f2937",
  color: "white",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "15px"
};

const statsRow = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "20px",
  marginBottom: "30px"
};

const miniCard = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const card = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  marginBottom: "30px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const hospitalCard = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const bookingCard = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  marginBottom: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const emptyCard = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  color: "#6b7280",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const statsCard = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const tipsCard = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const activityText = {
  marginTop: "12px",
  color: "#4b5563"
};

const heading = {
  marginBottom: "20px"
};

const sectionTitle = {
  marginBottom: "20px"
};

const input = {
  width: "100%",
  padding: "14px",
  marginBottom: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "15px"
};

const mainBtn = {
  padding: "14px 22px",
  border: "none",
  borderRadius: "10px",
  background: "#6366f1",
  color: "white",
  cursor: "pointer",
  fontSize: "15px"
};