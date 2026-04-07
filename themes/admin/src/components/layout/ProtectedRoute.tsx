import React from 'react';
import { Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logOut } from '../../store/authSlice';
import { FiLock } from 'react-icons/fi';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    // Redirect to login page and keep the attempted URL for redirecting back later if needed
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if user has admin access
  const hasAdminAccess = user && (
    user.has_all_permissions ||
    (user.permissions && user.permissions.length > 0) ||
    (user.roles && user.roles.length > 0)
  );

  if (isAuthenticated && user && !hasAdminAccess) {
    const handleLogout = () => {
      dispatch(logOut());
      navigate('/auth/login');
    };

    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center rounded-lg bg-white p-8 text-center shadow-md dark:bg-slate-800">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-900/30">
            <FiLock className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-white">Access Denied</h1>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            You do not have permission to access the admin area.
          </p>
          <button
            onClick={handleLogout}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:hover:bg-indigo-500"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
