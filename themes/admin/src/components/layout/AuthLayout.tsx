import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../../store/uiSlice';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { theme } = useAppSelector((state) => state.ui);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--bg-main)] p-4 relative transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-main)]">Admin Panel</h1>
          <p className="mt-2 text-[var(--text-muted)]">Secure Authentication</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-sm p-6 sm:p-8">
          {children}
        </div>

        <div className="mt-6 text-center text-sm text-[var(--text-muted)]">
          &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
        </div>
      </div>
    </div>
  );
};
