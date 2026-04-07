import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import axiosClient from '../../utils/axiosClient';
import { fetchProfile } from '../../store/authSlice';

interface ProfileFormData {
  name: string;
}

export const ProfileForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { control, handleSubmit, reset } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
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
      alert(t('profile_updated_successfully', 'Profile updated successfully'));
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(t('error_updating_profile', 'Error updating profile'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">
          {t('profile', 'Profile')}
        </h1>
      </div>

      <div className="max-w-2xl bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
    </div>
  );
};
