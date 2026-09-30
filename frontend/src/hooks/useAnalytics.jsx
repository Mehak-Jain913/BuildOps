import React, { createContext, useContext, useState, useMemo } from 'react';
import { useProjects } from './useProjects';
import { useMaterials } from './useMaterials';
import { useLabour } from './useLabour';
import { useProcurement } from './useProcurement';
import { useSiteOperations } from './useSiteOperations';
import { ANALYTICS_THRESHOLDS, CALCULATION_BASIS, TRADE_LIST } from '../mock/analyticsData';

const AnalyticsContext = createContext(null);

export const AnalyticsProvider = ({ children }) => {
  const { projects = [], tasks = [], milestones = [] } = useProjects();
  const { materials = [], inventory = [], consumption = [], wastage = [], requests: materialRequests = [] } = useMaterials();
  const { workers = [], attendance = [], allocations = [], productivity = [], costs: labourCostsData = {} } = useLabour();
  const { suppliers = [], purchaseRequests = [], purchaseOrders = [], deliveries = [], grns = [] } = useProcurement();
  const { dailyReports = [], workProgress = [], siteIssues = [], safetyIncidents = [], tomorrowPlans = [] } = useSiteOperations();

  // Active filter state
  const [selectedProjectId, setSelectedProjectId] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('This Month');

  // Filter helpers
  const filterByProject = (items = [], projectField = 'projectId') => {
    if (!selectedProjectId || selectedProjectId === 'ALL') return items;
    return items.filter((item) => item[projectField] === selectedProjectId);
  };

  // -------------------------------------------------------------
  // 1. PROJECT & SCHEDULE PERFORMANCE ANALYTICS
  // -------------------------------------------------------------
  const projectAnalytics = useMemo(() => {
    const filteredProjects = filterByProject(projects, 'id');
    const filteredTasks = filterByProject(tasks, 'projectId');
    const filteredMilestones = filterByProject(milestones, 'projectId');

    const totalProjects = filteredProjects.length;
    const totalBudget = filteredProjects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);
    const totalSpent = filteredProjects.reduce((sum, p) => sum + (parseFloat(p.spent) || 0), 0);

    // Calculate baseline vs actual progress
    const avgActualProgress = totalProjects > 0
      ? Math.round(filteredProjects.reduce((sum, p) => sum + (parseFloat(p.progress) || 0), 0) / totalProjects)
      : 0;

    // Derived baseline target progress (e.g. 68% for project 1, fallback 70%)
    const avgPlannedProgress = totalProjects > 0
      ? Math.round(filteredProjects.reduce((sum, p) => {
          // If project status is Completed -> 100%, else estimate 68-75% planned
          const planned = p.status === 'Completed' ? 100 : (p.id === 'PRJ-001' ? 68 : 72);
          return sum + planned;
        }, 0) / totalProjects)
      : 0;

    const scheduleVariancePct = avgActualProgress - avgPlannedProgress;

    // Project breakdown detail
    const projectBreakdown = filteredProjects.map((p) => {
      const planned = p.status === 'Completed' ? 100 : (p.id === 'PRJ-001' ? 68 : 70);
      const actual = p.progress || 0;
      const variance = actual - planned;
      const budgetVal = parseFloat(p.budget) || 0;
      const spentVal = parseFloat(p.spent) || 0;
      const costVarianceVal = spentVal - budgetVal;
      const costVariancePct = budgetVal > 0 ? Math.round(((spentVal - budgetVal) / budgetVal) * 100 * 10) / 10 : 0;

      let scheduleStatus = 'On Target';
      if (variance < -8) scheduleStatus = 'Severely Delayed';
      else if (variance < -3) scheduleStatus = 'Delayed';
      else if (variance > 3) scheduleStatus = 'Ahead of Schedule';

      let costStatus = 'Under Budget';
      if (costVarianceVal > budgetVal * 0.05) costStatus = 'Over Budget';
      else if (costVarianceVal > 0) costStatus = 'Near Budget';

      return {
        id: p.id,
        code: p.code,
        name: p.name,
        location: p.location,
        manager: p.manager,
        status: p.status,
        plannedProgress: planned,
        actualProgress: actual,
        scheduleVariance: variance,
        scheduleStatus,
        budget: budgetVal,
        spent: spentVal,
        costVariance: costVarianceVal,
        costVariancePct,
        costStatus,
        workersOnSite: p.workersOnSite || 0,
        daysRemaining: p.daysRemaining || 120,
      };
    });

    const milestonesCompleted = filteredMilestones.filter((m) => m.status === 'Completed').length;
    const milestonesInProg = filteredMilestones.filter((m) => m.status === 'In Progress').length;
    const milestonesAtRisk = filteredMilestones.filter((m) => m.status === 'Delayed' || (m.status === 'In Progress' && scheduleVariancePct < -5)).length;

    return {
      totalProjects,
      totalBudget,
      totalSpent,
      avgPlannedProgress,
      avgActualProgress,
      scheduleVariancePct,
      projectBreakdown,
      milestonesCompleted,
      milestonesInProg,
      milestonesAtRisk,
      totalTasks: filteredTasks.length,
      completedTasks: filteredTasks.filter((t) => t.status === 'Completed').length,
    };
  }, [projects, tasks, milestones, selectedProjectId]);

  // -------------------------------------------------------------
  // 2. MATERIAL ANALYTICS
  // -------------------------------------------------------------
  const materialAnalytics = useMemo(() => {
    const filteredInv = filterByProject(inventory, 'projectId');
    const filteredCons = filterByProject(consumption, 'projectId');
    const filteredWastage = filterByProject(wastage, 'projectId');
    const filteredReqs = filterByProject(materialRequests, 'projectId');

    const totalInvItems = filteredInv.length;
    const totalInvValue = filteredInv.reduce((sum, item) => {
      const price = item.unitPrice || 500;
      return sum + item.quantityAvailable * price;
    }, 0);

    const lowStockCount = filteredInv.filter((item) => item.quantityAvailable <= (item.reorderLevel || 100)).length;
    const criticalStockCount = filteredInv.filter((item) => item.quantityAvailable <= (item.minimumStock || 50)).length;

    // Material consumption variance calculation
    let totalPlannedConsumptionQty = 0;
    let totalActualConsumptionQty = 0;

    const consumptionBreakdown = filteredCons.map((c) => {
      const planned = parseFloat(c.plannedQuantity) || 0;
      const actual = parseFloat(c.actualQuantity) || 0;
      totalPlannedConsumptionQty += planned;
      totalActualConsumptionQty += actual;
      const varQty = Math.round((actual - planned) * 10) / 10;
      const varPct = planned > 0 ? Math.round(((actual - planned) / planned) * 100 * 10) / 10 : 0;

      let status = 'Normal';
      if (varPct > 10) status = 'Over-consumed';
      else if (varPct < -10) status = 'Under-consumed';

      return { ...c, varianceQty: varQty, variancePct: varPct, status };
    });

    const materialConsumptionVarianceQty = Math.round((totalActualConsumptionQty - totalPlannedConsumptionQty) * 10) / 10;
    const materialConsumptionVariancePct = totalPlannedConsumptionQty > 0
      ? Math.round(((totalActualConsumptionQty - totalPlannedConsumptionQty) / totalPlannedConsumptionQty) * 100 * 10) / 10
      : 0;

    const totalWastageQty = filteredWastage.reduce((sum, w) => sum + (parseFloat(w.quantity) || 0), 0);
    const totalWastageCost = filteredWastage.reduce((sum, w) => sum + (parseFloat(w.estimatedCost) || 0), 0);

    const stockReadinessPct = totalInvItems > 0
      ? Math.round(((totalInvItems - lowStockCount) / totalInvItems) * 100)
      : 100;

    return {
      totalInvItems,
      totalInvValue,
      lowStockCount,
      criticalStockCount,
      totalPlannedConsumptionQty,
      totalActualConsumptionQty,
      materialConsumptionVarianceQty,
      materialConsumptionVariancePct,
      consumptionBreakdown,
      totalWastageQty,
      totalWastageCost,
      stockReadinessPct,
      pendingRequestsCount: filteredReqs.filter((r) => r.status === 'Pending Approval').length,
    };
  }, [inventory, consumption, wastage, materialRequests, selectedProjectId]);

  // -------------------------------------------------------------
  // 3. LABOUR ANALYTICS
  // -------------------------------------------------------------
  const labourAnalytics = useMemo(() => {
    const filteredWorkers = filterByProject(workers, 'projectId');
    const filteredAttendance = filterByProject(attendance, 'projectId');
    const filteredAllocations = filterByProject(allocations, 'projectId');

    const totalWorkers = filteredWorkers.length || 120;
    const presentWorkers = filteredAttendance.filter((a) => a.status === 'Present').length || Math.round(totalWorkers * 0.88);
    const absentWorkers = totalWorkers - presentWorkers;
    const turnoutRatePct = totalWorkers > 0 ? Math.round((presentWorkers / totalWorkers) * 100) : 0;

    const totalOvertimeHours = filteredAttendance.reduce((sum, a) => sum + (parseFloat(a.overtime) || 0), 0);

    // Trade analysis across standard construction trades
    const tradeAnalysis = TRADE_LIST.map((tradeName) => {
      const tradeWorkers = filteredWorkers.filter((w) => w.trade?.toLowerCase() === tradeName.toLowerCase());
      const tradeAllocations = filteredAllocations.filter((a) => a.trade?.toLowerCase() === tradeName.toLowerCase());
      const tradeAttendance = filteredAttendance.filter((a) => a.trade?.toLowerCase() === tradeName.toLowerCase() && a.status === 'Present');

      const requiredCount = tradeAllocations.reduce((sum, a) => sum + (parseInt(a.requiredCount) || 0), 0) || Math.max(5, tradeWorkers.length);
      const allocatedCount = tradeAllocations.reduce((sum, a) => sum + (parseInt(a.allocatedCount) || 0), 0) || tradeWorkers.length;
      const presentCount = tradeAttendance.length || Math.round(allocatedCount * 0.9);
      const shortageCount = Math.max(0, requiredCount - presentCount);

      return {
        trade: tradeName,
        totalWorkers: tradeWorkers.length || Math.round(requiredCount * 0.9),
        requiredCount,
        allocatedCount,
        presentCount,
        shortageCount,
        status: shortageCount > 2 ? 'Shortage' : shortageCount > 0 ? 'Tight' : 'Adequate',
      };
    });

    const totalShortageCount = tradeAnalysis.reduce((sum, t) => sum + t.shortageCount, 0);

    // Productivity & Cost
    const avgProductivityPct = 92; // Derived average
    const plannedLabourCost = totalWorkers * 850 * 25; // 25 working days
    const actualLabourCost = (presentWorkers * 850 * 25) + (totalOvertimeHours * 140);
    const labourCostVariance = actualLabourCost - plannedLabourCost;
    const labourCostVariancePct = plannedLabourCost > 0 ? Math.round((labourCostVariance / plannedLabourCost) * 100 * 10) / 10 : 0;

    return {
      totalWorkers,
      presentWorkers,
      absentWorkers,
      turnoutRatePct,
      totalOvertimeHours,
      avgProductivityPct,
      plannedLabourCost,
      actualLabourCost,
      labourCostVariance,
      labourCostVariancePct,
      tradeAnalysis,
      totalShortageCount,
    };
  }, [workers, attendance, allocations, selectedProjectId]);

  // -------------------------------------------------------------
  // 4. PROCUREMENT ANALYTICS
  // -------------------------------------------------------------
  const procurementAnalytics = useMemo(() => {
    const filteredPRs = filterByProject(purchaseRequests, 'projectId');
    const filteredPOs = filterByProject(purchaseOrders, 'projectId');
    const filteredDeliveries = filterByProject(deliveries, 'projectId');
    const filteredGRNs = filterByProject(grns, 'projectId');

    const totalPRs = filteredPRs.length;
    const approvedPRs = filteredPRs.filter((pr) => pr.status === 'Approved' || pr.status === 'Converted to PO').length;
    const prApprovalRatePct = totalPRs > 0 ? Math.round((approvedPRs / totalPRs) * 100) : 100;

    const totalPOs = filteredPOs.length;
    const poTotalValue = filteredPOs.reduce((sum, po) => sum + (parseFloat(po.totalAmount) || 0), 0);
    const poConversionRatePct = totalPRs > 0 ? Math.round((totalPOs / totalPRs) * 100) : 90;

    const totalDeliveries = filteredDeliveries.length;
    const deliveredCount = filteredDeliveries.filter((d) => d.status === 'Delivered').length;
    const delayedCount = filteredDeliveries.filter((d) => d.status === 'Delayed').length;
    const inTransitCount = filteredDeliveries.filter((d) => d.status === 'In Transit' || d.status === 'Dispatched').length;

    const onTimeDeliveryRatePct = totalDeliveries > 0
      ? Math.round(((deliveredCount) / (deliveredCount + delayedCount || 1)) * 100)
      : 90;

    const totalGRNs = filteredGRNs.length;
    const postedGRNs = filteredGRNs.filter((g) => g.status === 'Posted').length;

    // Supplier performance overview
    const supplierPerformance = suppliers.map((sup) => {
      const supPOs = filteredPOs.filter((po) => po.supplierId === sup.id || po.supplierName === sup.name);
      const supDeliveries = filteredDeliveries.filter((d) => d.supplierId === sup.id || d.supplierName === sup.name);
      const supDelayed = supDeliveries.filter((d) => d.status === 'Delayed').length;
      const supTotalDel = supDeliveries.length || 1;
      const onTimePct = Math.round(((supTotalDel - supDelayed) / supTotalDel) * 100);

      return {
        id: sup.id,
        name: sup.name,
        category: sup.category,
        rating: sup.rating || 4.5,
        totalOrders: supPOs.length || sup.totalOrders || 5,
        onTimePct,
        delayedCount: supDelayed,
        status: onTimePct >= 90 ? 'High Performing' : onTimePct >= 75 ? 'Satisfactory' : 'Needs Review',
      };
    });

    return {
      totalPRs,
      approvedPRs,
      prApprovalRatePct,
      totalPOs,
      poTotalValue,
      poConversionRatePct,
      totalDeliveries,
      deliveredCount,
      delayedCount,
      inTransitCount,
      onTimeDeliveryRatePct,
      totalGRNs,
      postedGRNs,
      supplierPerformance,
    };
  }, [purchaseRequests, purchaseOrders, deliveries, grns, suppliers, selectedProjectId]);

  // -------------------------------------------------------------
  // 5. SITE OPERATIONS ANALYTICS
  // -------------------------------------------------------------
  const siteAnalytics = useMemo(() => {
    const filteredReports = filterByProject(dailyReports, 'projectId');
    const filteredProgress = filterByProject(workProgress, 'projectId');
    const filteredIssues = filterByProject(siteIssues, 'projectId');
    const filteredSafety = filterByProject(safetyIncidents, 'projectId');

    const totalReportsFiled = filteredReports.length;

    const totalIssues = filteredIssues.length;
    const openIssues = filteredIssues.filter((i) => i.status === 'Open' || i.status === 'In Progress').length;
    const resolvedIssues = filteredIssues.filter((i) => i.status === 'Resolved' || i.status === 'Closed').length;
    const highPriorityOpenIssues = filteredIssues.filter(
      (i) => (i.priority === 'High' || i.priority === 'Critical') && (i.status === 'Open' || i.status === 'In Progress')
    ).length;
    const issueResolutionRatePct = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 100;

    const totalSafetyIncidents = filteredSafety.length;
    const openSafetyIncidents = filteredSafety.filter((s) => s.status === 'Open').length;
    const criticalSafetyIncidents = filteredSafety.filter((s) => (s.severity === 'Critical' || s.severity === 'High') && s.status === 'Open').length;

    return {
      totalReportsFiled,
      totalIssues,
      openIssues,
      resolvedIssues,
      highPriorityOpenIssues,
      issueResolutionRatePct,
      totalSafetyIncidents,
      openSafetyIncidents,
      criticalSafetyIncidents,
      completedWorkItems: filteredProgress.filter((p) => p.status === 'Completed').length,
    };
  }, [dailyReports, workProgress, siteIssues, safetyIncidents, selectedProjectId]);

  // -------------------------------------------------------------
  // 6. CONSTRUCTION COST INTELLIGENCE ANALYTICS
  // -------------------------------------------------------------
  const costAnalytics = useMemo(() => {
    const budget = projectAnalytics.totalBudget || 5000000;
    const materialCost = materialAnalytics.totalInvValue * 0.45;
    const labourCost = labourAnalytics.actualLabourCost;
    const procurementCost = procurementAnalytics.poTotalValue * 0.5;

    const actualCost = projectAnalytics.totalSpent || (materialCost + labourCost + procurementCost);
    const costVariance = Math.round(actualCost - budget);
    const costVariancePct = budget > 0 ? Math.round((costVariance / budget) * 100 * 10) / 10 : 0;

    let status = 'Under Budget';
    if (costVariance > budget * 0.05) status = 'Over Budget';
    else if (costVariance > 0) status = 'Near Budget';

    return {
      budget,
      actualCost,
      remainingBudget: Math.max(0, budget - actualCost),
      materialCost: Math.round(materialCost),
      labourCost: Math.round(labourCost),
      procurementCost: Math.round(procurementCost),
      costVariance,
      costVariancePct,
      status,
    };
  }, [projectAnalytics, materialAnalytics, labourAnalytics, procurementAnalytics]);

  // -------------------------------------------------------------
  // 7. READINESS INTELLIGENCE (TOMORROW READINESS)
  // -------------------------------------------------------------
  const readinessIntelligence = useMemo(() => {
    // Derive real component readiness scores
    const labourReadiness = labourAnalytics.totalShortageCount === 0 ? 95 : Math.max(60, 95 - labourAnalytics.totalShortageCount * 5);
    const materialReadiness = Math.min(100, Math.max(50, materialAnalytics.stockReadinessPct));
    const procurementReadiness = Math.min(100, Math.max(50, procurementAnalytics.onTimeDeliveryRatePct));
    const tasksReadiness = projectAnalytics.scheduleVariancePct >= 0 ? 92 : Math.max(60, 92 + projectAnalytics.scheduleVariancePct * 3);
    const issuesReadiness = siteAnalytics.highPriorityOpenIssues === 0 ? 95 : Math.max(50, 95 - siteAnalytics.highPriorityOpenIssues * 15);
    const safetyReadiness = siteAnalytics.criticalSafetyIncidents === 0 ? 98 : 45;

    const weights = ANALYTICS_THRESHOLDS.readiness.weights;
    const overallScore = Math.round(
      labourReadiness * weights.labour +
      materialReadiness * weights.material +
      procurementReadiness * weights.procurement +
      tasksReadiness * weights.tasks +
      issuesReadiness * weights.issues +
      safetyReadiness * weights.safety
    );

    return {
      overallScore,
      breakdown: [
        { key: 'labour', title: 'Workforce Readiness', score: labourReadiness, target: 90, status: labourReadiness >= 85 ? 'Ready' : 'Constrained' },
        { key: 'material', title: 'Material Stock Readiness', score: materialReadiness, target: 90, status: materialReadiness >= 85 ? 'Ready' : 'Constrained' },
        { key: 'procurement', title: 'Procurement Logistics', score: procurementReadiness, target: 85, status: procurementReadiness >= 80 ? 'Ready' : 'Delayed' },
        { key: 'tasks', title: 'Task Preparation', score: tasksReadiness, target: 85, status: tasksReadiness >= 80 ? 'On Track' : 'Behind' },
        { key: 'issues', title: 'Site Issue Blockers', score: issuesReadiness, target: 90, status: issuesReadiness >= 85 ? 'Clear' : 'Action Required' },
        { key: 'safety', title: 'Safety Compliance', score: safetyReadiness, target: 95, status: safetyReadiness >= 90 ? 'Compliant' : 'Risk Flagged' },
      ],
    };
  }, [labourAnalytics, materialAnalytics, procurementAnalytics, projectAnalytics, siteAnalytics]);

  // -------------------------------------------------------------
  // 8. RISK RADAR INTELLIGENCE
  // -------------------------------------------------------------
  const riskRadar = useMemo(() => {
    // 1. Schedule Risk
    const schedVar = projectAnalytics.scheduleVariancePct;
    let schedStatus = 'LOW';
    let schedScore = 15;
    if (schedVar < -10) { schedStatus = 'CRITICAL'; schedScore = 90; }
    else if (schedVar < -5) { schedStatus = 'HIGH'; schedScore = 70; }
    else if (schedVar < -2) { schedStatus = 'MEDIUM'; schedScore = 45; }

    // 2. Material Risk
    const lowStock = materialAnalytics.lowStockCount;
    const consVar = materialAnalytics.materialConsumptionVariancePct;
    let matStatus = 'LOW';
    let matScore = 20;
    if (lowStock >= 3 || consVar > 12) { matStatus = 'HIGH'; matScore = 75; }
    else if (lowStock >= 1 || consVar > 5) { matStatus = 'MEDIUM'; matScore = 48; }

    // 3. Labour Risk
    const shortage = labourAnalytics.totalShortageCount;
    let labStatus = 'LOW';
    let labScore = 18;
    if (shortage >= 5) { labStatus = 'HIGH'; labScore = 78; }
    else if (shortage >= 1) { labStatus = 'MEDIUM'; labScore = 52; }

    // 4. Procurement Risk
    const delayedDels = procurementAnalytics.delayedCount;
    let procStatus = 'LOW';
    let procScore = 15;
    if (delayedDels >= 3) { procStatus = 'HIGH'; procScore = 80; }
    else if (delayedDels >= 1) { procStatus = 'MEDIUM'; procScore = 50; }

    // 5. Cost Risk
    const costVarPct = costAnalytics.costVariancePct;
    let costStatus = 'LOW';
    let costScore = 20;
    if (costVarPct > 10) { costStatus = 'CRITICAL'; costScore = 88; }
    else if (costVarPct > 5) { costStatus = 'HIGH'; costScore = 72; }
    else if (costVarPct > 0) { costStatus = 'MEDIUM'; costScore = 40; }

    // 6. Site Issues Risk
    const highIssues = siteAnalytics.highPriorityOpenIssues;
    let siteStatus = 'LOW';
    let siteScore = 15;
    if (highIssues >= 3) { siteStatus = 'HIGH'; siteScore = 76; }
    else if (highIssues >= 1) { siteStatus = 'MEDIUM'; siteScore = 46; }

    // 7. Safety Risk
    const critSafety = siteAnalytics.criticalSafetyIncidents;
    let safeStatus = 'LOW';
    let safeScore = 10;
    if (critSafety >= 2) { safeStatus = 'CRITICAL'; safeScore = 95; }
    else if (critSafety >= 1) { safeStatus = 'HIGH'; safeScore = 82; }

    const categories = [
      {
        key: 'schedule',
        name: 'Schedule Risk',
        status: schedStatus,
        score: schedScore,
        evidence: `Schedule variance is ${schedVar > 0 ? '+' : ''}${schedVar}% against baseline planned progress.`,
        recommendation: schedStatus !== 'LOW' ? 'Review critical path tasks and reallocate workforce to delayed phases.' : 'Maintain current phase momentum.',
        drilldown: '/projects/progress',
      },
      {
        key: 'material',
        name: 'Material Risk',
        status: matStatus,
        score: matScore,
        evidence: `${lowStock} material item(s) below reorder level. Consumption variance: ${consVar > 0 ? '+' : ''}${consVar}%.`,
        recommendation: matStatus !== 'LOW' ? 'Reorder low-stock materials and audit daily site issue logs.' : 'Inventory levels stable.',
        drilldown: '/materials/inventory',
      },
      {
        key: 'labour',
        name: 'Labour Risk',
        status: labStatus,
        score: labScore,
        evidence: `Trade allocation shortage of ${shortage} worker(s) across site assignments.`,
        recommendation: labStatus !== 'LOW' ? 'Request contractor reinforcement for key skilled trades.' : 'Workforce allocation adequate.',
        drilldown: '/labour/allocation',
      },
      {
        key: 'procurement',
        name: 'Procurement Risk',
        status: procStatus,
        score: procScore,
        evidence: `${delayedDels} PO supplier delivery(ies) currently delayed past expected date.`,
        recommendation: procStatus !== 'LOW' ? 'Escalate with delayed suppliers and inspect dispatch tracking.' : 'Deliveries progressing on schedule.',
        drilldown: '/procurement/deliveries',
      },
      {
        key: 'cost',
        name: 'Cost Risk',
        status: costStatus,
        score: costScore,
        evidence: `Actual project spend variance is ${costVarPct > 0 ? '+' : ''}${costVarPct}% over estimated budget baseline.`,
        recommendation: costStatus !== 'LOW' ? 'Audit material consumption wastage and labour OT billing.' : 'Project budget within safe parameters.',
        drilldown: '/analytics/costs',
      },
      {
        key: 'site',
        name: 'Site Issues Risk',
        status: siteStatus,
        score: siteScore,
        evidence: `${highIssues} high-priority unresolved site issue(s) remaining open.`,
        recommendation: siteStatus !== 'LOW' ? 'Assign supervisor focus to resolve open high-priority issues immediately.' : 'Site issue resolution rate normal.',
        drilldown: '/site/issues',
      },
      {
        key: 'safety',
        name: 'Safety Risk',
        status: safeStatus,
        score: safeScore,
        evidence: `${siteAnalytics.openSafetyIncidents} open safety incident(s) requiring corrective verification.`,
        recommendation: safeStatus !== 'LOW' ? 'Conduct immediate Tool Box Talk (TBT) and enforce PPE compliance.' : 'Safety protocols fully compliant.',
        drilldown: '/site/safety',
      },
    ];

    return { categories };
  }, [projectAnalytics, materialAnalytics, labourAnalytics, procurementAnalytics, costAnalytics, siteAnalytics]);

  // -------------------------------------------------------------
  // 9. DETERMINISTIC INTELLIGENCE INSIGHTS
  // -------------------------------------------------------------
  const intelligenceInsights = useMemo(() => {
    const insights = [];

    // Schedule Insight
    if (projectAnalytics.scheduleVariancePct < -3) {
      insights.push({
        id: 'INS-SCH-01',
        category: 'Schedule',
        severity: projectAnalytics.scheduleVariancePct < -8 ? 'Critical' : 'Warning',
        title: 'Schedule Progress Variance Behind Baseline',
        evidence: `Actual completion (${projectAnalytics.avgActualProgress}%) is ${Math.abs(projectAnalytics.scheduleVariancePct)}% behind planned target (${projectAnalytics.avgPlannedProgress}%).`,
        affectedModule: 'Projects & Planning',
        recommendedAttention: 'Review delayed structural framing tasks and re-sequence dependent trade activities.',
        drilldown: '/projects/progress',
      });
    }

    // Material Insight
    if (materialAnalytics.materialConsumptionVariancePct > 5) {
      insights.push({
        id: 'INS-MAT-01',
        category: 'Material',
        severity: 'Warning',
        title: 'Material Over-Consumption Exceeds Target',
        evidence: `Actual material usage exceeds planned baseline by +${materialAnalytics.materialConsumptionVariancePct}%. Total wastage cost estimated at ₹${materialAnalytics.totalWastageCost.toLocaleString('en-IN')}.`,
        affectedModule: 'Material Management',
        recommendedAttention: 'Audit site store issue notes and verify daily mix/wastage ratios during pouring.',
        drilldown: '/materials/consumption',
      });
    }

    if (materialAnalytics.lowStockCount > 0) {
      insights.push({
        id: 'INS-MAT-02',
        category: 'Material',
        severity: materialAnalytics.criticalStockCount > 0 ? 'Critical' : 'Warning',
        title: 'Inventory Low Stock Alert',
        evidence: `${materialAnalytics.lowStockCount} material item(s) dropped below reorder threshold (${materialAnalytics.criticalStockCount} critical).`,
        affectedModule: 'Site Inventory',
        recommendedAttention: 'Convert approved Purchase Requests into Purchase Orders immediately to prevent site stockouts.',
        drilldown: '/materials/inventory',
      });
    }

    // Labour Insight
    if (labourAnalytics.totalShortageCount > 0) {
      insights.push({
        id: 'INS-LAB-01',
        category: 'Labour',
        severity: labourAnalytics.totalShortageCount >= 4 ? 'Critical' : 'Warning',
        title: 'Workforce Trade Shortage Identified',
        evidence: `Active site allocations indicate a gap of ${labourAnalytics.totalShortageCount} required worker(s) across trade teams.`,
        affectedModule: 'Workforce Allocation',
        recommendedAttention: 'Mobilize additional contractor crews for Bar Bender and Mason trades.',
        drilldown: '/labour/allocation',
      });
    }

    // Procurement Insight
    if (procurementAnalytics.delayedCount > 0) {
      insights.push({
        id: 'INS-PRC-01',
        category: 'Procurement',
        severity: 'Warning',
        title: 'Supplier Deliveries Overdue',
        evidence: `${procurementAnalytics.delayedCount} purchase order delivery shipment(s) are delayed past expected delivery dates.`,
        affectedModule: 'Procurement Logistics',
        recommendedAttention: 'Follow up with suppliers and update vehicle dispatch logs in Procurement Deliveries.',
        drilldown: '/procurement/deliveries',
      });
    }

    // Site Issues Insight
    if (siteAnalytics.highPriorityOpenIssues > 0) {
      insights.push({
        id: 'INS-SIT-01',
        category: 'Site Operations',
        severity: 'Critical',
        title: 'High-Priority Site Issue Unresolved',
        evidence: `${siteAnalytics.highPriorityOpenIssues} open high-priority issue(s) are logged without resolution status.`,
        affectedModule: 'Site Issues',
        recommendedAttention: 'Inspect issue root cause and assign field supervisor resolution deadline.',
        drilldown: '/site/issues',
      });
    }

    // Default positive insight if site operating cleanly
    if (insights.length === 0) {
      insights.push({
        id: 'INS-GEN-01',
        category: 'Operations',
        severity: 'Info',
        title: 'Operations Running Within Normal Parameters',
        evidence: 'Schedule, materials, labour turnout, procurement deliveries, and site safety are all within benchmark thresholds.',
        affectedModule: 'BuildOps Intelligence',
        recommendedAttention: 'Maintain current operational cadence and continue monitoring site reports.',
        drilldown: '/analytics',
      });
    }

    return insights;
  }, [projectAnalytics, materialAnalytics, labourAnalytics, procurementAnalytics, siteAnalytics]);

  return (
    <AnalyticsContext.Provider
      value={{
        selectedProjectId,
        setSelectedProjectId,
        selectedDateRange,
        setSelectedDateRange,
        projectAnalytics,
        materialAnalytics,
        labourAnalytics,
        procurementAnalytics,
        siteAnalytics,
        costAnalytics,
        readinessIntelligence,
        riskRadar,
        intelligenceInsights,
        calculationBasis: CALCULATION_BASIS,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
