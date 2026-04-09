import { Outlet } from 'react-router-dom';

export function InstallerLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
