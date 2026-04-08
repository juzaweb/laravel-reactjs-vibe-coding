import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/form/Select';
import { Switch } from '../../components/ui/form/Switch';
import { Radio } from '../../components/ui/form/Radio';
import { MediaPlaceholder } from '../../components/ui/form/MediaPlaceholder';
import { useSettings, useUpdateSettings } from './hooks';

interface SettingFormData {
  title: string;
  description: string;
  sitename: string;
  user_registration: boolean;
  user_verification: boolean;
  custom_header_script: string;
  custom_footer_script: string;
  enable_cookie_consent: boolean;
  cookie_consent_message: string;
  language: string;
  logo: string;
  favicon: string;
  banner: string;
  google_analytics: string;
}

export const SettingPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: settingsData, isLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  const { control, handleSubmit, reset } = useForm<SettingFormData>({
    defaultValues: {
      title: '',
      description: '',
      sitename: '',
      user_registration: false,
      user_verification: false,
      custom_header_script: '',
      custom_footer_script: '',
      enable_cookie_consent: false,
      cookie_consent_message: '',
      language: 'en',
      logo: '',
      favicon: '',
      banner: '',
      google_analytics: '',
    },
  });

  useEffect(() => {
    if (settingsData) {
      reset({
        title: settingsData.title || '',
        description: settingsData.description || '',
        sitename: settingsData.sitename || '',
        user_registration: settingsData.user_registration === '1' || settingsData.user_registration === true,
        user_verification: settingsData.user_verification === '1' || settingsData.user_verification === true,
        custom_header_script: settingsData.custom_header_script || '',
        custom_footer_script: settingsData.custom_footer_script || '',
        enable_cookie_consent: settingsData.enable_cookie_consent === '1' || settingsData.enable_cookie_consent === true,
        cookie_consent_message: settingsData.cookie_consent_message || '',
        language: settingsData.language || 'en',
        logo: settingsData.logo || '',
        favicon: settingsData.favicon || '',
        banner: settingsData.banner || '',
        google_analytics: settingsData.google_analytics || '',
      });
    }
  }, [settingsData, reset]);

  const onSubmit = async (data: SettingFormData) => {
    const formattedData = {
      ...data,
      user_registration: data.user_registration ? '1' : '0',
      user_verification: data.user_verification ? '1' : '0',
      enable_cookie_consent: data.enable_cookie_consent ? '1' : '0',
    };
    await updateSettingsMutation.mutateAsync(formattedData);
  };

  if (isLoading) {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  const isSubmitting = updateSettingsMutation.isPending;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">{t('settings', 'Settings')}</h1>
        <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? t('saving', 'Saving...') : t('save_change', 'Save Change')}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* General Section */}
          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-[var(--border-color)]">
              <h3 className="text-lg font-medium text-[var(--text-main)]">{t('general', 'General')}</h3>
            </div>
            <div className="p-6 space-y-6">
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <Input {...field} label={t('site_title', 'Site Title')} error={fieldState.error?.message} />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-[var(--text-main)]">{t('site_description', 'Site Description')}</label>
                    <textarea
                      {...field}
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-card)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                    {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                  </div>
                )}
              />

              <Controller
                name="sitename"
                control={control}
                render={({ field, fieldState }) => (
                  <Input {...field} label={t('site_name', 'Site Name')} error={fieldState.error?.message} />
                )}
              />

              <Controller
                name="user_registration"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    label={t('user_registration', 'User Registration')}
                  />
                )}
              />

              <Controller
                name="user_verification"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    label={t('user_verification', 'User Verification')}
                  />
                )}
              />
            </div>
          </div>

          {/* Custom Scripts */}
          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-[var(--border-color)]">
              <h3 className="text-lg font-medium text-[var(--text-main)]">{t('custom_scripts', 'Custom Scripts')}</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md text-sm">
                <strong>{t('warning', 'Warning:')}</strong> {t('custom_scripts_warning', 'These scripts will be injected directly into your website. Only trusted administrators should have access to these settings.')}
              </div>

              <Controller
                name="custom_header_script"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-[var(--text-main)]">{t('custom_header_script', 'Custom Header Script')}</label>
                    <textarea
                      {...field}
                      placeholder="HTML/JavaScript code to inject in <head> section"
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-card)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      rows={5}
                    />
                    {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                  </div>
                )}
              />

              <Controller
                name="custom_footer_script"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-[var(--text-main)]">{t('custom_footer_script', 'Custom Footer Script')}</label>
                    <textarea
                      {...field}
                      placeholder="HTML/JavaScript code to inject before </body> tag"
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-card)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      rows={5}
                    />
                    {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Cookie Consent */}
          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-[var(--border-color)]">
              <h3 className="text-lg font-medium text-[var(--text-main)]">{t('cookie_consent', 'Cookie Consent')}</h3>
            </div>
            <div className="p-6 space-y-6">
              <Controller
                name="enable_cookie_consent"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    label={t('enable_cookie_consent', 'Enable Cookie Consent')}
                  />
                )}
              />

              <Controller
                name="cookie_consent_message"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-[var(--text-main)]">{t('cookie_consent_message', 'Cookie Consent Message')}</label>
                    <textarea
                      {...field}
                      placeholder="We use cookies to enhance your browsing experience..."
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-card)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                    {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                  </div>
                )}
              />
            </div>

            {/* Bottom Save Button */}
            <div className="p-6">
               <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                 {isSubmitting ? t('saving', 'Saving...') : t('save_change', 'Save Change')}
               </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Language Sidebar */}
          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
             <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-[var(--border-color)]">
               <h3 className="text-lg font-medium text-[var(--text-main)]">{t('language', 'Language')}</h3>
             </div>
             <div className="p-6">
               <Controller
                 name="language"
                 control={control}
                 render={({ field, fieldState }) => (
                   <Select
                     {...field}
                     options={[
                       { value: 'en', label: 'English' },
                       { value: 'fr', label: 'French' },
                       // Will be populated dynamically ideally
                     ]}
                     error={fieldState.error?.message}
                   />
                 )}
               />
             </div>
          </div>

          {/* Logo & Icon Sidebar */}
          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
             <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-[var(--border-color)]">
               <h3 className="text-lg font-medium text-[var(--text-main)]">{t('logo_icon', 'Logo & Icon')}</h3>
             </div>
             <div className="p-6 space-y-6">
                <Controller
                  name="logo"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-1">
                       <label className="block text-sm font-medium text-[var(--text-main)]">{t('logo', 'Logo')}</label>
                       <MediaPlaceholder value={field.value} onChange={field.onChange} />
                    </div>
                  )}
                />
                <Controller
                  name="favicon"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-1">
                       <label className="block text-sm font-medium text-[var(--text-main)]">{t('favicon', 'Favicon')}</label>
                       <MediaPlaceholder value={field.value} onChange={field.onChange} />
                    </div>
                  )}
                />
             </div>
          </div>

          {/* Banner Sidebar */}
          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
             <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-[var(--border-color)]">
               <h3 className="text-lg font-medium text-[var(--text-main)]">{t('banner_social', 'Banner (for social)')}</h3>
             </div>
             <div className="p-6">
                <Controller
                  name="banner"
                  control={control}
                  render={({ field }) => (
                     <MediaPlaceholder value={field.value} onChange={field.onChange} />
                  )}
                />
             </div>
          </div>

          {/* Analytics Sidebar */}
          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
             <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-[var(--border-color)]">
               <h3 className="text-lg font-medium text-[var(--text-main)]">{t('analytics', 'Analytics')}</h3>
             </div>
             <div className="p-6">
               <Controller
                 name="google_analytics"
                 control={control}
                 render={({ field, fieldState }) => (
                   <Input {...field} label={t('google_analytics', 'Google Analytics')} error={fieldState.error?.message} />
                 )}
               />
             </div>
          </div>
        </div>
      </form>
    </div>
  );
};
