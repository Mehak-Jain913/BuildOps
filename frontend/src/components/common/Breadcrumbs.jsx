import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { capitalize } from '../../utils/formatters';

/**
 * Auto-generating Breadcrumbs component based on active React Router location
 */
export const Breadcrumbs = ({ customItems }) => {
  const location = useLocation();

  if (customItems) {
    return (
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
        <Link to="/dashboard" className="hover:text-slate-900 transition-colors">
          <Home className="w-3.5 h-3.5" />
        </Link>
        {customItems.map((item, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            {item.path ? (
              <Link to={item.path} className="hover:text-slate-900 transition-colors">
                {item.title}
              </Link>
            ) : (
              <span className="font-semibold text-slate-800">{item.title}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 overflow-x-auto py-0.5" aria-label="Breadcrumb">
      <Link to="/dashboard" className="hover:text-slate-900 transition-colors shrink-0">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = capitalize(name.replace(/-/g, ' '));

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-slate-800 shrink-0">{formattedName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-slate-900 transition-colors shrink-0">
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
