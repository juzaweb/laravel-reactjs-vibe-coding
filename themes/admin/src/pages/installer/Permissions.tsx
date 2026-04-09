import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { Button } from '../../components/ui/Button';

export function Permissions() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<any>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const { data } = await axiosClient.get('/v1/install/permissions');
        if (data.status) {
          setPermissions(data.data.permissions);
        }
      } catch (error) {
        console.error('Failed to fetch permissions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  if (loading) {
    return <div className="text-center py-4 text-slate-500">Checking folder permissions...</div>;
  }

  const allPassed = permissions?.errors === false;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
        Folder Permissions
      </h2>

      <div className="space-y-2 mb-8">
        {permissions?.permissions &&
          permissions.permissions.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="font-medium font-mono text-sm">{item.folder}</span>
              {item.isSet ? (
                <span className="text-green-600 font-medium">{item.permission}</span>
              ) : (
                <span className="text-red-600 font-medium">{item.permission}</span>
              )}
            </div>
          ))}
      </div>

      <div className="flex space-x-3">
        <Button
          variant="secondary"
          onClick={() => navigate('/install/requirements')}
          className="flex-1 justify-center"
        >
          Back
        </Button>
        <Button
          onClick={() => navigate('/install/environment')}
          disabled={!allPassed}
          className="flex-1 justify-center"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}
