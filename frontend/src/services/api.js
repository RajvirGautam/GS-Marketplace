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
      filters.categories.forEach(cat => params.append('categories', cat));
    }
    if (filters.branches && filters.branches.length > 0) {
      filters.branches.forEach(branch => params.append('branches', branch));
    }
    if (filters.years && filters.years.length > 0) {
      filters.years.forEach(year => params.append('years', year));
    }
    if (filters.conditions && filters.conditions.length > 0) {
      filters.conditions.forEach(cond => params.append('conditions', cond));
    }
    if (filters.types && filters.types.length > 0) {
      filters.types.forEach(type => params.append('types', type));
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

  getAnalytics: async () => {
    const { data } = await api.get('/products/user/analytics');
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

  analyzeImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const { data } = await api.post('/products/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  generateListing: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const { data } = await api.post('/ai/generate-listing', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  getPriceSuggestion: async (category, condition) => {
    const { data } = await api.get(`/products/price-suggestion?category=${category}&condition=${condition}`);
    return data;
  },
};


// ==================== USER APIs ====================

export const userAPI = {
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  updateProfile: async (profileData) => {
    const { data } = await api.put('/auth/update-profile', profileData);
    return data;
  },

  uploadAvatar: async (imageData) => {
    const { data } = await api.post('/auth/upload-avatar', { imageData });
    return data;
  },
};


// ==================== SELLER APIs ====================

export const sellerAPI = {
  getProfile: async (sellerId) => {
    const { data } = await api.get(`/products/seller/${sellerId}`);
    return data;
  },
};

// ==================== OFFER APIs ====================

export const offerAPI = {
  create: async (offerData) => {
    const { data } = await api.post('/offers', offerData);
    return data;
  },
  getReceived: async () => {
    const { data } = await api.get('/offers/received');
    return data;
  },
  getSent: async () => {
    const { data } = await api.get('/offers/sent');
    return data;
  },
  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/offers/${id}/status`, { status });
    return data;
  },
};

// ==================== DEAL APIs ====================

export const dealAPI = {
  getAll: async () => {
    const { data } = await api.get('/deals');
    return data;
  },
  confirmSold: async (id) => {
    const { data } = await api.patch(`/deals/${id}/confirm-sold`);
    return data;
  },
  submitReview: async (id, rating, comment) => {
    const { data } = await api.patch(`/deals/${id}/review`, { rating, comment });
    return data;
  },
};

// ==================== CHAT APIs ====================

export const chatAPI = {
  startConversation: async (productId) => {
    const { data } = await api.post('/chat/conversations', { productId });
    return data;
  },
  getConversations: async () => {
    const { data } = await api.get('/chat/conversations');
    return data;
  },
  getMessages: async (conversationId, page = 1) => {
    const { data } = await api.get(`/chat/conversations/${conversationId}/messages?page=${page}`);
    return data;
  },
  sendMessage: async (conversationId, content) => {
    const { data } = await api.post(`/chat/conversations/${conversationId}/messages`, { content });
    return data;
  },
  sendMedia: async (conversationId, file, caption = '') => {
    const formData = new FormData();
    formData.append('media', file);
    formData.append('caption', caption);
    const { data } = await api.post(`/chat/conversations/${conversationId}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append('media', file);
    const { data } = await api.post('/chat/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data; // { success, url, mediaType }
  },
  sendMediaMessage: async (conversationId, mediaUrl, mediaType, caption = '') => {
    const { data } = await api.post(`/chat/conversations/${conversationId}/media-url`, {
      mediaUrl, mediaType, caption
    });
    return data;
  },
  sendOffer: async (conversationId, amount, note = '') => {
    const { data } = await api.post(`/chat/conversations/${conversationId}/offer`, { amount, note });
    return data;
  },
  respondToOffer: async (messageId, status) => {
    const { data } = await api.patch(`/chat/messages/${messageId}/offer`, { status });
    return data;
  },
  deleteConversation: async (conversationId) => {
    const { data } = await api.delete(`/chat/conversations/${conversationId}`);
    return data;
  },
};

// ==================== LEGACY EXPORTS (for backward compatibility) ====================

export const getUserListings = () => productAPI.getMyListings();
export const getSavedProducts = () => productAPI.getSaved();
export const deleteProduct = (id) => productAPI.delete(id);
export const updateProductStatus = (id, status) => productAPI.update(id, { status });

export default api;