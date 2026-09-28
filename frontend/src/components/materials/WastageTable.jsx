import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SearchInput } from '../forms/SearchInput';
import { Select } from '../forms/Select';
import { WASTAGE_REASONS } from '../../mock/materialData';
import { formatCurrency } from '../../utils/formatters';
import { Trash2, Plus, AlertCircle, TrendingDown } from 'lucide-react';

export const WastageTable = ({
  wastage = [],
  onReportWastage,
  title = 'Material Wastage Log',
  subtitle = 'Track handling losses, storage damage, cutting waste, and estimated financial loss impact.',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState('ALL');

  const filteredWastage = wastage.filter((w) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      w.materialName.toLowerCase().includes(query) ||
      w.projectName.toLowerCase().includes(query) ||
      w.reportedBy.toLowerCase().includes(query);

    const matchesReason = reasonFilter === 'ALL' || w.reason === reasonFilter;

    return matchesSearch && matchesReason;
  });

  // Calculate summary breakdown per material
  const wastageSummaryMap = wastage.reduce((acc, curr) => {
    const key = curr.materialName;
    if (!acc[key]) {
      acc[key] = { name: curr.materialName, quantity: 0, unit: curr.unit, cost: 0 };
    }
    acc[key].quantity += curr.quantity;
    acc[key].cost += curr.estimatedCost || 0;
    return acc;
  }, {});

  const wastageSummaryList = Object.values(wastageSummaryMap);
  const totalWastageCost = wastage.reduce((acc, w) => acc + (w.estimatedCost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Wastage Compact Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-red-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Total Material Loss Impact
          </span>
          <div className="text-2xl font-extrabold text-red-600 mt-1">
            ₹{totalWastageCost.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">Direct material scrap & damage value</p>
        </div>

        {wastageSummaryList.slice(0, 3).map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block truncate">
              {item.name} Loss
            </span>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {item.quantity} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Est. Loss: <strong className="text-slate-800">₹{item.cost.toLocaleString()}</strong>
            </p>
          </div>
        ))}
      </div>

      {/* Main Log Card */}
      <Card
        header={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">{title}</h3>
                <p className="text-xs text-slate-500 font-normal">{subtitle}</p>
              </div>
            </div>

            {onReportWastage && (
              <Button variant="outline" size="sm" leftIcon={Plus} onClick={onReportWastage}>
                Report Wastage
              </Button>
            )}
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <SearchInput
            placeholder="Search by material, project, or reporter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
          />

          <Select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Wastage Reasons' },
              ...WASTAGE_REASONS.map((r) => ({ value: r, label: r })),
            ]}
            placeholder={null}
          />
        </div>

        {filteredWastage.length === 0 ? (
          <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <Trash2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No wastage entries reported</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Material SKU</th>
                  <th className="py-3 px-4 text-right">Wasted Qty</th>
                  <th className="py-3 px-4">Wastage Reason</th>
                  <th className="py-3 px-4">Project & Location</th>
                  <th className="py-3 px-4">Reported By</th>
                  <th className="py-3 px-4 text-right">Est. Cost Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 bg-white">
                {filteredWastage.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                      {w.date}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {w.materialName}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-red-600 whitespace-nowrap">
                      {w.quantity} {w.unit}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant="amber" size="sm">
                        {w.reason}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-800 block">{w.projectName}</span>
                      <span className="text-[11px] text-slate-400">{w.blockName}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {w.reportedBy}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      ₹{w.estimatedCost ? w.estimatedCost.toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
