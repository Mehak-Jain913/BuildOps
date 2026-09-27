import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, HardHat, Package, Users, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Mobile Bottom Navigation Bar for Site Supervisors and Workers on mobile devices
 */
export const MobileNavigation = () => {
  const links = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Site Logs', path: '/site/daily-reports', icon: HardHat },
    { label: 'Materials', path: '/materials', icon: Package },
    { label: 'Labour', path: '/labour', icon: Users },
    { label: 'AI Risk', path: '/intelligence', icon: Sparkles },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-800 text-slate-400 px-2 py-1.5 shadow-2xl flex items-center justify-around">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-[10px] font-semibold transition-colors',
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              )
            }
          >
            <Icon className="w-5 h-5 stroke-[1.75]" />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
