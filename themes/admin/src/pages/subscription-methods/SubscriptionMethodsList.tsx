import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { useSubscriptionMethods, useDeleteSubscriptionMethod } from './hooks'
import { useAppSelector } from '../../store/hooks'

export function SubscriptionMethodsList() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const { currentLocale } = useAppSelector((state: any) => state.ui)

  const { data, isLoading } = useSubscriptionMethods(page, limit, '', currentLocale)
  const deleteMutation = useDeleteSubscriptionMethod()

  const handleDelete = async (id: string) => {
    if (window.confirm(t('common.delete_confirm'))) {
      await deleteMutation.mutateAsync(id)
      if (data?.data.length === 1 && page > 1) {
        setPage(page - 1)
      }
    }
  }

  if (isLoading) {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title={t('subscription_method.title', 'Subscription Methods')}
        breadcrumbs={[{ label: t('subscription.title', 'Subscription') }, { label: t('subscription_method.title', 'Subscription Methods') }]}
        actions={
          <div className="flex items-center space-x-2">
            <Link to="/admin/subscription-methods/create">
              <Button className="flex items-center gap-2">
                <FiPlus className="w-4 h-4" />
                {t('subscription_method.create', 'Add New')}
              </Button>
            </Link>
          </div>
        }
      />

      <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border-color)]">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('subscription_method.name', 'Name')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('subscription_method.driver', 'Driver')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('common.status', 'Status')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--bg-card)] divide-y divide-[var(--border-color)]">
              {data?.data?.map((method: any) => (
                <tr key={method.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[var(--text-main)]">{method.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)]">
                    {method.driver}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      method.active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {method.active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/subscription-methods/${method.id}/edit`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          <FiEdit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => handleDelete(method.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
