import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPhotoUrl = (path) => {
  if (!path) return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  if (path.startsWith('http')) return path;
  return `http://localhost:5000${path}`;
};



export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // Server handles session via cookie
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data; // Server handles session via cookie
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const getDiscoverUsers = async () => {
  const response = await api.get('/users/discover');
  return response.data;
};

export const getMatches = async () => {
  const response = await api.get('/users/matches');
  return response.data;
};

export const getPendingLikes = async () => {
  const response = await api.get('/users/pending');
  return response.data;
};

export const getIncomingLikes = async () => {
  const response = await api.get('/users/incoming');
  return response.data;
};

export const actionUser = async (targetUserId, action) => {
  const response = await api.post('/users/action', { targetUserId, action });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default api;
