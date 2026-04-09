import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  theme: 'light' | 'dark';
  isSidebarOpen: boolean;
}

const getInitialSidebarState = (): boolean => {
  const savedSidebarState = localStorage.getItem('isSidebarOpen');

  if (savedSidebarState === 'true') {
    return true;
  }

  if (savedSidebarState === 'false') {
    return false;
  }

  return true;
};

const getInitialTheme = (): 'light' | 'dark' => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialState: UiState = {
  theme: getInitialTheme(),
  isSidebarOpen: getInitialSidebarState(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', state.theme);
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
      localStorage.setItem('isSidebarOpen', String(state.isSidebarOpen));
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
      localStorage.setItem('isSidebarOpen', String(state.isSidebarOpen));
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, setSidebarOpen } = uiSlice.actions;

export default uiSlice.reducer;
