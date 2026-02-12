import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 second timeout
});

// Add auth token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle responses globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 - token expired or invalid
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            // Only redirect if not already on login/register/landing
            if (!['/login', '/register', '/'].includes(currentPath)) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }

        // Handle network errors
        if (!error.response && error.code === 'ECONNABORTED') {
            error.message = 'Request timed out. Please try again.';
        } else if (!error.response) {
            error.message = 'Network error. Please check your connection.';
        }

        return Promise.reject(error);
    }
);

export default api;
