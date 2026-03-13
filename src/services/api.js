import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      console.log('API Request Interceptor - userInfo found:', !!userInfoStr);
      
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        console.log('API Request Interceptor - token extracted:', !!userInfo?.token);
        
        if (userInfo && userInfo.token) {
           config.headers['Authorization'] = `Bearer ${userInfo.token}`;
        }
      }
    } catch (e) {
      console.error('API Request Interceptor Error:', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  console.log('API Login Response Data:', response.data);
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    console.log('Saved to localStorage:', localStorage.getItem('userInfo'));
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  console.log('API Register Response Data:', response.data);
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('userInfo');
};

export const getDiscoverUsers = async () => {
  const response = await api.get('/users/discover');
  return response.data;
};

export const getMatches = async () => {
  const response = await api.get('/users/matches');
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
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

export default api;
