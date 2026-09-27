import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Bell, Plus, Search, User, ShieldCheck, ChevronDown } from 'lucide-react';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { SearchInput } from '../forms/SearchInput';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../../hooks/useToast';
import { MOCK_NOTIFICATIONS } from '../../mock/mockData';
import { useRole } from '../../hooks/useRole';
import { ROLE_LABELS } from '../../constants/roles';

/**
 * Enterprise Top Navigation Bar
 */
export const Topbar = ({ onOpenMobile, toggleCollapse, isCollapsed }) => {
  const { addToast } = useToast();
  const { role } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleQuickAction = () => {
    addToast({
      title: 'Quick Action Clicked',
      message: 'Phase 0 layout ready. Action modal will open in Phase 1.',
      type: 'info',
    });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block flex-1 max-w-xs md:max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search projects, materials, daily logs..."
          />
        </div>
      </div>

      {/* Right: Quick Action, Role Switcher, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        {/* Quick Action Button */}
        <Button
          size="sm"
          variant="secondary"
          leftIcon={Plus}
          onClick={handleQuickAction}
          className="hidden md:inline-flex"
        >
          Quick Action
        </Button>

        {/* Role Switcher */}
        <RoleSwitcher />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Notifications
                </span>
                <Badge variant="amber" size="sm">
                  {MOCK_NOTIFICATIONS.length} New
                </Badge>
              </div>

              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <h5 className="text-xs font-semibold text-slate-800">{n.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-slate-100 text-center">
                <NavLink
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                >
                  View All Notifications →
                </NavLink>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown Mockup */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center border border-slate-700 shadow-xs">
              JD
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                John Doe
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {ROLE_LABELS[role].split('/')[0]}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">John Doe</p>
                <p className="text-[11px] text-slate-500">john.doe@buildops.io</p>
                <Badge variant="amber" size="sm" className="mt-1.5">
                  {ROLE_LABELS[role]}
                </Badge>
              </div>

              <NavLink
                to="/settings"
                onClick={() => setShowUserMenu(false)}
                className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
              >
                Account Settings
              </NavLink>

              <NavLink
                to="/login"
                onClick={() => setShowUserMenu(false)}
                className="block px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold border-t border-slate-100"
              >
                Sign Out (Mock)
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
