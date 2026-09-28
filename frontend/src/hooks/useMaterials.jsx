import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_MATERIALS,
  INITIAL_INVENTORY,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_MATERIAL_REQUESTS,
  INITIAL_CONSUMPTION,
  INITIAL_WASTAGE,
  INITIAL_ALERTS,
  INITIAL_INTELLIGENCE,
  INITIAL_COST_SNAPSHOT,
} from '../mock/materialData';

const MaterialContext = createContext({
  materials: [],
  inventory: [],
  stockMovements: [],
  requests: [],
  consumption: [],
  wastage: [],
  alerts: [],
  intelligence: [],
  costSnapshot: {},
  getInventoryByProjectId: () => [],
  getMaterialById: () => null,
  getTraceabilityForMaterial: () => [],
  recordStockIn: () => ({ success: false }),
  issueMaterial: () => ({ success: false }),
  createMaterialRequest: () => ({ success: false }),
  approveMaterialRequest: () => {},
  rejectMaterialRequest: () => {},
  recordConsumption: () => {},
  recordWastage: () => ({ success: false }),
});

export const MaterialProvider = ({ children }) => {
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [stockMovements, setStockMovements] = useState(INITIAL_STOCK_MOVEMENTS);
  const [requests, setRequests] = useState(INITIAL_MATERIAL_REQUESTS);
  const [consumption, setConsumption] = useState(INITIAL_CONSUMPTION);
  const [wastage, setWastage] = useState(INITIAL_WASTAGE);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [intelligence] = useState(INITIAL_INTELLIGENCE);
  const [costSnapshot] = useState(INITIAL_COST_SNAPSHOT);

  const getInventoryByProjectId = (projectId) => {
    if (!projectId || projectId === 'ALL') return inventory;
    return inventory.filter((inv) => inv.projectId === projectId);
  };

  const getMaterialById = (id) => {
    return materials.find((m) => m.id === id || m.code === id) || materials[0] || null;
  };

  const getTraceabilityForMaterial = (materialId, projectId) => {
    return stockMovements
      .filter((m) => m.materialId === materialId && (!projectId || m.projectId === projectId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // 1. STOCK IN / RECEIVE
  const recordStockIn = (data) => {
    const qty = parseFloat(data.quantity) || 0;
    if (qty <= 0) return { success: false, error: 'Quantity must be greater than 0.' };

    const materialObj = materials.find((m) => m.id === data.materialId) || materials[0];

    const newMovement = {
      id: `MOV-${Date.now()}`,
      materialId: data.materialId,
      materialName: materialObj.name,
      projectId: data.projectId || 'PRJ-001',
      projectName: data.projectName || 'Sunrise Heights',
      blockId: data.blockId || 'BLK-101',
      blockName: data.blockName || 'Storage Yard',
      levelId: data.levelId || '',
      levelName: data.levelName || '',
      taskId: '',
      taskName: '',
      type: 'RECEIVED',
      quantity: qty,
      unit: materialObj.unit,
      reference: data.reference || `GRN-2026-${Math.floor(100 + Math.random() * 900)}`,
      actor: data.supplier || 'Site Logistics',
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      notes: data.notes || 'Stock in recorded.',
    };

    setStockMovements((prev) => [newMovement, ...prev]);

    // Update inventory stock
    setInventory((prev) => {
      const existingIdx = prev.findIndex(
        (inv) => inv.materialId === data.materialId && inv.projectId === data.projectId
      );

      if (existingIdx >= 0) {
        return prev.map((inv, idx) => {
          if (idx === existingIdx) {
            const updatedQty = inv.quantityAvailable + qty;
            let newStatus = 'Healthy';
            if (updatedQty < inv.minimumStock) newStatus = 'Critical';
            else if (updatedQty < inv.reorderLevel) newStatus = 'Low Stock';
            else if (updatedQty < inv.reorderLevel * 1.2) newStatus = 'Monitor';

            return {
              ...inv,
              quantityAvailable: updatedQty,
              lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16),
              status: newStatus,
            };
          }
          return inv;
        });
      } else {
        // Add new inventory entry
        const newInv = {
          id: `INV-${Date.now()}`,
          materialId: data.materialId,
          materialCode: materialObj.code,
          materialName: materialObj.name,
          category: materialObj.category,
          unit: materialObj.unit,
          projectId: data.projectId || 'PRJ-001',
          projectName: data.projectName || 'Sunrise Heights',
          blockId: data.blockId || 'BLK-101',
          blockName: data.blockName || 'Storage Yard',
          locationName: data.locationName || `${data.blockName || 'Yard'} Store`,
          quantityAvailable: qty,
          quantityReserved: 0,
          quantityInTransit: 0,
          reorderLevel: materialObj.reorderLevel,
          minimumStock: materialObj.minimumStock,
          averageDailyConsumption: 10,
          estimatedDaysRemaining: Math.round(qty / 10),
          lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16),
          status: 'Healthy',
          unitPrice: materialObj.unitPrice,
        };
        return [newInv, ...prev];
      }
    });

    return { success: true, movement: newMovement };
  };

  // 2. STOCK ISSUE / OUT (Validates stock & creates consumption record)
  const issueMaterial = (data) => {
    const qty = parseFloat(data.quantity) || 0;
    if (qty <= 0) return { success: false, error: 'Quantity must be greater than 0.' };

    const invItem = inventory.find(
      (inv) => inv.materialId === data.materialId && inv.projectId === data.projectId
    );

    if (!invItem || invItem.quantityAvailable < qty) {
      return {
        success: false,
        error: `Insufficient available stock. Available: ${invItem?.quantityAvailable || 0} ${invItem?.unit || 'units'}, Requested: ${qty}.`,
      };
    }

    const materialObj = materials.find((m) => m.id === data.materialId) || materials[0];

    // Decrease Inventory
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.materialId === data.materialId && inv.projectId === data.projectId) {
          const newQty = inv.quantityAvailable - qty;
          let newStatus = 'Healthy';
          if (newQty <= 0) newStatus = 'Out of Stock';
          else if (newQty < inv.minimumStock) newStatus = 'Critical';
          else if (newQty < inv.reorderLevel) newStatus = 'Low Stock';
          else if (newQty < inv.reorderLevel * 1.2) newStatus = 'Monitor';

          return {
            ...inv,
            quantityAvailable: newQty,
            lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16),
            status: newStatus,
          };
        }
        return inv;
      })
    );

    // Create Stock Movement
    const newMovement = {
      id: `MOV-${Date.now()}`,
      materialId: data.materialId,
      materialName: materialObj.name,
      projectId: data.projectId,
      projectName: data.projectName || 'Sunrise Heights',
      blockId: data.blockId || '',
      blockName: data.blockName || 'Block A',
      levelId: data.levelId || '',
      levelName: data.levelName || 'General Floor',
      taskId: data.taskId || '',
      taskName: data.taskName || 'Site Task',
      type: 'ISSUED',
      quantity: qty,
      unit: materialObj.unit,
      reference: `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      actor: data.requestedBy || 'Site Supervisor',
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      notes: data.notes || 'Issued for site execution.',
    };

    setStockMovements((prev) => [newMovement, ...prev]);

    // Create Consumption Record automatically from issue
    const newConsumption = {
      id: `CNS-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      materialId: data.materialId,
      materialName: materialObj.name,
      projectId: data.projectId,
      projectName: data.projectName || 'Sunrise Heights',
      blockId: data.blockId || '',
      blockName: data.blockName || 'Block A',
      levelId: data.levelId || '',
      levelName: data.levelName || 'Level 1',
      taskId: data.taskId || '',
      taskName: data.taskName || 'Site Execution',
      plannedQuantity: Math.round(qty * 0.9), // Planned benchmark
      actualQuantity: qty,
      variance: Math.round(qty * 0.1 * 10) / 10,
      variancePercentage: 10.0,
      unit: materialObj.unit,
      recordedBy: data.requestedBy || 'Site Supervisor',
    };

    setConsumption((prev) => [newConsumption, ...prev]);

    return { success: true };
  };

  // 3. CREATE MATERIAL REQUEST
  const createMaterialRequest = (data) => {
    const qty = parseFloat(data.requestedQuantity) || 0;
    if (qty <= 0) return { success: false, error: 'Requested Quantity must be greater than 0.' };

    const materialObj = materials.find((m) => m.id === data.materialId) || materials[0];

    const newRequest = {
      id: `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      materialId: data.materialId,
      materialName: materialObj.name,
      projectId: data.projectId,
      projectName: data.projectName || 'Sunrise Heights',
      blockId: data.blockId || '',
      blockName: data.blockName || 'Site Area',
      levelId: data.levelId || '',
      levelName: data.levelName || '',
      taskId: data.taskId || '',
      taskName: data.taskName || '',
      requestedQuantity: qty,
      unit: materialObj.unit,
      requestedBy: data.requestedBy || 'David Miller',
      priority: data.priority || 'Medium',
      date: new Date().toISOString().split('T')[0],
      requiredDate: data.requiredDate || new Date().toISOString().split('T')[0],
      status: 'Pending Approval',
      notes: data.notes || '',
    };

    setRequests((prev) => [newRequest, ...prev]);

    return { success: true, request: newRequest };
  };

  // 4. APPROVE / REJECT REQUEST
  const approveMaterialRequest = (requestId) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Approved' } : r))
    );
  };

  const rejectMaterialRequest = (requestId) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Rejected' } : r))
    );
  };

  // 5. RECORD CONSUMPTION
  const recordConsumption = (data) => {
    const planned = parseFloat(data.plannedQuantity) || 0;
    const actual = parseFloat(data.actualQuantity) || 0;
    const variance = actual - planned;
    const variancePct = planned > 0 ? Math.round((variance / planned) * 100 * 10) / 10 : 0;

    const materialObj = materials.find((m) => m.id === data.materialId) || materials[0];

    const newEntry = {
      id: `CNS-${Date.now()}`,
      date: data.date || new Date().toISOString().split('T')[0],
      materialId: data.materialId,
      materialName: materialObj.name,
      projectId: data.projectId,
      projectName: data.projectName || 'Sunrise Heights',
      blockId: data.blockId || '',
      blockName: data.blockName || 'Block A',
      levelId: data.levelId || '',
      levelName: data.levelName || 'Ground Floor',
      taskId: data.taskId || '',
      taskName: data.taskName || 'Construction Task',
      plannedQuantity: planned,
      actualQuantity: actual,
      variance: Math.round(variance * 10) / 10,
      variancePercentage: variancePct,
      unit: materialObj.unit,
      recordedBy: data.recordedBy || 'Site Supervisor',
    };

    setConsumption((prev) => [newEntry, ...prev]);
  };

  // 6. RECORD WASTAGE
  const recordWastage = (data) => {
    const qty = parseFloat(data.quantity) || 0;
    if (qty <= 0) return { success: false, error: 'Quantity must be greater than 0.' };

    const materialObj = materials.find((m) => m.id === data.materialId) || materials[0];

    const newWastage = {
      id: `WST-${Date.now()}`,
      materialId: data.materialId,
      materialName: materialObj.name,
      projectId: data.projectId,
      projectName: data.projectName || 'Sunrise Heights',
      blockId: data.blockId || '',
      blockName: data.blockName || 'Site Storage',
      quantity: qty,
      unit: materialObj.unit,
      reason: data.reason || 'Handling loss',
      reportedBy: data.reportedBy || 'Site Supervisor',
      date: new Date().toISOString().split('T')[0],
      estimatedCost: Math.round(qty * (materialObj.unitPrice || 100)),
    };

    setWastage((prev) => [newWastage, ...prev]);

    // Decrease Inventory
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.materialId === data.materialId && inv.projectId === data.projectId) {
          const newQty = Math.max(0, inv.quantityAvailable - qty);
          return {
            ...inv,
            quantityAvailable: newQty,
            lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return inv;
      })
    );

    // Record Wastage Movement
    setStockMovements((prev) => [
      {
        id: `MOV-${Date.now()}`,
        materialId: data.materialId,
        materialName: materialObj.name,
        projectId: data.projectId,
        projectName: data.projectName || 'Sunrise Heights',
        blockId: data.blockId || '',
        blockName: data.blockName || 'Site Storage',
        type: 'WASTAGE',
        quantity: qty,
        unit: materialObj.unit,
        reference: newWastage.id,
        actor: data.reportedBy || 'Site Supervisor',
        date: new Date().toISOString().replace('T', ' ').slice(0, 19),
        notes: `Wastage reported due to ${data.reason}.`,
      },
      ...prev,
    ]);

    return { success: true };
  };

  return (
    <MaterialContext.Provider
      value={{
        materials,
        inventory,
        stockMovements,
        requests,
        consumption,
        wastage,
        alerts,
        intelligence,
        costSnapshot,
        getInventoryByProjectId,
        getMaterialById,
        getTraceabilityForMaterial,
        recordStockIn,
        issueMaterial,
        createMaterialRequest,
        approveMaterialRequest,
        rejectMaterialRequest,
        recordConsumption,
        recordWastage,
      }}
    >
      {children}
    </MaterialContext.Provider>
  );
};

export const useMaterials = () => useContext(MaterialContext);
