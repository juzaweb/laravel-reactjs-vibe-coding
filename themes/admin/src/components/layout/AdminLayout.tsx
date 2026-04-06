import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toggleSidebar } from '../../store/uiSlice';
import { Outlet } from 'react-router-dom';

export const AdminLayout: React.FC = () => {
  const { isSidebarOpen } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  return (
    <div className="flex h-screen bg-[var(--bg-main)] overflow-hidden transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => {
            dispatch(toggleSidebar());
          }}
        />
      )}
    </div>
  );
};
