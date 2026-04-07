import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { Button } from '../../components/ui/Button';
import { useUsers, useDeleteUser, useBulkUsers } from './hooks';
import { usePermissions } from '../../store/hooks';

export const UsersList: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { hasPermission } = usePermissions();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');

  const { data, isLoading, error } = useUsers(page, limit);
  const deleteUserMutation = useDeleteUser();
  const bulkUsersMutation = useBulkUsers();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && data?.data) {
      setSelectedIds(data.data.map(u => u.id));
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

    if (bulkAction === 'delete' && !window.confirm(t('are_you_sure_delete_selected_users', 'Are you sure you want to delete selected users?'))) {
      return;
    }

    try {
      await bulkUsersMutation.mutateAsync({ ids: selectedIds, action: bulkAction });
      setSelectedIds([]);
      setBulkAction('');
    } catch (err) {
      console.error('Failed to perform bulk action:', err);
      alert(t('error_bulk_action', 'Error performing bulk action'));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('are_you_sure_delete_user', 'Are you sure you want to delete this user?'))) {
      try {
        await deleteUserMutation.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete user:', err);
        alert(t('error_deleting_user', 'Error deleting user'));
      }
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{t('error_loading_users', 'Error loading users')}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">{t('users', 'Users')}</h1>
        {hasPermission('users.create') && (
          <Link to="/admin/users/create">
            <Button variant="primary" className="flex items-center gap-2">
              <FiPlus className="w-4 h-4" />
              {t('create_user', 'Create User')}
            </Button>
          </Link>
        )}
      </div>

      <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">

        <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-2">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
          >
            <option value="">{t('bulk_actions', 'Bulk Actions')}</option>
            <option value="active">{t('active', 'Active')}</option>
            <option value="inactive">{t('inactive', 'Inactive')}</option>
            {hasPermission('users.delete') && <option value="delete">{t('delete', 'Delete')}</option>}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkAction}
            disabled={!bulkAction || selectedIds.length === 0 || bulkUsersMutation.isPending}
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
                  {t('email', 'Email')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('status', 'Status')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--bg-card)] divide-y divide-[var(--border-color)]">
              {data?.data?.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap w-10">
                    <input
                      type="checkbox"
                      className="rounded border-[var(--border-color)] text-blue-600 focus:ring-blue-500"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => handleSelect(user.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[var(--text-main)]">{user.name}</div>
                        {user.is_super_admin && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 mt-1">Super Admin</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)]">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {t(`status_${user.status}`, user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {hasPermission('users.edit') && (
                        <Link to={`/admin/users/${user.id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            <FiEdit2 className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      {hasPermission('users.delete') && !user.is_super_admin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteUserMutation.isPending}
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
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--text-muted)]">
                    {t('no_users_found', 'No users found')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
