import { configureStore } from '@reduxjs/toolkit';
import settingReducer from './settingSlice';

export const store = configureStore({
  reducer: {
    settings: settingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
