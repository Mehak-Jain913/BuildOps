import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Truck, ArrowRight, Layers, Trash2, CheckCircle2, FileText } from 'lucide-react';

export const MaterialTraceability = ({ movements = [], materialName = 'Cement — OPC 53 Grade' }) => {
  const getMovementIcon = (type) => {
    switch (type) {
      case 'RECEIVED':
        return Truck;
      case 'ISSUED':
        return ArrowRight;
      case 'WASTAGE':
        return Trash2;
      case 'RETURNED':
        return CheckCircle2;
      default:
        return FileText;
    }
  };

  const getMovementBadge = (type) => {
    switch (type) {
      case 'RECEIVED':
        return { variant: 'success', bg: 'bg-emerald-500' };
      case 'ISSUED':
        return { variant: 'info', bg: 'bg-blue-500' };
      case 'WASTAGE':
        return { variant: 'danger', bg: 'bg-red-500' };
      case 'RETURNED':
        return { variant: 'warning', bg: 'bg-amber-500' };
      default:
        return { variant: 'neutral', bg: 'bg-slate-400' };
    }
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Material Traceability Chain</h3>
              <p className="text-xs text-slate-500 font-normal">
                Traceability flow: Supplier Delivery → Store → Site Issue → Task Consumption → Wastage
              </p>
            </div>
          </div>
          <Badge variant="amber" size="sm">
            {movements.length} Trace Events
          </Badge>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Target Material SKU:</span>
          <span className="text-xs font-mono font-extrabold text-amber-400">{materialName}</span>
        </div>

        {movements.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 italic">
            No movement records found for this material.
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {movements.map((mov, idx) => {
              const Icon = getMovementIcon(mov.type);
              const badgeCfg = getMovementBadge(mov.type);

              return (
                <div key={mov.id || idx} className="relative group">
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-white ${badgeCfg.bg}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={badgeCfg.variant} size="sm">
                          {mov.type}
                        </Badge>
                        <span className="font-extrabold text-slate-900 text-sm">
                          {mov.quantity} {mov.unit}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          ({mov.materialName})
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 font-medium">
                        {mov.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold pt-1 border-t border-slate-100">
                      <span>Destination / Source:</span>
                      <span className="text-amber-700 font-bold">
                        {mov.projectName} → {mov.blockName || 'Storage Yard'}{' '}
                        {mov.levelName ? `(${mov.levelName})` : ''}
                      </span>
                    </div>

                    {mov.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-0.5">{mov.notes}</p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Ref: {mov.reference || 'N/A'}</span>
                      <span>Log Actor: {mov.actor}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};
