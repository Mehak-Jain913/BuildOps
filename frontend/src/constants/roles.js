export const ROLES = {
  ADMIN: 'ADMIN',
  SUPERVISOR: 'SUPERVISOR',
  SUPPLIER: 'SUPPLIER',
  WORKER: 'WORKER',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Project Manager / Admin',
  [ROLES.SUPERVISOR]: 'Site Supervisor',
  [ROLES.SUPPLIER]: 'Material Supplier',
  [ROLES.WORKER]: 'Site Worker',
};

export const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: 'Full system access, financial approvals, analytics & intelligence',
  [ROLES.SUPERVISOR]: 'Daily site logs, labour attendance, safety issues, material requisitions',
  [ROLES.SUPPLIER]: 'Purchase orders, delivery status, Goods Received Notes (GRN)',
  [ROLES.WORKER]: 'Shift schedules, personal attendance, task checklists',
};
