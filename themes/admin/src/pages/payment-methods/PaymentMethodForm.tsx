import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { Button } from '../../components/ui/Button';
import { Text as Input } from '../../components/ui/form/Text';
import { usePaymentMethod, useCreatePaymentMethod, useUpdatePaymentMethod } from './hooks';
import type { PaymentMethodFormData } from './types';
import { PageHeader } from '../../components/ui/PageHeader';
import { usePermissions } from '../../store/hooks';

export const PaymentMethodForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isEdit = Boolean(id);
  const { hasPermission } = usePermissions();

  const { data: methodData, isLoading: isLoadingMethod } = usePaymentMethod(id || '');
  const createMutation = useCreatePaymentMethod();
  const updateMutation = useUpdatePaymentMethod();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentMethodFormData>({
    defaultValues: {
      name: '',
      description: '',
      driver: '',
      active: true,
      locale: 'en',
    },
  });

  useEffect(() => {
    if (methodData) {
      reset({
        name: methodData.name || '',
        description: methodData.description || '',
        driver: methodData.driver || '',
        active: methodData.active,
        locale: methodData.locale || 'en',
      });
    }
  }, [methodData, reset]);

  const onSubmit = async (data: PaymentMethodFormData) => {
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      navigate('/admin/payment-methods');
    } catch (err) {
      console.error('Failed to save payment method:', err);
      alert(t('error_saving_payment_method', 'Error saving payment method'));
    }
  };

  if (isEdit && isLoadingMethod) {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title={isEdit ? t('edit_payment_method', 'Edit Payment Method') : t('create_payment_method', 'Create Payment Method')}
        breadcrumbs={[
          { label: t('payment_methods', 'Payment Methods'), href: '/admin/payment-methods' },
          { label: isEdit ? t('edit', 'Edit') : t('create', 'Create') }
        ]}
      />

      <div className="flex items-center justify-between mb-4">
        <Link to="/admin/payment-methods">
          <Button variant="ghost" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)]">
            <FiArrowLeft className="w-4 h-4" />
            {t('back_to_list', 'Back to List')}
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
          <div className="p-6 space-y-6">
            <Controller
              name="name"
              control={control}
              rules={{ required: t('validation_required', 'This field is required') }}
              render={({ field }) => (
                <Input
                  label={t('name', 'Name')}
                  error={errors.name?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="driver"
              control={control}
              rules={{ required: t('validation_required', 'This field is required') }}
              render={({ field }) => (
                <Input
                  label={t('driver', 'Driver')}
                  error={errors.driver?.message}
                  placeholder="paypal, stripe, etc."
                  {...field}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[var(--text-main)]">
                    {t('description', 'Description')}
                  </label>
                  <textarea
                    {...field}
                    rows={3}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors p-2"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="active"
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <div className="flex items-center gap-3">
                  <div className="flex items-center h-5">
                    <input
                      id="active"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-[var(--bg-main)] border-[var(--border-color)] rounded focus:ring-blue-500"
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      ref={ref}
                    />
                  </div>
                  <div className="text-sm">
                    <label htmlFor="active" className="font-medium text-[var(--text-main)] cursor-pointer">
                      {t('active', 'Active')}
                    </label>
                  </div>
                </div>
              )}
            />

          </div>
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-[var(--border-color)] flex justify-end gap-3">
            <Link to="/admin/payment-methods">
              <Button type="button" variant="outline">
                {t('cancel', 'Cancel')}
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2"
              disabled={isSubmitting || (isEdit && !hasPermission('payment_methods.edit')) || (!isEdit && !hasPermission('payment_methods.create'))}
            >
              <FiSave className="w-4 h-4" />
              {t('save', 'Save')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
