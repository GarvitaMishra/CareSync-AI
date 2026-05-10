import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import { Bar, Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function AdminAnalytics() {

  const [totalBookings, setTotalBookings] = useState(0);

  const [revenue, setRevenue] = useState(0);

  const [popularService, setPopularService] = useState({});

  const [topHospital, setTopHospital] = useState({});

  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchAnalytics = async () => {

    try {

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const [bRes, rRes, pRes, hRes] =
        await Promise.all([

          API.get(
            "/bookings/analytics/total-bookings",
            { headers }
          ),

          API.get(
            "/bookings/analytics/revenue",
            { headers }
          ),

          API.get(
            "/bookings/analytics/popular-service",
            { headers }
          ),

          API.get(
            "/bookings/analytics/top-hospital",
            { headers }
          )

        ]);

      setTotalBookings(
        bRes.data.totalBookings
      );

      setRevenue(
        rRes.data.revenue
      );

      setPopularService(
        pRes.data
      );

      setTopHospital(
        hRes.data
      );

    } catch (err) {

      console.log(err);

      alert("Failed to load analytics");
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleLogout = () => {

    localStorage.clear();

    navigate("/login");
  };

  /* CHARTS */

  const barData = {
    labels: ["Bookings", "Revenue"],

    datasets: [
      {
        label: "Platform Stats",

        data: [
          totalBookings,
          revenue
        ],

        backgroundColor: [
          "#6366f1",
          "#8b5cf6"
        ],

        borderRadius: 12
      }
    ]
  };

  const pieData = {
    labels: [
      popularService.service || "Service"
    ],

    datasets: [
      {
        data: [
          popularService.bookings || 0
        ],

        backgroundColor: [
          "#4f46e5"
        ]
      }
    ]
  };

  return (

    <div style={page}>

      {/* TOPBAR */}

      <div style={topbar}>

        <div>

          <h1 style={title}>
            Admin Analytics
          </h1>

          <p style={subtitle}>
            Platform overview & insights
          </p>

        </div>

        {/* PROFILE */}

        <div style={profileWrapper}>

          <button
            style={profileBtn}
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            👨‍💼 Admin ▾
          </button>

          {menuOpen && (

            <div style={dropdown}>

              <button
                style={dropdownBtn}
                onClick={() => navigate("/")}
              >
                🏠 Home
              </button>

              <button
                style={dropdownBtn}
                onClick={() => navigate("/admin")}
              >
                📊 Dashboard
              </button>

              <button
                style={logoutBtn}
                onClick={handleLogout}
              >
                🚪 Logout
              </button>

            </div>

          )}

        </div>

      </div>

      {/* STATS */}

      <div style={statsGrid}>

        <div style={card}>
          <h3 style={cardTitle}>
            Total Bookings
          </h3>

          <h1 style={cardValue}>
            {totalBookings}
          </h1>

          <p style={cardSub}>
            All platform bookings
          </p>
        </div>

        <div style={card}>
          <h3 style={cardTitle}>
            Revenue
          </h3>

          <h1 style={cardValue}>
            ₹{revenue}
          </h1>

          <p style={cardSub}>
            Total earnings
          </p>
        </div>

        <div style={card}>
          <h3 style={cardTitle}>
            Popular Service
          </h3>

          <h1 style={smallValue}>
            {popularService.service || "N/A"}
          </h1>

          <p style={cardSub}>
            {popularService.bookings || 0}
            {" "}bookings
          </p>
        </div>

        <div style={card}>
          <h3 style={cardTitle}>
            Top Hospital
          </h3>

          <h1 style={smallValue}>
            {topHospital.hospitalName || "N/A"}
          </h1>

          <p style={cardSub}>
            {topHospital.count || 0}
            {" "}bookings
          </p>
        </div>

      </div>

      {/* CHARTS */}

      <div style={chartsGrid}>

        <div style={chartCard}>

          <h2 style={chartTitle}>
            Revenue & Booking Stats
          </h2>

          <Bar data={barData} />

        </div>

        <div style={chartCard}>

          <h2 style={chartTitle}>
            Popular Service
          </h2>

          <Pie data={pieData} />

        </div>

      </div>

      {/* ACTIVITY */}

      <div style={activityCard}>

        <h2 style={chartTitle}>
          Recent Activity
        </h2>

        <div style={activityItem}>
          📅 {totalBookings} bookings processed
        </div>

        <div style={activityItem}>
          💰 ₹{revenue} revenue generated
        </div>

        <div style={activityItem}>
          🏥 {topHospital.hospitalName || "Hospital"}
          {" "}is performing best
        </div>

        <div style={activityItem}>
          ⭐ {popularService.service || "Service"}
          {" "}is trending
        </div>

      </div>

    </div>
  );
}

/* STYLES */

const page = {
  minHeight: "100vh",
  background: "#f3f4f6",
  padding: "40px"
};

const topbar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px",
  position: "relative"
};

const title = {
  fontSize: "42px",
  color: "#111827",
  marginBottom: "8px"
};

const subtitle = {
  color: "#6b7280",
  fontSize: "16px"
};

const profileWrapper = {
  position: "relative"
};

const profileBtn = {
  padding: "14px 20px",
  border: "none",
  borderRadius: "14px",
  background:
    "linear-gradient(135deg, #4f46e5, #8b5cf6)",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
  boxShadow:
    "0 8px 20px rgba(79,70,229,0.3)"
};

const dropdown = {
  position: "absolute",
  right: 0,
  top: "65px",
  background: "white",
  borderRadius: "18px",
  padding: "12px",
  width: "220px",
  boxShadow:
    "0 12px 30px rgba(0,0,0,0.15)",
  zIndex: 99
};

const dropdownBtn = {
  width: "100%",
  padding: "14px",
  border: "none",
  background: "#f3f4f6",
  borderRadius: "12px",
  marginBottom: "10px",
  cursor: "pointer",
  textAlign: "left",
  fontWeight: "600"
};

const logoutBtn = {
  width: "100%",
  padding: "14px",
  border: "none",
  background: "#ef4444",
  color: "white",
  borderRadius: "12px",
  cursor: "pointer",
  textAlign: "left",
  fontWeight: "600"
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "24px",
  marginBottom: "40px"
};

const card = {
  background: "white",
  padding: "28px",
  borderRadius: "24px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08)"
};

const cardTitle = {
  color: "#6b7280",
  marginBottom: "14px",
  fontSize: "16px"
};

const cardValue = {
  fontSize: "42px",
  color: "#111827",
  marginBottom: "10px"
};

const smallValue = {
  fontSize: "24px",
  color: "#111827",
  marginBottom: "10px"
};

const cardSub = {
  color: "#9ca3af",
  fontSize: "14px"
};

const chartsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "30px",
  marginBottom: "40px"
};

const chartCard = {
  background: "white",
  padding: "30px",
  borderRadius: "24px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08)"
};

const chartTitle = {
  marginBottom: "25px",
  color: "#111827"
};

const activityCard = {
  background: "white",
  padding: "30px",
  borderRadius: "24px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08)"
};

const activityItem = {
  padding: "16px",
  borderRadius: "14px",
  background: "#f9fafb",
  marginBottom: "14px",
  color: "#374151"
};