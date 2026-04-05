import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: Record<string, unknown>) => {
    // Simulate login
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate('/');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[var(--text-main)] mb-6 text-center">Sign In</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
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
        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
          Create one
        </Link>
      </div>
    </div>
  );
};
