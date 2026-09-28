import React, { useState } from 'react';
import { WorkerTable } from '../../components/labour/WorkerTable';
import { AddWorkerModal } from '../../components/labour/AddWorkerModal';
import { useLabour } from '../../hooks/useLabour';
import { useProjects } from '../../hooks/useProjects';

export const WorkersPage = () => {
  const { workers, contractors } = useLabour();
  const { projects } = useProjects();
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);

  return (
    <div className="space-y-6">
      <WorkerTable
        workers={workers}
        contractors={contractors}
        projects={projects}
        onAddWorker={() => setIsAddWorkerOpen(true)}
        title="Comprehensive Worker Directory"
        subtitle="Filter by trade skill, contractor mapping, project site, and active employment status."
      />

      <AddWorkerModal isOpen={isAddWorkerOpen} onClose={() => setIsAddWorkerOpen(false)} />
    </div>
  );
};
