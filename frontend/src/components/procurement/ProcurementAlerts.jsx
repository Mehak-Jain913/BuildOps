import React from 'react';
import { AlertCard } from '../ui/AlertCard';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProcurementAlerts = ({ alerts = [], onAlertAction }) => {
  const navigate = useNavigate();

  if (!alerts || alerts.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs">
        No active procurement alerts. Operations running smoothly.
      </div>
    );
  }

  const mapSeverityToType = (severity) => {
    switch (severity) {
      case 'HIGH':
        return 'danger';
      case 'MEDIUM':
        return 'warning';
      case 'ATTENTION':
        return 'info';
      case 'UPCOMING':
        return 'success';
      default:
        return 'warning';
    }
  };

  const handleAction = (alert) => {
    if (onAlertAction) {
      onAlertAction(alert);
      return;
    }
    if (alert.poNumber) {
      navigate('/procurement/orders');
    } else if (alert.title.includes('request') || alert.title.includes('PR')) {
      navigate('/procurement/requests');
    } else if (alert.title.includes('delivery') || alert.title.includes('overdue')) {
      navigate('/procurement/deliveries');
    } else if (alert.title.includes('reliability') || alert.title.includes('Supplier')) {
      navigate('/suppliers');
    } else {
      navigate('/procurement');
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const type = mapSeverityToType(alert.severity);

        return (
          <AlertCard
            key={alert.id}
            type={type}
            title={alert.title}
            description={alert.description}
            actionLabel={alert.action || 'Take Action'}
            onAction={() => handleAction(alert)}
          />
        );
      })}
    </div>
  );
};
