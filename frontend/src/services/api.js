import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('accessToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ==================== PRODUCT APIs ====================

export const productAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach(cat => params.append('category', cat));
    }
    if (filters.branches && filters.branches.length > 0) {
      filters.branches.forEach(branch => params.append('branch', branch));
    }
    if (filters.years && filters.years.length > 0) {
      filters.years.forEach(year => params.append('year', year));
    }
    if (filters.conditions && filters.conditions.length > 0) {
      filters.conditions.forEach(cond => params.append('condition', cond));
    }
    if (filters.types && filters.types.length > 0) {
      filters.types.forEach(type => params.append('type', type));
    }
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const { data } = await api.get(`/products?${params}`);
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  create: async (formData) => {
    const { data } = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  update: async (id, productData) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  getMyListings: async () => {
    const { data } = await api.get('/products/user/my-listings');
    return data;
  },

  toggleSave: async (id) => {
    const { data } = await api.post(`/products/${id}/save`);
    return data;
  },

  getSaved: async () => {
    const { data } = await api.get('/products/user/saved');
    return data;
  },

  trackView: async (id) => {
    const { data } = await api.post(`/products/${id}/view`);
    return data;
  },
};

// ==================== USER APIs ====================

export const userAPI = {
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

export default api;
