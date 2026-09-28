import React, { useState } from 'react';
import { InventoryTable } from '../../components/materials/InventoryTable';
import { StockInModal } from '../../components/materials/StockInModal';
import { StockIssueModal } from '../../components/materials/StockIssueModal';
import { useMaterials } from '../../hooks/useMaterials';
import { useProjects } from '../../hooks/useProjects';

export const InventoryPage = () => {
  const { inventory } = useMaterials();
  const { projects } = useProjects();

  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockIssueOpen, setIsStockIssueOpen] = useState(false);

  return (
    <div className="space-y-6">
      <InventoryTable
        inventory={inventory}
        projects={projects}
        onStockIn={() => setIsStockInOpen(true)}
        onIssueStock={() => setIsStockIssueOpen(true)}
        title="Comprehensive Site Inventory Stock"
        subtitle="Full warehouse and staging yard material availability, daily consumption rates, and stock life projections."
      />

      <StockInModal isOpen={isStockInOpen} onClose={() => setIsStockInOpen(false)} />
      <StockIssueModal isOpen={isStockIssueOpen} onClose={() => setIsStockIssueOpen(false)} />
    </div>
  );
};
