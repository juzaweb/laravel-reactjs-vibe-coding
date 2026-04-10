import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiSave } from 'react-icons/fi';
import { Button } from '../../components/ui/Button';
import { useVideoAd, useCreateVideoAd, useUpdateVideoAd } from './hooks';
import type { VideoAdFormData } from './types';
import { PageHeader } from '../../components/ui/PageHeader';

export const VideoAdsForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: videoAd, isLoading: isAdLoading } = useVideoAd(id);
  const createMutation = useCreateVideoAd();
  const updateMutation = useUpdateVideoAd(id || '');

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<VideoAdFormData>({
    defaultValues: {
      name: '',
      title: '',
      url: '',
      video: '',
      position: 'pre-roll',
      offset: 0,
      active: true,
    }
  });

  useEffect(() => {
    if (videoAd && isEditing) {
      reset({
        name: videoAd.name,
        title: videoAd.title,
        url: videoAd.url,
        video: videoAd.video,
        position: videoAd.position,
        offset: videoAd.offset,
        active: videoAd.active,
      });
    }
  }, [videoAd, isEditing, reset]);

  const onSubmit = async (data: VideoAdFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
      navigate('/admin/video-ads');
    } catch (error) {
      console.error('Failed to save video ad:', error);
      alert(t('error_saving', 'Error saving data'));
    }
  };

  if (isEditing && isAdLoading) {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title={isEditing ? t('edit_video_ad', 'Edit Video Ad') : t('create_video_ad', 'Create Video Ad')}
        breadcrumbs={[
          { label: t('video_ads', 'Video Ads') },
          { label: isEditing ? t('edit', 'Edit') : t('create', 'Create') }
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                  {t('name', 'Name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('name', { required: t('required', 'This field is required') })}
                  className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--bg-main)] text-[var(--text-main)]"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                  {t('title', 'Title')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('title', { required: t('required', 'This field is required') })}
                  className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--bg-main)] text-[var(--text-main)]"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                  {t('url', 'Target URL')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  {...register('url', { required: t('required', 'This field is required') })}
                  className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--bg-main)] text-[var(--text-main)]"
                />
                {errors.url && <p className="mt-1 text-sm text-red-500">{errors.url.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                  {t('video_url', 'Video URL')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  {...register('video', { required: t('required', 'This field is required') })}
                  className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--bg-main)] text-[var(--text-main)]"
                />
                {errors.video && <p className="mt-1 text-sm text-red-500">{errors.video.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                  {t('position', 'Position')} <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('position', { required: t('required', 'This field is required') })}
                  className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--bg-main)] text-[var(--text-main)]"
                >
                  <option value="pre-roll">Pre-roll</option>
                  <option value="mid-roll">Mid-roll</option>
                  <option value="post-roll">Post-roll</option>
                </select>
                {errors.position && <p className="mt-1 text-sm text-red-500">{errors.position.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                  {t('offset', 'Offset')} (seconds) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('offset', { required: t('required', 'This field is required'), valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--bg-main)] text-[var(--text-main)]"
                />
                {errors.offset && <p className="mt-1 text-sm text-red-500">{errors.offset.message}</p>}
              </div>

              <div className="flex items-center gap-2 mt-6">
                <Controller
                  name="active"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      id="active"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="rounded border-[var(--border-color)] text-blue-600 focus:ring-blue-500"
                    />
                  )}
                />
                <label htmlFor="active" className="text-sm font-medium text-[var(--text-main)]">
                  {t('active', 'Active')}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-[var(--border-color)] flex items-center justify-end gap-3">
          <Link to="/admin/video-ads">
            <Button type="button" variant="outline">
              {t('cancel', 'Cancel')}
            </Button>
          </Link>
          <Button type="submit" variant="primary" disabled={isSaving} className="flex items-center gap-2">
            <FiSave className="w-4 h-4" />
            {isSaving ? t('saving', 'Saving...') : t('save', 'Save')}
          </Button>
        </div>
      </form>
    </div>
  );
};
