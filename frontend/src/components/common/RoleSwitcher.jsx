import React from 'react';
import { useRole } from '../../hooks/useRole';
import { ROLES, ROLE_LABELS } from '../../constants/roles';
import { UserCheck, Shield } from 'lucide-react';

/**
 * Role Switcher dropdown/toggle for testing role-aware UI capabilities
 */
export const RoleSwitcher = () => {
  const { role, setRole } = useRole();

  return (
    <div className="flex items-center gap-2 bg-slate-100/90 hover:bg-slate-100 p-1 pl-2.5 rounded-lg border border-slate-200">
      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold select-none">
        <Shield className="w-3.5 h-3.5 text-amber-600" />
        <span className="hidden md:inline">Role:</span>
      </div>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="bg-white text-xs font-semibold text-slate-800 border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-slate-800 cursor-pointer shadow-2xs"
      >
        {Object.values(ROLES).map((rKey) => (
          <option key={rKey} value={rKey}>
            {ROLE_LABELS[rKey]}
          </option>
        ))}
      </select>
    </div>
  );
};
