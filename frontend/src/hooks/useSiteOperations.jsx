import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_DAILY_REPORTS,
  INITIAL_WORK_PROGRESS,
  INITIAL_SITE_ISSUES,
  INITIAL_SAFETY_INCIDENTS,
  INITIAL_SITE_ACTIVITIES,
  INITIAL_SITE_EVIDENCE,
  INITIAL_TOMORROW_PLANS,
  INITIAL_SITE_ALERTS,
} from '../mock/siteOperationsData';
import { useProjects } from './useProjects';
import { useMaterials } from './useMaterials';
import { useLabour } from './useLabour';
import { useProcurement } from './useProcurement';
import { useToast } from './useToast';

const SiteOperationsContext = createContext({
  dailyReports: [],
  workProgress: [],
  siteIssues: [],
  safetyIncidents: [],
  siteActivities: [],
  siteEvidence: [],
  tomorrowPlans: [],
  siteAlerts: [],
  createDailyReport: () => {},
  updateDailyReport: () => {},
  submitDailyReport: () => {},
  approveDailyReport: () => {},
  updateWorkProgress: () => {},
  createSiteIssue: () => {},
  updateSiteIssue: () => {},
  resolveSiteIssue: () => {},
  createSafetyIncident: () => {},
  updateSafetyIncident: () => {},
  createSiteActivity: () => {},
  addSiteEvidence: () => {},
  createTomorrowPlan: () => {},
  getDailyReportById: () => null,
  getIssueById: () => null,
  getSafetyIncidentById: () => null,
});

