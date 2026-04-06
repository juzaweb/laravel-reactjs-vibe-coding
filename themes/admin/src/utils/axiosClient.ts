import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { Store } from '@reduxjs/toolkit';

// Extended request config to include _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Keep track of the injected store
let store: Store | null = null;

export const injectStore = (_store: Store) => {
  store = _store;
};

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (store) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const state = store.getState() as any;
      const token = state.auth?.accessToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (reason?: any) => void;
}> = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
        const { data } = await axios.post(`${baseURL}/v1/auth/user/refresh-token`, {}, {
          withCredentials: true, // often needed for sending httpOnly refresh cookies
        });

        const newAccessToken = data.accessToken || data.access_token || data.token;

        if (store && newAccessToken) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const state = store.getState() as any;
          store.dispatch({
            type: 'auth/setCredentials',
            payload: {
              accessToken: newAccessToken,
              user: state.auth?.user || data.user || null,
            }
          });
        }

        processQueue(null, newAccessToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return axiosClient(originalRequest);

      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;

        if (store) {
          store.dispatch({ type: 'auth/logOut' });
        }

        // Force redirect to login screen
        window.location.href = '/auth/login';

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
