import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import axiosClient from '../../utils/axiosClient';
import { Button } from '../../components/ui/Button';
import { Text as Input } from '../../components/ui/form/Text';

type EnvironmentForm = {
  database_hostname: string;
  database_port: number;
  database_name: string;
  database_username: string;
  database_password?: string;
};

export function Environment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<EnvironmentForm>({
    defaultValues: {
      database_hostname: '127.0.0.1',
      database_port: 3306,
      database_name: '',
      database_username: 'root',
      database_password: '',
    }
  });

  const onSubmit = async (data: EnvironmentForm) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/v1/install/environment', data);
      if (response.data.status) {
        toast.success(response.data.message || 'Environment saved successfully');
        navigate('/install/database');
      } else {
        toast.error(response.data.message || 'Failed to save environment');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Database connection failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
        Database Configuration
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="database_hostname"
          control={control}
          rules={{ required: 'Hostname is required' }}
          render={({ field }) => (
            <Input
              label="Database Host"
              error={errors.database_hostname?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="database_port"
          control={control}
          rules={{ required: 'Port is required' }}
          render={({ field }) => (
            <Input
              label="Database Port"
              type="number"
              error={errors.database_port?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="database_name"
          control={control}
          rules={{ required: 'Database name is required' }}
          render={({ field }) => (
            <Input
              label="Database Name"
              error={errors.database_name?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="database_username"
          control={control}
          rules={{ required: 'Username is required' }}
          render={({ field }) => (
            <Input
              label="Database Username"
              error={errors.database_username?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="database_password"
          control={control}
          render={({ field }) => (
            <Input
              label="Database Password"
              type="password"
              error={errors.database_password?.message}
              {...field}
            />
          )}
        />

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/install/permissions')}
            className="flex-1 justify-center"
            disabled={loading}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 justify-center"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Setup Application'}
          </Button>
        </div>
      </form>
    </div>
  );
}
