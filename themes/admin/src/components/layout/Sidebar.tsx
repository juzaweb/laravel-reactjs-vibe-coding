import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppSelector, usePermissions } from '../../store/hooks';
import { FiHome, FiUsers, FiSettings, FiImage, FiFileText, FiList, FiChevronDown, FiChevronRight, FiEdit, FiCreditCard } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export const Sidebar: React.FC = () => {
  const { isSidebarOpen } = useAppSelector((state) => state.ui);
  const { data: settings } = useAppSelector((state) => state.settings);
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const location = useLocation();

  const isBlogActive = location.pathname.startsWith('/admin/posts') || location.pathname.startsWith('/admin/categories');
  const [isBlogOpen, setIsBlogOpen] = useState(isBlogActive);

  const isPaymentActive = location.pathname.startsWith('/admin/payment');
  const [isPaymentOpen, setIsPaymentOpen] = useState(isPaymentActive);

  const isSubscriptionActive = location.pathname.startsWith('/admin/subscription');
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(isSubscriptionActive);

  const activeModules = settings?.active_modules || [];
  const isBlogModuleActive = activeModules.includes('Blog');
  const isPaymentModuleActive = activeModules.includes('Payment');
  const isSubscriptionModuleActive = activeModules.includes('Subscription');

  const navItems = [
    { name: t('dashboard'), path: '/admin', icon: FiHome, permission: null },
    { name: 'Media', path: '/admin/media', icon: FiImage, permission: 'media.index' },
    { name: t('pages', 'Pages'), path: '/admin/pages', icon: FiFileText, permission: 'pages.index' },
    ...(isBlogModuleActive
      ? [
          {
            name: t('blog', 'Blog'),
            icon: FiEdit,
            permission: null, // Depending on if there's a global blog permission
            children: [
              { name: t('posts', 'Posts'), path: '/admin/posts', permission: 'posts.index' },
              { name: t('categories', 'Categories'), path: '/admin/categories', permission: 'categories.index' },
            ],
          },
        ]
      : []),
    ...(isPaymentModuleActive
      ? [
          {
            name: t('payment', 'Payment'),
            icon: FiCreditCard,
            permission: null,
            children: [
              { name: t('orders', 'Orders'), path: '/admin/orders', permission: 'orders.index' },
              { name: t('payment_histories', 'Payment Histories'), path: '/admin/payment-histories', permission: 'payment_histories.index' },
              { name: t('payment_methods', 'Payment Methods'), path: '/admin/payment-methods', permission: 'payment_methods.index' },
            ],
          },
        ]
      : []),
    ...(isSubscriptionModuleActive
      ? [
          {
            name: t('subscription', 'Subscription'),
            icon: FiCreditCard,
            permission: null,
            children: [
              { name: t('plans', 'Plans'), path: '/admin/subscription/plans', permission: null },
              { name: t('subscriptions', 'Subscriptions'), path: '/admin/subscription/subscriptions', permission: null },
              { name: t('subscription_histories', 'Subscription Histories'), path: '/admin/subscription/histories', permission: null },
            ],
          },
        ]
      : []),
    { name: t('menus', 'Menus'), path: '/admin/menus', icon: FiList, permission: null },
    { name: t('users'), path: '/admin/users', icon: FiUsers, permission: 'users.index' },
    { name: t('settings'), path: '/admin/settings', icon: FiSettings, permission: 'settings.index' },
  ].filter(item => !item.permission || hasPermission(item.permission))
   .map(item => {
     if (item.children) {
       return {
         ...item,
         children: item.children.filter(child => !child.permission || hasPermission(child.permission))
       }
     }
     return item;
   }).filter(item => !item.children || item.children.length > 0);

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
        {navItems.map((item) => {
          if (item.children) {
            const isGroupActive = item.name === t('blog', 'Blog') ? isBlogActive : (item.name === t('payment', 'Payment') ? isPaymentActive : (item.name === t('subscription', 'Subscription') ? isSubscriptionActive : false));
            const isGroupOpen = item.name === t('blog', 'Blog') ? isBlogOpen : (item.name === t('payment', 'Payment') ? isPaymentOpen : (item.name === t('subscription', 'Subscription') ? isSubscriptionOpen : false));
            const toggleGroup = () => {
              if (item.name === t('blog', 'Blog')) setIsBlogOpen(!isBlogOpen);
              if (item.name === t('payment', 'Payment')) setIsPaymentOpen(!isPaymentOpen);
              if (item.name === t('subscription', 'Subscription')) setIsSubscriptionOpen(!isSubscriptionOpen);
            };

            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={toggleGroup}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 group ${
                    isGroupActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-[var(--text-muted)] hover:bg-slate-100 hover:text-[var(--text-main)] dark:hover:bg-slate-800'
                  }`}
                  title={!isSidebarOpen ? item.name : undefined}
                >
                  <item.icon
                    className={`flex-shrink-0 w-5 h-5 transition-colors duration-200 ${
                      !isSidebarOpen ? 'mx-auto' : 'mr-3'
                    }`}
                  />
                  <span
                    className={`flex-1 text-left transition-opacity duration-300 ${
                      !isSidebarOpen ? 'lg:opacity-0 lg:hidden' : 'opacity-100'
                    }`}
                  >
                    {item.name}
                  </span>
                  {isSidebarOpen && (
                    isGroupOpen ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />
                  )}
                </button>
                {isSidebarOpen && isGroupOpen && (
                  <div className="pl-11 space-y-1 mt-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.name}
                        to={child.path}
                        className={({ isActive }) =>
                          `block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'text-[var(--text-muted)] hover:bg-slate-100 hover:text-[var(--text-main)] dark:hover:bg-slate-800'
                          }`
                        }
                      >
                        {child.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
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
          );
        })}
      </nav>
    </aside>
  );
};
