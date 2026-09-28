import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SearchInput } from '../forms/SearchInput';
import { ProgressBar } from '../ui/ProgressBar';
import { PackageMinus, TrendingUp, AlertTriangle } from 'lucide-react';

export const ConsumptionTable = ({
  consumption = [],
  title = 'Material Consumption Records',
  subtitle = 'Compare planned budget consumption against actual site usage variance across tasks and blocks.',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConsumption = consumption.filter((c) => {
    const query = searchTerm.toLowerCase();
    return (
      c.materialName.toLowerCase().includes(query) ||
      c.projectName.toLowerCase().includes(query) ||
      c.blockName.toLowerCase().includes(query) ||
      (c.taskName && c.taskName.toLowerCase().includes(query))
    );
  });

  return (
    <Card
      header={
        <div className="flex items-center gap-2">
          <PackageMinus className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 font-normal">{subtitle}</p>
          </div>
        </div>
      }
    >
      <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
        <SearchInput
          placeholder="Search by material, project, block, or task..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
        />
      </div>

      {filteredConsumption.length === 0 ? (
        <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <PackageMinus className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No consumption records found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Material</th>
                <th className="py-3 px-4">Project & Location</th>
                <th className="py-3 px-4">Task</th>
                <th className="py-3 px-4 text-right">Planned Qty</th>
                <th className="py-3 px-4 text-right">Actual Qty</th>
                <th className="py-3 px-4 text-right">Variance</th>
                <th className="py-3 px-4">Variance %</th>
                <th className="py-3 px-4">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 bg-white">
              {filteredConsumption.map((c) => {
                const isOverBudget = c.variance > 0;

                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                      {c.date}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {c.materialName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-800 block">{c.projectName}</span>
                      <span className="text-[11px] text-slate-400">
                        {c.blockName} • {c.levelName}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-semibold whitespace-nowrap">
                      {c.taskName}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-600 whitespace-nowrap">
                      {c.plannedQuantity} {c.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                      {c.actualQuantity} {c.unit}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-mono font-extrabold whitespace-nowrap ${
                        isOverBudget ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {c.variance > 0 ? `+${c.variance}` : c.variance} {c.unit}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                          isOverBudget
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {c.variancePercentage > 0 ? `+${c.variancePercentage}%` : `${c.variancePercentage}%`}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {c.recordedBy}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};
