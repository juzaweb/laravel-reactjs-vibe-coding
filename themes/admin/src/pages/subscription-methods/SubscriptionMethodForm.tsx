import { useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FiArrowLeft, FiSave } from 'react-icons/fi'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { Text as Input } from '../../components/ui/form/Text'
import { Select } from '../../components/ui/form/Select'

import { useSubscriptionMethod, useCreateSubscriptionMethod, useUpdateSubscriptionMethod, useSubscriptionDrivers } from './hooks'
import type { SubscriptionMethodFormData } from './types'
import { useAppSelector } from '../../store/hooks'
import { isAxiosError } from 'axios'

export function SubscriptionMethodForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id

  const { currentLocale } = useAppSelector((state: { ui: { currentLocale: string } }) => state.ui)

  // Fetch available drivers (assuming it's similar to payment drivers, you might need a dedicated endpoint if different)
  // Let's assume we use an API endpoint to get available subscription drivers, or hardcode it if needed.
  // For now, let's create a dummy query or fetch if a driver endpoint exists.
  // Actually, we can fetch active methods or we can just fetch driver list.
  // Wait, let's look at `SubscriptionManager::drivers()`. It doesn't seem to have an API endpoint exposed in `api.php`.
  // We can either expose it or just use simple select for now. Assuming PayPal, Stripe are common.
  // I will add a text input for driver for now, or if it's identical to payment methods...
  // Let's use a simple text input for driver to avoid blocking, since I don't see an API route for driver list.

  const { data: method, isLoading: isLoadingMethod } = useSubscriptionMethod(id, currentLocale)
  const { data: drivers } = useSubscriptionDrivers()

  const createMutation = useCreateSubscriptionMethod()
  const updateMutation = useUpdateSubscriptionMethod()

  const {
    handleSubmit,
    watch,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionMethodFormData>({
    defaultValues: {
      name: '',
      description: '',
      driver: '',
      config: {},
      active: true,
    },
  })

  const selectedDriverName = watch('driver')

  useEffect(() => {
    if (method) {
      reset({
        name: method.name || '',
        description: method.description || '',
        driver: method.driver || '',
        config: method.config || {},
        active: method.active,
      })
    } else {
      reset({
        name: '',
        description: '',
        driver: '',
        config: {},
        active: true,
      })
    }
  }, [method, reset, currentLocale])

  const onSubmit = async (data: SubscriptionMethodFormData) => {
    try {
      const payload = {
        ...data,
        locale: currentLocale,
      }

      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data: payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      navigate('/admin/subscription-methods')
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        const validationErrors = error.response.data.errors
        Object.keys(validationErrors).forEach((key) => {
          setError(key as keyof SubscriptionMethodFormData, {
            type: 'manual',
            message: validationErrors[key][0],
          })
        })
      }
    }
  }

  if (isEdit && isLoadingMethod) {
    return <div className="p-6 text-center">{t('common.loading', 'Loading...')}</div>
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title={isEdit ? t('subscription_method.edit', 'Edit Subscription Method') : t('subscription_method.create', 'Create Subscription Method')}
        breadcrumbs={[
          { label: t('subscription.title', 'Subscription') },
          { label: t('subscription_method.title', 'Subscription Methods'), href: '/admin/subscription-methods' },
          { label: isEdit ? t('common.edit', 'Edit') : t('common.create', 'Create') },
        ]}
      />

      <div className="flex items-center justify-between mb-4">
        <Link to="/admin/subscription-methods">
          <Button variant="ghost" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)]">
            <FiArrowLeft className="w-4 h-4" />
            {t('common.back_to_list', 'Back to List')}
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
          <div className="p-6 space-y-6">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  label={t('subscription_method.name', 'Name')}
                  error={errors.name?.message?.toString()}
                  placeholder={t('subscription_method.name_placeholder', 'Enter method name')}
                  {...field}
                />
              )}
            />

                        <Controller
              name="driver"
              control={control}
              render={({ field }) => (
                <Select
                  label={t('subscription_method.driver', 'Driver')}
                  error={errors.driver?.message?.toString()}
                  options={[
                    { label: t('common.select_driver', '-- Select Driver --'), value: '' },
                    ...(drivers?.map(d => ({ label: d.label, value: d.name })) || [])
                  ]}
                  disabled={isEdit}
                  {...field}
                />
              )}
            />

            {selectedDriverName && drivers?.find(d => d.name === selectedDriverName) && (
              <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-sm font-medium text-[var(--text-main)] mb-4">{t('subscription_method.configuration', 'Configuration')}</h3>
                {Object.entries(drivers.find(d => d.name === selectedDriverName)!.configs).map(([configKey, configDef]) => {
                  return (
                    <Controller
                      key={configKey}
                      name={`config.${configKey}`}
                      control={control}
                      render={({ field }) => {
                        if (configDef.type === 'select' && configDef.data) {
                          return (
                            <Select
                              label={configDef.label}
                              options={Object.entries(configDef.data).map(([v, l]) => ({ value: v, label: l as string }))}
                              {...field}
                            />
                          )
                        }
                        if (configDef.type === 'password') {
                          return (
                            <Input type="password"
                              label={configDef.label}
                              {...field}
                            />
                          )
                        }
                        return (
                          <Input
                            label={configDef.label}
                            {...field}
                          />
                        )
                      }}
                    />
                  )
                })}
              </div>
            )}

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[var(--text-main)]">
                    {t('subscription_method.description', 'Description')}
                  </label>
                  <textarea
                    {...field}
                    rows={3}
                    placeholder={t('subscription_method.description_placeholder', 'Enter description')}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors p-2"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description.message?.toString()}</p>
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
                      {t('common.active', 'Active')}
                    </label>
                  </div>
                </div>
              )}
            />

          </div>
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-[var(--border-color)] flex justify-end gap-3">
            <Link to="/admin/subscription-methods">
              <Button type="button" variant="outline">
                {t('common.cancel', 'Cancel')}
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2"
              disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            >
              <FiSave className="w-4 h-4" />
              {t('common.save', 'Save')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
