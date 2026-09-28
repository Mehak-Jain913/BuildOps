import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SearchInput } from '../forms/SearchInput';
import { Select } from '../forms/Select';
import { MOVEMENT_TYPES } from '../../mock/materialData';
import { ArrowLeftRight, Truck, ArrowRight, Trash2, CheckCircle2, FileText } from 'lucide-react';

export const MaterialMovementTable = ({
  movements = [],
  title = 'Stock Movement History',
  subtitle = 'Audit trail of received deliveries, site issues, returns, inventory adjustments, and reported wastage.',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredMovements = movements.filter((mov) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      mov.materialName.toLowerCase().includes(query) ||
      (mov.reference && mov.reference.toLowerCase().includes(query)) ||
      (mov.actor && mov.actor.toLowerCase().includes(query)) ||
      (mov.projectName && mov.projectName.toLowerCase().includes(query));

    const matchesType = typeFilter === 'ALL' || mov.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const getMovementBadge = (type) => {
    switch (type) {
      case 'RECEIVED':
        return 'success';
      case 'ISSUED':
        return 'info';
      case 'WASTAGE':
        return 'danger';
      case 'RETURNED':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <Card
      header={
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 font-normal">{subtitle}</p>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
        <SearchInput
          placeholder="Search by material, reference #, or actor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
        />

        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Movement Types' },
            ...MOVEMENT_TYPES.map((t) => ({ value: t, label: t })),
          ]}
          placeholder={null}
        />
      </div>

      {filteredMovements.length === 0 ? (
        <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <ArrowLeftRight className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No stock movements recorded</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Movement Type</th>
                <th className="py-3 px-4">Material SKU</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4">Project & Location</th>
                <th className="py-3 px-4">Reference #</th>
                <th className="py-3 px-4">Actor / Supplier</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 bg-white">
              {filteredMovements.map((mov) => (
                <tr key={mov.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                    {mov.date}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge variant={getMovementBadge(mov.type)} size="sm">
                      {mov.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {mov.materialName}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                    {mov.type === 'ISSUED' || mov.type === 'WASTAGE' ? `-${mov.quantity}` : `+${mov.quantity}`} {mov.unit}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-800 block">{mov.projectName}</span>
                    <span className="text-[11px] text-slate-400">{mov.blockName || 'Site Yard'}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 font-semibold whitespace-nowrap">
                    {mov.reference || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                    {mov.actor}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px] truncate max-w-xs">
                    {mov.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};
