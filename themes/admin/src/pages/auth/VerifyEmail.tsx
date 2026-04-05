import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(!token ? 'loading' : 'loading');

  useEffect(() => {
    if (!token) {
      return;
    }

    const verify = async () => {
      try {
        // Simulate API verification
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // Randomly succeed or fail for demo purposes if token exists
        setStatus(token === 'invalid' ? 'error' : 'success');
      } catch {
        setStatus('error');
      }
    };

    verify();
  }, [token]);

  if (!token) {
    return (
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center dark:bg-blue-900/30 dark:text-blue-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-[var(--text-main)] mb-2">Verify your email</h2>
        <p className="text-[var(--text-muted)] mb-6">
          We've sent an email to your address with a link to verify your account. Please check your inbox.
        </p>
        <div className="space-y-3">
          <Button variant="outline" className="w-full">
            Resend verification email
          </Button>
          <div className="text-sm mt-4">
            <Link to="/login" className="font-medium text-[var(--text-muted)] hover:text-[var(--text-main)]">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      {status === 'loading' && (
        <div className="flex flex-col items-center py-6">
          <FiLoader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-[var(--text-main)] mb-2">Verifying your email...</h2>
          <p className="text-[var(--text-muted)]">Please wait a moment.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center py-4">
          <FiCheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-semibold text-[var(--text-main)] mb-2">Email Verified!</h2>
          <p className="text-[var(--text-muted)] mb-6">
            Your email address has been successfully verified. You can now access all features.
          </p>
          <Link to="/login" className="w-full">
            <Button className="w-full">Continue to Login</Button>
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center py-4">
          <FiXCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-[var(--text-main)] mb-2">Verification Failed</h2>
          <p className="text-[var(--text-muted)] mb-6">
            The verification link is invalid or has expired. Please request a new verification email.
          </p>
          <Button variant="primary" className="w-full mb-3">
            Resend Verification Link
          </Button>
          <Link to="/login" className="font-medium text-sm text-[var(--text-muted)] hover:text-[var(--text-main)]">
            Back to login
          </Link>
        </div>
      )}
    </div>
  );
};
