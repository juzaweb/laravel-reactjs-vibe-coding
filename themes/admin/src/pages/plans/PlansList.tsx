import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader } from '../../components/ui/PageHeader'
import { usePlans, useDeletePlan, useBulkPlan } from './hooks'
import type { Plan } from './types'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Select } from '../../components/ui/form/Select'

export const PlansList: React.FC = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const perPage = 10
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState('')

  const { data, isLoading } = usePlans({
    page,
    limit: perPage,
  })

  const deleteMutation = useDeletePlan()
  const bulkMutation = useBulkPlan()

  const handleDelete = async (id: string) => {
    if (window.confirm(t('common.confirm_delete'))) {
      try {
        await deleteMutation.mutateAsync(id)
        toast.success(t('common.deleted_successfully'))
      } catch (error) {
        toast.error(t('common.delete_failed'))
      }
    }
  }

  const handleBulkAction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bulkAction || selectedIds.length === 0) return

    if (bulkAction === 'delete' && !window.confirm(t('common.confirm_delete_selected'))) {
      return
    }

    try {
      await bulkMutation.mutateAsync({ ids: selectedIds, action: bulkAction })
      toast.success(t('common.action_successful'))
      setSelectedIds([])
      setBulkAction('')
    } catch (error) {
      toast.error(t('common.action_failed'))
    }
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && data?.data) {
      setSelectedIds(data.data.map((item: Plan) => item.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const breadcrumbs = [
    { label: t('dashboard.title', 'Dashboard'), href: '/admin' },
    { label: t('plans.title', 'Plans') },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('plans.title', 'Plans')}
        breadcrumbs={breadcrumbs}
        actions={
          <Link
            to="/admin/subscription/plans/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiPlus />
            {t('plans.add_new', 'Add New')}
          </Link>
        }
      />

      <div className="bg-[var(--bg-card)] rounded-lg shadow-sm border border-[var(--border-color)]">
        <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-card)] rounded-t-lg">
          <form onSubmit={handleBulkAction} className="flex items-center gap-2">
            <Select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="min-w-[150px]"
              options={[
                  { value: '', label: t('common.bulk_actions', 'Bulk Actions') },
                  { value: '1', label: t('common.active', 'Active') },
                  { value: '0', label: t('common.inactive', 'Inactive') },
                  { value: 'delete', label: t('common.delete', 'Delete') },
              ]}
            >
            </Select>
            <button
              type="submit"
              disabled={!bulkAction || selectedIds.length === 0}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-[var(--text-main)] rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              {t('common.apply', 'Apply')}
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border-color)]">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-900 dark:border-slate-600"
                    onChange={handleSelectAll}
                    checked={!!(data?.data?.length && selectedIds.length === data.data.length)}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('plans.name', 'Name')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">
                  {t('plans.price', 'Price')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider hidden md:table-cell">
                  {t('plans.duration', 'Duration')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('common.status', 'Status')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('common.actions', 'Actions')}
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
                data.data.map((plan: Plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-900 dark:border-slate-600"
                        checked={selectedIds.includes(plan.id)}
                        onChange={() => handleSelect(plan.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/admin/subscription/plans/${plan.id}/edit`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                        {plan.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      {plan.is_free ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">{t('plans.free', 'Free')}</span>
                      ) : (
                        <span className="text-[var(--text-main)]">{plan.price ? `$${plan.price}` : '-'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)] hidden md:table-cell">
                      {(!plan.duration || !plan.duration_unit) ? '-' : `${plan.duration} ${plan.duration_unit}(s)`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        plan.active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {plan.active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/subscription/plans/${plan.id}/edit`}
                          className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                          title={t('common.edit', 'Edit')}
                        >
                          <FiEdit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                          title={t('common.delete', 'Delete')}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data?.meta && data.meta.last_page > 1 && (
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] rounded-b-lg flex justify-between items-center">
            <span className="text-sm text-[var(--text-muted)]">
              {t('common.showing_page', 'Showing page {{current}} of {{total}}', { current: data.meta.current_page, total: data.meta.last_page })}
            </span>
            <div className="flex gap-2">
              <button
                disabled={data.meta.current_page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[var(--text-main)] rounded disabled:opacity-50"
              >
                {t('common.previous', 'Previous')}
              </button>
              <button
                disabled={data.meta.current_page === data.meta.last_page}
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
