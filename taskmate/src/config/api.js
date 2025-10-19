import axios from 'axios';
import { getToken } from '../storage/authStorage';

export const API_BASE = 'http://192.168.1.7:4000'; // <-- GANTI DENGAN IP ANDA

const api = axios.create({
  baseURL: API_BASE,
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;