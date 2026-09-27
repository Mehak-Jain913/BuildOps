import React from 'react';
import { Outlet } from 'react-router-dom';
import { HardHat } from 'lucide-react';
import { ToastContainer } from '../components/ui/Toast';

/**
 * Authentication Layout Container
 */
export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Construction Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold shadow-lg">
          <HardHat className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-2xl tracking-tight text-white">
            BuildOps
          </span>
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
            Site Intelligence & Resource Management
          </span>
        </div>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-800 relative z-10 overflow-hidden">
        <Outlet />
      </div>

      <ToastContainer />
    </div>
  );
};
