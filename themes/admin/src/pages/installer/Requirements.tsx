import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { Button } from '../../components/ui/Button';

export function Requirements() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState<any>(null);
  const [phpSupportInfo, setPhpSupportInfo] = useState<any>(null);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const { data } = await axiosClient.get('/v1/install/requirements');
        if (data.status) {
          setRequirements(data.data.requirements);
          setPhpSupportInfo(data.data.phpSupportInfo);
        }
      } catch (error) {
        console.error('Failed to fetch requirements', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequirements();
  }, []);

  if (loading) {
    return <div className="text-center py-4 text-slate-500">Checking requirements...</div>;
  }

  const allPassed = requirements?.errors === false && phpSupportInfo?.supported === true;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
        Server Requirements
      </h2>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <span className="font-medium">PHP Version &gt;= {phpSupportInfo?.minimum}</span>
          {phpSupportInfo?.supported ? (
            <span className="text-green-600 font-medium">Yes ({phpSupportInfo?.current})</span>
          ) : (
            <span className="text-red-600 font-medium">No ({phpSupportInfo?.current})</span>
          )}
        </div>

        {requirements?.requirements &&
          Object.entries(requirements.requirements).map(([type, extensions]: [string, any]) => (
            <div key={type}>
              <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 capitalize">{type} Extensions</h3>
              <ul className="space-y-2">
                {Object.entries(extensions).map(([ext, passed]: [string, any]) => (
                  <li key={ext} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span>{ext}</span>
                    {passed ? (
                      <span className="text-green-600 font-medium">Passed</span>
                    ) : (
                      <span className="text-red-600 font-medium">Failed</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>

      <div className="flex space-x-3">
        <Button
          variant="secondary"
          onClick={() => navigate('/install')}
          className="flex-1 justify-center"
        >
          Back
        </Button>
        <Button
          onClick={() => navigate('/install/permissions')}
          disabled={!allPassed}
          className="flex-1 justify-center"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}
