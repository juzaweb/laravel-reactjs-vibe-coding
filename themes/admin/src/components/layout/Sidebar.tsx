import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector, usePermissions } from '../../store/hooks';
import { FiHome, FiUsers, FiSettings, FiBarChart2, FiImage, FiFileText, FiList } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export const Sidebar: React.FC = () => {
  const { isSidebarOpen } = useAppSelector((state) => state.ui);
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const navItems = [
    { name: t('dashboard'), path: '/admin', icon: FiHome, permission: null },
    { name: t('pages', 'Pages'), path: '/admin/pages', icon: FiFileText, permission: 'pages.index' },
    { name: t('menus', 'Menus'), path: '/admin/menus', icon: FiList, permission: null },
    { name: 'Media', path: '/admin/media', icon: FiImage, permission: 'media.index' },
    { name: t('analytics'), path: '/admin/analytics', icon: FiBarChart2, permission: null },
    { name: t('users'), path: '/admin/users', icon: FiUsers, permission: 'users.index' },
    { name: t('settings'), path: '/admin/settings', icon: FiSettings, permission: 'settings.index' },
  ].filter(item => !item.permission || hasPermission(item.permission));

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
