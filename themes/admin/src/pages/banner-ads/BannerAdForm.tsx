import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isAxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/form/Select';
import { useBannerAd, useCreateBannerAd, useUpdateBannerAd } from './hooks';
import type { BannerAdFormData } from './types';
import { PageHeader } from '../../components/ui/PageHeader';
import { MediaPlaceholder } from '../../components/ui/form/MediaPlaceholder';

export const BannerAdForm: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: bannerAdData, isLoading: isLoadingBannerAd } = useBannerAd(id || '');

  const createBannerAdMutation = useCreateBannerAd();
  const updateBannerAdMutation = useUpdateBannerAd();

  const { control, handleSubmit, reset, watch, setError } = useForm<BannerAdFormData>({
    defaultValues: {
      name: '',
      type: 'image',
      active: 1,
      position: '',
      url: '',
      body_image: '',
      body_html: '',
    },
  });

  const type = watch('type');

  useEffect(() => {
    if (bannerAdData) {
      reset({
        name: bannerAdData.name || '',
        type: bannerAdData.type || 'image',
        active: bannerAdData.active ? 1 : 0,
        position: bannerAdData.position || '',
        url: bannerAdData.url || '',
        body_image: bannerAdData.type === 'image' && typeof bannerAdData.body === 'string' ? bannerAdData.body.match(/src='([^']+)'/)?.[1] || bannerAdData.body.match(/src="([^"]+)"/)?.[1] || '' : '',
        body_html: bannerAdData.type === 'html' ? bannerAdData.body || '' : '',
      });
    }
  }, [bannerAdData, reset]);

  const onSubmit = async (data: BannerAdFormData) => {
    try {
      if (isEditMode && id) {
        await updateBannerAdMutation.mutateAsync({ id, data });
      } else {
        await createBannerAdMutation.mutateAsync(data);
      }
      navigate('/admin/banner-ads');
    } catch (error) {
      console.error('Failed to save banner ad:', error);
      if (isAxiosError(error) && error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors) {
          Object.keys(errors).forEach((key) => {
            setError(key as keyof BannerAdFormData, {
              type: 'server',
              message: errors[key][0],
            });
          });
        }
      }
    }
  };

  if (isEditMode && isLoadingBannerAd) {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  const isSubmitting = createBannerAdMutation.isPending || updateBannerAdMutation.isPending;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={isEditMode ? t('edit_banner_ads', 'Edit Banner Ads') : t('create_banner_ads', 'Create Banner Ads')}
        breadcrumbs={[
          { label: t('banner_ads', 'Banner Ads'), href: '/admin/banner-ads' },
          { label: isEditMode ? t('edit', 'Edit') : t('create', 'Create') }
        ]}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/admin/banner-ads')}>
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
              name="position"
              control={control}
              rules={{ required: 'Position is required' }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label={t('position', 'Position')}
                  error={fieldState.error?.message}
                />
              )}
            />

            {type === 'image' && (
               <Controller
                 name="url"
                 control={control}
                 render={({ field, fieldState }) => (
                   <Input
                     {...field}
                     label={t('url', 'URL')}
                     error={fieldState.error?.message}
                   />
                 )}
               />
            )}

            {type === 'html' && (
              <Controller
                name="body_html"
                control={control}
                rules={{ required: type === 'html' ? 'HTML code is required' : false }}
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                     <label className="block text-sm font-medium text-[var(--text-main)]">{t('html_code', 'HTML Code')}</label>
                     <textarea
                       {...field}
                       className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-card)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                       rows={6}
                     />
                     {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                  </div>
                )}
              />
            )}

            {type === 'image' && (
              <Controller
                 name="body_image"
                 control={control}
                 rules={{ required: type === 'image' ? 'Image is required' : false }}
                 render={({ field, fieldState }) => (
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-[var(--text-main)]">{t('image', 'Image')}</label>
                      <MediaPlaceholder
                        value={field.value || undefined}
                        onChange={field.onChange}

                      />
                      {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                    </div>
                 )}
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] p-6 space-y-6">
            <Controller
              name="type"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  label={t('type', 'Type')}
                  options={[
                    { value: 'image', label: t('image', 'Image') },
                    { value: 'html', label: t('html', 'HTML') },
                  ]}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="active"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  value={field.value.toString()}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  label={t('status', 'Status')}
                  options={[
                    { value: '1', label: t('active', 'Active') },
                    { value: '0', label: t('inactive', 'Inactive') },
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
