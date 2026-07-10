import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// ── Refresh token queue ───────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
    failedQueue = [];
};

// ── Request: attach access token ──────────────────────────────────────────────
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response: auto-refresh on 401 ────────────────────────────────────────────
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    original.headers.Authorization = `Bearer ${token}`;
                    return api(original);
                });
            }

            original._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                clearAuthData();
                window.location.href = '/';
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
                    refresh: refreshToken,
                });
                localStorage.setItem('access_token', data.access);
                processQueue(null, data.access);
                original.headers.Authorization = `Bearer ${data.access}`;
                return api(original);
            } catch (refreshError) {
                processQueue(refreshError, null);
                clearAuthData();
                window.location.href = '/';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authAPI = {
    register: (userData) =>
        api.post('/auth/register/', {
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            password: userData.password,
            contact: userData.contact || '',
        }),

    verifyEmail: (data) =>
        api.post('/auth/verify-email/', { email: data.email, code: data.code }),

    resendVerificationCode: (data) =>
        api.post('/auth/resend-verification-code/', { email: data.email }),

    login: (credentials) =>
        api.post('/auth/login/', {
            email: credentials.email,
            password: credentials.password,
        }),

    logout: (refreshToken) =>
        api.post('/auth/logout/', { refresh: refreshToken }),

    getProfile: () => api.get('/users/profile/'),

    updateProfile: (userData) =>
        api.put('/users/profile/', {
            first_name: userData.firstName,
            last_name: userData.lastName,
        }),

    changePassword: (passwordData) =>
        api.post('/users/change-password/', {
            old_password: passwordData.oldPassword,
            new_password: passwordData.newPassword,
            confirm_password: passwordData.confirmPassword,
        }),
};

// ── Helpers ───────────────────────────────────────────────────────────────────
export const storeAuthData = (token, user, refreshToken = null) => {
    localStorage.setItem('access_token', token);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
    }));
};

export const clearAuthData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
};

export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => !!localStorage.getItem('access_token');

export default api;