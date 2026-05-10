import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Search() {

  const [query, setQuery] = useState("");

  const [hospitals, setHospitals] = useState([]);

  const [date, setDate] = useState("");

  const [slot, setSlot] = useState("");

  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState(null);

  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const safeParse = (data) => {
    try {
      return data && data !== "undefined"
        ? JSON.parse(data)
        : null;
    } catch {
      return null;
    }
  };

  const getLocation = () => {

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {

        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });

        alert("Location captured ✅");

      },

      () => {
        alert("Location permission denied");
      }
    );
  };

  const handleSearch = async () => {

    try {

      setLoading(true);

      let url =
        `/hospitals/search?service=${query}`;

      if (location) {

        url +=
          `&userLat=${location.lat}&userLng=${location.lng}`;
      }

      const res = await API.get(url);

      setHospitals(res.data);

    } catch {

      alert("Search failed");

    } finally {

      setLoading(false);
    }
  };

  const handlePayment = async (
    hospital,
    service
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {

        alert("Please login first");

        navigate("/login");

        return;
      }

      if (!date || !slot) {

        alert(
          "Please select date and slot"
        );

        return;
      }

      const orderRes = await API.post(
        "/payment/create-order",
        { amount: service.price },

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const order = orderRes.data;

      const user = safeParse(
        localStorage.getItem("user")
      );

      const options = {

        key: "rzp_test_ShqrMs7IMHU2lr",

        amount: order.amount,

        currency: "INR",

        name: "MediCompare",

        description: service.name,

        order_id: order.id,

        handler: async function (
          response
        ) {

          try {

            const verifyRes =
              await API.post(
                "/payment/verify",
                response,

                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`
                  }
                }
              );

            if (!verifyRes.data.success) {

              alert(
                "Payment verification failed"
              );

              return;
            }

            await API.post(
              "/bookings",

              {
                hospitalId: hospital._id,
                serviceName: service.name,
                price: service.price,
                date,
                slot
              },

              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );

            alert(
              "Booking confirmed ✅"
            );

          } catch {

            alert("Booking failed");
          }
        },

        prefill: {
          name:
            user?.name || "Guest",

          email:
            user?.email ||
            "guest@example.com"
        }
      };

      new window.Razorpay(
        options
      ).open();

    } catch {

      alert("Payment failed");
    }
  };

  const handleLogout = () => {

    localStorage.clear();

    navigate("/login");
  };

  return (

    <div style={page}>

      {/* TOPBAR */}

      <div style={topbar}>

        <div>

          <h1 style={logo}>
            MediCompare
          </h1>

          <p style={logoSub}>
            Smart Healthcare Discovery
          </p>

        </div>

        <div style={topBtns}>

          <button
            style={topBtn}
            onClick={() =>
              navigate("/bookings")
            }
          >
            📅 My Bookings
          </button>

          {role === "hospital" && (

            <button
              style={topBtn}
              onClick={() =>
                navigate("/owner")
              }
            >
              🏥 Dashboard
            </button>

          )}

          {role === "admin" && (

            <button
              style={topBtn}
              onClick={() =>
                navigate("/admin")
              }
            >
              📊 Admin
            </button>

          )}

          <button
            style={logoutBtn}
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

      {/* HERO */}

      <div style={heroSection}>

        <div style={heroGlow}></div>

        <h1 style={heroTitle}>
          Find Best Hospitals & Services
        </h1>

        <p style={heroText}>
          Compare prices, ratings,
          distances and instantly
          book medical services.
        </p>

      </div>

      {/* FILTER CHIPS */}

      <div style={chipsRow}>

        {[
          "MRI",
          "X-Ray",
          "Blood Test",
          "CT Scan",
          "Ultrasound"
        ].map((item, index) => (

          <button
            key={index}
            style={chip}
            onClick={() =>
              setQuery(item)
            }
          >
            {item}
          </button>

        ))}

      </div>

      {/* SEARCH PANEL */}

      <div style={searchPanel}>

        <input
          style={searchInput}
          placeholder="Search services..."
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
        />

        <button
          style={locationBtn}
          onClick={getLocation}
        >
          📍 Location
        </button>

        <input
          style={dateInput}
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
        />

        <select
          style={select}
          value={slot}
          onChange={(e) =>
            setSlot(e.target.value)
          }
        >
          <option value="">
            Select Slot
          </option>

          <option value="10:00 AM">
            10:00 AM
          </option>

          <option value="2:00 PM">
            2:00 PM
          </option>

          <option value="6:00 PM">
            6:00 PM
          </option>

        </select>

        <button
          style={searchBtn}
          onClick={handleSearch}
        >
          {loading
            ? "Searching..."
            : "Search"}
        </button>

      </div>

      {/* RESULTS */}

      <div style={resultsGrid}>

        {!loading &&
          hospitals.length === 0 && (

          <div style={emptyState}>

            <h2>
              🔍 No Results Yet
            </h2>

            <p>
              Search medical services
              to discover hospitals.
            </p>

          </div>

        )}

        {hospitals.map((h, i) => (

          <div
            key={i}
            style={hospitalCard}
          >

            {i === 0 && (

              <div style={bestBadge}>
                ⭐ Recommended
              </div>

            )}

            <div style={hospitalHeader}>

              <div>

                <h2 style={hospitalName}>
                  {h.name}
                </h2>

                <p style={address}>
                  📍 {h.address}
                </p>

              </div>

              <div style={ratingBox}>
                ⭐ {h.rating}
              </div>

            </div>

            {h.distance && (

              <p style={distance}>
                📏 {h.distance} km away
              </p>

            )}

            <div style={scoreBox}>
              AI Score:
              {" "}
              {h.score?.toFixed(2)}
            </div>

            <div style={servicesSection}>

              <h3 style={serviceHeading}>
                Available Services
              </h3>

              {h.services.map(
                (s, idx) => (

                  <div
                    key={idx}
                    style={serviceCard}
                  >

                    <div>

                      <h4 style={serviceName}>
                        {s.name}
                      </h4>

                      <p style={price}>
                        ₹{s.price}
                      </p>

                    </div>

                    <button
                      style={bookBtn}
                      onClick={() =>
                        handlePayment(h, s)
                      }
                    >
                      Pay & Book
                    </button>

                  </div>

                )
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

/* STYLES */

const page = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg,#eef2ff,#f8fafc)",
  padding: "30px"
};

const topbar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px",
  flexWrap: "wrap",
  gap: "20px"
};

const logo = {
  fontSize: "36px",
  color: "#4338ca",
  fontWeight: "800"
};

const logoSub = {
  color: "#6b7280"
};

const topBtns = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap"
};

const topBtn = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "14px",
  background: "white",
  cursor: "pointer",
  fontWeight: "600",
  boxShadow:
    "0 6px 20px rgba(0,0,0,0.08)"
};

const logoutBtn = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "14px",
  background:
    "linear-gradient(135deg,#ef4444,#dc2626)",
  color: "white",
  cursor: "pointer",
  fontWeight: "600"
};

const heroSection = {
  position: "relative",
  textAlign: "center",
  marginBottom: "40px",
  padding: "60px 20px",
  borderRadius: "30px",
  overflow: "hidden",
  background:
    "linear-gradient(135deg,#4f46e5,#8b5cf6)",
  color: "white"
};

const heroGlow = {
  position: "absolute",
  width: "300px",
  height: "300px",
  background:
    "rgba(255,255,255,0.2)",
  borderRadius: "50%",
  filter: "blur(80px)",
  top: "-50px",
  right: "-50px"
};

const heroTitle = {
  fontSize: "54px",
  marginBottom: "14px",
  position: "relative",
  zIndex: 2
};

const heroText = {
  fontSize: "18px",
  opacity: 0.9,
  position: "relative",
  zIndex: 2
};

const chipsRow = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "30px"
};

const chip = {
  padding: "10px 18px",
  borderRadius: "999px",
  border: "none",
  background: "white",
  cursor: "pointer",
  fontWeight: "600",
  boxShadow:
    "0 4px 14px rgba(0,0,0,0.08)"
};

const searchPanel = {
  background:
    "rgba(255,255,255,0.7)",
  backdropFilter: "blur(18px)",
  padding: "28px",
  borderRadius: "24px",
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "16px",
  marginBottom: "40px",
  boxShadow:
    "0 12px 30px rgba(0,0,0,0.08)"
};

const searchInput = {
  padding: "16px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  fontSize: "15px"
};

const locationBtn = {
  padding: "16px",
  borderRadius: "14px",
  border: "none",
  background:
    "linear-gradient(135deg,#10b981,#059669)",
  color: "white",
  cursor: "pointer",
  fontWeight: "600"
};

const dateInput = {
  padding: "16px",
  borderRadius: "14px",
  border: "1px solid #d1d5db"
};

const select = {
  padding: "16px",
  borderRadius: "14px",
  border: "1px solid #d1d5db"
};

const searchBtn = {
  padding: "16px",
  borderRadius: "14px",
  border: "none",
  background:
    "linear-gradient(135deg,#4f46e5,#8b5cf6)",
  color: "white",
  cursor: "pointer",
  fontWeight: "700",
  boxShadow:
    "0 8px 20px rgba(79,70,229,0.3)"
};

const resultsGrid = {
  display: "grid",
  gap: "28px"
};

const emptyState = {
  background: "white",
  padding: "60px",
  borderRadius: "24px",
  textAlign: "center",
  color: "#6b7280",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08)"
};

const hospitalCard = {
  background:
    "rgba(255,255,255,0.8)",
  backdropFilter: "blur(14px)",
  borderRadius: "28px",
  padding: "28px",
  position: "relative",
  boxShadow:
    "0 14px 40px rgba(0,0,0,0.08)",
  transition: "0.3s"
};

const bestBadge = {
  position: "absolute",
  top: "20px",
  right: "20px",
  background:
    "linear-gradient(135deg,#22c55e,#16a34a)",
  color: "white",
  padding: "10px 16px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "700"
};

const hospitalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "15px"
};

const hospitalName = {
  fontSize: "30px",
  marginBottom: "8px",
  color: "#111827"
};

const address = {
  color: "#6b7280"
};

const ratingBox = {
  background: "#fef3c7",
  padding: "10px 16px",
  borderRadius: "14px",
  fontWeight: "700"
};

const distance = {
  marginTop: "16px",
  color: "#4b5563"
};

const scoreBox = {
  marginTop: "16px",
  display: "inline-block",
  background: "#eef2ff",
  color: "#4338ca",
  padding: "10px 16px",
  borderRadius: "12px",
  fontWeight: "700"
};

const servicesSection = {
  marginTop: "32px"
};

const serviceHeading = {
  marginBottom: "18px",
  color: "#111827"
};

const serviceCard = {
  background: "white",
  padding: "20px",
  borderRadius: "18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "16px",
  flexWrap: "wrap",
  gap: "16px",
  boxShadow:
    "0 6px 20px rgba(0,0,0,0.05)"
};

const serviceName = {
  marginBottom: "6px",
  color: "#111827"
};

const price = {
  color: "#4f46e5",
  fontWeight: "700",
  fontSize: "18px"
};

const bookBtn = {
  padding: "14px 20px",
  border: "none",
  borderRadius: "14px",
  background:
    "linear-gradient(135deg,#4f46e5,#8b5cf6)",
  color: "white",
  cursor: "pointer",
  fontWeight: "700",
  boxShadow:
    "0 8px 20px rgba(79,70,229,0.25)"
};