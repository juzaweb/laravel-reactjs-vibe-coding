import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/form/Text';
import { Select } from '../../components/ui/form/Select';
import { useLanguage, useCreateLanguage, useUpdateLanguage, useLocales } from './hooks';
import { PageHeader } from '../../components/ui/PageHeader';
import type { LanguageFormData } from './types';

export const LanguageForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: language, isLoading } = useLanguage(id as string);
  const { data: localesResponse } = useLocales();
  const locales = localesResponse?.data || [];
  const createMutation = useCreateLanguage();
  const updateMutation = useUpdateLanguage();

  const { control, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<LanguageFormData>({
    defaultValues: {
      code: '',
      name: '',
    }
  });

  useEffect(() => {
    if (language) {
      reset({
        code: language.code || '',
        name: language.name || '',
      });
    }
  }, [language, reset]);

  const handleLocaleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    if (selectedCode && locales) {
      const selectedLocale = locales.find(l => l.code === selectedCode);
      if (selectedLocale) {
        setValue('code', selectedLocale.code, { shouldValidate: true });
        setValue('name', selectedLocale.name, { shouldValidate: true });
      }
    }
  };

  const onSubmit = async (data: LanguageFormData) => {
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      toast.success(t('success_saving_language', 'Language saved successfully'));
      navigate('/admin/languages');
    } catch (error) {
      console.error('Failed to save language', error);
      toast.error(t('error_saving_language', 'Error saving language'));
    }
  };

  if (isEdit && isLoading) {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <PageHeader
        title={isEdit ? t('edit_language', 'Edit Language') : t('create_language', 'Create Language')}
        breadcrumbs={[
          { label: t('languages', 'Languages'), href: '/admin/languages' },
          { label: isEdit ? t('edit', 'Edit') : t('create', 'Create') }
        ]}
      />

      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-6">
            {!isEdit && (
              <Select
                label={t('select_locale_preset', 'Select Locale Preset (Optional)')}
                options={[
                  { value: '', label: t('select_a_locale', '--- Select a Locale ---') },
                  ...(locales?.map(l => ({ value: l.code, label: `${l.name} (${l.code})` })) || [])
                ]}
                onChange={handleLocaleSelect}
              />
            )}

            <Controller
              name="code"
              control={control}
              rules={{ required: t('code_required', 'Code is required') }}
              render={({ field }) => (
                <Text
                  label={t('code', 'Code')}
                  error={errors.code?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="name"
              control={control}
              rules={{ required: t('name_required', 'Name is required') }}
              render={({ field }) => (
                <Text
                  label={t('name', 'Name')}
                  error={errors.name?.message}
                  {...field}
                />
              )}
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-[var(--border-color)] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/languages')}
              disabled={isSubmitting}
            >
              {t('cancel', 'Cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('saving', 'Saving...') : t('save', 'Save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
