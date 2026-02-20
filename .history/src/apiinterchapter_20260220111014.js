import axios from "axios";

// ✅ Create axios instance
const api = axios.create({
    baseURL: "https://mychat-q3ya.onrender.com/api", // তোমার backend URL
    withCredentials: true, // cookies pathanor jonno
});

// ✅ Request interceptor: attach accessToken, refreshToken, CSRF token
api.interceptors.request.use(
    (config) => {
        // Access Token
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        // Refresh Token
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            config.headers["x-refresh-token"] = refreshToken;
        }

        // CSRF Token
        const csrfToken = localStorage.getItem("csrfToken");
        if (csrfToken) {
            config.headers["x-csrf-token"] = csrfToken;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Queue for handling multiple simultaneous refresh requests
const queues = { auth: [] };
const flags = { auth: false };

const processQueue = (type, error = null) => {
    queues[type].forEach((p) => (error ? p.reject(error) : p.resolve()));
    queues[type] = [];
};

// ✅ Handle token refresh
const handleRefresh = async (type, endpoint, originalRequest) => {
    if (flags[type]) {
        return new Promise((resolve, reject) => {
            queues[type].push({ resolve, reject });
        }).then(() => api(originalRequest));
    }

    flags[type] = true;
    originalRequest._retry = true;

    try {
        const { data } = await api.post(endpoint); // /user/refresh
        if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
        if (data.csrfToken) localStorage.setItem("csrfToken", data.csrfToken);
        processQueue(type);
        return api(originalRequest);
    } catch (err) {
        processQueue(type, err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("csrfToken");
        window.location.href = "/login";
        return Promise.reject(err);
    } finally {
        flags[type] = false;
    }
};

// ✅ Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        // Ignore non-401 or already retried requests
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Try refresh token
        return handleRefresh("auth", "/user/refresh", originalRequest);
    }
);

export default api;