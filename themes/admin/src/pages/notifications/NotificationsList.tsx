import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { notificationService } from './hooks';
import { FiBell, FiCheck, FiEye } from 'react-icons/fi';

export const NotificationsList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', page, perPage],
    queryFn: () => notificationService.getNotifications({ page, per_page: perPage }),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      // Invalidate and refetch notifications
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsReadMutation.mutate(id);
  };

  const handleView = (id: string) => {
    navigate(`/admin/notifications/${id}`);
  };

  const notifications = data?.data?.data || [];
  const meta = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">
          {t('notifications', 'Notifications')}
        </h1>
      </div>

      <div className="bg-[var(--bg-card)] rounded-lg shadow-sm border border-[var(--border-color)] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[var(--text-muted)]">
            {t('loading', 'Loading...')}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-muted)] flex flex-col items-center">
            <FiBell className="w-12 h-12 mb-4 opacity-50" />
            <p>{t('no_notifications_found', 'No notifications found.')}</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 flex items-start justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!notification.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                onClick={() => handleView(notification.id)}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <p className={`text-base font-medium truncate ${!notification.read ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
                    {notification.title || notification.data?.title || t('new_notification', 'New notification')}
                  </p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleView(notification.id); }}
                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                    title={t('view', 'View')}
                  >
                    <FiEye className="w-5 h-5" />
                  </button>

                  {!notification.read && (
                    <button
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                      disabled={markAsReadMutation.isPending}
                      className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-full transition-colors"
                      title={t('mark_as_read', 'Mark as read')}
                    >
                      <FiCheck className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Simple Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="px-4 py-3 border-t border-[var(--border-color)] flex items-center justify-between sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-[var(--text-muted)]">
                  {t('showing')} <span className="font-medium">{meta.from}</span> {t('to')} <span className="font-medium">{meta.to}</span> {t('of')} <span className="font-medium">{meta.total}</span> {t('results')}
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-[var(--border-color)] bg-[var(--bg-card)] text-sm font-medium text-[var(--text-muted)] hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                  >
                    {t('previous')}
                  </button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === meta.last_page || isLoading}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-[var(--border-color)] bg-[var(--bg-card)] text-sm font-medium text-[var(--text-muted)] hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                  >
                    {t('next')}
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
