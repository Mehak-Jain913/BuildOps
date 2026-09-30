import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';

export const AnalyticsDrilldownLink = ({ to, label = 'Investigate', variant = 'ghost', size = 'sm' }) => {
  if (variant === 'button') {
    return (
      <Link
        to={to}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors shadow-xs"
      >
        <span>{label}</span>
        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors group"
    >
      <span>{label}</span>
      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
};
