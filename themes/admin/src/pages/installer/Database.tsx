import { usePageTitle } from '../../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import toast from 'react-hot-toast';

export function Database() {
  const navigate = useNavigate();
  usePageTitle('Install - Database');
  const [status, setStatus] = useState('Installing database...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runMigrations = async () => {
      try {
        const { data } = await axiosClient.post('/v1/install/database');
        if (data.status) {
          setStatus('Database installed successfully!');
          toast.success('Database migrated successfully');
          setTimeout(() => {
            navigate('/install/admin');
          }, 1500);
        } else {
          setError(data.message || 'Failed to install database');
          toast.error(data.message || 'Failed to install database');
        }
      } catch (err: any) {
        const errMsg = err.response?.data?.message || 'An error occurred during database setup';
        setError(errMsg);
        toast.error(errMsg);
      }
    };

    runMigrations();
  }, [navigate]);

  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Database Setup
      </h2>

      {error ? (
        <div className="text-red-600 mb-6">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <button
            onClick={() => navigate('/install/environment')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Go back and check database credentials
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400">{status}</p>
          <p className="text-sm text-slate-500">This may take a few minutes. Please do not close the window.</p>
        </div>
      )}
    </div>
  );
}
