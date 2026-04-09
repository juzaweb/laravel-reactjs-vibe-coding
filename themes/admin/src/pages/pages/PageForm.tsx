import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isAxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/form/Select';
import { Editor } from '../../components/ui/form/Editor';
import { usePage, useCreatePage, useUpdatePage, usePageTemplates } from './hooks';
import type { PageFormData } from './types';
import { PageHeader } from '../../components/ui/PageHeader';

export const PageForm: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: pageData, isLoading: isLoadingPage } = usePage(id || '');
  const { data: pageTemplates, isLoading: isLoadingTemplates } = usePageTemplates();
  const createPageMutation = useCreatePage();
  const updatePageMutation = useUpdatePage();

  const { control, handleSubmit, reset, setValue, setError } = useForm<PageFormData>({
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      template: '',
      status: 'published',
      locale: 'en',
    },
  });

  useEffect(() => {
    if (pageData) {
      reset({
        title: pageData.title || '',
        slug: pageData.slug || '',
        content: pageData.content || '',
        template: pageData.template || '',
        status: pageData.status || 'published',
        locale: pageData.locale || 'en',
      });
    }
  }, [pageData, reset]);

  const onSubmit = async (data: PageFormData) => {
    try {
      if (isEditMode && id) {
        await updatePageMutation.mutateAsync({ id, data });
      } else {
        await createPageMutation.mutateAsync(data);
      }
      navigate('/admin/pages');
    } catch (error) {
      console.error('Failed to save page:', error);
      if (isAxiosError(error) && error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors) {
          Object.keys(errors).forEach((key) => {
            setError(key as keyof PageFormData, {
              type: 'server',
              message: errors[key][0],
            });
          });
        }
      }
    }
  };

  if (isEditMode && isLoadingPage) {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  const isSubmitting = createPageMutation.isPending || updatePageMutation.isPending;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={isEditMode ? t('edit_page', 'Edit Page') : t('create_page', 'Create Page')}
        breadcrumbs={[
          { label: t('pages', 'Pages'), href: '/admin/pages' },
          { label: isEditMode ? t('edit', 'Edit') : t('create', 'Create') }
        ]}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/admin/pages')}>
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
                    if (!isEditMode && !pageData) {
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
              name="template"
              control={control}
              render={({ field, fieldState }) => {
                const templateOptions = pageTemplates && pageTemplates.length > 0
                  ? pageTemplates.map((tpl) => ({ value: tpl.key, label: tpl.label }))
                  : [];

                return (
                  <Select
                    {...field}
                    label={t('template', 'Template')}
                    options={
                      isLoadingTemplates
                        ? [{ value: '', label: t('loading', 'Loading...') }]
                        : templateOptions.length === 0
                        ? [{ value: '', label: t('no_templates', 'No templates') }]
                        : [{ value: '', label: t('default_template', 'Default Template') }, ...templateOptions]
                    }
                    error={fieldState.error?.message}
                    disabled={isLoadingTemplates || templateOptions.length === 0}
                  />
                );
              }}
            />

            <Controller
              name="slug"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label={t('slug', 'URL Slug')}
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
