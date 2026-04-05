import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar, toggleTheme } from '../../store/uiSlice';
import { FiMenu, FiSun, FiMoon, FiBell } from 'react-icons/fi';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.ui);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-colors duration-300">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        onClick={() => dispatch(toggleSidebar())}
      >
        <span className="sr-only">Toggle sidebar</span>
        <FiMenu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            onClick={() => dispatch(toggleTheme())}
          >
            <span className="sr-only">Toggle theme</span>
            {theme === 'dark' ? (
              <FiSun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <FiMoon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className="-m-2.5 p-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            <span className="sr-only">View notifications</span>
            <FiBell className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-[var(--border-color)]" aria-hidden="true" />

          <div className="relative">
            <button
              type="button"
              className="-m-1.5 flex items-center p-1.5 focus:outline-none"
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full bg-slate-50 border border-[var(--border-color)]"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-[var(--text-main)]" aria-hidden="true">
                  Tom Cook
                </span>
                <svg className="ml-2 h-5 w-5 text-[var(--text-muted)]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
