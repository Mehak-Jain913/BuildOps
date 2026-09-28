import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { MaterialTraceability } from '../../components/materials/MaterialTraceability';
import { MaterialMovementTable } from '../../components/materials/MaterialMovementTable';
import { StockInModal } from '../../components/materials/StockInModal';
import { StockIssueModal } from '../../components/materials/StockIssueModal';
import { useMaterials } from '../../hooks/useMaterials';
import { formatCurrency } from '../../utils/formatters';
import {
  Package,
  ArrowLeft,
  Warehouse,
  Truck,
  ArrowRight,
  Layers,
  Clock,
  Trash2,
  Building2,
  Calendar,
} from 'lucide-react';

export const MaterialDetailPage = () => {
  const { materialId } = useParams();
  const navigate = useNavigate();

  const {
    getMaterialById,
    inventory,
    stockMovements,
    consumption,
    wastage,
    getTraceabilityForMaterial,
  } = useMaterials();

  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockIssueOpen, setIsStockIssueOpen] = useState(false);

  const material = getMaterialById(materialId);

  if (!material) {
    return (
      <Card className="p-8 text-center bg-white">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Material SKU Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          The requested material ID "{materialId}" does not exist in catalog.
        </p>
        <Button variant="primary" onClick={() => navigate('/materials')}>
          Back to Material Management
        </Button>
      </Card>
    );
  }

  // Filter inventory, movements, consumption, wastage for this specific material
  const materialInventory = inventory.filter((inv) => inv.materialId === material.id);
  const totalAvailable = materialInventory.reduce((acc, i) => acc + (i.quantityAvailable || 0), 0);
  const totalReserved = materialInventory.reduce((acc, i) => acc + (i.quantityReserved || 0), 0);
  const totalInTransit = materialInventory.reduce((acc, i) => acc + (i.quantityInTransit || 0), 0);
  const avgDailyRate = materialInventory[0]?.averageDailyConsumption || 15;
  const daysRemaining = Math.round(totalAvailable / (avgDailyRate || 1));

  const traceabilityMovements = getTraceabilityForMaterial(material.id);
  const materialMovements = stockMovements.filter((m) => m.materialId === material.id);
  const materialConsumption = consumption.filter((c) => c.materialId === material.id);
  const materialWastage = wastage.filter((w) => w.materialId === material.id);

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <button
        onClick={() => navigate('/materials')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Material Inventory
      </button>

      {/* 1. HEADER */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded bg-slate-900 text-amber-400">
                {material.code}
              </span>
              <Badge variant="neutral" size="md">
                {material.category}
              </Badge>
              <Badge variant="success" size="md">
                Active SKU
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {material.name}
            </h1>
            <p className="text-xs text-slate-500">
              Specification: <strong className="text-slate-700">{material.specification}</strong> •
              Default Supplier: <strong className="text-slate-700">{material.defaultSupplier}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button variant="outline" leftIcon={Truck} onClick={() => setIsStockInOpen(true)}>
              Stock In
            </Button>
            <Button variant="primary" leftIcon={ArrowRight} onClick={() => setIsStockIssueOpen(true)}>
              Issue Material
            </Button>
          </div>
        </div>

        {/* Header Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Total Stock Available
            </span>
            <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
              {totalAvailable.toLocaleString()} {material.unit}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Reserved Qty
            </span>
            <span className="font-bold text-slate-700 text-sm mt-0.5 block">
              {totalReserved} {material.unit}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              In Transit
            </span>
            <span className="font-bold text-blue-600 text-sm mt-0.5 block">
              {totalInTransit} {material.unit}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Reorder Level
            </span>
            <span className="font-bold text-amber-700 text-sm mt-0.5 block">
              {material.reorderLevel} {material.unit}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Daily Burn Rate
            </span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              ~{avgDailyRate} {material.unit}/day
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Est. Stock Life
            </span>
            <span className="font-extrabold text-emerald-700 text-sm mt-0.5 block">
              ~{daysRemaining} Days
            </span>
          </div>
        </div>
      </div>

      {/* 2. PROJECT & SITE DISTRIBUTION BREAKDOWN */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">Project & Storage Depot Distribution</h3>
            </div>
            <Badge variant="neutral" size="sm">
              {materialInventory.length} Depot Locations
            </Badge>
          </div>
        }
        subtitle="Stock breakdown across project sites, storage warehouses, and staging yards."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materialInventory.map((inv) => (
            <div
              key={inv.id}
              className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{inv.projectName}</h4>
                  <span className="text-xs text-slate-500 font-medium">{inv.locationName}</span>
                </div>
                <Badge variant={inv.status === 'Healthy' ? 'success' : 'warning'} size="sm">
                  {inv.status}
                </Badge>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-slate-200/60 text-xs">
                <span className="text-slate-600">Quantity Available:</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {inv.quantityAvailable} {inv.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 3. MATERIAL TRACEABILITY CHAIN */}
      <MaterialTraceability movements={traceabilityMovements} materialName={material.name} />

      {/* 4. STOCK MOVEMENT LOG FOR THIS MATERIAL */}
      <MaterialMovementTable
        movements={materialMovements}
        title={`Movement Log for ${material.name}`}
      />

      {/* MODALS */}
      <StockInModal isOpen={isStockInOpen} onClose={() => setIsStockInOpen(false)} />
      <StockIssueModal
        isOpen={isStockIssueOpen}
        onClose={() => setIsStockIssueOpen(false)}
        defaultMaterialId={material.id}
      />
    </div>
  );
};
