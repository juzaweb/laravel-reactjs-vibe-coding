import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { FiHome, FiUsers, FiSettings, FiBarChart2, FiImage } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export const Sidebar: React.FC = () => {
  const { isSidebarOpen } = useAppSelector((state) => state.ui);
  const { t } = useTranslation();

  const navItems = [
    { name: t('dashboard'), path: '/', icon: FiHome },
    { name: 'Media', path: '/media', icon: FiImage },
    { name: t('analytics'), path: '/analytics', icon: FiBarChart2 },
    { name: t('users'), path: '/users', icon: FiUsers },
    { name: t('settings'), path: '/settings', icon: FiSettings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 bg-[var(--bg-card)] border-r border-[var(--border-color)] transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:w-20'
      }`}
    >
      <div className="flex h-16 items-center justify-center border-b border-[var(--border-color)] px-4">
        <h1
          className={`text-xl font-bold text-[var(--text-main)] transition-opacity duration-300 ${
            !isSidebarOpen && 'lg:opacity-0 lg:hidden'
          }`}
        >
          Admin Pro
        </h1>
        {/* Placeholder for collapsed state icon */}
        <div className={`text-xl font-bold text-blue-600 hidden ${!isSidebarOpen && 'lg:block'}`}>
          AP
        </div>
      </div>

      <nav className="mt-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-[var(--text-muted)] hover:bg-slate-100 hover:text-[var(--text-main)] dark:hover:bg-slate-800'
              }`
            }
            title={!isSidebarOpen ? item.name : undefined}
          >
            <item.icon
              className={`flex-shrink-0 w-5 h-5 transition-colors duration-200 ${
                !isSidebarOpen ? 'mx-auto' : 'mr-3'
              }`}
            />
            <span
              className={`transition-opacity duration-300 ${
                !isSidebarOpen ? 'lg:opacity-0 lg:hidden' : 'opacity-100'
              }`}
            >
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
