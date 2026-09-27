import React from 'react';
import { cn } from '../../utils/cn';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';

/**
 * Reusable Data Table Component with headers, striped rows, hover state, and empty/loading integration.
 */
export const Table = ({
  columns = [],
  data = [],
  keyField = 'id',
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your filters or search query.',
  onRowClick,
  className = '',
  striped = false,
}) => {
  if (isLoading) {
    return <LoadingState variant="table" rows={5} columns={columns.length || 4} />;
  }

  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs', className)}>
      <table className="w-full text-left text-sm text-slate-600 border-collapse">
        <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200 tracking-wider">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={cn(
                  'px-4 py-3.5 whitespace-nowrap',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                  col.headerClassName
                )}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-normal">
          {data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr
                key={row[keyField] || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  'transition-colors',
                  striped && rowIdx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white',
                  onRowClick && 'cursor-pointer hover:bg-slate-50/80'
                )}
              >
                {columns.map((col, colIdx) => {
                  const val = row[col.key];
                  return (
                    <td
                      key={col.key || colIdx}
                      className={cn(
                        'px-4 py-3.5 whitespace-nowrap text-slate-800 text-sm',
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center',
                        col.className
                      )}
                    >
                      {col.render ? col.render(val, row, rowIdx) : val}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length || 1} className="py-10">
                <EmptyState title={emptyTitle} description={emptyDescription} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
