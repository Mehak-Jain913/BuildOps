import React, { useState } from 'react';
import { useProcurement } from '../../hooks/useProcurement';
import { MetricCard } from '../../components/ui/MetricCard';
import { SupplierTable } from '../../components/procurement/SupplierTable';
import { SupplierPerformanceCard } from '../../components/procurement/SupplierPerformanceCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { SUPPLIER_CATEGORIES } from '../../mock/procurementData';
import {
  Truck,
  ShieldCheck,
  DollarSign,
  Package,
  AlertTriangle,
  Plus,
  BarChart3,
  ListFilter
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const SuppliersPage = () => {
  const { suppliers, deliveries, addSupplier } = useProcurement();
  const location = useLocation();

  // If URL is /suppliers/performance, default to performance tab
  const [activeTab, setActiveTab] = useState(() => {
    return location.pathname.includes('/performance') ? 'performance' : 'directory';
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newCategory, setNewCategory] = useState(SUPPLIER_CATEGORIES[0]);
  const [newContact, setNewContact] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newGST, setNewGST] = useState('');

  // Metrics calculations
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter((s) => s.status === 'Active' || s.status === 'Preferred').length;
  const totalOrdersMonth = suppliers.reduce((acc, s) => acc + s.totalOrders, 0);
  const totalProcurementVal = suppliers.reduce((acc, s) => acc + s.totalProcurementValue, 0);
  const pendingDeliveriesCount = deliveries.filter((d) => d.status === 'Dispatched' || d.status === 'Scheduled' || d.status === 'In Transit').length;
  const delayedDeliveriesCount = deliveries.filter((d) => d.status === 'Delayed').length;

  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const handleCreateSupplier = (e) => {
    e.preventDefault();
    if (!newSupplierName) return;

    addSupplier({
      name: newSupplierName,
      category: newCategory,
      contactPerson: newContact,
      phone: newPhone,
      email: newEmail,
      gstNumber: newGST,
      status: 'Active',
    });

    setIsAddModalOpen(false);
    setNewSupplierName('');
    setNewContact('');
    setNewPhone('');
    setNewEmail('');
    setNewGST('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-amber-400" />
            Supplier Directory & SLA Performance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Construction material vendors, SLA delivery metrics, quality audit scores, and active PO management.
          </p>
        </div>

        <Button variant="amber" onClick={() => setIsAddModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Register New Supplier</span>
        </Button>
      </div>

      {/* KPI Cards (Section 7) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <MetricCard
          title="Total Suppliers"
          value={totalSuppliers}
          icon={Truck}
          subtitle="Registered Vendors"
        />
        <MetricCard
          title="Active Vendors"
          value={activeSuppliers}
          icon={ShieldCheck}
          badgeText="Verified"
          badgeVariant="emerald"
        />
        <MetricCard
          title="Orders This Month"
          value={totalOrdersMonth}
          icon={Package}
          subtitle="Total PO Volume"
        />
        <MetricCard
          title="Procurement Value"
          value={formatCurrency(totalProcurementVal)}
          icon={DollarSign}
          subtitle="Lifetime Spend"
        />
        <MetricCard
          title="Pending Deliveries"
          value={pendingDeliveriesCount}
          icon={Truck}
          badgeText="In Pipeline"
          badgeVariant="info"
        />
        <MetricCard
          title="Delayed Deliveries"
          value={delayedDeliveriesCount}
          icon={AlertTriangle}
          badgeText={delayedDeliveriesCount > 0 ? "Action Req" : "On Track"}
          badgeVariant={delayedDeliveriesCount > 0 ? "danger" : "emerald"}
        />
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'directory'
              ? 'border-amber-500 text-amber-400 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Supplier Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('performance')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'performance'
              ? 'border-amber-500 text-amber-400 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>SLA & Quality Performance</span>
        </button>
      </div>

      {/* Directory Tab */}
      {activeTab === 'directory' && <SupplierTable suppliers={suppliers} />}

      {/* Performance Tab (Section 28) */}
      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((supplier) => (
            <SupplierPerformanceCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      )}

      {/* Add Supplier Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register Construction Vendor">
        <form onSubmit={handleCreateSupplier} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Company / Vendor Name *</label>
            <Input
              value={newSupplierName}
              onChange={(e) => setNewSupplierName(e.target.value)}
              placeholder="e.g. UltraCon Cement Supplies"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Primary Material Category *</label>
            <Select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              options={SUPPLIER_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contact Representative</label>
              <Input
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
                placeholder="e.g. Anil Sharma"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
              <Input
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+91 98260 00000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="orders@vendor.com"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">GST Registration #</label>
              <Input
                value={newGST}
                onChange={(e) => setNewGST(e.target.value)}
                placeholder="23AAACU1234F1Z5"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="amber" type="submit">
              Register Vendor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
