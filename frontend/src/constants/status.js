export const STATUS_TYPES = {
  // Project & Task Statuses
  DRAFT: 'draft',
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  DELAYED: 'delayed',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled',

  // Approval & Risk Statuses
  APPROVED: 'approved',
  REJECTED: 'rejected',
  LOW_RISK: 'low_risk',
  MEDIUM_RISK: 'medium_risk',
  HIGH_RISK: 'high_risk',
  CRITICAL: 'critical',

  // Stock & Inventory
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
};

export const STATUS_CONFIG = {
  [STATUS_TYPES.DRAFT]: { label: 'Draft', badgeVariant: 'neutral', dotColor: 'bg-slate-400' },
  [STATUS_TYPES.PENDING]: { label: 'Pending Approval', badgeVariant: 'warning', dotColor: 'bg-amber-400' },
  [STATUS_TYPES.IN_PROGRESS]: { label: 'In Progress', badgeVariant: 'info', dotColor: 'bg-blue-500' },
  [STATUS_TYPES.COMPLETED]: { label: 'Completed', badgeVariant: 'success', dotColor: 'bg-emerald-500' },
  [STATUS_TYPES.DELAYED]: { label: 'Delayed', badgeVariant: 'danger', dotColor: 'bg-red-500' },
  [STATUS_TYPES.ON_HOLD]: { label: 'On Hold', badgeVariant: 'warning', dotColor: 'bg-amber-500' },
  [STATUS_TYPES.CANCELLED]: { label: 'Cancelled', badgeVariant: 'neutral', dotColor: 'bg-slate-500' },

  [STATUS_TYPES.APPROVED]: { label: 'Approved', badgeVariant: 'success', dotColor: 'bg-emerald-500' },
  [STATUS_TYPES.REJECTED]: { label: 'Rejected', badgeVariant: 'danger', dotColor: 'bg-red-500' },

  [STATUS_TYPES.LOW_RISK]: { label: 'Low Risk', badgeVariant: 'success', dotColor: 'bg-emerald-400' },
  [STATUS_TYPES.MEDIUM_RISK]: { label: 'Medium Risk', badgeVariant: 'warning', dotColor: 'bg-amber-500' },
  [STATUS_TYPES.HIGH_RISK]: { label: 'High Risk', badgeVariant: 'danger', dotColor: 'bg-orange-600' },
  [STATUS_TYPES.CRITICAL]: { label: 'Critical Alert', badgeVariant: 'danger', dotColor: 'bg-red-600 animate-pulse' },

  [STATUS_TYPES.IN_STOCK]: { label: 'In Stock', badgeVariant: 'success', dotColor: 'bg-emerald-500' },
  [STATUS_TYPES.LOW_STOCK]: { label: 'Low Stock', badgeVariant: 'warning', dotColor: 'bg-amber-500' },
  [STATUS_TYPES.OUT_OF_STOCK]: { label: 'Out of Stock', badgeVariant: 'danger', dotColor: 'bg-red-500' },
};
