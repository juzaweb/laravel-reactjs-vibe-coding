import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { Button } from '../../components/ui/Button';
import { useBannerAds, useDeleteBannerAd, useBulkBannerAds } from './hooks';
import { usePermissions } from '../../store/hooks';
import { PageHeader } from '../../components/ui/PageHeader';

export const BannerAdsList: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { hasPermission } = usePermissions();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');

  const { data, isLoading, error } = useBannerAds(page, limit);
  const deleteBannerAdMutation = useDeleteBannerAd();
  const bulkBannerAdsMutation = useBulkBannerAds();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && data?.data) {
      setSelectedIds(data.data.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.length === 0) return;

    if (bulkAction === 'delete' && !window.confirm(t('are_you_sure_delete_selected_banner_ads', 'Are you sure you want to delete selected banner ads?'))) {
      return;
    }

    try {
      await bulkBannerAdsMutation.mutateAsync({ ids: selectedIds, action: bulkAction });
      setSelectedIds([]);
      setBulkAction('');
    } catch (err) {
      console.error('Failed to perform bulk action:', err);
      alert(t('error_bulk_action', 'Error performing bulk action'));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('are_you_sure_delete_banner_ad', 'Are you sure you want to delete this banner ad?'))) {
      try {
        await deleteBannerAdMutation.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete banner ad:', err);
        alert(t('error_deleting_banner_ad', 'Error deleting banner ad'));
      }
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{t('error_loading_banner_ads', 'Error loading banner ads')}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title={t('banner_ads', 'Banner Ads')}
        breadcrumbs={[{ label: t('banner_ads', 'Banner Ads') }]}
        actions={
          hasPermission('banner-ads.create') ? (
            <Link to="/admin/banner-ads/create">
              <Button variant="primary" className="flex items-center gap-2">
                <FiPlus className="w-4 h-4" />
                {t('create_banner_ads', 'Create Banner Ads')}
              </Button>
            </Link>
          ) : undefined
        }
      />

      <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-2">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
          >
            <option value="">{t('bulk_actions', 'Bulk Actions')}</option>
            <option value="activate">{t('activate', 'Activate')}</option>
            <option value="deactivate">{t('deactivate', 'Deactivate')}</option>
            {hasPermission('banner-ads.delete') && <option value="delete">{t('delete', 'Delete')}</option>}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkAction}
            disabled={!bulkAction || selectedIds.length === 0 || bulkBannerAdsMutation.isPending}
          >
            {t('apply', 'Apply')}
          </Button>
          {selectedIds.length > 0 && (
            <span className="text-sm text-[var(--text-muted)] ml-2">
              {selectedIds.length} {t('selected', 'selected')}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border-color)]">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    className="rounded border-[var(--border-color)] text-blue-600 focus:ring-blue-500"
                    onChange={handleSelectAll}
                    checked={data?.data && data.data.length > 0 && selectedIds.length === data.data.length}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('name', 'Name')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('position', 'Position')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('type', 'Type')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('status', 'Status')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('clicks', 'Clicks')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('views', 'Views')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--bg-card)] divide-y divide-[var(--border-color)]">
              {data?.data?.map((banner) => (
                <tr key={banner.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap w-10">
                    <input
                      type="checkbox"
                      className="rounded border-[var(--border-color)] text-blue-600 focus:ring-blue-500"
                      checked={selectedIds.includes(banner.id)}
                      onChange={() => handleSelect(banner.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[var(--text-main)]">{banner.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[var(--text-main)]">{banner.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[var(--text-main)]">{t(`type_${banner.type}`, banner.type)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      banner.active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {banner.active ? t('active', 'Active') : t('inactive', 'Inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[var(--text-main)]">{banner.click}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[var(--text-main)]">{banner.views}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {hasPermission('banner-ads.edit') && (
                        <Link to={`/admin/banner-ads/${banner.id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            <FiEdit2 className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      {hasPermission('banner-ads.delete') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleDelete(banner.id)}
                          disabled={deleteBannerAdMutation.isPending}
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
                  <td colSpan={8} className="px-6 py-8 text-center text-[var(--text-muted)]">
                    {t('no_banner_ads_found', 'No banner ads found')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
