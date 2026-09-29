import React from 'react';
import { Badge } from '../ui/Badge';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  PackageCheck,
  Truck,
  FileText,
  ShieldCheck,
  Send,
  Warehouse
} from 'lucide-react';

export const ProcurementStatusBadge = ({ status, type = 'general', size = 'sm' }) => {
  if (!status) return null;

  const getVariantAndIcon = () => {
    switch (status) {
      // Purchase Request & PO Statuses
      case 'Draft':
        return { variant: 'slate', icon: FileText, label: 'Draft' };
      case 'Pending Approval':
      case 'Under Inspection':
        return { variant: 'amber', icon: Clock, label: status };
      case 'Approved':
      case 'Accepted':
        return { variant: 'emerald', icon: CheckCircle2, label: status };
      case 'Rejected':
      case 'Cancelled':
        return { variant: 'rose', icon: XCircle, label: status };
      case 'Converted to PO':
        return { variant: 'indigo', icon: PackageCheck, label: 'Converted to PO' };
      case 'Sent to Supplier':
        return { variant: 'blue', icon: Send, label: 'Sent to Supplier' };
      case 'Partially Delivered':
      case 'Partially Accepted':
        return { variant: 'purple', icon: Truck, label: status };
      case 'Delivered':
      case 'Closed':
        return { variant: 'emerald', icon: CheckCircle2, label: status };

      // Delivery Statuses
      case 'Scheduled':
        return { variant: 'slate', icon: Clock, label: 'Scheduled' };
      case 'Dispatched':
      case 'In Transit':
        return { variant: 'blue', icon: Truck, label: status };
      case 'Delayed':
        return { variant: 'rose', icon: AlertTriangle, label: status };

      // GRN Statuses
      case 'Posted':
        return { variant: 'emerald', icon: Warehouse, label: 'Posted to Stock' };

      // Supplier Statuses
      case 'Active':
      case 'Preferred':
        return { variant: 'emerald', icon: ShieldCheck, label: status };
      case 'Under Review':
        return { variant: 'amber', icon: Clock, label: status };
      case 'Suspended':
      case 'Inactive':
        return { variant: 'rose', icon: XCircle, label: status };

      default:
        return { variant: 'slate', icon: Clock, label: status };
    }
  };

  const { variant, icon: Icon, label } = getVariantAndIcon();

  return (
    <Badge variant={variant} size={size} className="gap-1 inline-flex items-center font-medium">
      <Icon className="w-3 h-3 shrink-0" />
      <span>{label}</span>
    </Badge>
  );
};
