import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isAxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/form/Select';
import { useUser, useCreateUser, useUpdateUser } from './hooks';
import type { UserFormData } from './types';
import { PageHeader } from '../../components/ui/PageHeader';

export const UserForm: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: userData, isLoading: isLoadingUser } = useUser(id || '');
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const { control, handleSubmit, reset, setError } = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      status: 'active',
      password: '',
      password_confirmation: '',
    },
  });

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || '',
        email: userData.email || '',
        status: userData.status || 'active',
      });
    }
  }, [userData, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEditMode && id) {
        await updateUserMutation.mutateAsync({ id, data });
      } else {
        await createUserMutation.mutateAsync(data);
      }
      navigate('/admin/users');
    } catch (error) {
      console.error('Failed to save user:', error);
      if (isAxiosError(error) && error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors) {
          Object.keys(errors).forEach((key) => {
            setError(key as keyof UserFormData, {
              type: 'server',
              message: errors[key][0],
            });
          });
        }
      }
    }
  };

  if (isEditMode && isLoadingUser) {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  const isSubmitting = createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={isEditMode ? t('edit_user', 'Edit User') : t('create_user', 'Create User')}
        breadcrumbs={[
          { label: t('users', 'Users'), href: '/admin/users' },
          { label: isEditMode ? t('edit', 'Edit') : t('create', 'Create') }
        ]}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/admin/users')}>
              {t('cancel', 'Cancel')}
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? t('saving', 'Saving...') : t('save', 'Save')}
            </Button>
          </>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] p-6 space-y-6">
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label={t('name', 'Name')}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address"
                }
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="email"
                  label={t('email', 'Email')}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{ required: !isEditMode ? 'Password is required' : false }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="password"
                  label={t('password', 'Password')}
                  error={fieldState.error?.message}
                  placeholder={isEditMode ? t('leave_blank_to_keep_current', 'Leave blank to keep current password') : ''}
                />
              )}
            />

            <Controller
              name="password_confirmation"
              control={control}
              rules={{
                 validate: (val: string | undefined, formValues: UserFormData) => {
                     if (formValues.password && val !== formValues.password) {
                         return "Passwords do no match";
                     }
                 }
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="password"
                  label={t('confirm_password', 'Confirm Password')}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] p-6 space-y-6">
            <h3 className="text-lg font-medium text-[var(--text-main)]">{t('status', 'Status')}</h3>

            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  label={t('status', 'Status')}
                  options={[
                    { value: 'active', label: t('active', 'Active') },
                    { value: 'inactive', label: t('inactive', 'Inactive') },
                    { value: 'banned', label: t('banned', 'Banned') },
                  ]}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
