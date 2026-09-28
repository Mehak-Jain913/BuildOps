import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_PROJECTS,
  INITIAL_BLOCKS,
  INITIAL_LEVELS,
  INITIAL_PHASES,
  INITIAL_MILESTONES,
  INITIAL_TASKS,
  INITIAL_ACTIVITIES,
} from '../mock/projectData';

const ProjectContext = createContext({
  projects: [],
  blocks: [],
  levels: [],
  phases: [],
  milestones: [],
  tasks: [],
  activities: [],
  selectedProjectId: 'PRJ-001',
  setSelectedProjectId: () => {},
  getProjectById: () => null,
  getBlocksByProjectId: () => [],
  getLevelsByBlockId: () => [],
  getPhasesByProjectId: () => [],
  getMilestonesByProjectId: () => [],
  getTasksByProjectId: () => [],
  getActivitiesByProjectId: () => [],
  addProject: () => {},
  updateProject: () => {},
  addTask: () => {},
  updateTask: () => {},
});

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [levels, setLevels] = useState(INITIAL_LEVELS);
  const [phases, setPhases] = useState(INITIAL_PHASES);
  const [milestones, setMilestones] = useState(INITIAL_MILESTONES);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [selectedProjectId, setSelectedProjectId] = useState('PRJ-001');

  const getProjectById = (id) => {
    return projects.find((p) => p.id === id || p.code === id) || projects[0] || null;
  };

  const getBlocksByProjectId = (projectId) => {
    return blocks.filter((b) => b.projectId === projectId);
  };

  const getLevelsByBlockId = (blockId) => {
    return levels.filter((l) => l.blockId === blockId).sort((a, b) => a.order - b.order);
  };

  const getPhasesByProjectId = (projectId) => {
    const prjPhases = phases.filter((p) => p.projectId === projectId);
    if (prjPhases.length > 0) return prjPhases;
    // Fallback default phases if newly created project
    return [
      { id: `PHS-1-${projectId}`, projectId, name: 'Foundation & Substructure', plannedProgress: 80, actualProgress: 80, variance: 0, status: 'Completed' },
      { id: `PHS-2-${projectId}`, projectId, name: 'Superstructure Framing', plannedProgress: 50, actualProgress: 45, variance: -5, status: 'In Progress' },
      { id: `PHS-3-${projectId}`, projectId, name: 'Brickwork & Masonry', plannedProgress: 30, actualProgress: 25, variance: -5, status: 'In Progress' },
      { id: `PHS-4-${projectId}`, projectId, name: 'Electrical & Plumbing', plannedProgress: 15, actualProgress: 10, variance: -5, status: 'Scheduled' },
    ];
  };

  const getMilestonesByProjectId = (projectId) => {
    const prjMilestones = milestones.filter((m) => m.projectId === projectId);
    if (prjMilestones.length > 0) return prjMilestones;
    return [
      { id: `MLS-1-${projectId}`, projectId, name: 'Site Kickoff', status: 'Completed', date: '01 Apr 2026', description: 'Project mobilized and site layout prepared.' },
      { id: `MLS-2-${projectId}`, projectId, name: 'Foundation Complete', status: 'In Progress', targetDate: '15 Oct 2026', description: 'Substructure excavation and concrete slab.' },
      { id: `MLS-3-${projectId}`, projectId, name: 'Roof Topoff', status: 'Upcoming', targetDate: '20 Jan 2027', description: 'Final structural level concrete casting.' },
    ];
  };

  const getTasksByProjectId = (projectId) => {
    return tasks.filter((t) => t.projectId === projectId);
  };

  const getActivitiesByProjectId = (projectId) => {
    const prjActivities = activities.filter((a) => a.projectId === projectId);
    if (prjActivities.length > 0) return prjActivities;
    return [
      { id: `ACT-DEF-1`, projectId, timestamp: 'Today — 09:00 AM', actor: 'System', action: 'Project context initialized.', type: 'info' },
    ];
  };

  const addProject = (projectData) => {
    const nextNum = projects.length + 1;
    const newId = `PRJ-00${nextNum}`;
    const newCode = projectData.code || `PRJ-${String(nextNum).padStart(3, '0')}`;
    
    const newProject = {
      id: newId,
      code: newCode,
      name: projectData.name,
      client: projectData.client || 'Client N/A',
      location: projectData.location,
      type: projectData.type || 'Residential',
      manager: projectData.manager || 'Sarah Jenkins',
      startDate: projectData.startDate,
      targetDate: projectData.expectedCompletion || projectData.targetDate,
      budget: parseFloat(projectData.budget) || 0,
      spent: 0,
      progress: 0,
      healthScore: 95,
      status: projectData.status || 'Planning',
      description: projectData.description || 'Newly initialized construction project.',
      workersOnSite: 0,
      daysRemaining: 180,
      activeIssues: 0,
      upcomingMilestones: 3,
    };

    setProjects((prev) => [newProject, ...prev]);

    // Create default Site Structure (Block A & Block B)
    const newBlockA = { id: `BLK-${newId}-A`, projectId: newId, name: 'Block A', type: 'Main Structure' };
    const newBlockB = { id: `BLK-${newId}-B`, projectId: newId, name: 'Block B', type: 'Auxiliary Building' };
    setBlocks((prev) => [...prev, newBlockA, newBlockB]);

    setLevels((prev) => [
      ...prev,
      { id: `LVL-${newId}-A1`, blockId: newBlockA.id, name: 'Ground Floor', order: 1, usage: 'Entry & Reception' },
      { id: `LVL-${newId}-A2`, blockId: newBlockA.id, name: 'Level 1', order: 2, usage: 'Main Floor' },
      { id: `LVL-${newId}-B1`, blockId: newBlockB.id, name: 'Ground Floor', order: 1, usage: 'Storage & Utility' },
    ]);

    // Add activity log entry
    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        projectId: newId,
        timestamp: 'Just now',
        actor: projectData.manager || 'Admin',
        action: `created new project "${projectData.name}".`,
        type: 'project_created',
      },
      ...prev,
    ]);

    return newProject;
  };

  const updateProject = (projectId, updatedFields) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId || p.code === projectId) {
          return { ...p, ...updatedFields };
        }
        return p;
      })
    );

    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        projectId: projectId,
        timestamp: 'Just now',
        actor: 'Project Manager',
        action: `updated project metadata.`,
        type: 'project_updated',
      },
      ...prev,
    ]);
  };

  const addTask = (taskData) => {
    const newTask = {
      id: `TSK-${Date.now()}`,
      projectId: taskData.projectId || selectedProjectId,
      blockId: taskData.blockId || '',
      levelId: taskData.levelId || '',
      phaseId: taskData.phaseId || '',
      name: taskData.name,
      location: taskData.location || `${taskData.blockName || 'Site'} • ${taskData.levelName || 'General'}`,
      blockName: taskData.blockName || 'General Block',
      levelName: taskData.levelName || 'General Level',
      phaseName: taskData.phaseName || 'Construction',
      supervisor: taskData.supervisor || 'David Miller',
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'Not Started',
      progress: taskData.status === 'Completed' ? 100 : taskData.progress || 0,
      startDate: taskData.startDate || new Date().toISOString().split('T')[0],
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      description: taskData.description || '',
    };

    setTasks((prev) => [newTask, ...prev]);

    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        projectId: newTask.projectId,
        timestamp: 'Just now',
        actor: newTask.supervisor,
        action: `created task "${newTask.name}".`,
        type: 'task_created',
      },
      ...prev,
    ]);

    return newTask;
  };

  const updateTask = (taskId, updatedFields) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return { ...t, ...updatedFields };
        }
        return t;
      })
    );
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        blocks,
        levels,
        phases,
        milestones,
        tasks,
        activities,
        selectedProjectId,
        setSelectedProjectId,
        getProjectById,
        getBlocksByProjectId,
        getLevelsByBlockId,
        getPhasesByProjectId,
        getMilestonesByProjectId,
        getTasksByProjectId,
        getActivitiesByProjectId,
        addProject,
        updateProject,
        addTask,
        updateTask,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);
