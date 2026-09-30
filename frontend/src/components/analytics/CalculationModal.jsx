import React from 'react';
import { X, Calculator, HelpCircle, CheckCircle } from 'lucide-react';
import { CALCULATION_BASIS } from '../../mock/analyticsData';

export const CalculationModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Engineering Calculation Basis</h3>
              <p className="text-xs text-slate-400">Transparent rule-based analytics & construction intelligence formulas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar text-slate-700 text-sm">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-amber-900 text-xs">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              BuildOps Analytics uses <strong>100% deterministic, explainable rule-based metrics</strong> derived strictly from live operational contexts (Projects, Materials, Labour, Procurement, Site Operations). No black-box machine learning or synthetic estimates are used in Phase 8.
            </p>
          </div>

          <div className="space-y-3">
            {Object.entries(CALCULATION_BASIS).map(([key, calc]) => (
              <div key={key} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-sm">{calc.name}</span>
                  <span className="text-[10px] uppercase font-mono tracking-wide px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                    Rule-Based
                  </span>
                </div>
                <div className="bg-slate-900 text-amber-300 font-mono text-xs px-3 py-2 rounded-lg mb-2 overflow-x-auto">
                  {calc.formula}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {calc.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Single Source of Truth Contexts Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close Basis
          </button>
        </div>
      </div>
    </div>
  );
};
