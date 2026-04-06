import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAppDispatch } from '../../store/hooks';
import { resetPassword } from '../../store/authSlice';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const { register, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      email: email || '',
      token: token || '',
      password: '',
      password_confirmation: ''
    }
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const password = watch('password');

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const resetToken = data.token || token;
      await dispatch(resetPassword({ ...data, token: resetToken })).unwrap();
      navigate('/login?reset=success');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err?.message || err || 'Failed to reset password.';
      setError('root', { type: 'manual', message: errorMessage });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[var(--text-main)] mb-2 text-center">Set New Password</h2>
      <p className="text-[var(--text-muted)] text-sm mb-6 text-center">
        Please enter your new password below.
      </p>

      {errors.root && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded border border-red-200 dark:border-red-800 text-sm">
          {errors.root.message as string}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Hidden fields for token and email if we wanted them submitted with the form */}
        <input type="hidden" {...register('token')} />
        <input type="hidden" {...register('email')} />

        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            }
          })}
          error={errors.password?.message as string}
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          {...register('password_confirmation', {
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match'
          })}
          error={errors.password_confirmation?.message as string}
        />

        <Button
          type="submit"
          className="w-full mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link to="/login" className="font-medium text-[var(--text-muted)] hover:text-[var(--text-main)]">
          Back to login
        </Link>
      </div>
    </div>
  );
};
