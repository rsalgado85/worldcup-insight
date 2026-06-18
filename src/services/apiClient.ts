// ─── API Client ──────────────────────────────────────
import axios from 'axios';

// Proxy local para evitar CORS — Vercel rewrites /api/* → https://worldcup26.ir/*
// En desarrollo local, vite.config.ts hace el proxy.
const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,  // 5s — API is unreliable, fallback fast to local data
  headers: {
    'Content-Type': 'application/json',
  },
});

// No retries — API is down permanently. Fall through to cached/static data.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      console.error(`API Error [${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      console.warn('🌐 API offline — using cached/local data');
    }
    return Promise.reject(error);
  }
);
