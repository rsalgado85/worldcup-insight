// ─── API Client ──────────────────────────────────────
import axios from 'axios';

const API_BASE_URL = 'https://worldcup26.ir';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry interceptor for unstable API
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    config.retryCount = config.retryCount || 0;
    if (config.retryCount < 2 && (!error.response || error.response.status >= 500)) {
      config.retryCount++;
      await new Promise(r => setTimeout(r, 1000));
      return apiClient(config);
    }
    if (error.response) {
      console.error(`API Error [${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      console.error('Network Error: No response received (timeout or CORS)');
    }
    return Promise.reject(error);
  }
);
