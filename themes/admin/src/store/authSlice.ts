import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosClient';

// Types
export interface User {
  id?: number | string;
  name?: string;
  email?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'failed';
}

interface LoginPayload {
  user: User;
  accessToken?: string;
  access_token?: string;
  token?: string;
}

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  status: 'idle',
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (credentials: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/v1/auth/user/login', credentials);
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (data: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/v1/auth/user/register', data);
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (data: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/v1/auth/user/forgot-password', data);
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (data: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/v1/auth/user/reset-password/${data.token}`, data);
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (data: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/v1/auth/user/email/verify/${data.id}/${data.hash}`);
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerificationEmail',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (data: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/v1/auth/user/resend-verification-email', data);
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User | null; accessToken: string | null }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = !!action.payload.accessToken;
    },
    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.status = 'idle';

      // Optionally clear localStorage here if tokens were synced
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginPayload>) => {
        state.status = 'idle';
        const token = action.payload.accessToken || action.payload.access_token || action.payload.token;

        state.accessToken = token || null;
        state.user = action.payload.user || null;
        state.isAuthenticated = !!token;

        // Optionally save to localStorage
        if (token) {
          localStorage.setItem('accessToken', token);
        }
        if (action.payload.user) {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
