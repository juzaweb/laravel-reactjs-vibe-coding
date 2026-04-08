import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { PageHeader } from '../../components/ui/PageHeader'
import { Text } from '../../components/ui/form/Text'
import { Switch } from '../../components/ui/form/Switch'
import { Select } from '../../components/ui/form/Select'
import { usePlan, useCreatePlan, useUpdatePlan } from './hooks'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

interface PlanFormValues {
  name: string
  is_free: boolean
  price: number | ''
  duration: number | ''
  duration_unit: 'day' | 'week' | 'month' | 'year' | ''
  active: boolean
  module: string
  features: { name: string; value: string }[]
}

export const PlanForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isEdit = !!id

  const { data: plan, isLoading } = usePlan(id)
  const createMutation = useCreatePlan()
  const updateMutation = useUpdatePlan()

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PlanFormValues>({
    defaultValues: {
      name: '',
      is_free: false,
      price: '',
      duration: '',
      duration_unit: '',
      active: true,
      module: '',
      features: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  })

  const isFree = watch('is_free')

  useEffect(() => {
    if (plan) {
      reset({
        name: plan.name,
        is_free: plan.is_free,
        price: plan.price ?? '',
        duration: plan.duration ?? '',
        duration_unit: plan.duration_unit ?? '',
        active: plan.active,
        module: plan.module ?? '',
        features: plan.features.map((f: any) => ({ name: f.name, value: f.value ?? '' })) || [],
      })
    }
  }, [plan, reset])

  const onSubmit = async (data: PlanFormValues) => {
    try {
      const payload = {
        ...data,
        price: data.is_free ? null : Number(data.price),
        duration: data.duration ? Number(data.duration) : null,
        duration_unit: data.duration_unit || null,
        module: data.module || null,
        features: data.features.map((f: any) => ({ name: f.name, value: f.value || null })),
      }

      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data: payload })
        toast.success(t('plans.updated_successfully', 'Plan updated successfully'))
      } else {
        await createMutation.mutateAsync(payload)
        toast.success(t('plans.created_successfully', 'Plan created successfully'))
      }
      navigate('/admin/subscription/plans')
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('common.error_occurred'))
    }
  }

  const breadcrumbs = [
    { label: t('dashboard.title', 'Dashboard'), href: '/admin' },
    { label: t('plans.title', 'Plans'), href: '/admin/subscription/plans' },
    { label: isEdit ? t('common.edit', 'Edit') : t('common.create', 'Create') },
  ]

  if (isLoading) {
    return <div className="p-4">{t('common.loading')}</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? t('plans.edit_plan', 'Edit Plan') : t('plans.create_plan', 'Create Plan')}
        breadcrumbs={breadcrumbs}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <Text
              label={t('plans.name', 'Plan Name')}
              {...register('name', { required: t('validation.required') })}
              error={errors.name?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <Switch
                label={t('plans.is_free', 'Is Free Plan')}
                {...register('is_free')}
              />

              <Switch
                label={t('common.status', 'Active')}
                {...register('active')}
              />
            </div>

            {!isFree && (
              <Text
                type="number"
                step="0.01"
                label={t('plans.price', 'Price')}
                {...register('price', { required: !isFree ? t('validation.required') : false })}
                error={errors.price?.message}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <Text
                type="number"
                label={t('plans.duration', 'Duration')}
                {...register('duration')}
                error={errors.duration?.message}
              />

              <Select
                label={t('plans.duration_unit', 'Duration Unit')}
                {...register('duration_unit')}
                error={errors.duration_unit?.message}
                options={[
                  { value: '', label: t('common.select', 'Select...') },
                  { value: 'day', label: t('plans.day', 'Day(s)') },
                  { value: 'week', label: t('plans.week', 'Week(s)') },
                  { value: 'month', label: t('plans.month', 'Month(s)') },
                  { value: 'year', label: t('plans.year', 'Year(s)') },
                ]}
              />
            </div>

            <Text
              label={t('plans.module', 'Module (Optional)')}
              {...register('module')}
              error={errors.module?.message}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{t('plans.features', 'Features')}</h3>
              <button
                type="button"
                onClick={() => append({ name: '', value: '' })}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
              >
                <FiPlus /> {t('common.add', 'Add')}
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-start">
                <div className="flex-1">
                  <Text
                    placeholder={t('plans.feature_name', 'Feature Name')}
                    {...register(`features.${index}.name` as const, { required: true })}
                    error={errors.features?.[index]?.name?.message}
                  />
                </div>
                <div className="flex-1">
                  <Text
                    placeholder={t('plans.feature_value', 'Value (Optional)')}
                    {...register(`features.${index}.value` as const)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded mt-1"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">{t('plans.no_features', 'No features added yet.')}</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">{t('common.publish')}</h3>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
