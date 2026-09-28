import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { SearchInput } from '../forms/SearchInput';
import { Select } from '../forms/Select';
import { MATERIAL_CATEGORIES, STOCK_CONDITIONS } from '../../mock/materialData';
import { Warehouse, ArrowRight, PackagePlus, Eye, AlertTriangle } from 'lucide-react';

export const InventoryTable = ({
  inventory = [],
  projects = [],
  onIssueStock,
  onStockIn,
  title = 'Current Site Inventory',
  subtitle = 'Monitor stock levels, reserved quantities, daily consumption, and estimated days remaining.',
}) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');

  const filteredInventory = inventory.filter((inv) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      inv.materialName.toLowerCase().includes(query) ||
      inv.materialCode.toLowerCase().includes(query) ||
      inv.locationName.toLowerCase().includes(query);

    const matchesCategory = categoryFilter === 'ALL' || inv.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    const matchesProject = projectFilter === 'ALL' || inv.projectId === projectFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesProject;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Healthy':
        return 'success';
      case 'Monitor':
        return 'amber';
      case 'Low Stock':
        return 'warning';
      case 'Critical':
        return 'danger';
      case 'Out of Stock':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <Card
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 font-normal">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onStockIn && (
              <Button variant="outline" size="sm" leftIcon={PackagePlus} onClick={onStockIn}>
                Stock In
              </Button>
            )}
            {onIssueStock && (
              <Button variant="primary" size="sm" leftIcon={ArrowRight} onClick={onIssueStock}>
                Issue Material
              </Button>
            )}
          </div>
        </div>
      }
    >
      {/* Search & Multi-Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
        <SearchInput
          placeholder="Search by material name, code, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
        />

        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Categories' },
            ...MATERIAL_CATEGORIES.map((c) => ({ value: c, label: c })),
          ]}
          placeholder={null}
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Stock Conditions' },
            ...STOCK_CONDITIONS.map((s) => ({ value: s, label: s })),
          ]}
          placeholder={null}
        />

        <Select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Projects' },
            ...projects.map((p) => ({ value: p.id, label: p.name })),
          ]}
          placeholder={null}
        />
      </div>

      {/* Table */}
      {filteredInventory.length === 0 ? (
        <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <Warehouse className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No inventory stock found matching criteria</p>
          <p className="text-xs text-slate-400 mt-0.5">Try adjusting filters or record stock in.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Material Name & Code</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Project & Location</th>
                <th className="py-3 px-4 text-right">Available</th>
                <th className="py-3 px-4 text-right">Reserved</th>
                <th className="py-3 px-4 text-right">In Transit</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Daily Rate</th>
                <th className="py-3 px-4">Est. Days</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 bg-white">
              {filteredInventory.map((inv) => {
                const stockPercent = Math.min(
                  100,
                  Math.round((inv.quantityAvailable / (inv.reorderLevel * 1.5)) * 100)
                );

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{inv.materialName}</span>
                      <span className="text-[11px] font-mono text-slate-400">{inv.materialCode}</span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                      {inv.category}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-800 block">{inv.projectName}</span>
                      <span className="text-[11px] text-slate-400">{inv.locationName}</span>
                    </td>

                    <td className="py-3 px-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                      {inv.quantityAvailable.toLocaleString()} <span className="text-[11px] font-normal text-slate-500">{inv.unit}</span>
                    </td>

                    <td className="py-3 px-4 text-right font-semibold text-slate-600 whitespace-nowrap">
                      {inv.quantityReserved} {inv.unit}
                    </td>

                    <td className="py-3 px-4 text-right font-semibold text-blue-600 whitespace-nowrap">
                      {inv.quantityInTransit ? `+${inv.quantityInTransit}` : '0'} {inv.unit}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap w-28">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-600">{stockPercent}% Cap</span>
                        <ProgressBar
                          value={stockPercent}
                          variant={stockPercent < 30 ? 'danger' : stockPercent < 60 ? 'amber' : 'emerald'}
                          size="sm"
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-semibold whitespace-nowrap">
                      {inv.averageDailyConsumption} {inv.unit}/day
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`font-bold font-mono px-2 py-0.5 rounded text-[11px] ${
                          inv.estimatedDaysRemaining <= 4
                            ? 'bg-red-100 text-red-800'
                            : inv.estimatedDaysRemaining <= 7
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        ~{inv.estimatedDaysRemaining} days
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(inv.status)} size="sm">
                        {inv.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={Eye}
                        onClick={() => navigate(`/materials/${inv.materialId}`)}
                      >
                        Details
                      </Button>
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