export const SiteOperationsProvider = ({ children }) => {
  const [dailyReports, setDailyReports] = useState(INITIAL_DAILY_REPORTS);
  const [workProgress, setWorkProgress] = useState(INITIAL_WORK_PROGRESS);
  const [siteIssues, setSiteIssues] = useState(INITIAL_SITE_ISSUES);
  const [safetyIncidents, setSafetyIncidents] = useState(INITIAL_SAFETY_INCIDENTS);
  const [siteActivities, setSiteActivities] = useState(INITIAL_SITE_ACTIVITIES);
  const [siteEvidence, setSiteEvidence] = useState(INITIAL_SITE_EVIDENCE);
  const [tomorrowPlans, setTomorrowPlans] = useState(INITIAL_TOMORROW_PLANS);
  const [siteAlerts, setSiteAlerts] = useState(INITIAL_SITE_ALERTS);

  const { projects, tasks } = useProjects();
  const { consumption, inventory } = useMaterials();
  const { workers, attendance } = useLabour();
  const { deliveries, purchaseRequests } = useProcurement();
  const { addToast } = useToast();

  // Helper getters
  const getDailyReportById = (id) => {
    return dailyReports.find((r) => r.id === id || r.reportNumber === id) || null;
  };

  const getIssueById = (id) => {
    return siteIssues.find((i) => i.id === id || i.issueCode === id) || null;
  };

  const getSafetyIncidentById = (id) => {
    return safetyIncidents.find((s) => s.id === id || s.incidentCode === id) || null;
  };

  // Actions

  // 1. Daily Reports
  const createDailyReport = (reportData) => {
    const nextNum = dailyReports.length + 1;
    const dateStr = reportData.date || new Date().toISOString().split('T')[0];
    const reportNum = `DSR-${dateStr.replace(/-/g, '')}`;

    const newReport = {
      id: `DSR-${Date.now()}`,
      reportNumber: reportNum,
      projectId: reportData.projectId || 'PRJ-001',
      projectName: reportData.projectName || 'Sunrise Heights',
      date: dateStr,
      supervisorId: reportData.supervisorId || 'David Miller',
      supervisorName: reportData.supervisorName || 'David Miller',
      weather: reportData.weather || 'Partly Cloudy',
      siteStatus: reportData.siteStatus || 'Operational',
      workforcePresent: parseInt(reportData.workforcePresent) || 103,
      workforceRequired: parseInt(reportData.workforceRequired) || 118,
      majorActivities: reportData.majorActivities || 'Daily construction activities execution.',
      completedWork: reportData.completedWork || '',
      materialConsumption: reportData.materialConsumption || [],
      equipmentUsed: reportData.equipmentUsed || '',
      openIssues: siteIssues.filter((i) => i.status !== 'Closed' && i.status !== 'Resolved').length,
      safetySummary: reportData.safetySummary || 'Daily TBT conducted; zero major accidents.',
      overallProgress: parseInt(reportData.overallProgress) || 68,
      remarks: reportData.remarks || '',
      tomorrowPlan: reportData.tomorrowPlan || '',
      status: 'Submitted',
    };

    setDailyReports((prev) => [newReport, ...prev]);

    // Create activity log
    createSiteActivity({
      projectId: newReport.projectId,
      type: 'Task Completed',
      title: `Daily Site Report ${reportNum} Submitted`,
      description: `Report filed by ${newReport.supervisorName} for ${dateStr}.`,
      actor: newReport.supervisorName,
    });

    if (addToast) addToast({ type: 'success', title: 'Daily Report Submitted', message: `${reportNum} filed successfully.` });
    return { success: true, report: newReport };
  };

  const updateDailyReport = (reportId, data) => {
    setDailyReports((prev) =>
      prev.map((r) => (r.id === reportId || r.reportNumber === reportId ? { ...r, ...data } : r))
    );
  };

  const submitDailyReport = (reportId) => {
    updateDailyReport(reportId, { status: 'Submitted' });
    if (addToast) addToast({ type: 'info', title: 'Report Submitted', message: `Report submitted for PM review.` });
  };

  const approveDailyReport = (reportId) => {
    updateDailyReport(reportId, { status: 'Approved' });
    if (addToast) addToast({ type: 'success', title: 'Report Approved', message: `Daily report approved by PM.` });
  };

  // 2. Work Progress
  const updateWorkProgress = (progressData) => {
    const planned = parseFloat(progressData.plannedQuantity) || 0;
    const completed = parseFloat(progressData.completedQuantity) || 0;
    const pct = planned > 0 ? Math.min(100, Math.round((completed / planned) * 100)) : 0;

    const existingIdx = workProgress.findIndex((wp) => wp.taskId === progressData.taskId && wp.date === progressData.date);

    let status = progressData.status || 'In Progress';
    if (pct === 100) status = 'Completed';

    if (existingIdx >= 0) {
      setWorkProgress((prev) =>
        prev.map((wp, idx) =>
          idx === existingIdx
            ? {
                ...wp,
                completedQuantity: completed,
                progressPercentage: pct,
                status,
                remarks: progressData.remarks || wp.remarks,
              }
            : wp
        )
      );
    } else {
      const newProgress = {
        id: `WPR-${Date.now()}`,
        projectId: progressData.projectId || 'PRJ-001',
        projectName: progressData.projectName || 'Sunrise Heights',
        blockId: progressData.blockId || '',
        blockName: progressData.blockName || 'Block A',
        levelId: progressData.levelId || '',
        levelName: progressData.levelName || 'Level 1',
        taskId: progressData.taskId || `TSK-${Date.now()}`,
        taskName: progressData.taskName || 'Site Task',
        date: progressData.date || new Date().toISOString().split('T')[0],
        plannedQuantity: planned,
        completedQuantity: completed,
        unit: progressData.unit || 'sq.ft.',
        progressPercentage: pct,
        status,
        supervisorId: progressData.supervisorId || 'David Miller',
        remarks: progressData.remarks || '',
      };
      setWorkProgress((prev) => [newProgress, ...prev]);
    }

    if (addToast) addToast({ type: 'success', title: 'Progress Logged', message: `Task progress updated to ${pct}%.` });
    return { success: true };
  };

  // 3. Site Issues
  const createSiteIssue = (issueData) => {
    if (!issueData.title || !issueData.description) {
      return { success: false, error: 'Title and description are required.' };
    }

    const nextNum = 100 + siteIssues.length + 1;
    const newIssue = {
      id: `ISS-${nextNum}`,
      issueCode: `ISS-2026-${nextNum}`,
      projectId: issueData.projectId || 'PRJ-001',
      projectName: issueData.projectName || 'Sunrise Heights',
      blockId: issueData.blockId || '',
      blockName: issueData.blockName || 'Block A',
      levelId: issueData.levelId || '',
      levelName: issueData.levelName || '',
      taskId: issueData.taskId || '',
      taskName: issueData.taskName || '',
      type: issueData.type || 'Other',
      title: issueData.title,
      description: issueData.description,
      priority: issueData.priority || 'Medium',
      status: 'Open',
      reportedBy: issueData.reportedBy || 'Site Supervisor',
      assignedTo: issueData.assignedTo || 'Unassigned',
      reportedDate: new Date().toISOString().split('T')[0],
      dueDate: issueData.dueDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      resolvedDate: '',
      impact: issueData.impact || 'Schedule',
      resolution: '',
      remarks: issueData.remarks || '',
    };

    setSiteIssues((prev) => [newIssue, ...prev]);

    // Log Activity
    createSiteActivity({
      projectId: newIssue.projectId,
      type: 'Issue Reported',
      title: `New Site Issue Logged: ${newIssue.title}`,
      description: `[${newIssue.type}] Priority: ${newIssue.priority}. ${newIssue.description}`,
      actor: newIssue.reportedBy,
    });

    if (addToast) addToast({ type: 'warning', title: 'Issue Reported', message: `${newIssue.issueCode} created.` });
    return { success: true, issue: newIssue };
  };

  const updateSiteIssue = (issueId, data) => {
    setSiteIssues((prev) =>
      prev.map((i) => (i.id === issueId || i.issueCode === issueId ? { ...i, ...data } : i))
    );
  };

  const resolveSiteIssue = (issueId, resolutionData) => {
    const resText = typeof resolutionData === 'string' ? resolutionData : resolutionData.resolution;
    setSiteIssues((prev) =>
      prev.map((i) =>
        i.id === issueId || i.issueCode === issueId
          ? {
              ...i,
              status: 'Resolved',
              resolution: resText,
              resolvedDate: new Date().toISOString().split('T')[0],
            }
          : i
      )
    );

    if (addToast) addToast({ type: 'success', title: 'Issue Resolved', message: `Site issue marked as resolved.` });
  };

  // 4. Safety Incidents
  const createSafetyIncident = (incidentData) => {
    if (!incidentData.type || !incidentData.description) {
      return { success: false, error: 'Type and description are required.' };
    }

    const nextNum = 100 + safetyIncidents.length + 1;
    const newIncident = {
      id: `SAF-${nextNum}`,
      incidentCode: `SAF-2026-${nextNum}`,
      projectId: incidentData.projectId || 'PRJ-001',
      projectName: incidentData.projectName || 'Sunrise Heights',
      blockId: incidentData.blockId || '',
      blockName: incidentData.blockName || 'Block A',
      levelId: incidentData.levelId || '',
      levelName: incidentData.levelName || '',
      date: incidentData.date || new Date().toISOString().split('T')[0],
      time: incidentData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: incidentData.type || 'Unsafe Condition',
      severity: incidentData.severity || 'Medium',
      description: incidentData.description,
      reportedBy: incidentData.reportedBy || 'Safety Inspector',
      affectedWorkers: incidentData.affectedWorkers || 'None',
      immediateAction: incidentData.immediateAction || '',
      correctiveAction: incidentData.correctiveAction || '',
      status: 'Open',
      closedDate: '',
    };

    setSafetyIncidents((prev) => [newIncident, ...prev]);

    // Log Activity
    createSiteActivity({
      projectId: newIncident.projectId,
      type: 'Inspection',
      title: `Safety Incident Logged: ${newIncident.type}`,
      description: `Severity: ${newIncident.severity}. ${newIncident.description}`,
      actor: newIncident.reportedBy,
    });

    if (addToast) addToast({ type: 'warning', title: 'Safety Incident Logged', message: `${newIncident.incidentCode} filed.` });
    return { success: true, incident: newIncident };
  };

  const updateSafetyIncident = (incidentId, data) => {
    setSafetyIncidents((prev) =>
      prev.map((s) => (s.id === incidentId || s.incidentCode === incidentId ? { ...s, ...data } : s))
    );
  };

  // 5. Site Activities
  const createSiteActivity = (activityData) => {
    const newActivity = {
      id: `ACT-${Date.now()}`,
      projectId: activityData.projectId || 'PRJ-001',
      timestamp: activityData.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: activityData.type || 'Other',
      title: activityData.title || 'Site Event',
      description: activityData.description || '',
      actor: activityData.actor || 'Site Supervisor',
      relatedEntityType: activityData.relatedEntityType || '',
      relatedEntityId: activityData.relatedEntityId || '',
    };

    setSiteActivities((prev) => [newActivity, ...prev]);
  };

  // 6. Site Evidence Gallery
  const addSiteEvidence = (evidenceData) => {
    const newEvidence = {
      id: `EVI-${Date.now()}`,
      projectId: evidenceData.projectId || 'PRJ-001',
      projectName: evidenceData.projectName || 'Sunrise Heights',
      blockId: evidenceData.blockId || '',
      blockName: evidenceData.blockName || 'Block A',
      levelId: evidenceData.levelId || '',
      levelName: evidenceData.levelName || 'Level 1',
      taskId: evidenceData.taskId || '',
      taskName: evidenceData.taskName || '',
      type: evidenceData.type || 'Progress',
      title: evidenceData.title || 'Site Progress Photo',
      description: evidenceData.description || '',
      imageUrl: evidenceData.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=800&q=80',
      capturedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      capturedBy: evidenceData.capturedBy || 'Site Inspector',
      tags: evidenceData.tags || ['Progress', 'Site Photo'],
    };

    setSiteEvidence((prev) => [newEvidence, ...prev]);
    if (addToast) addToast({ type: 'success', title: 'Evidence Added', message: `Site photo saved to gallery.` });
    return { success: true, evidence: newEvidence };
  };

  // 7. Tomorrow Plan
  const createTomorrowPlan = (planData) => {
    const newPlan = {
      id: `TMP-${Date.now()}`,
      projectId: planData.projectId || 'PRJ-001',
      projectName: planData.projectName || 'Sunrise Heights',
      blockId: planData.blockId || '',
      blockName: planData.blockName || 'Block A',
      levelId: planData.levelId || '',
      levelName: planData.levelName || '',
      taskId: planData.taskId || '',
      taskName: planData.taskName || 'Planned Task',
      date: planData.date || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      requiredWorkforce: parseInt(planData.requiredWorkforce) || 25,
      availableWorkforce: parseInt(planData.availableWorkforce) || 25,
      labourReadiness: planData.labourReadiness || '100%',
      requiredMaterial: planData.requiredMaterial || 'Cement 200 bags',
      expectedMaterial: planData.expectedMaterial || 'In Stock',
      materialReadiness: planData.materialReadiness || '100%',
      openDependency: planData.openDependency || 'None',
      overallReadiness: planData.overallReadiness || 'Ready',
      supervisor: planData.supervisor || 'David Miller',
    };

    setTomorrowPlans((prev) => [newPlan, ...prev]);
    if (addToast) addToast({ type: 'success', title: 'Tomorrow Plan Saved', message: `Work plan for tomorrow created.` });
    return { success: true, plan: newPlan };
  };

  return (
    <SiteOperationsContext.Provider
      value={{
        dailyReports,
        workProgress,
        siteIssues,
        safetyIncidents,
        siteActivities,
        siteEvidence,
        tomorrowPlans,
        siteAlerts,
        createDailyReport,
        updateDailyReport,
        submitDailyReport,
        approveDailyReport,
        updateWorkProgress,
        createSiteIssue,
        updateSiteIssue,
        resolveSiteIssue,
        createSafetyIncident,
        updateSafetyIncident,
        createSiteActivity,
        addSiteEvidence,
        createTomorrowPlan,
        getDailyReportById,
        getIssueById,
        getSafetyIncidentById,
      }}
    >
      {children}
    </SiteOperationsContext.Provider>
  );
};

export const useSiteOperations = () => useContext(SiteOperationsContext);
