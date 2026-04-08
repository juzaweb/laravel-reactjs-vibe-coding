import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionHistories } from './hooks'
import { PageHeader } from '../../components/ui/PageHeader'
import type { SubscriptionHistory } from './types'

export const SubscriptionHistoriesList: React.FC = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const { data, isLoading } = useSubscriptionHistories(page, limit)

  const breadcrumbs = [
    { label: t('dashboard.title', 'Dashboard'), href: '/admin' },
    { label: t('subscription_histories.title', 'Subscription Histories') },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('subscription_histories.title', 'Subscription Histories')}
        breadcrumbs={breadcrumbs}
      />

      <div className="bg-[var(--bg-card)] rounded-lg shadow-sm border border-[var(--border-color)]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border-color)]">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('subscription_histories.module', 'Module')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('subscription_histories.plan', 'Plan')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">
                  {t('subscription_histories.method', 'Method')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('subscription_histories.amount', 'Amount')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('common.status', 'Status')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider hidden md:table-cell">
                  {t('subscription_histories.created_at', 'Created At')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--bg-card)] divide-y divide-[var(--border-color)]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-[var(--text-muted)]">
                    {t('common.loading', 'Loading...')}
                  </td>
                </tr>
              ) : !data?.data || data.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-[var(--text-muted)]">
                    {t('common.no_data', 'No data available')}
                  </td>
                </tr>
              ) : (
                data.data.map((history: SubscriptionHistory) => (
                  <tr key={history.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-main)]">
                      {history.module}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-main)]">
                      {history.plan?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-main)] hidden sm:table-cell">
                      {history.method?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-main)]">
                      ${history.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        history.status === 'success' || history.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : history.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : history.status === 'cancel' || history.status === 'error'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {t(`subscription_histories.status_${history.status}`, history.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)] hidden md:table-cell">
                      {history.created_at ? new Date(history.created_at).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.last_page > 1 && (
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] rounded-b-lg flex justify-between items-center">
            <span className="text-sm text-[var(--text-muted)]">
              {t('common.showing_page', 'Showing page {{current}} of {{total}}', { current: data.current_page, total: data.last_page })}
            </span>
            <div className="flex gap-2">
              <button
                disabled={data.current_page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[var(--text-main)] rounded disabled:opacity-50"
              >
                {t('common.previous', 'Previous')}
              </button>
              <button
                disabled={data.current_page === data.last_page}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[var(--text-main)] rounded disabled:opacity-50"
              >
                {t('common.next', 'Next')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
