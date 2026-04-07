import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { Button } from '../../components/ui/Button';
import { usePages, useDeletePage } from './hooks';
import { usePermissions } from '../../store/hooks';

export const PagesList: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { hasPermission } = usePermissions();

  const { data, isLoading, error } = usePages(page, limit);
  const deletePageMutation = useDeletePage();

  const handleDelete = async (id: string) => {
    if (window.confirm(t('are_you_sure_delete_page', 'Are you sure you want to delete this page?'))) {
      try {
        await deletePageMutation.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete page:', err);
        alert(t('error_deleting_page', 'Error deleting page'));
      }
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{t('error_loading_pages', 'Error loading pages')}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">{t('pages', 'Pages')}</h1>
        {hasPermission('pages.create') && (
          <Link to="/admin/pages/create">
            <Button variant="primary" className="flex items-center gap-2">
              <FiPlus className="w-4 h-4" />
              {t('create_page', 'Create Page')}
            </Button>
          </Link>
        )}
      </div>

      <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border-color)]">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('title', 'Title')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('status', 'Status')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('template', 'Template')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--bg-card)] divide-y divide-[var(--border-color)]">
              {data?.data?.map((page) => (
                <tr key={page.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[var(--text-main)]">{page.title}</div>
                    <div className="text-sm text-[var(--text-muted)]">{page.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      page.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {t(`status_${page.status}`, page.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)]">
                    {page.template || 'Default'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {hasPermission('pages.edit') && (
                        <Link to={`/admin/pages/${page.id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            <FiEdit2 className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      {hasPermission('pages.delete') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleDelete(page.id)}
                          disabled={deletePageMutation.isPending}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {(!data?.data || data.data.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[var(--text-muted)]">
                    {t('no_pages_found', 'No pages found')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        {data?.meta && data.meta.last_page > 1 && (
          <div className="px-6 py-4 border-t border-[var(--border-color)] flex items-center justify-between">
             <span className="text-sm text-[var(--text-muted)]">
               {t('showing', 'Showing')} {data.meta.from} {t('to', 'to')} {data.meta.to} {t('of', 'of')} {data.meta.total} {t('results', 'results')}
             </span>
             <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  {t('previous', 'Previous')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.meta.last_page}
                  onClick={() => setPage(p => p + 1)}
                >
                  {t('next', 'Next')}
                </Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
