import React, { useState } from 'react';
import { AttendanceTable } from '../../components/labour/AttendanceTable';
import { MarkAttendanceModal } from '../../components/labour/MarkAttendanceModal';
import { useLabour } from '../../hooks/useLabour';
import { useProjects } from '../../hooks/useProjects';

export const AttendancePage = () => {
  const { attendance } = useLabour();
  const { projects } = useProjects();
  const [isMarkOpen, setIsMarkOpen] = useState(false);

  return (
    <div className="space-y-6">
      <AttendanceTable
        attendance={attendance}
        projects={projects}
        onMarkAttendance={() => setIsMarkOpen(true)}
        title="Daily Attendance & Working Hours"
        subtitle="Log worker check-in times, check-out times, working hours, and overtime duty logs."
      />

      <MarkAttendanceModal isOpen={isMarkOpen} onClose={() => setIsMarkOpen(false)} />
    </div>
  );
};
