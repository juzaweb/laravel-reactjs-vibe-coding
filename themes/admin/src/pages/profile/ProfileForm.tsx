import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isAxiosError } from 'axios';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import axiosClient from '../../utils/axiosClient';
import { fetchProfile } from '../../store/authSlice';
import { PageHeader } from '../../components/ui/PageHeader';
import { MediaPlaceholder } from '../../components/ui/form/MediaPlaceholder';
import toast from 'react-hot-toast';

interface ProfileFormData {
  name: string;
  avatar: string;
}

interface PasswordFormData {
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

const ChangePasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { control, handleSubmit, reset, setError } = useForm<PasswordFormData>({
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data: PasswordFormData) => {
    setIsSubmitting(true);
    try {
      await axiosClient.put('/v1/profile/password', data);
      toast.success(t('password_updated_successfully', 'Password updated successfully'));
      reset();
    } catch (error) {
      console.error('Failed to update password:', error);
      if (isAxiosError(error) && error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors) {
          Object.keys(errors).forEach((key) => {
            setError(key as keyof PasswordFormData, {
              type: 'server',
              message: errors[key][0],
            });
          });
        }
      } else {
        toast.error(t('failed_to_update_password', 'Failed to update password'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] p-6 mt-6">
      <h2 className="text-xl font-semibold mb-6">{t('change_password', 'Change Password')}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="current_password"
          control={control}
          rules={{ required: 'Current password is required' }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="password"
              label={t('current_password', 'Current Password')}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: 'New password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="password"
              label={t('new_password', 'New Password')}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="password_confirmation"
          control={control}
          rules={{ required: 'Password confirmation is required' }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="password"
              label={t('confirm_password', 'Confirm Password')}
              error={fieldState.error?.message}
            />
          )}
        />
        <div className="flex justify-end">
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('saving', 'Saving...') : t('update_password', 'Update Password')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export const ProfileForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { control, handleSubmit, reset, setError } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      avatar: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        avatar: user.avatar || '',
      });
    } else {
      void dispatch(fetchProfile());
    }
  }, [user, reset, dispatch]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await axiosClient.put('/v1/profile', data);
      await dispatch(fetchProfile());
      toast.success(t('profile_updated_successfully', 'Profile updated successfully'));
    } catch (error) {
      console.error('Failed to update profile:', error);
      if (isAxiosError(error) && error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors) {
          Object.keys(errors).forEach((key) => {
            setError(key as keyof ProfileFormData, {
              type: 'server',
              message: errors[key][0],
            });
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={t('profile', 'Profile')}
        breadcrumbs={[{ label: t('profile', 'Profile') }]}
      />

      <div className="max-w-2xl bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="avatar"
            control={control}
            render={({ field, fieldState }) => (
              <MediaPlaceholder
                {...field}
                label={t('avatar', 'Avatar')}
                error={fieldState.error?.message}
                className="w-32 h-32 rounded-full mx-auto"
              />
            )}
          />

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

          <div className="flex justify-end">
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('saving', 'Saving...') : t('save', 'Save')}
            </Button>
          </div>
        </form>
      </div>

      <ChangePasswordForm />
    </div>
  );
};
