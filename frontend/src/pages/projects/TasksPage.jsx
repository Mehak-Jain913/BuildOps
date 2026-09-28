import React, { useState } from 'react';
import { TaskTable } from '../../components/projects/TaskTable';
import { CreateTaskModal } from '../../components/projects/CreateTaskModal';
import { useProjects } from '../../hooks/useProjects';
import { useRole } from '../../hooks/useRole';
import { ROLES } from '../../constants/roles';

export const TasksPage = () => {
  const { tasks } = useProjects();
  const { role } = useRole();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const canCreateTask = role === ROLES.ADMIN || role === ROLES.SUPERVISOR;

  return (
    <div className="space-y-6">
      <TaskTable
        tasks={tasks}
        onCreateTask={() => setIsCreateModalOpen(true)}
        canCreateTask={canCreateTask}
        title="Site Task Execution Matrix"
        subtitle="Manage daily site assignments, trade deliverables, priority levels, and supervisor progress across all active projects."
      />

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
