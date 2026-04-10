import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/form/Select';
import { fetchSettings, useUpdateSettings, useSendTestEmail } from './hooks';
import toast from 'react-hot-toast';
import { FiSend } from 'react-icons/fi';

interface EmailSettingFormData {
  mail_host: string;
  mail_port: string;
  mail_username: string;
  mail_password?: string;
  mail_encryption: string;
  mail_from_address: string;
  mail_from_name: string;
}

type SettingsPayload = Record<string, unknown>;

const toStringValue = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

export const EmailSettingPage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const updateSettingsMutation = useUpdateSettings();
  const sendTestEmailMutation = useSendTestEmail();

  const { control, handleSubmit, reset } = useForm<EmailSettingFormData>({
    defaultValues: {
      mail_host: '',
      mail_port: '',
      mail_username: '',
      mail_password: '',
      mail_encryption: 'none',
      mail_from_address: '',
      mail_from_name: '',
    },
  });

  const [testEmail, setTestEmail] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const settingsData = await fetchSettings();
        if (!isMounted || !settingsData) {
          return;
        }

        const data = settingsData as SettingsPayload;
        reset({
          mail_host: toStringValue(data.mail_host),
          mail_port: toStringValue(data.mail_port),
          mail_username: toStringValue(data.mail_username),
          mail_password: toStringValue(data.mail_password),
          mail_encryption: toStringValue(data.mail_encryption, 'none'),
          mail_from_address: toStringValue(data.mail_from_address),
          mail_from_name: toStringValue(data.mail_from_name),
        });
      } catch (error) {
         toast.error(t('error_loading_settings', 'Failed to load settings'));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      isMounted = false;
    };
  }, [reset, t]);

  const onSubmit = async (data: EmailSettingFormData) => {
    try {
      await updateSettingsMutation.mutateAsync(data as Record<string, string>);
      toast.success(t('settings_saved_successfully', 'Settings saved successfully'));
    } catch (error) {
      toast.error(t('error_saving_settings', 'Failed to save settings'));
    }
  };

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) {
      toast.error(t('please_enter_an_email_address', 'Please enter an email address'));
      return;
    }
    
    try {
      await sendTestEmailMutation.mutateAsync({ email: testEmail });
      toast.success(t('test_email_sent_successfully', 'Test email sent successfully. Please check your inbox.'));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('failed_to_send_test_email', 'Failed to send test email. Please check your config.'));
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  const isSubmitting = updateSettingsMutation.isPending;
  const isSendingTestEmail = sendTestEmailMutation.isPending;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">{t('email_setting', 'Email Setting')}</h1>
        <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? t('saving', 'Saving...') : t('save_change', 'Save Change')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form id="emailSettingsForm" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* SMTP Settings */}
            <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-[var(--border-color)]">
                <h3 className="text-lg font-medium text-[var(--text-main)]">{t('smtp_settings', 'SMTP Settings')}</h3>
              </div>
              <div className="p-6 space-y-6">
                <Controller
                  name="mail_host"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input 
                      {...field} 
                      label={t('smtp_host', 'SMTP Host')} 
                      placeholder="smtp.gmail.com" 
                      error={fieldState.error?.message} 
                    />
                  )}
                />

                <Controller
                  name="mail_port"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input 
                      {...field} 
                      label={t('smtp_port', 'SMTP Port')} 
                      placeholder="587" 
                      error={fieldState.error?.message} 
                    />
                  )}
                />

                <Controller
                  name="mail_username"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input 
                      {...field} 
                      label={t('smtp_username', 'SMTP Username')} 
                      placeholder="your-email@example.com" 
                      error={fieldState.error?.message} 
                    />
                  )}
                />

                <Controller
                  name="mail_password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input 
                      {...field} 
                      type="password"
                      label={t('smtp_password', 'SMTP Password')} 
                      error={fieldState.error?.message} 
                    />
                  )}
                />

                <Controller
                  name="mail_encryption"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      label={t('encryption', 'Encryption')}
                      options={[
                        { value: 'none', label: 'None' },
                        { value: 'tls', label: 'TLS' },
                        { value: 'ssl', label: 'SSL' },
                      ]}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </div>

            {/* From Address */}
            <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-[var(--border-color)]">
                <h3 className="text-lg font-medium text-[var(--text-main)]">{t('from_address', 'From Address')}</h3>
              </div>
              <div className="p-6 space-y-6">
                <Controller
                  name="mail_from_address"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input 
                      {...field} 
                      label={t('from_email_address', 'From Email Address')} 
                      error={fieldState.error?.message} 
                    />
                  )}
                />

                <Controller
                  name="mail_from_name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input 
                      {...field} 
                      label={t('from_name', 'From Name')} 
                      error={fieldState.error?.message} 
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Right Sidebar - Test Email */}
        <div className="space-y-6">
          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
             <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-[var(--border-color)]">
               <h3 className="text-lg font-medium text-[var(--text-main)]">{t('test_email_settings', 'Test Email Settings')}</h3>
             </div>
             <div className="p-6">
               <form onSubmit={handleTestEmail} className="space-y-4">
                 <p className="text-sm text-[var(--text-muted)]">
                   {t('test_email_description', 'Send a test email to ensure your email settings are correct.')}
                 </p>
                 <Input 
                   value={testEmail}
                   onChange={(e) => setTestEmail(e.target.value)}
                   placeholder={t('email_address', 'example@gmail.com')}
                   type="email"
                   required
                 />
                 <Button 
                   type="submit" 
                   className="w-full justify-center flex items-center gap-2 bg-slate-500 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 text-white border-0"
                   disabled={isSendingTestEmail}
                 >
                   <FiSend />
                   {isSendingTestEmail ? t('sending', 'Sending...') : t('send_test_email', 'Send Test Email')}
                 </Button>
               </form>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
