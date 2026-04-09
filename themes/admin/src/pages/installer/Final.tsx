import { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

export function Final() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const finishInstallation = async () => {
      try {
        const { data } = await axiosClient.post('/v1/install/final');
        if (data.status) {
          setResult(data.data);
          toast.success('Installation completed successfully!');
        } else {
          setError(data.message || 'Failed to complete installation');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred while finalizing the installation');
      } finally {
        setLoading(false);
      }
    };

    finishInstallation();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Finalizing Installation
        </h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Wrapping things up...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Installation Failed
        </h2>
        <div className="text-red-600 mb-6">
          <p>{error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
        Installation Complete!
      </h2>

      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Juzaweb CMS has been successfully installed. You can now login to your admin dashboard.
      </p>

      {result?.finalMessages && (
        <div className="text-left text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg mb-8 h-32 overflow-y-auto font-mono">
          {result.finalMessages}
        </div>
      )}

      <Button
        onClick={() => {
          // Go to admin login
          window.location.href = '/auth/login';
        }}
        className="w-full justify-center text-lg py-3"
      >
        Go to Login
      </Button>
    </div>
  );
}
