import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAppDispatch } from '../../store/hooks';
import { forgotPassword } from '../../store/authSlice';

export const ForgotPassword: React.FC = () => {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();
  const [isSent, setIsSent] = useState(false);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      await dispatch(forgotPassword(data)).unwrap();
      setIsSent(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err?.message || err || 'Failed to send reset link.';
      setError('root', { type: 'manual', message: errorMessage });
    }
  };

  if (isSent) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-[var(--text-main)] mb-4">Check your email</h2>
        <p className="text-[var(--text-muted)] mb-6">
          We have sent a password reset link to your email address.
        </p>
        <Link to="/auth/login">
          <Button variant="outline" className="w-full">
            Back to login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[var(--text-main)] mb-2 text-center">Reset Password</h2>
      <p className="text-[var(--text-muted)] text-sm mb-6 text-center">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {errors.root && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded border border-red-200 dark:border-red-800 text-sm">
          {errors.root.message as string}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Invalid email format'
            }
          })}
          error={errors.email?.message as string}
        />

        <Button
          type="submit"
          className="w-full mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link to="/auth/login" className="font-medium text-[var(--text-muted)] hover:text-[var(--text-main)]">
          &larr; Back to login
        </Link>
      </div>
    </div>
  );
};
