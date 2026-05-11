import axios from "axios";

// ✅ DEPLOYMENT SAFE BASE URL
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://caresync-ai-v7wg.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
});

// ✅ AUTO TOKEN ATTACH
API.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

// ✅ AUTO HANDLE SESSION EXPIRE
API.interceptors.response.use(

  (response) => response,

  (error) => {

    if (
      error.response?.status === 401
    ) {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      window.location.href =
        "/login";
    }

    return Promise.reject(error);
  }
);

export default API;