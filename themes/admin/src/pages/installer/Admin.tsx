import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import axiosClient from '../../utils/axiosClient';
import { Button } from '../../components/ui/Button';
import { Text as Input } from '../../components/ui/form/Text';

type AdminForm = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<AdminForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    }
  });

  const pwd = watch('password');

  const onSubmit = async (data: AdminForm) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/v1/install/admin', data);
      if (response.data.status) {
        toast.success(response.data.message || 'Admin user created successfully');
        navigate('/install/final');
      } else {
        toast.error(response.data.message || 'Failed to create admin user');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create admin user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
        Create Administrator
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field }) => (
            <Input
              label="Full Name"
              error={errors.name?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          }}
          render={({ field }) => (
            <Input
              label="Email Address"
              type="email"
              error={errors.email?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' }
          }}
          render={({ field }) => (
            <Input
              label="Password"
              type="password"
              error={errors.password?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="password_confirmation"
          control={control}
          rules={{
            required: 'Please confirm password',
            validate: value => value === pwd || 'The passwords do not match'
          }}
          render={({ field }) => (
            <Input
              label="Confirm Password"
              type="password"
              error={errors.password_confirmation?.message}
              {...field}
            />
          )}
        />

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full justify-center"
            disabled={loading}
          >
            {loading ? 'Creating User...' : 'Create Admin User'}
          </Button>
        </div>
      </form>
    </div>
  );
}
