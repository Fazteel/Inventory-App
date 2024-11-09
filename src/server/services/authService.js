import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const checkAuthStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { needsRelogin: true };
    }

    const response = await axios.get(`${API_URL}/auth/verify`, {
      headers: {
        // Tambahkan prefix 'Bearer ' saat mengirim token
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.token) {
      // Simpan token baru tanpa prefix 'Bearer '
      localStorage.setItem('token', response.data.token);
    }

    return {
      needsRelogin: false,
      user: response.data.user
    };
  } catch (error) {
    console.error('Auth status check error:', error);
    
    // Handle different error cases
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      return { needsRelogin: true };
    }
    
    if (error.response?.data?.needsRelogin) {
      localStorage.removeItem('token');
      return { needsRelogin: true };
    }
    
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });

    if (response.data.token) {
      // Simpan token tanpa prefix 'Bearer '
      localStorage.setItem('token', response.data.token);
      return response.data;
    }
    throw new Error('Login failed');
  } catch (error) {
    throw error.response?.data?.msg || 'Login failed';
  }
};

// Tambahkan axios interceptor untuk menangani token secara global
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Tambahkan prefix 'Bearer ' saat mengirim request
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tambahkan axios interceptor untuk menangani response
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  checkAuthStatus,
  login
};