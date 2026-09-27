import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { useRole } from '../../hooks/useRole';
import { cn } from '../../utils/cn';
import {
  HardHat,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

/**
 * Enterprise Construction SaaS Sidebar Navigation
 */
export const Sidebar = ({ isMobileOpen, onCloseMobile, isCollapsed, toggleCollapse }) => {
  const { isRole } = useRole();
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState(() => {
    // Auto expand active section on load
    const activeParent = NAVIGATION_ITEMS.find(
      (item) => item.children && item.children.some((child) => location.pathname.startsWith(child.path))
    );
    return activeParent ? { [activeParent.title]: true } : {};
  });

  const toggleSubmenu = (title) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const filteredNav = NAVIGATION_ITEMS.filter((item) => isRole(item.roles));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 select-none border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <NavLink to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold shadow-md group-hover:bg-amber-400 transition-colors">
            <HardHat className="w-5 h-5 stroke-[2.5]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                BuildOps <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-400 rounded border border-amber-500/30 uppercase font-mono">SaaS</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                Site Intelligence
              </span>
            </div>
          )}
        </NavLink>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isSubOpen = openSubmenus[item.title];
          const isActive = location.pathname === item.path || (hasChildren && item.children.some(c => location.pathname === c.path));

          if (hasChildren) {
            return (
              <div key={item.title} className="flex flex-col">
                <button
                  onClick={() => toggleSubmenu(item.title)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all',
                    isActive
                      ? 'bg-slate-800 text-amber-400'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-amber-400' : 'text-slate-400')} />
                    {!isCollapsed && <span>{item.title}</span>}
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 font-bold uppercase">
                          {item.badge}
                        </span>
                      )}
                      {isSubOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  )}
                </button>

                {/* Submenu links */}
                {isSubOpen && !isCollapsed && (
                  <div className="ml-4 pl-3 border-l border-slate-800 my-1 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={onCloseMobile}
                          className={({ isActive: isChildActive }) =>
                            cn(
                              'flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs transition-colors font-medium',
                              isChildActive
                                ? 'bg-amber-500/10 text-amber-400 font-semibold border-l-2 border-amber-500'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                            )
                          }
                        >
                          <ChildIcon className="w-3.5 h-3.5" />
                          <span>{child.title}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive: isItemActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all',
                  isItemActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                )
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{item.title}</span>}
              </div>

              {!isCollapsed && item.badgeCount && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                  {item.badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer / System Status */}
      {!isCollapsed && (
        <div className="p-3.5 m-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Phase 0 Active Architecture
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Design tokens, routing matrix, and role permissions established.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop & Laptop Sidebar */}
      <aside
        className={cn(
          'hidden lg:block h-screen sticky top-0 transition-all duration-300 z-30 shrink-0',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
