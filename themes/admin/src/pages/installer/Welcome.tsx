import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
        Welcome to Juzaweb CMS
      </h2>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        Thank you for choosing Juzaweb CMS. This wizard will guide you through the installation process.
      </p>
      <div className="mt-8">
        <Button
          onClick={() => navigate('/install/requirements')}
          className="w-full justify-center"
        >
          Check Requirements
        </Button>
      </div>
    </div>
  );
}
