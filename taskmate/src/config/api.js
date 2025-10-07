// src/api/api.js
// Client AxioGunakan baseURL sesuai target:
// - Android emulator : http://10.0.2.2:4000
// - iOS simulator : http://localhost:4000
// - Device fisik : http://IP-LAPTOP-ANDA:4000

import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://10.74.11.38:4000',
  timeout: 8000,
  // headers: { 'Content-Type': 'application/json' },
});

export const API_BASE = 'http://10.74.11.38:4000';
