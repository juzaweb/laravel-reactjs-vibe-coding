import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../store/authSlice';
import { fetchSettings } from '../../store/settingSlice';
import { usePageTitle } from '../../hooks/usePageTitle';

export const Login: React.FC = () => {
  usePageTitle('Sign In');
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { data: settings, status: settingsStatus } = useAppSelector((state) => state.settings);
  const captchaType = settings?.captcha;
  const captchaSiteKey = settings?.captcha_site_key;
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (settingsStatus === 'idle') {
      dispatch(fetchSettings());
    }
  }, [settingsStatus, dispatch]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    try {
      let token: string | null = null;
      if (captchaType === 'recaptcha-v2-invisible' && captchaSiteKey && recaptchaRef.current) {
        token = await recaptchaRef.current.executeAsync();
        if (token) {
          data['g-recaptcha-response'] = token;
        }
      }

      await dispatch(loginUser(data)).unwrap();
      navigate(from, { replace: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError('root', {
        type: 'manual',
        message: err?.message || err || 'Failed to login. Please try again.'
      });
      if (captchaType === 'recaptcha-v2-invisible' && recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    void handleSubmit(handleFormSubmit)(e);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[var(--text-main)] mb-6 text-center">Sign In</h2>

      {errors.root && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded border border-red-200 dark:border-red-800 text-sm">
          {errors.root.message as string}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message as string}
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password', { required: 'Password is required' })}
            error={errors.password?.message as string}
          />
          <div className="flex justify-end mt-1">
            <Link to="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-[var(--border-color)] bg-transparent text-blue-600 focus:ring-blue-500"
            {...register('remember')}
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--text-muted)]">
            Remember me
          </label>
        </div>

        {captchaType === 'recaptcha-v2-invisible' && captchaSiteKey && (
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={captchaSiteKey}
            size="invisible"
          />
        )}

        <Button
          type="submit"
          className="w-full mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Don't have an account?{' '}
        <Link to="/auth/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
          Create one
        </Link>
      </div>
    </div>
  );
};
