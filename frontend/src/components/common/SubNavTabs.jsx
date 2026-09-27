import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';

/**
 * Reusable Sub-navigation tabs bar for section pages (Projects, Materials, Labour, Site Ops, Intelligence)
 */
export const SubNavTabs = ({ tabs = [] }) => {
  if (!tabs || tabs.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 border-b border-slate-200 custom-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                'inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border',
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-slate-200'
              )
            }
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{tab.title}</span>
          </NavLink>
        );
      })}
    </div>
  );
};
