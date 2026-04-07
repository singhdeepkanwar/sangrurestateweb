import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend.sangrurestate.com/api';
export const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL || 'https://backend.sangrurestate.com';

// --- AXIOS INSTANCE ---
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh access token on 401, then retry original request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh: refreshToken });

        if (response.data.access) {
          const newAccessToken = response.data.access;
          localStorage.setItem('access_token', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed — clear session and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ---- AUTH ----
export const sendOtp = (phone) =>
  api.post('/auth/send-otp/', { phone });

export const verifyOtp = (session_id, otp_code) =>
  api.post('/auth/verify-otp/', { session_id, otp_code });

export const register = (registrationToken, profileData) =>
  api.post('/auth/register/', profileData, {
    headers: { Authorization: `Bearer ${registrationToken}` },
  });

export const getProfile = () =>
  api.get('/auth/profile/');

export const updateProfile = (data) =>
  api.patch('/auth/profile/', data);

export const logout = () => {
  const refresh = localStorage.getItem('refresh_token');
  return api.post('/auth/logout/', { refresh });
};

export const deleteAccount = () =>
  api.delete('/auth/delete-account/');

// ---- PROPERTIES ----
const ts = () => ({ _t: Date.now() });

export const getProperties = (params) =>
  api.get('/properties/', { params: { ...params, ...ts() } });

export const getProperty = (id) =>
  api.get(`/properties/${id}/`, { params: ts() });

export const getMyProperties = () =>
  api.get('/properties/my_properties/', { params: ts() });

export const toggleFavorite = (id) =>
  api.post(`/properties/${id}/toggle_favorite/`);

export const getFavorites = () =>
  api.get('/properties/favorites/', { params: ts() });

export const deleteProperty = (id) =>
  api.delete(`/properties/${id}/`);

export const updatePropertyStatus = (id, status) =>
  api.patch(`/properties/${id}/`, { status });

// ---- INQUIRIES ----
export const inquireProperty = (property) =>
  api.post('/inquiries/', { property });

export const getInquiries = () =>
  api.get('/inquiries/', { params: ts() });

// ---- AMENITIES ----
export const getAmenities = () =>
  api.get('/amenities/', { params: ts() });

// ---- PRE-LISTING ----
export const submitPreListing = (data) =>
  api.post('/pre-listings/', data);

// ---- FILE UPLOADS (fetch — avoids axios multipart boundary issues) ----
const uploadWithFetch = async (url, method, formData) => {
  const token = localStorage.getItem('access_token');

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      // No Content-Type — fetch sets it automatically with the correct boundary
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error('Upload failed');
    error.response = { data, status: response.status };
    throw error;
  }

  return data;
};

export const createProperty = (formData) =>
  uploadWithFetch(`${BASE_URL}/properties/`, 'POST', formData);

export const updateProperty = (id, formData) =>
  uploadWithFetch(`${BASE_URL}/properties/${id}/`, 'PATCH', formData);

export default api;
