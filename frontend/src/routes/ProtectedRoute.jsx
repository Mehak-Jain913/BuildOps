import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2, HardHat } from 'lucide-react';

/**
 * ProtectedRoute Component
 * Guards application routes against unauthenticated access.
 * Redirects unauthenticated users to /login while saving intended target route.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold shadow-lg animate-pulse">
          <HardHat className="w-7 h-7 stroke-[2.5]" />
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          <span>Verifying BuildOps Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};
