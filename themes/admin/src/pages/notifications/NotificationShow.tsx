import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { notificationService } from '../../store/hooks';
import { FiArrowLeft, FiClock, FiCheck } from 'react-icons/fi';

export const NotificationShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notification', id],
    queryFn: () => notificationService.getNotification(id!),
    enabled: !!id,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      // Invalidate both lists and single view
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      void queryClient.invalidateQueries({ queryKey: ['notification', id] });
    },
  });

  const notification = data?.data;

  useEffect(() => {
    // Automatically mark as read when viewed
    if (notification && !notification.read && id) {
      markAsReadMutation.mutate(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification, id]); // Intentionally not including markAsReadMutation to avoid loops

  if (isLoading) {
    return <div className="p-8 text-center text-[var(--text-muted)]">{t('loading', 'Loading...')}</div>;
  }

  if (isError || !notification) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{t('notification_not_found', 'Notification not found.')}</p>
        <button
          onClick={() => navigate('/admin/notifications')}
          className="text-blue-500 hover:underline"
        >
          {t('back_to_notifications', 'Back to notifications')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate('/admin/notifications')}
          className="p-2 text-[var(--text-muted)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-[var(--text-main)]">
          {notification.title || notification.data?.title || t('notification_details', 'Notification Details')}
        </h1>
      </div>

      <div className="bg-[var(--bg-card)] rounded-lg shadow-sm border border-[var(--border-color)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center text-sm text-[var(--text-muted)]">
            <FiClock className="w-4 h-4 mr-2" />
            {new Date(notification.created_at).toLocaleString()}
          </div>

          <div className="flex items-center">
            {notification.read ? (
               <span className="flex items-center text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                 <FiCheck className="w-4 h-4 mr-1" />
                 {t('read', 'Read')}
               </span>
            ) : (
               <span className="text-sm text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                 {t('unread', 'Unread')}
               </span>
            )}
          </div>
        </div>

        <div className="p-6">
          {notification.data && typeof notification.data === 'object' ? (
             <div className="prose dark:prose-invert max-w-none text-[var(--text-main)]">
                {/* Render specific fields if known, otherwise render a generic structure */}
                {notification.data.message ? (
                  <p>{notification.data.message}</p>
                ) : (
                  <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-md overflow-x-auto text-sm">
                    {JSON.stringify(notification.data, null, 2)}
                  </pre>
                )}
             </div>
          ) : (
             <p className="text-[var(--text-muted)]">{t('no_additional_data', 'No additional data available.')}</p>
          )}
        </div>
      </div>
    </div>
  );
};
