import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MOCK_NOTIFICATIONS } from '../../mock/mockData';
import { Bell, Check, Trash2, Filter } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const NotificationsPage = () => {
  const { addToast } = useToast();

  const handleMarkAllRead = () => {
    addToast({
      title: 'Notifications Updated',
      message: 'All notifications marked as read.',
      type: 'success',
    });
  };

  return (
    <div>
      <PageHeader
        title="Notifications Center"
        subtitle="Operational alerts, approval requests, material dispatch updates, and hazard warnings."
        action={
          <Button variant="outline" size="sm" leftIcon={Check} onClick={handleMarkAllRead}>
            Mark All as Read
          </Button>
        }
      />

      <Card header="Recent System Notifications" subtitle="List of real-time site updates">
        <div className="divide-y divide-slate-100">
          {MOCK_NOTIFICATIONS.map((n) => (
            <div key={n.id} className="py-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 ${n.type === 'success' ? 'bg-emerald-50 text-emerald-600' : n.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-slate-900">{n.title}</h5>
                    {!n.read && <Badge variant="amber" size="sm">New</Badge>}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                  <span className="text-[11px] text-slate-400 mt-1 block">{n.time}</span>
                </div>
              </div>

              <Button variant="ghost" size="sm" iconOnly title="Archive">
                <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
