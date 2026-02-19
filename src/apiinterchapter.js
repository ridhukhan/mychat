import axios from "axios"

const api = axios.create({
    baseURL: "https://authentication-tz5b.onrender.com/api",
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        // refreshToken header এ পাঠাও
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            config.headers["x-refresh-token"] = refreshToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const queues = { auth: [] };
const flags = { auth: false };

const processQueue = (type, error = null) => {
    queues[type].forEach((p) => (error ? p.reject(error) : p.resolve()));
    queues[type] = [];
};

const handleRefresh = async (type, endpoint, originalRequest) => {
    if (flags[type]) {
        return new Promise((resolve, reject) => {
            queues[type].push({ resolve, reject });
        }).then(() => api(originalRequest));
    }

    flags[type] = true;
    originalRequest._retry = true;

    try {
        const { data } = await api.post(endpoint);
        if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
        }
        processQueue(type);
        return api(originalRequest);
    } catch (err) {
        processQueue(type, err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
    } finally {
        flags[type] = false;
    }
};

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        return handleRefresh("auth", "/user/refresh", originalRequest);
    }
);

export default api;