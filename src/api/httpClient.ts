import axios from 'axios';
import { tokenStorage } from '@/core/storage/tokenStorage';

/**
 * Padanan `dioProvider` di `frontend-android/lib/core/network/api_client.dart`:
 * base URL + timeout + header Bearer otomatis + pembersihan token pada 401.
 */
const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

export const httpClient = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const token = tokenStorage.current;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

/** Dipasang oleh `store.ts` setelah store dibuat (hindari import melingkar). */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      tokenStorage.clear();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);
