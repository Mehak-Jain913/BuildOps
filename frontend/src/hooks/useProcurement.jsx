import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_REQUESTS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_DELIVERIES,
  INITIAL_GRNS,
  INITIAL_PROCUREMENT_ALERTS,
} from '../mock/procurementData';
import { useMaterials } from './useMaterials';
import { useToast } from './useToast';

const ProcurementContext = createContext({
  suppliers: [],
  purchaseRequests: [],
  purchaseOrders: [],
  deliveries: [],
  grns: [],
  alerts: [],
  addSupplier: () => {},
  createPurchaseRequest: () => {},
  approvePurchaseRequest: () => {},
  rejectPurchaseRequest: () => {},
  createPurchaseOrder: () => {},
  approvePurchaseOrder: () => {},
  updateDeliveryStatus: () => {},
  recordDelivery: () => {},
  createGRN: () => {},
  postGRN: () => {},
  getSupplierById: () => null,
  getPurchaseRequestById: () => null,
  getPurchaseOrderById: () => null,
  getDeliveryById: () => null,
  getGRNById: () => null,
});

export const ProcurementProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [purchaseRequests, setPurchaseRequests] = useState(INITIAL_PURCHASE_REQUESTS);
  const [purchaseOrders, setPurchaseOrders] = useState(INITIAL_PURCHASE_ORDERS);
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [grns, setGrns] = useState(INITIAL_GRNS);
  const [alerts, setAlerts] = useState(INITIAL_PROCUREMENT_ALERTS);

  const { recordStockIn, materials } = useMaterials();
  const { addToast } = useToast();

  // Getters
  const getSupplierById = (id) => {
    return suppliers.find((s) => s.id === id || s.supplierCode === id) || null;
  };

  const getPurchaseRequestById = (id) => {
    return purchaseRequests.find((pr) => pr.id === id || pr.prNumber === id) || null;
  };

  const getPurchaseOrderById = (id) => {
    return purchaseOrders.find((po) => po.id === id || po.poNumber === id) || null;
  };

  const getDeliveryById = (id) => {
    return deliveries.find((d) => d.id === id || d.deliveryNumber === id) || null;
  };

  const getGRNById = (id) => {
    return grns.find((g) => g.id === id || g.grnNumber === id) || null;
  };

  // Actions
  const addSupplier = (supplierData) => {
    const newId = `SUP-${100 + suppliers.length + 1}`;
    const newCode = `SUP-${(supplierData.name || 'VEN').slice(0, 2).toUpperCase()}-0${suppliers.length + 1}`;

    const newSupplier = {
      id: newId,
      supplierCode: newCode,
      name: supplierData.name || 'New Supplier',
      category: supplierData.category || 'General Construction Materials',
      primaryMaterials: supplierData.primaryMaterials || [],
      contactPerson: supplierData.contactPerson || '',
      phone: supplierData.phone || '',
      email: supplierData.email || '',
      address: supplierData.address || '',
      gstNumber: supplierData.gstNumber || '',
      status: supplierData.status || 'Active',
      rating: 5.0,
      totalOrders: 0,
      completedOrders: 0,
      delayedOrders: 0,
      totalProcurementValue: 0,
      averageDeliveryDays: 2.0,
      qualityScore: 100,
      reliabilityScore: 100,
      lastOrderDate: new Date().toISOString().split('T')[0],
    };

    setSuppliers((prev) => [newSupplier, ...prev]);
    if (addToast) addToast({ type: 'success', title: 'Supplier Registered', message: `Registered ${newSupplier.name}` });
    return { success: true, supplier: newSupplier };
  };

  const createPurchaseRequest = (prData) => {
    const qty = parseFloat(prData.requestedQuantity) || 0;
    if (qty <= 0) return { success: false, error: 'Requested quantity must be greater than 0.' };
    if (!prData.materialId) return { success: false, error: 'Please select a material.' };
    if (!prData.projectId) return { success: false, error: 'Please select a project.' };

    const materialObj = materials.find((m) => m.id === prData.materialId) || { name: prData.materialName || 'Material', unit: prData.unit || 'pcs' };
    const nextNum = 100 + purchaseRequests.length + 1;
    const newId = `PR-${nextNum}`;
    const prNumber = `PR-2026-${nextNum}`;

    const newPR = {
      id: newId,
      prNumber: prNumber,
      projectId: prData.projectId,
      projectName: prData.projectName || 'Sunrise Heights',
      blockId: prData.blockId || '',
      blockName: prData.blockName || 'Block A',
      levelId: prData.levelId || '',
      levelName: prData.levelName || 'Ground Floor',
      taskId: prData.taskId || '',
      taskName: prData.taskName || '',
      requestedBy: prData.requestedBy || 'Site Supervisor',
      materialId: prData.materialId,
      materialName: materialObj.name,
      requestedQuantity: qty,
      unit: prData.unit || materialObj.unit || 'pcs',
      requiredBy: prData.requiredBy || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      priority: prData.priority || 'Medium',
      reason: prData.reason || 'Site requirement',
      notes: prData.notes || '',
      status: 'Pending Approval',
      createdDate: new Date().toISOString().split('T')[0],
    };

    setPurchaseRequests((prev) => [newPR, ...prev]);
    if (addToast) addToast({ type: 'success', title: 'Purchase Request Submitted', message: `${prNumber} created successfully.` });
    return { success: true, purchaseRequest: newPR };
  };

  const approvePurchaseRequest = (requestId) => {
    setPurchaseRequests((prev) =>
      prev.map((pr) => (pr.id === requestId || pr.prNumber === requestId ? { ...pr, status: 'Approved' } : pr))
    );
    if (addToast) addToast({ type: 'success', title: 'Request Approved', message: `Purchase Request approved.` });
  };

  const rejectPurchaseRequest = (requestId) => {
    setPurchaseRequests((prev) =>
      prev.map((pr) => (pr.id === requestId || pr.prNumber === requestId ? { ...pr, status: 'Rejected' } : pr))
    );
    if (addToast) addToast({ type: 'warning', title: 'Request Rejected', message: `Purchase Request rejected.` });
  };

  const createPurchaseOrder = (poData) => {
    if (!poData.supplierId) return { success: false, error: 'Please select a supplier.' };
    if (!poData.items || poData.items.length === 0) return { success: false, error: 'At least one item is required.' };

    const supplierObj = suppliers.find((s) => s.id === poData.supplierId);
    const nextNum = 200 + purchaseOrders.length + 1;
    const newId = `PO-${nextNum}`;
    const poNumber = `PO-2026-${nextNum}`;

    const items = poData.items.map((item) => {
      const q = parseFloat(item.quantity) || 0;
      const p = parseFloat(item.unitPrice) || 0;
      const sub = q * p;
      const taxRate = item.taxRate !== undefined ? parseFloat(item.taxRate) : 18;
      const total = sub + (sub * taxRate) / 100;
      return {
        materialId: item.materialId,
        materialName: item.materialName || 'Material',
        quantity: q,
        unit: item.unit || 'pcs',
        unitPrice: p,
        taxRate,
        total,
      };
    });

    const subtotal = items.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
    const tax = items.reduce((acc, curr) => acc + ((curr.quantity * curr.unitPrice * curr.taxRate) / 100), 0);
    const totalAmount = subtotal + tax;

    const newPO = {
      id: newId,
      poNumber: poNumber,
      purchaseRequestId: poData.purchaseRequestId || '',
      supplierId: poData.supplierId,
      supplierName: supplierObj?.name || poData.supplierName || 'Supplier',
      projectId: poData.projectId || 'PRJ-001',
      projectName: poData.projectName || 'Sunrise Heights',
      items,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: poData.expectedDeliveryDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      deliveryAddress: poData.deliveryAddress || 'Site Central Depot',
      subtotal,
      tax,
      totalAmount,
      status: 'Sent to Supplier',
      paymentStatus: 'Pending Invoice',
      notes: poData.notes || '',
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);

    // If linked to a purchase request, update request status to 'Converted to PO'
    if (poData.purchaseRequestId) {
      setPurchaseRequests((prev) =>
        prev.map((pr) =>
          pr.id === poData.purchaseRequestId || pr.prNumber === poData.purchaseRequestId
            ? { ...pr, status: 'Converted to PO' }
            : pr
        )
      );
    }

    // Automatically create a scheduled delivery record
    const nextDelNum = 300 + deliveries.length + 1;
    const firstItem = items[0] || {};
    const newDelivery = {
      id: `DEL-${nextDelNum}`,
      deliveryNumber: `DEL-2026-${nextDelNum}`,
      poId: newId,
      poNumber: poNumber,
      supplierId: poData.supplierId,
      supplierName: supplierObj?.name || 'Supplier',
      projectId: poData.projectId || 'PRJ-001',
      projectName: poData.projectName || 'Sunrise Heights',
      materialId: firstItem.materialId,
      materialName: firstItem.materialName,
      unit: firstItem.unit,
      orderedQuantity: firstItem.quantity,
      deliveredQuantity: 0,
      remainingQuantity: firstItem.quantity,
      expectedDate: newPO.expectedDeliveryDate,
      actualDate: '',
      vehicleNumber: 'Pending Dispatch',
      driverName: 'Unassigned',
      status: 'Scheduled',
    };

    setDeliveries((prev) => [newDelivery, ...prev]);

    if (addToast) addToast({ type: 'success', title: 'Purchase Order Issued', message: `${poNumber} sent to ${newPO.supplierName}.` });
    return { success: true, purchaseOrder: newPO };
  };

  const approvePurchaseOrder = (poId) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === poId || po.poNumber === poId ? { ...po, status: 'Approved' } : po))
    );
    if (addToast) addToast({ type: 'success', title: 'PO Approved', message: `Purchase order approved.` });
  };

  const updateDeliveryStatus = (deliveryId, statusData) => {
    const updatedStatus = typeof statusData === 'string' ? statusData : statusData.status;

    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id === deliveryId || d.deliveryNumber === deliveryId) {
          const deliveredQty = statusData.deliveredQuantity !== undefined ? parseFloat(statusData.deliveredQuantity) : d.deliveredQuantity;
          const remainingQty = Math.max(0, d.orderedQuantity - deliveredQty);
          return {
            ...d,
            status: updatedStatus,
            deliveredQuantity: deliveredQty,
            remainingQuantity: remainingQty,
            actualDate: statusData.actualDate || d.actualDate || (updatedStatus === 'Delivered' ? new Date().toISOString().split('T')[0] : ''),
            vehicleNumber: statusData.vehicleNumber || d.vehicleNumber,
            driverName: statusData.driverName || d.driverName,
          };
        }
        return d;
      })
    );

    if (addToast) addToast({ type: 'info', title: 'Delivery Updated', message: `Delivery status updated to ${updatedStatus}.` });
  };

  const recordDelivery = (deliveryData) => {
    updateDeliveryStatus(deliveryData.id || deliveryData.deliveryId, deliveryData);
  };

  const createGRN = (grnData) => {
    const nextNum = 400 + grns.length + 1;
    const newId = `GRN-${nextNum}`;
    const grnNumber = `GRN-2026-${nextNum}`;

    const items = (grnData.items || []).map((item) => {
      const rec = parseFloat(item.receivedQuantity) || 0;
      const acc = parseFloat(item.acceptedQuantity) || 0;
      const rej = parseFloat(item.rejectedQuantity) || 0;
      return {
        materialId: item.materialId,
        materialName: item.materialName || 'Material',
        unit: item.unit || 'pcs',
        orderedQuantity: parseFloat(item.orderedQuantity) || rec,
        receivedQuantity: rec,
        acceptedQuantity: acc,
        rejectedQuantity: rej,
        remarks: item.remarks || '',
      };
    });

    const newGRN = {
      id: newId,
      grnNumber,
      poId: grnData.poId || '',
      poNumber: grnData.poNumber || '',
      deliveryId: grnData.deliveryId || '',
      supplierId: grnData.supplierId || '',
      supplierName: grnData.supplierName || 'Supplier',
      projectId: grnData.projectId || 'PRJ-001',
      projectName: grnData.projectName || 'Sunrise Heights',
      receivedDate: grnData.receivedDate || new Date().toISOString().split('T')[0],
      receivedBy: grnData.receivedBy || 'Site Inspector',
      qualityStatus: grnData.qualityStatus || 'Under Inspection',
      inspectionNotes: grnData.inspectionNotes || '',
      status: 'Draft',
      items,
    };

    setGrns((prev) => [newGRN, ...prev]);
    if (addToast) addToast({ type: 'success', title: 'GRN Created', message: `${grnNumber} created as Draft.` });
    return { success: true, grn: newGRN };
  };

  // CRITICAL INTEGRATION REQUIREMENT: POST GRN -> Stock IN to Material Inventory
  const postGRN = (grnId) => {
    const targetGRN = grns.find((g) => g.id === grnId || g.grnNumber === grnId);
    if (!targetGRN) return { success: false, error: 'GRN not found.' };
    if (targetGRN.status === 'Posted') return { success: false, error: 'GRN is already posted.' };

    let totalStockAdded = 0;

    // Call recordStockIn for each accepted item quantity
    (targetGRN.items || []).forEach((item) => {
      const acceptedQty = parseFloat(item.acceptedQuantity) || 0;
      if (acceptedQty > 0) {
        recordStockIn({
          materialId: item.materialId,
          quantity: acceptedQty,
          projectId: targetGRN.projectId,
          projectName: targetGRN.projectName,
          reference: targetGRN.grnNumber,
          supplier: targetGRN.supplierName,
          notes: `GRN Posted: ${targetGRN.inspectionNotes || 'Accepted stock entered inventory.'}`,
        });
        totalStockAdded += acceptedQty;
      }
    });

    // Update GRN state
    setGrns((prev) =>
      prev.map((g) =>
        g.id === grnId || g.grnNumber === grnId
          ? { ...g, status: 'Posted', qualityStatus: g.qualityStatus === 'Under Inspection' ? 'Accepted' : g.qualityStatus }
          : g
      )
    );

    // Update PO status to Delivered / Partially Delivered
    if (targetGRN.poId) {
      setPurchaseOrders((prev) =>
        prev.map((po) => {
          if (po.id === targetGRN.poId || po.poNumber === targetGRN.poId) {
            return { ...po, status: 'Delivered', paymentStatus: 'Pending Invoice' };
          }
          return po;
        })
      );
    }

    // Update Delivery status to Delivered
    if (targetGRN.deliveryId) {
      setDeliveries((prev) =>
        prev.map((d) => {
          if (d.id === targetGRN.deliveryId || d.deliveryNumber === targetGRN.deliveryId) {
            return {
              ...d,
              status: 'Delivered',
              deliveredQuantity: d.orderedQuantity,
              remainingQuantity: 0,
              actualDate: new Date().toISOString().split('T')[0],
            };
          }
          return d;
        })
      );
    }

    if (addToast) {
      addToast({
        type: 'success',
        title: 'GRN Posted to Inventory',
        message: `${targetGRN.grnNumber} posted! +${totalStockAdded} items added to site inventory stock.`,
      });
    }

    return { success: true };
  };

  return (
    <ProcurementContext.Provider
      value={{
        suppliers,
        purchaseRequests,
        purchaseOrders,
        deliveries,
        grns,
        alerts,
        addSupplier,
        createPurchaseRequest,
        approvePurchaseRequest,
        rejectPurchaseRequest,
        createPurchaseOrder,
        approvePurchaseOrder,
        updateDeliveryStatus,
        recordDelivery,
        createGRN,
        postGRN,
        getSupplierById,
        getPurchaseRequestById,
        getPurchaseOrderById,
        getDeliveryById,
        getGRNById,
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurement = () => useContext(ProcurementContext);
