import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/form/Switch';
import { fetchSettings, useUpdateSettings } from './hooks';
import toast from 'react-hot-toast';

interface SocialSettingFormData {
  google_client_id: string;
  google_client_secret: string;
  google_login_enable: string;
  
  facebook_client_id: string;
  facebook_client_secret: string;
  facebook_login_enable: string;
  
  linkedin_client_id: string;
  linkedin_client_secret: string;
  linkedin_login_enable: string;
  
  twitter_client_id: string;
  twitter_client_secret: string;
  twitter_login_enable: string;
  
  github_client_id: string;
  github_client_secret: string;
  github_login_enable: string;
  
  gitlab_client_id: string;
  gitlab_client_secret: string;
  gitlab_login_enable: string;
  
  bitbucket_client_id: string;
  bitbucket_client_secret: string;
  bitbucket_login_enable: string;
}

type SettingsPayload = Record<string, unknown>;

const toStringValue = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const SocialProviderCard = ({
  providerName,
  providerKey,
  control,
  t,
  appUrl
}: {
  providerName: string;
  providerKey: string;
  control: any;
  t: any;
  appUrl: string;
}) => {
  return (
    <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
      <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-[var(--border-color)]">
        <h3 className="text-lg font-medium text-[var(--text-main)]">{t(`login_with_${providerKey}`, `Login with ${providerName}`)}</h3>
      </div>
      <div className="p-6 space-y-6">
        <Controller
          name={`${providerKey}_client_id`}
          control={control}
          render={({ field, fieldState }) => (
            <Input 
              {...field} 
              label={t('client_id', 'Client ID')} 
              error={fieldState.error?.message} 
            />
          )}
        />

        <Controller
          name={`${providerKey}_client_secret`}
          control={control}
          render={({ field, fieldState }) => (
            <Input 
              {...field} 
              label={t('client_secret', 'Client Secret')} 
              error={fieldState.error?.message} 
            />
          )}
        />
        
        <Input 
          label={t('redirect_url', 'Redirect URL')} 
          value={`${appUrl}/user/social/${providerKey}/redirect`}
          readOnly
          disabled
          className="bg-slate-50 dark:bg-slate-800 text-[var(--text-muted)] cursor-not-allowed"
        />
        
        <Input 
          label={t('callback_url', 'Callback URL')} 
          value={`${appUrl}/user/social/${providerKey}/callback`}
          readOnly
          disabled
          className="bg-slate-50 dark:bg-slate-800 text-[var(--text-muted)] cursor-not-allowed"
        />

        <Controller
          name={`${providerKey}_login_enable`}
          control={control}
          render={({ field: { value, onChange, ref } }) => (
            <Switch 
              checked={value === '1'} 
              onChange={(e) => onChange(e.target.checked ? '1' : '0')} 
              ref={ref}
              label={t(`enable_login_with_${providerKey}`, `Enable login with ${providerName}`)} 
            />
          )}
        />
      </div>
    </div>
  );
};

export const SocialLoginSettingPage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const updateSettingsMutation = useUpdateSettings();

  const { control, handleSubmit, reset } = useForm<SocialSettingFormData>({
    defaultValues: {
      google_client_id: '',
      google_client_secret: '',
      google_login_enable: '0',
      facebook_client_id: '',
      facebook_client_secret: '',
      facebook_login_enable: '0',
      linkedin_client_id: '',
      linkedin_client_secret: '',
      linkedin_login_enable: '0',
      twitter_client_id: '',
      twitter_client_secret: '',
      twitter_login_enable: '0',
      github_client_id: '',
      github_client_secret: '',
      github_login_enable: '0',
      gitlab_client_id: '',
      gitlab_client_secret: '',
      gitlab_login_enable: '0',
      bitbucket_client_id: '',
      bitbucket_client_secret: '',
      bitbucket_login_enable: '0',
    },
  });

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com';

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
          google_client_id: toStringValue(data.google_client_id),
          google_client_secret: toStringValue(data.google_client_secret),
          google_login_enable: toStringValue(data.google_login_enable, '0'),
          facebook_client_id: toStringValue(data.facebook_client_id),
          facebook_client_secret: toStringValue(data.facebook_client_secret),
          facebook_login_enable: toStringValue(data.facebook_login_enable, '0'),
          linkedin_client_id: toStringValue(data.linkedin_client_id),
          linkedin_client_secret: toStringValue(data.linkedin_client_secret),
          linkedin_login_enable: toStringValue(data.linkedin_login_enable, '0'),
          twitter_client_id: toStringValue(data.twitter_client_id),
          twitter_client_secret: toStringValue(data.twitter_client_secret),
          twitter_login_enable: toStringValue(data.twitter_login_enable, '0'),
          github_client_id: toStringValue(data.github_client_id),
          github_client_secret: toStringValue(data.github_client_secret),
          github_login_enable: toStringValue(data.github_login_enable, '0'),
          gitlab_client_id: toStringValue(data.gitlab_client_id),
          gitlab_client_secret: toStringValue(data.gitlab_client_secret),
          gitlab_login_enable: toStringValue(data.gitlab_login_enable, '0'),
          bitbucket_client_id: toStringValue(data.bitbucket_client_id),
          bitbucket_client_secret: toStringValue(data.bitbucket_client_secret),
          bitbucket_login_enable: toStringValue(data.bitbucket_login_enable, '0'),
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

  const onSubmit = async (data: SocialSettingFormData) => {
    try {
      await updateSettingsMutation.mutateAsync(data as Record<string, string>);
      toast.success(t('settings_saved_successfully', 'Settings saved successfully'));
    } catch (error) {
      toast.error(t('error_saving_settings', 'Failed to save settings'));
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">{t('loading', 'Loading...')}</div>;
  }

  const isSubmitting = updateSettingsMutation.isPending;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">{t('social_login_setting', 'Social Login Setting')}</h1>
        <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? t('saving', 'Saving...') : t('save_change', 'Save Change')}
        </Button>
      </div>

      <form id="socialSettingsForm" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SocialProviderCard providerName="Google" providerKey="google" control={control} t={t} appUrl={appUrl} />
        <SocialProviderCard providerName="Facebook" providerKey="facebook" control={control} t={t} appUrl={appUrl} />
        <SocialProviderCard providerName="LinkedIn" providerKey="linkedin" control={control} t={t} appUrl={appUrl} />
        <SocialProviderCard providerName="Twitter" providerKey="twitter" control={control} t={t} appUrl={appUrl} />
        <SocialProviderCard providerName="Github" providerKey="github" control={control} t={t} appUrl={appUrl} />
        <SocialProviderCard providerName="Gitlab" providerKey="gitlab" control={control} t={t} appUrl={appUrl} />
        <SocialProviderCard providerName="Bitbucket" providerKey="bitbucket" control={control} t={t} appUrl={appUrl} />
      </form>
    </div>
  );
};
