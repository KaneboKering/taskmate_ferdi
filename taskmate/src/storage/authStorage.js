import { setItemAsync, deleteItemAsync, getItemAsync } from 'expo-secure-store';
import api from '../config/api';

export async function register(name, email, password) {
  try {
    await api.post('/auth/register', { name, email, password });
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Gagal mendaftar, coba lagi.';
    return { success: false, error: errorMessage };
  }
}

export async function login(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, userName } = response.data;
    
    await setItemAsync('authToken', token);
    await setItemAsync('userName', userName);
    
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login gagal, periksa kembali email dan password Anda.';
    return { success: false, error: errorMessage };
  }
}

export async function logout() {
  await deleteItemAsync('authToken');
  await deleteItemAsync('userName');
}

export async function getToken() {
  return await getItemAsync('authToken');
}