import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Global/Data Search input component with clear button
 */
export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search materials, projects, site logs...',
  className = '',
  onClear,
}) => {
  return (
    <div className={cn('relative flex items-center w-full max-w-xs sm:max-w-md', className)}>
      <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-400 transition-all placeholder:text-slate-400"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
