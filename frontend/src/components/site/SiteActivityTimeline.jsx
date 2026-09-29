import React, { useState, useMemo } from 'react';
import { Badge } from '../ui/Badge';
import { SearchInput } from '../forms/SearchInput';
import { Select } from '../forms/Select';
import { ACTIVITY_TYPES } from '../../mock/siteOperationsData';
import {
  Clock,
  HardHat,
  ShieldCheck,
  Users,
  Truck,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Lock,
  Calendar
} from 'lucide-react';

export const SiteActivityTimeline = ({ activities = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchSearch =
        act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.actor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = typeFilter === 'ALL' || act.type === typeFilter;

      return matchSearch && matchType;
    });
  }, [activities, searchTerm, typeFilter]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'Site Opening':
      case 'Site Closing':
        return <Lock className="w-4 h-4 text-slate-400" />;
      case 'Safety Briefing':
      case 'Inspection':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'Attendance':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'Material Delivery':
      case 'Material Issue':
        return <Truck className="w-4 h-4 text-amber-400" />;
      case 'Task Started':
      case 'Task Completed':
        return <PlayCircle className="w-4 h-4 text-emerald-400" />;
      case 'Issue Reported':
      case 'Issue Resolved':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      default:
        return <Clock className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search chronological activity logs..."
          />
        </div>
        <div className="w-48">
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Activity Types' },
              ...ACTIVITY_TYPES.map((t) => ({ value: t, label: t })),
            ]}
          />
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 border-l border-slate-800 space-y-6 my-2">
        {filteredActivities.map((act) => (
          <div key={act.id} className="relative group">
            {/* Timeline Icon Node */}
            <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-md">
              {getActivityIcon(act.type)}
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="blue" size="xs">{act.type}</Badge>
                  <span className="text-xs font-bold text-white">{act.title}</span>
                </div>
                <span className="font-mono text-[11px] text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {act.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-300">{act.description}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                <span>Actor: <strong className="text-slate-200">{act.actor}</strong></span>
                {act.relatedEntityType && (
                  <span className="font-mono text-[10px] text-slate-400">
                    Ref: {act.relatedEntityType} #{act.relatedEntityId}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
