import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const AUTH_401_SKIP = [
    '/auth/login/',
    '/auth/register/',
    '/auth/verify-email/',
    '/auth/resend-verification-code/',
    '/auth/forgotpassword/',
    '/auth/forgotpassreset',
];
const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } });
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
    failedQueue = [];
};

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use((response) => response, async (error) => {
    const original = error.config;
    const url = original?.url || '';
    if (AUTH_401_SKIP.some((path) => url.includes(path))) {
        return Promise.reject(error);
    }
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
            window.location.href = '/login';
            return Promise.reject(error);
        }
        try {
            const { data } = await axios.post(`${API_BASE_URL}/auth/refresh/`, { refresh: refreshToken });
            localStorage.setItem('access_token', data.access);
            processQueue(null, data.access);
            original.headers.Authorization = `Bearer ${data.access}`;
            return api(original);
        } catch (refreshError) {
            processQueue(refreshError, null);
            clearAuthData();
            window.location.href = '/login';
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
    return Promise.reject(error);
});

export const homePathForRole = (role) => {
    if (role === 'admin') return '/admin';
    if (role === 'merchant') return '/merchant';
    return '/';
};

export const merchantAPI = {
    getSales: (days = 30) => api.get('/merchant/sales/', { params: { days } }),
    getProducts: () => api.get('/merchant/products/'),
    createProduct: (data) => api.post('/merchant/products/', data),
    updateProduct: (id, data) => api.put(`/merchant/products/${id}/`, data),
    deleteProduct: (id) => api.delete(`/merchant/products/${id}/`),
};

export const PCSpecs = {
    getPCSpecs: () => api.get('/pcspec/'),
};

export const pointsAPI = {
    getBalance: () => api.get('/points/'),
    getHistory: () => api.get('/pointsuser/'),
};

export const productAPI = {
    getAll: (category = null, search = '') =>
        api.get('/products/', {
            params: {
                ...(category ? { category } : {}),
                ...(search ? { search } : {}),
            },
        }),
    getOne: (id) => api.get(`/products/${id}/`),
    getRecommended: () => api.get('/products/recommended/'),
};

export const machineLearningAPI = {
    getClusters: (clusters = 3) => api.get('/ml/clusters/', { params: { clusters } }),
    getForecast: (days = 7) => api.get('/ml/forecast/', { params: { days } }),
    getRecommendations: (limit = 8) => api.get('/ml/recommendations/', { params: { limit } }),
};

export const cartAPI = {
    getCart: () => api.get('/cart/'),
    addItem: (productId, quantity = 1) =>
        api.post('/cart/add/', { product_id: productId, quantity }),
    updateItem: (itemId, quantity) =>
        api.put(`/cart/items/${itemId}/`, { quantity }),
    removeItem: (itemId) => api.delete(`/cart/items/${itemId}/`),
    clearCart: () => api.delete('/cart/'),
};

export const orderAPI = {
    createOrder: (data) => api.post('/orders/create/', data),
    getOrders: () => api.get('/orders/'),
    getOrder: (id) => api.get(`/orders/${id}/`),
};

export const authAPI = {
    register: (userData) =>
        api.post('/auth/register/', {
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            password: userData.password,
            user_type: userData.userType,
            ...(userData.contact && { contact: userData.contact }),
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
    googleLogin: (credential) => api.post('/auth/google/', { credential }),
    logout: (refreshToken) =>
        api.post('/auth/logout/', { refresh: refreshToken }),
    getProfile: () => api.get('/users/profile/'),
    updateProfile: (userData) => {
        const formData = new FormData();
        formData.append('first_name', userData.firstName);
        formData.append('last_name', userData.lastName);
        formData.append('contact', userData.contact || '');
        formData.append('addresses', userData.addresses || '');
        if (userData.picture) formData.append('picture', userData.picture);
        return api.put('/users/profile/', formData);
    },
    changePassword: (passwordData) =>
        api.post('/users/change-password/', {
            old_password: passwordData.oldPassword,
            new_password: passwordData.newPassword,
            confirm_password: passwordData.confirmPassword,
        }),
    forgotpassword: (emailOrData) => {
        const email = typeof emailOrData === 'string' ? emailOrData : emailOrData?.email;
        return api.post('/auth/forgotpassword/', { email });
    },
    resetPassword: (data) => {
        const safeData = data || {};
        return api.post('/auth/forgotpassreset', {
            usid: safeData.usid,
            token: safeData.token,
            new_password: safeData.newPassword || safeData.new_password,
        });
    },
};

export const adminAPI = {
    getUsers: (search = '') => api.get('/staff/users/', { params: { search } }),
    createUser: (data) => api.post('/staff/users/', data),
    deleteUser: (userId) => api.delete(`/staff/users/${userId}/`),
    getOrders: (status = '') => api.get('/staff/orders/', { params: status ? { status } : {} }),
    getProducts: () => api.get('/staff/products/'),
};

export const storeAuthData = (access_token, user, refresh_token = null) => {
    localStorage.setItem('access_token', access_token);
    if (refresh_token) localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        picture: user.picture || null,
        usertype: user.user_type || null,
        role: user.role || 'user',
        branch: user.branch || '',
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
