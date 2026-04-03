import axios from "axios";

const url = `${import.meta.env.VITE_APP_BASE_URL}` || "http://localhost:8000";

const api = axios.create({
    baseURL: url,
    withCredentials: true,
});

// api.interceptors.request.use((config) => {
//   config.headers["ngrok-skip-browser-warning"] = "69420";
//   return config;
// });

export default api;
