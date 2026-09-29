import React from 'react';
import { useSiteOperations } from '../../hooks/useSiteOperations';
import { SiteActivityTimeline } from '../../components/site/SiteActivityTimeline';
import { Clock } from 'lucide-react';

export const SiteActivityPage = () => {
  const { siteActivities } = useSiteOperations();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Clock className="w-6 h-6 text-amber-400" />
          Chronological Site Activity Timeline
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Real-time chronological log of daily site events: site opening, safety TBT, attendance, material deliveries, task execution, and site closing.
        </p>
      </div>

      <SiteActivityTimeline activities={siteActivities} />
    </div>
  );
};
