import React, { useState } from 'react';
import { WastageTable } from '../../components/materials/WastageTable';
import { StockIssueModal } from '../../components/materials/StockIssueModal';
import { useMaterials } from '../../hooks/useMaterials';

export const WastagePage = () => {
  const { wastage } = useMaterials();
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Site Material Wastage & Loss Tracking
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor handling losses, weather exposure damage, rebar cutting scrap, and financial impact.
        </p>
      </div>

      <WastageTable wastage={wastage} onReportWastage={() => setIsReportOpen(true)} />

      <StockIssueModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </div>
  );
};
