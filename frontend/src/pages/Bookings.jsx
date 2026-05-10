import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Bookings() {

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchBookings = async () => {

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {

        alert("Please login first");

        navigate("/login");

        return;
      }

      const res = await API.get(
        "/bookings",

        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setBookings(res.data);

    } catch (err) {

      console.log(err);

      if (
        err.response?.status === 401
      ) {

        alert(
          "Session expired. Please login again"
        );

        localStorage.clear();

        navigate("/login");

      } else {

        alert(
          "Failed to fetch bookings"
        );
      }

    } finally {

      setLoading(false);
    }
  };

  const handleCancel = async (
    bookingId
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      await API.put(
        `/bookings/${bookingId}/cancel`,
        {},

        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      alert(
        "Booking cancelled ❌"
      );

      fetchBookings();

    } catch {

      alert(
        "Failed to cancel booking"
      );
    }
  };

  useEffect(() => {

    fetchBookings();

  }, []);

  const totalBookings =
    bookings.length;

  const activeBookings =
    bookings.filter(
      (b) =>
        b.status !== "cancelled"
    ).length;

  const cancelledBookings =
    bookings.filter(
      (b) =>
        b.status === "cancelled"
    ).length;

  return (

    <div style={page}>

      {/* HEADER */}

      <div style={heroSection}>

        <div>

          <h1 style={title}>
            My Bookings
          </h1>

          <p style={subtitle}>
            Manage appointments,
            payments & schedules
          </p>

        </div>

        <button
          style={backBtn}
          onClick={() =>
            navigate("/")
          }
        >
          ← Back to Search
        </button>

      </div>

      {/* STATS */}

      <div style={statsGrid}>

        <div style={statCard}>
          <h3>Total Bookings</h3>

          <h1>
            {totalBookings}
          </h1>
        </div>

        <div style={statCard}>
          <h3>Active</h3>

          <h1>
            {activeBookings}
          </h1>
        </div>

        <div style={statCard}>
          <h3>Cancelled</h3>

          <h1>
            {cancelledBookings}
          </h1>
        </div>

      </div>

      {/* LOADING */}

      {loading ? (

        <div style={loadingCard}>

          <div style={loader}></div>

          <p>
            Loading your bookings...
          </p>

        </div>

      ) : bookings.length === 0 ? (

        /* EMPTY STATE */

        <div style={emptyCard}>

          <div style={emptyEmoji}>
            📅
          </div>

          <h2>
            No bookings yet
          </h2>

          <p style={emptyText}>
            Search hospitals &
            instantly book medical
            services.
          </p>

          <button
            style={searchBtn}
            onClick={() =>
              navigate("/")
            }
          >
            Search Services
          </button>

        </div>

      ) : (

        /* BOOKINGS */

        <div style={bookingsGrid}>

          {bookings.map((b, i) => (

            <div
              key={i}
              style={bookingCard}
            >

              {/* STATUS */}

              <div
                style={{
                  ...statusBadge,

                  background:
                    b.status ===
                    "cancelled"
                      ? "#fee2e2"
                      : "#dcfce7",

                  color:
                    b.status ===
                    "cancelled"
                      ? "#b91c1c"
                      : "#166534"
                }}
              >
                {b.status}
              </div>

              {/* TOP */}

              <div style={invoiceTop}>

                <div>

                  <p style={invoiceId}>
                    Booking #{i + 1}
                  </p>

                  <h2 style={serviceName}>
                    {b.serviceName}
                  </h2>

                </div>

                <div style={priceBox}>
                  ₹{b.price}
                </div>

              </div>

              {/* DETAILS */}

              <div style={detailsGrid}>

                <div style={detailCard}>
                  <span>🏥 Hospital</span>

                  <strong>
                    {b.hospitalName || "Unknown Hospital"}
                  </strong>
                </div>

                <div style={detailCard}>
                  <span>📍 Address</span>

                  <strong>
                    {b.hospitalAddress || "No address"}
                  </strong>
                </div>

                <div style={detailCard}>
                  <span>📅 Date</span>

                  <strong>
                    {b.date}
                  </strong>
                </div>

                <div style={detailCard}>
                  <span>⏰ Slot</span>

                  <strong>
                    {b.slot}
                  </strong>
                </div>

              </div>

              {/* TIMELINE */}

              <div style={timelineWrapper}>

                <div style={timeline}></div>

              </div>

              {/* ACTION */}

              {b.status !==
                "cancelled" && (

                <button
                  style={cancelBtn}
                  onClick={() =>
                    handleCancel(
                      b._id
                    )
                  }
                >
                  Cancel Booking
                </button>

              )}

            </div>

          ))}

        </div>

      )}
    </div>
  );
}

