// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Request interceptor: Attach fresh token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle authentication errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for authentication/authorization errors
    if (error.response?.status === 401 || error.response?.status === 407) {
      // Token expired or invalid - clear storage
      localStorage.removeItem("token");
      localStorage.removeItem("profilePic");
      
      // Redirect to login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
