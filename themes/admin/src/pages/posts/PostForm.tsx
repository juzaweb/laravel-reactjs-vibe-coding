import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isAxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/form/Select';
import { Editor } from '../../components/ui/form/Editor';
import { MediaPlaceholder } from '../../components/ui/form/MediaPlaceholder';
import { usePost, useCreatePost, useUpdatePost } from './hooks';
import type { PostFormData } from './types';
import { PageHeader } from '../../components/ui/PageHeader';
import { FiEdit2 } from 'react-icons/fi';

export const PostForm: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [isSlugEditable, setIsSlugEditable] = useState(false);

  const { data: postData, isLoading: isLoadingPost } = usePost(id || '');
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();

  const { control, handleSubmit, reset, setValue, setError } = useForm<PostFormData>({
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      thumbnail: '',
      status: 'published',
    },
  });

  useEffect(() => {
    if (postData) {
      reset({
        title: postData.title || '',
        slug: postData.slug || '',
        content: postData.content || '',
        thumbnail: postData.thumbnail || '',
        status: postData.status || 'published',
      });
    }
  }, [postData, reset]);

  useEffect(() => {
    setIsSlugEditable(false);
  }, [id]);

  const onSubmit = async (data: PostFormData) => {
    try {
      if (isEditMode && id) {
        await updatePostMutation.mutateAsync({ id, data });
      } else {
        await createPostMutation.mutateAsync(data);
      }
      navigate('/admin/posts');
    } catch (error) {
      console.error('Failed to save post:', error);
      if (isAxiosError(error) && error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors) {
          Object.keys(errors).forEach((key) => {
            setError(key as keyof PostFormData, {
              type: 'server',
              message: errors[key][0],
            });
          });
        }
      }
    }
  };

  if (isEditMode && isLoadingPost) {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  const isSubmitting = createPostMutation.isPending || updatePostMutation.isPending;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={isEditMode ? t('edit_post', 'Edit Post') : t('create_post', 'Create Post')}
        breadcrumbs={[
          { label: t('posts', 'Posts'), href: '/admin/posts' },
          { label: isEditMode ? t('edit', 'Edit') : t('create', 'Create') }
        ]}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/admin/posts')}>
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
              name="title"
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label={t('title', 'Title')}
                  error={fieldState.error?.message}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e);
                    if (!isEditMode && !postData && !isSlugEditable) {
                       const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                       setValue('slug', slug);
                    }
                  }}
                />
              )}
            />

            <Controller
              name="content"
              control={control}
              render={({ field, fieldState }) => (
                <Editor
                  value={field.value || ''}
                  onChange={field.onChange}
                  label={t('content', 'Content')}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] p-6 space-y-6">
            <h3 className="text-lg font-medium text-[var(--text-main)]">{t('publish', 'Publish')}</h3>

            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  label={t('status', 'Status')}
                  options={[
                    { value: 'draft', label: t('draft', 'Draft') },
                    { value: 'published', label: t('published', 'Published') },
                  ]}
                  error={fieldState.error?.message}
                />
              )}
            />


            <Controller
              name="slug"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[var(--text-main)]">{t('slug', 'URL Slug')}</label>
                  <div className="flex items-center gap-2">
                    <Input
                      {...field}
                      aria-label={t('slug', 'URL Slug')}
                      error={fieldState.error?.message}
                      disabled={!isSlugEditable}
                      wrapperClassName="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => setIsSlugEditable((prev) => !prev)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title={t('edit_slug', 'Edit slug')}
                      aria-label={t('edit_slug', 'Edit slug')}
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            />
          </div>

          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] p-6 space-y-6">
            <h3 className="text-lg font-medium text-[var(--text-main)]">{t('thumbnail', 'Thumbnail')}</h3>

            <Controller
              name="thumbnail"
              control={control}
              render={({ field, fieldState }) => (
                <MediaPlaceholder
                  {...field}
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