/* STYLES */

const page = {
  minHeight: "100vh",
  padding: "40px",
  background:
    "linear-gradient(135deg,#eef2ff,#f8fafc)"
};

const heroSection = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "20px",
  marginBottom: "40px"
};

const title = {
  fontSize: "52px",
  fontWeight: "800",
  color: "#111827",
  marginBottom: "8px"
};

const subtitle = {
  color: "#6b7280",
  fontSize: "17px"
};

const backBtn = {
  padding: "15px 22px",
  border: "none",
  borderRadius: "16px",
  background:
    "linear-gradient(135deg,#4f46e5,#8b5cf6)",
  color: "white",
  cursor: "pointer",
  fontWeight: "700",
  boxShadow:
    "0 8px 24px rgba(79,70,229,0.3)"
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "22px",
  marginBottom: "40px"
};

const statCard = {
  background:
    "rgba(255,255,255,0.7)",
  backdropFilter: "blur(18px)",
  padding: "28px",
  borderRadius: "24px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08)"
};

const loadingCard = {
  background: "white",
  padding: "60px",
  borderRadius: "24px",
  textAlign: "center",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08)"
};

const loader = {
  width: "60px",
  height: "60px",
  border:
    "6px solid #e5e7eb",
  borderTop:
    "6px solid #4f46e5",
  borderRadius: "50%",
  margin: "0 auto 20px",
  animation:
    "spin 1s linear infinite"
};

const emptyCard = {
  background:
    "rgba(255,255,255,0.75)",
  backdropFilter: "blur(18px)",
  padding: "70px 30px",
  borderRadius: "28px",
  textAlign: "center",
  maxWidth: "650px",
  margin: "0 auto",
  boxShadow:
    "0 14px 40px rgba(0,0,0,0.08)"
};

const emptyEmoji = {
  fontSize: "80px",
  marginBottom: "20px"
};

const emptyText = {
  marginTop: "12px",
  marginBottom: "30px",
  color: "#6b7280",
  fontSize: "16px"
};

const searchBtn = {
  padding: "16px 24px",
  border: "none",
  borderRadius: "16px",
  background:
    "linear-gradient(135deg,#4f46e5,#8b5cf6)",
  color: "white",
  cursor: "pointer",
  fontWeight: "700"
};

const bookingsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(350px,1fr))",
  gap: "28px"
};

const bookingCard = {
  background:
    "rgba(255,255,255,0.75)",
  backdropFilter: "blur(18px)",
  padding: "28px",
  borderRadius: "28px",
  position: "relative",
  boxShadow:
    "0 14px 40px rgba(0,0,0,0.08)"
};

const statusBadge = {
  position: "absolute",
  top: "22px",
  right: "22px",
  padding: "9px 16px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "700",
  textTransform: "capitalize"
};

const invoiceTop = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  marginBottom: "26px",
  flexWrap: "wrap",
  gap: "16px"
};

const invoiceId = {
  color: "#6b7280",
  marginBottom: "8px"
};

const serviceName = {
  fontSize: "30px",
  color: "#111827"
};

const priceBox = {
  background:
    "linear-gradient(135deg,#4f46e5,#8b5cf6)",
  color: "white",
  padding: "14px 18px",
  borderRadius: "16px",
  fontWeight: "700",
  fontSize: "20px"
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns:
    "1fr 1fr",
  gap: "16px",
  marginBottom: "28px"
};

const detailCard = {
  background: "white",
  padding: "18px",
  borderRadius: "18px",
  boxShadow:
    "0 6px 16px rgba(0,0,0,0.05)"
};

const timelineWrapper = {
  marginBottom: "28px"
};

const timeline = {
  width: "100%",
  height: "8px",
  borderRadius: "999px",
  background:
    "linear-gradient(90deg,#4f46e5,#8b5cf6)"
};

const cancelBtn = {
  width: "100%",
  padding: "16px",
  border: "none",
  borderRadius: "16px",
  background:
    "linear-gradient(135deg,#ef4444,#dc2626)",
  color: "white",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "15px"
};