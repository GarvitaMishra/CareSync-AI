import {
  HashRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { useEffect, useState } from "react";

import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookings from "./pages/Bookings";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminAnalytics from "./pages/AdminAnalytics";

import Chatbot from "./components/Chatbot";

/* AUTH HELPERS */

const getToken = () => {
  return localStorage.getItem("token");
};

const getRole = () => {
  return localStorage.getItem("role");
};

const isLoggedIn = () => {
  return !!getToken();
};

/* LOADING SCREEN */

const LoadingScreen = () => {
  return (
    <div style={loadingContainer}>

      <div style={loader}></div>

      <h2 style={loadingText}>
        CareSync AI
      </h2>

    </div>
  );
};

/* PRIVATE ROUTE */

const PrivateRoute = ({ children }) => {
  return isLoggedIn()
    ? children
    : <Navigate to="/login" replace />;
};

/* OWNER ROUTE */

const OwnerRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return getRole() === "hospital"
    ? children
    : <Navigate to="/" replace />;
};

/* ADMIN ROUTE */

const AdminRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return getRole() === "admin"
    ? children
    : <Navigate to="/" replace />;
};

/* AUTH REDIRECT */

const AuthRedirect = () => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (getRole() === "hospital") {
    return <Navigate to="/owner" replace />;
  }

  if (getRole() === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/search" replace />;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);

  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <HashRouter>

      <Routes>

        {/* DEFAULT */}
        <Route path="/" element={<AuthRedirect />} />

        {/* PUBLIC */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* USER */}
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <PrivateRoute>
              <Bookings />
            </PrivateRoute>
          }
        />

        {/* OWNER */}
        <Route
          path="/owner"
          element={
            <OwnerRoute>
              <OwnerDashboard />
            </OwnerRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminAnalytics />
            </AdminRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

      {/* GLOBAL CHATBOT */}
      <Chatbot />

    </HashRouter>
  );
}

export default App;

/* STYLES */

const loadingContainer = {
  width: "100%",
  height: "100vh",
  background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "25px"
};

const loader = {
  width: "70px",
  height: "70px",
  border: "6px solid rgba(255,255,255,0.25)",
  borderTop: "6px solid white",
  borderRadius: "50%",
  animation: "spin 1s linear infinite"
};

const loadingText = {
  color: "white",
  fontSize: "42px",
  fontWeight: "700",
  letterSpacing: "1px"
};


