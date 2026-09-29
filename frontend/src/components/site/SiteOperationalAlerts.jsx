import React from 'react';
import { AlertCard } from '../ui/AlertCard';
import { useNavigate } from 'react-router-dom';

export const SiteOperationalAlerts = ({ alerts = [], onAction }) => {
  const navigate = useNavigate();

  if (!alerts || alerts.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs">
        No active site operational alerts.
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
      case 'INFO':
        return 'success';
      default:
        return 'warning';
    }
  };

  const handleAlertAction = (alert) => {
    if (onAction) {
      onAction(alert);
      return;
    }
    if (alert.actionRoute) {
      navigate(alert.actionRoute);
    } else {
      navigate('/site');
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
            actionLabel={alert.actionLabel || 'Inspect Issue'}
            onAction={() => handleAlertAction(alert)}
          />
        );
      })}
    </div>
  );
};
