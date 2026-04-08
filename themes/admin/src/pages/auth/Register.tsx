import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAppDispatch } from '../../store/hooks';
import { registerUser } from '../../store/authSlice';
import { usePageTitle } from '../../hooks/usePageTitle';

export const Register: React.FC = () => {
  usePageTitle('Create an Account');
  const { register, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const password = watch('password');

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      navigate('/auth/login');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err?.message || err || 'Registration failed.';
      setError('root', { type: 'manual', message: errorMessage });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[var(--text-main)] mb-6 text-center">Create an Account</h2>

      {errors.root && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded border border-red-200 dark:border-red-800 text-sm">
          {errors.root.message as string}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message as string}
        />

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

        <Input
          label="Password"
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
          label="Confirm Password"
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
          {isSubmitting ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
          Sign in
        </Link>
      </div>
    </div>
  );
};
