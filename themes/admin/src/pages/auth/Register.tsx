import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const Register: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data: Record<string, unknown>) => {
    // Simulate registration
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate('/login');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[var(--text-main)] mb-6 text-center">Create an Account</h2>

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
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
          Sign in
        </Link>
      </div>
    </div>
  );
};
