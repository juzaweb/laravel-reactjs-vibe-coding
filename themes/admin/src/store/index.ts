import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import authReducer from './authSlice';
import { injectStore } from '../utils/axiosClient';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
  },
});

// Inject store to axios client
injectStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
