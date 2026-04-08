import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosClient';

// Types
export interface User {
  id?: number | string;
  name?: string;
  email?: string;
  permissions?: string[];
  roles?: string[];
  has_all_permissions?: boolean;
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
  user?: User;
  data?: {
    user?: User;
    token?: {
      access_token?: string;
      token?: string;
    };
  };
  accessToken?: string;
  access_token?: string;
  token?: string;
}

// Helper to safely parse user from localStorage
const getUserFromStorage = (): User | null => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const initialAccessToken = localStorage.getItem('accessToken');
const initialUser = getUserFromStorage();

// Initial state
const initialState: AuthState = {
  user: initialUser,
  accessToken: initialAccessToken,
  isAuthenticated: !!initialAccessToken,
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

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/v1/profile');
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

        // Extract token depending on API response structure
        const token =
          action.payload.data?.token?.access_token ||
          action.payload.data?.token?.token ||
          action.payload.accessToken ||
          action.payload.access_token ||
          action.payload.token;

        // Extract user depending on API response structure
        const user = action.payload.data?.user || action.payload.user || null;

        state.accessToken = token || null;
        state.user = user;
        state.isAuthenticated = !!token;

        // Save to localStorage to persist session
        if (token) {
          localStorage.setItem('accessToken', token);
        }
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        const user = action.payload?.data || action.payload;
        if (user) {
          state.user = { ...state.user, ...user };
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      });
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
