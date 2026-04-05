import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ForgotPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [isSent, setIsSent] = useState(false);

  const onSubmit = async (data: Record<string, unknown>) => {
    // Simulate API request
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSent(true);
  };

  if (isSent) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-[var(--text-main)] mb-4">Check your email</h2>
        <p className="text-[var(--text-muted)] mb-6">
          We have sent a password reset link to your email address.
        </p>
        <Link to="/login">
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
        <Link to="/login" className="font-medium text-[var(--text-muted)] hover:text-[var(--text-main)]">
          &larr; Back to login
        </Link>
      </div>
    </div>
  );
};
