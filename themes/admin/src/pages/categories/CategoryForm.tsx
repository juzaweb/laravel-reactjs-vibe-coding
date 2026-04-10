import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/form/Select';
import { useCategory, useCreateCategory, useUpdateCategory } from './hooks';
import { useLocales } from '../languages/hooks';
import type { CategoryFormData } from './types';
import { PageHeader } from '../../components/ui/PageHeader';
import { FiEdit2 } from 'react-icons/fi';

export const CategoryForm: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLocale = searchParams.get('locale') || i18n.language || 'en';
  const isEditMode = !!id;
  const [isSlugEditable, setIsSlugEditable] = useState(false);

  const { data: categoryData, isLoading: isLoadingCategory } = useCategory(id || '', currentLocale);
  const { data: localesData } = useLocales();

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const { control, handleSubmit, reset, setValue, setError } = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      status: 'draft',
      locale: currentLocale,
    },
  });

  useEffect(() => {
    if (categoryData) {
      reset({
        name: categoryData.name || '',
        locale: currentLocale,
        slug: categoryData.slug || '',
        description: categoryData.description || '',
        status: categoryData.status || 'draft',
      });
    }
  }, [categoryData, currentLocale, reset]);

  useEffect(() => {
    setIsSlugEditable(false);
  }, [id]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      data.locale = currentLocale;
      if (isEditMode && id) {
        await updateCategoryMutation.mutateAsync({ id, data });
      } else {
        await createCategoryMutation.mutateAsync(data);
      }
      navigate('/admin/categories');
    } catch (error) {
      console.error('Failed to save category:', error);
      if (isAxiosError(error) && error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors) {
          Object.keys(errors).forEach((key) => {
            setError(key as keyof CategoryFormData, {
              type: 'server',
              message: errors[key][0],
            });
          });
        }
      }
    }
  };

  if (isEditMode && isLoadingCategory) {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  const isSubmitting = createCategoryMutation.isPending || updateCategoryMutation.isPending;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={isEditMode ? t('edit_category', 'Edit Category') : t('create_category', 'Create Category')}
        breadcrumbs={[
          { label: t('categories', 'Categories'), href: '/admin/categories' },
          { label: isEditMode ? t('edit', 'Edit') : t('create', 'Create') }
        ]}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/admin/categories')}>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e);
                    if (!isEditMode && !categoryData && !isSlugEditable) {
                       const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                       setValue('slug', slug);
                    }
                  }}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                   <label className="block text-sm font-medium text-[var(--text-main)]">{t('description', 'Description')}</label>
                   <textarea
                     {...field}
                     className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-card)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     rows={3}
                   />
                   {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                </div>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">

          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] p-6 space-y-6">
            <h3 className="text-lg font-medium text-[var(--text-main)]">{t('language', 'Language')}</h3>
            <Select
              value={currentLocale}
              onChange={(e) => {
                setSearchParams({ locale: e.target.value });
              }}
              options={(localesData || []).map((l) => ({ value: l.code, label: l.name }))}
              label={t('select_language', 'Select Language')}
            />
          </div>

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
        </div>
      </form>
    </div>
  );
};
