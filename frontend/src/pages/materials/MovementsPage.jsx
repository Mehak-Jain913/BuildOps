import React, { useState } from 'react';
import { MaterialMovementTable } from '../../components/materials/MaterialMovementTable';
import { StockInModal } from '../../components/materials/StockInModal';
import { StockIssueModal } from '../../components/materials/StockIssueModal';
import { Button } from '../../components/ui/Button';
import { useMaterials } from '../../hooks/useMaterials';
import { PackagePlus, ArrowRight } from 'lucide-react';

export const MovementsPage = () => {
  const { stockMovements } = useMaterials();
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockIssueOpen, setIsStockIssueOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Stock Movement Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete transaction log of received consignments, site issues, returns, and reported wastage.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" leftIcon={PackagePlus} onClick={() => setIsStockInOpen(true)}>
            Record Stock In
          </Button>
          <Button variant="primary" size="sm" leftIcon={ArrowRight} onClick={() => setIsStockIssueOpen(true)}>
            Issue Material
          </Button>
        </div>
      </div>

      <MaterialMovementTable movements={stockMovements} />

      <StockInModal isOpen={isStockInOpen} onClose={() => setIsStockInOpen(false)} />
      <StockIssueModal isOpen={isStockIssueOpen} onClose={() => setIsStockIssueOpen(false)} />
    </div>
  );
};
