import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { Text as Input } from '../../components/ui/form/Text'
import { Textarea } from '../../components/ui/form/Textarea'
import { Checkbox } from '../../components/ui/form/Checkbox'
import { useSubscriptionMethod, useCreateSubscriptionMethod, useUpdateSubscriptionMethod } from './hooks'
import type { SubscriptionMethodFormData } from './types'
import { useAppSelector } from '../../store/hooks'
import { isAxiosError } from 'axios'

export function SubscriptionMethodForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id

  const { currentLocale } = useAppSelector((state: any) => state.ui)

  // Fetch available drivers (assuming it's similar to payment drivers, you might need a dedicated endpoint if different)
  // Let's assume we use an API endpoint to get available subscription drivers, or hardcode it if needed.
  // For now, let's create a dummy query or fetch if a driver endpoint exists.
  // Actually, we can fetch active methods or we can just fetch driver list.
  // Wait, let's look at `SubscriptionManager::drivers()`. It doesn't seem to have an API endpoint exposed in `api.php`.
  // We can either expose it or just use simple select for now. Assuming PayPal, Stripe are common.
  // I will add a text input for driver for now, or if it's identical to payment methods...
  // Let's use a simple text input for driver to avoid blocking, since I don't see an API route for driver list.

  const { data: method, isLoading: isLoadingMethod } = useSubscriptionMethod(id, currentLocale)

  const createMutation = useCreateSubscriptionMethod()
  const updateMutation = useUpdateSubscriptionMethod()

  const {
    register,
    handleSubmit,
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
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? t('subscription_method.edit', 'Edit Subscription Method') : t('subscription_method.create', 'Create Subscription Method')}
        breadcrumbs={[
          { label: t('subscription.title', 'Subscription') },
          { label: t('subscription_method.title', 'Subscription Methods'), href: '/admin/subscription-methods' },
          { label: isEdit ? t('common.edit') : t('common.create') },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium">{t('subscription_method.name', 'Name')}</label>
            <Input {...register('name')} placeholder={t('subscription_method.name_placeholder', 'Enter method name')} />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message?.toString()}</p>}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">{t('subscription_method.description', 'Description')}</label>
            <Textarea {...register('description')} placeholder={t('subscription_method.description_placeholder', 'Enter description')} rows={3} />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message?.toString()}</p>}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">{t('subscription_method.driver', 'Driver')}</label>
            <Input {...register('driver')} placeholder="e.g. PayPal, Stripe" disabled={isEdit} />
            {errors.driver && <p className="text-red-500 text-sm mt-1">{errors.driver.message?.toString()}</p>}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">{t('subscription_method.config', 'Configuration (JSON)')}</label>
            <Controller
              name="config"
              control={control}
              render={({ field: { value, onChange, ...field } }) => {
                const [localValue, setLocalValue] = useState(() => {
                  try {
                    return JSON.stringify(value, null, 2) === '{}' ? '' : JSON.stringify(value, null, 2)
                  } catch {
                    return ''
                  }
                })

                useEffect(() => {
                  try {
                    setLocalValue(JSON.stringify(value, null, 2) === '{}' ? '' : JSON.stringify(value, null, 2))
                  } catch {
                    // ignore
                  }
                }, [value])

                return (
                  <Textarea
                    {...field}
                    value={localValue}
                    onChange={(e: any) => {
                      setLocalValue(e.target.value)
                    }}
                    onBlur={(e: any) => {
                      try {
                        const val = e.target.value ? JSON.parse(e.target.value) : {}
                        onChange(val)
                        field.onBlur?.()
                      } catch (err) {
                        // ignore invalid json on blur, wait for user to fix
                      }
                    }}
                    placeholder='{"client_id": "...", "secret": "..."}'
                    rows={10}
                    className="font-mono text-sm"
                  />
                )
              }}
            />
            {errors.config && <p className="text-red-500 text-sm mt-1">{errors.config.message?.toString()}</p>}
          </div>

          <div className="space-y-4">
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  label={t('common.active', 'Active')}
                />
              )}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => navigate('/admin/subscription-methods')}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}>
              {t('common.save')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
