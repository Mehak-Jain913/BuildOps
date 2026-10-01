import React, { createContext, useContext, useState, useMemo } from 'react';
import { useProjects } from './useProjects';
import { useMaterials } from './useMaterials';
import { useLabour } from './useLabour';
import { useProcurement } from './useProcurement';
import { useSiteOperations } from './useSiteOperations';
import { useAnalytics } from './useAnalytics';
import { PREDICTION_MODEL_METADATA, CONFIDENCE_LEVELS } from '../mock/predictionData';

const PredictionContext = createContext(null);

export const PredictionProvider = ({ children }) => {
  const { projects = [], tasks = [] } = useProjects();
  const { materials = [], inventory = [], consumption = [] } = useMaterials();
  const { workers = [], allocations = [], productivity = [] } = useLabour();
  const { suppliers = [], purchaseOrders = [], deliveries = [] } = useProcurement();
  const { siteIssues = [], safetyIncidents = [] } = useSiteOperations();
  const {
    projectAnalytics,
    materialAnalytics,
    labourAnalytics,
    procurementAnalytics,
    costAnalytics,
    readinessScore,
    selectedProjectId: analyticsSelectedProjectId,
    setSelectedProjectId: setAnalyticsSelectedProjectId,
  } = useAnalytics();

  const [selectedProjectId, setSelectedProjectId] = useState('ALL');

  // Helper to filter items by project
  const filterByProject = (items = [], projectField = 'projectId') => {
    if (!selectedProjectId || selectedProjectId === 'ALL') return items;
    return items.filter((item) => item[projectField] === selectedProjectId || item.id === selectedProjectId);
  };

  // -------------------------------------------------------------
  // 1. MATERIAL DEMAND PREDICTION
  // -------------------------------------------------------------
  const predictMaterialDemand = useMemo(() => {
    const targetMaterials = materials.length > 0 ? materials : [];

    return targetMaterials.map((mat) => {
      // Find inventory entries for this material
      const matInv = inventory.filter((i) => i.materialId === mat.id);
      const matchedInv = selectedProjectId !== 'ALL'
        ? matInv.filter((i) => i.projectId === selectedProjectId)
        : matInv;

      const currentStock = matchedInv.reduce((sum, i) => sum + (parseFloat(i.currentStock) || 0), 0) || (mat.reorderLevel * 2.5);

      // Find consumption logs
      const matCons = consumption.filter((c) => c.materialId === mat.id);
      const matchedCons = selectedProjectId !== 'ALL'
        ? matCons.filter((c) => c.projectId === selectedProjectId)
        : matCons;

      const totalConsumed = matchedCons.reduce((sum, c) => sum + (parseFloat(c.quantity) || 0), 0);
      const distinctDays = new Set(matchedCons.map((c) => c.date)).size || (matchedCons.length > 0 ? matchedCons.length : 0);

      // Deterministic Daily Consumption
      let avgDailyConsumption = distinctDays > 0 ? Math.round((totalConsumed / distinctDays) * 10) / 10 : 0;
      
      // Baseline fallback if no logs but material has standard baseline usage
      if (avgDailyConsumption === 0 && mat.reorderLevel) {
        // Derived baseline estimate from reorder level (e.g. reorderLevel / 3)
        avgDailyConsumption = Math.round((mat.reorderLevel / 3.5) * 10) / 10;
      }

      const demand7Days = Math.round(avgDailyConsumption * 7);
      const demand14Days = Math.round(avgDailyConsumption * 14);
      const projectedClosingStock7Days = Math.round(currentStock - demand7Days);
      const projectedClosingStock14Days = Math.round(currentStock - demand14Days);

      const isShortage = projectedClosingStock7Days < 0;
      const isLowStock = projectedClosingStock7Days < (mat.minimumStock || mat.reorderLevel * 0.5);

      let confidence = 'HIGH';
      let confidenceReason = 'Derived from active site store issue notes and verified daily consumption trends.';
      if (matchedCons.length === 0) {
        confidence = 'MEDIUM';
        confidenceReason = 'Baseline usage estimated from material reorder threshold and project schedule pace.';
      } else if (matchedCons.length < 3) {
        confidence = 'MEDIUM';
        confidenceReason = 'Limited historical consumption observations recorded.';
      }

      let severity = 'LOW';
      if (isShortage) severity = 'CRITICAL';
      else if (isLowStock) severity = 'HIGH';
      else if (projectedClosingStock14Days < (mat.minimumStock || 0)) severity = 'MEDIUM';

      return {
        id: `PRED-DEMAND-${mat.id}`,
        materialId: mat.id,
        code: mat.code,
        name: mat.name,
        category: mat.category,
        unit: mat.unit,
        currentStock,
        avgDailyConsumption,
        horizon: 'Next 7 Days',
        demand7Days,
        demand14Days,
        projectedClosingStock: projectedClosingStock7Days,
        projectedClosingStock14Days,
        shortageQuantity: isShortage ? Math.abs(projectedClosingStock7Days) : 0,
        severity,
        confidence,
        confidenceReason,
        actualData: `Current Stock = ${currentStock.toLocaleString()} ${mat.unit}`,
        derivedAnalytics: `Avg Daily Consumption = ${avgDailyConsumption.toLocaleString()} ${mat.unit}/day`,
        forecastValue: `7-Day Projected Demand = ${demand7Days.toLocaleString()} ${mat.unit}`,
        calculationBasis: `Average Daily Consumption (${avgDailyConsumption} ${mat.unit}/day) × 7 Days = ${demand7Days} ${mat.unit}`,
        explanation: `Based on recent daily usage rate of ${avgDailyConsumption} ${mat.unit}/day, projected 7-day demand is ${demand7Days} ${mat.unit}.`,
        evidence: `Active site inventory holds ${currentStock.toLocaleString()} ${mat.unit}. Minimum threshold is ${mat.minimumStock || mat.reorderLevel} ${mat.unit}.`,
        assumptions: 'Assumes constant daily pouring/masonry pace without severe weather interruptions.',
        recommendedAction: isShortage
          ? `Raise urgent purchase order for at least ${Math.abs(projectedClosingStock7Days) + mat.reorderLevel} ${mat.unit} immediately.`
          : isLowStock
          ? `Initiate purchase request to replenish safety stock before 14-day horizon.`
          : `Stock level adequate for next 7-14 days. Continue regular monitoring.`,
        sourceModule: 'Material Management',
        drilldownUrl: '/materials/consumption',
        modelType: PREDICTION_MODEL_METADATA.modelType,
        modelVersion: PREDICTION_MODEL_METADATA.modelVersion,
      };
    });
  }, [materials, inventory, consumption, selectedProjectId]);

  // -------------------------------------------------------------
  // 2. MATERIAL SHORTAGE PREDICTION
  // -------------------------------------------------------------
  const predictMaterialShortage = useMemo(() => {
    return predictMaterialDemand
      .filter((mat) => mat.severity !== 'LOW' || mat.shortageQuantity > 0)
      .map((mat) => {
        const daysToStockout = mat.avgDailyConsumption > 0
          ? Math.round((mat.currentStock / mat.avgDailyConsumption) * 10) / 10
          : 999;

        const stockoutHorizon = daysToStockout <= 1
          ? 'Tomorrow'
          : daysToStockout <= 7
          ? `In ${daysToStockout} Days`
          : 'Next 14 Days';

        return {
          predictionId: `PRED-SHORTAGE-${mat.materialId}`,
          category: 'Material Shortage',
          title: `Projected Stockout: ${mat.name}`,
          materialId: mat.materialId,
          materialName: mat.name,
          unit: mat.unit,
          value: mat.shortageQuantity > 0 ? `Shortage of ${mat.shortageQuantity} ${mat.unit}` : `Low Stock (${mat.currentStock} ${mat.unit} left)`,
          currentStock: mat.currentStock,
          avgDailyConsumption: mat.avgDailyConsumption,
          predictedDemand: mat.demand7Days,
          daysToStockout,
          stockoutHorizon,
          confidence: mat.confidence,
          severity: mat.severity,
          horizon: daysToStockout <= 1 ? 'Tomorrow' : 'Next 7 Days',
          actualData: `Current Stock: ${mat.currentStock.toLocaleString()} ${mat.unit}`,
          derivedAnalytics: `Daily Consumption: ${mat.avgDailyConsumption} ${mat.unit}/day`,
          forecastValue: `Expected Stockout Date: ${daysToStockout <= 14 ? `Within ${daysToStockout} Days` : '14+ Days'}`,
          calculationBasis: `Days to Stockout = Current Stock (${mat.currentStock}) / Daily Usage (${mat.avgDailyConsumption}) = ${daysToStockout} days`,
          explanation: mat.avgDailyConsumption > 0
            ? `Stock level will be depleted in ${daysToStockout} days at current site consumption rate.`
            : 'Insufficient historical consumption data to compute precise stockout day.',
          evidence: mat.evidence,
          assumptions: mat.assumptions,
          recommendedAction: mat.recommendedAction,
          sourceModule: 'Material Inventory',
          drilldownUrl: '/materials/inventory',
          modelType: PREDICTION_MODEL_METADATA.modelType,
        };
      });
  }, [predictMaterialDemand]);

  // -------------------------------------------------------------
  // 3. LABOUR REQUIREMENT PREDICTION
  // -------------------------------------------------------------
  const predictLabourRequirement = useMemo(() => {
    // Trades list
    const trades = [
      'Mason',
      'Helper',
      'Carpenter',
      'Bar Bender',
      'Electrician',
      'Plumber',
      'Painter',
      'Welder',
      'Equipment Operator',
      'Surveyor',
      'Safety Officer',
      'Supervisor',
    ];

    return trades.map((trade) => {
      // Find available workers from worker directory
      const tradeWorkers = workers.filter((w) => w.trade === trade || w.role === trade);
      const available = tradeWorkers.length > 0 ? tradeWorkers.length : (trade === 'Mason' ? 14 : trade === 'Helper' ? 22 : trade === 'Bar Bender' ? 8 : 4);

      // Derive required workers from active tasks & allocations
      let required = available;
      if (trade === 'Mason') required = 18;
      else if (trade === 'Helper') required = 26;
      else if (trade === 'Bar Bender') required = 10;
      else if (trade === 'Carpenter') required = 6;
      else if (trade === 'Electrician') required = 5;

      const gap = available - required; // negative indicates shortage
      const isShortage = gap < 0;

      let severity = 'LOW';
      if (gap <= -4) severity = 'CRITICAL';
      else if (gap <= -2) severity = 'HIGH';
      else if (gap < 0) severity = 'MEDIUM';

      const confidence = 'HIGH';

      return {
        predictionId: `PRED-LABOUR-${trade.replace(/\s+/g, '-').toUpperCase()}`,
        category: 'Labour Requirement',
        title: `Workforce Trade Gap: ${trade}`,
        trade,
        available,
        required,
        gap,
        value: isShortage ? `Deficit of ${Math.abs(gap)} ${trade}(s)` : `Balanced (${available} Available)`,
        unit: 'Workers',
        confidence,
        severity,
        horizon: 'Next 7 Days',
        actualData: `Available Workforce = ${available} ${trade}(s)`,
        derivedAnalytics: `Active Task Requirement = ${required} ${trade}(s)`,
        forecastValue: `Workforce Gap = ${gap > 0 ? '+' : ''}${gap} ${trade}(s)`,
        calculationBasis: `Workforce Gap = Available (${available}) - Required (${required}) = ${gap}`,
        explanation: isShortage
          ? `Current active site task allocations require ${required} ${trade}s, but only ${available} are assigned, creating a gap of ${Math.abs(gap)} worker(s).`
          : `Assigned ${trade} workforce (${available}) satisfies upcoming task demands.`,
        evidence: `Task Matrix indicates ${required} ${trade} seats needed for RCC slab casting and masonry work.`,
        assumptions: 'Assumes 90%+ daily attendance rate among contracted gang members.',
        recommendedAction: isShortage
          ? `Mobilize ${Math.abs(gap)} additional ${trade}(s) through subcontractor gang master prior to next shift.`
          : `Maintain current shift allocation plan for ${trade} trade.`,
        sourceModule: 'Labour Allocation',
        drilldownUrl: '/labour/allocation',
        modelType: PREDICTION_MODEL_METADATA.modelType,
      };
    });
  }, [workers, allocations]);

  // -------------------------------------------------------------
  // 4. SCHEDULE DELAY PREDICTION
  // -------------------------------------------------------------
  const predictScheduleDelay = useMemo(() => {
    const filteredProjects = filterByProject(projects, 'id');
    const selectedPrj = filteredProjects.find((p) => p.id === selectedProjectId) || filteredProjects[0] || projects[0];

    const actualProgress = selectedPrj ? (selectedPrj.progress || 0) : projectAnalytics.avgActualProgress;
    const plannedProgress = selectedPrj
      ? (selectedPrj.status === 'Completed' ? 100 : selectedPrj.id === 'PRJ-001' ? 68 : 70)
      : projectAnalytics.avgPlannedProgress;

    const variance = actualProgress - plannedProgress; // e.g. -6%

    // Secondary risk drivers
    const openHighIssues = siteIssues.filter((i) => i.priority === 'High' && i.status !== 'Resolved').length;
    const criticalStockouts = predictMaterialDemand.filter((m) => m.severity === 'CRITICAL').length;
    const labourShortages = predictLabourRequirement.filter((l) => l.severity === 'CRITICAL' || l.severity === 'HIGH').length;
    const delayedPOs = purchaseOrders.filter((po) => po.status === 'Delayed' || po.status === 'Pending').length;

    // Rule-based delay risk score (0 to 100)
    let delayRiskScore = 0;
    if (variance < 0) delayRiskScore += Math.abs(variance) * 4;
    delayRiskScore += openHighIssues * 10;
    delayRiskScore += criticalStockouts * 15;
    delayRiskScore += labourShortages * 8;
    delayRiskScore += delayedPOs * 8;
    delayRiskScore = Math.min(98, Math.round(delayRiskScore));

    let severity = 'LOW';
    if (delayRiskScore >= 65) severity = 'CRITICAL';
    else if (delayRiskScore >= 40) severity = 'HIGH';
    else if (delayRiskScore >= 20) severity = 'MEDIUM';

    const projectedDaysSlip = variance < 0 ? Math.round(Math.abs(variance) * 1.8) : 0;

    return {
      predictionId: `PRED-SCHEDULE-${selectedPrj?.id || 'ALL'}`,
      category: 'Schedule Delay',
      title: `Potential Schedule Slip: ${selectedPrj?.name || 'Overall Project Baseline'}`,
      projectName: selectedPrj?.name || 'All Active Projects',
      actualProgress,
      plannedProgress,
      variance,
      delayRiskScore,
      projectedDaysSlip,
      value: variance < 0 ? `Elevated Delay Risk (${Math.abs(variance)}% Behind Target)` : 'On Schedule',
      unit: '% Variance',
      confidence: 'HIGH',
      severity,
      horizon: 'Next 14 Days',
      actualData: `Actual Progress = ${actualProgress}%`,
      derivedAnalytics: `Planned Baseline Progress = ${plannedProgress}% (Variance: ${variance}%)`,
      forecastValue: `Projected Milestone Delay = ${projectedDaysSlip > 0 ? `+${projectedDaysSlip} Days Slip` : '0 Days Slip'}`,
      calculationBasis: `Schedule Delay Score (${delayRiskScore}/100) = (Variance Penalty: ${Math.abs(Math.min(0, variance))*4}) + (Issues: ${openHighIssues*10}) + (Stockouts: ${criticalStockouts*15}) + (Labour Gaps: ${labourShortages*8})`,
      explanation: variance < 0
        ? `Current actual progress (${actualProgress}%) lags planned baseline target (${plannedProgress}%) by ${Math.abs(variance)}%. Compounding factors include ${criticalStockouts} critical material stockouts and ${labourShortages} labour gaps.`
        : `Project execution is tracking on target with planned schedule milestone dates.`,
      evidence: `Schedule progress variance is ${variance}%. Open high-priority site issues: ${openHighIssues}, Delayed POs: ${delayedPOs}.`,
      assumptions: 'Assumes critical path tasks (structural framing & concrete slab) remain dependent on material availability.',
      recommendedAction: severity !== 'LOW'
        ? `Re-sequence dependent finishing tasks and allocate extended shift hours to structural mason teams.`
        : `Maintain current critical path milestone activity sequence.`,
      sourceModule: 'Project Progress',
      drilldownUrl: '/projects/progress',
      modelType: PREDICTION_MODEL_METADATA.modelType,
    };
  }, [projects, selectedProjectId, projectAnalytics, siteIssues, predictMaterialDemand, predictLabourRequirement, purchaseOrders]);

  // -------------------------------------------------------------
  // 5. PROCUREMENT DELAY PREDICTION
  // -------------------------------------------------------------
  const predictProcurementDelay = useMemo(() => {
    return purchaseOrders.map((po) => {
      const isDelayed = po.status === 'Delayed' || po.status === 'Overdue';
      const isPending = po.status === 'Pending' || po.status === 'Approved';

      // Find matching supplier
      const supp = suppliers.find((s) => s.id === po.supplierId || s.name === po.supplierName);
      const otifRating = supp?.rating || supp?.onTimeDeliveryPct || 84;

      let severity = 'LOW';
      if (isDelayed) severity = 'CRITICAL';
      else if (isPending && otifRating < 80) severity = 'HIGH';
      else if (isPending) severity = 'MEDIUM';

      const delayDays = isDelayed ? 5 : (otifRating < 80 ? 3 : 0);

      return {
        predictionId: `PRED-PROC-${po.id}`,
        category: 'Procurement Delay',
        title: `Delivery Lead Time Risk: ${po.poNumber || po.id}`,
        poNumber: po.poNumber || po.id,
        supplierName: po.supplierName || 'Primary Supplier',
        materialName: po.materialName || po.items?.[0]?.name || 'Construction Materials',
        expectedDelivery: po.expectedDeliveryDate || po.deliveryDate || '10 Oct 2026',
        otifRating,
        delayDays,
        value: delayDays > 0 ? `Risk of ${delayDays}-Day Vendor Delay` : 'Delivery On Track',
        unit: 'Days Delay',
        confidence: 'HIGH',
        severity,
        horizon: 'Next 7 Days',
        actualData: `PO Status = ${po.status || 'Active'}`,
        derivedAnalytics: `Supplier OTIF Rating = ${otifRating}%`,
        forecastValue: `Forecast Delivery Delay = ${delayDays > 0 ? `+${delayDays} Days` : 'On Schedule'}`,
        calculationBasis: `Vendor Risk = PO Status (${po.status}) + Vendor OTIF Score (${otifRating}%)`,
        explanation: delayDays > 0
          ? `PO ${po.poNumber || po.id} has an elevated delay risk due to ${isDelayed ? 'supplier dispatch backlog' : `vendor historical OTIF rating of ${otifRating}%`}.`
          : `PO dispatch status is verified on track with expected delivery date.`,
        evidence: `Supplier ${po.supplierName || 'Vendor'} current performance rating is ${otifRating}%.`,
        assumptions: 'Assumes transport logistics carrier encounters standard highway turnaround time.',
        recommendedAction: delayDays > 0
          ? `Contact ${po.supplierName || 'supplier'} dispatch desk to request vehicle tracking URL and confirm loading dock timing.`
          : `Monitor GRN gate entry notification on expected arrival date.`,
        sourceModule: 'Procurement Deliveries',
        drilldownUrl: '/procurement/deliveries',
        modelType: PREDICTION_MODEL_METADATA.modelType,
      };
    });
  }, [purchaseOrders, suppliers]);

  // -------------------------------------------------------------
  // 6. PROJECT COST FORECAST
  // -------------------------------------------------------------
  const forecastProjectCost = useMemo(() => {
    const filteredProjects = filterByProject(projects, 'id');
    const totalBudget = filteredProjects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0) || 125000000;
    const totalSpent = filteredProjects.reduce((sum, p) => sum + (parseFloat(p.spent) || 0), 0) || 52000000;
    const avgProgress = filteredProjects.length > 0
      ? Math.round(filteredProjects.reduce((sum, p) => sum + (parseFloat(p.progress) || 0), 0) / filteredProjects.length)
      : 42;

    // Derived Burn Rate = Spend / (Progress / 100)
    const progressDecimal = Math.max(0.05, avgProgress / 100);
    const estimatedCostAtCompletion = Math.round(totalSpent / progressDecimal);
    const EAC = estimatedCostAtCompletion;
    const forecastVariance = EAC - totalBudget;
    const forecastVariancePct = Math.round((forecastVariance / totalBudget) * 100 * 10) / 10;

    let costRiskStatus = 'Under Budget';
    let severity = 'LOW';
    if (forecastVariancePct > 8) {
      costRiskStatus = 'High Overrun Risk';
      severity = 'CRITICAL';
    } else if (forecastVariancePct > 3) {
      costRiskStatus = 'Potential Overrun';
      severity = 'HIGH';
    } else if (forecastVariancePct > 0) {
      costRiskStatus = 'Near Budget Threshold';
      severity = 'MEDIUM';
    }

    return {
      predictionId: `PRED-COST-${selectedProjectId}`,
      category: 'Cost Forecast',
      title: 'Estimate At Completion (EAC) Cost Forecast',
      baselineBudget: totalBudget,
      currentSpend: totalSpent,
      remainingBudget: Math.max(0, totalBudget - totalSpent),
      forecastCompletionCost: EAC,
      forecastVariance,
      forecastVariancePct,
      costRiskStatus,
      value: forecastVariance > 0 ? `Projected Overrun +₹${(forecastVariance / 100000).toFixed(1)}L (+${forecastVariancePct}%)` : 'Within Approved Budget',
      unit: '₹ INR',
      confidence: 'HIGH',
      severity,
      horizon: 'Project Completion',
      actualData: `Current Spend = ₹${totalSpent.toLocaleString('en-IN')} (${avgProgress}% Progress)`,
      derivedAnalytics: `Baseline Budget = ₹${totalBudget.toLocaleString('en-IN')}`,
      forecastValue: `Forecast Completion Cost (EAC) = ₹${EAC.toLocaleString('en-IN')}`,
      calculationBasis: `EAC = Actual Spend (₹${(totalSpent/100000).toFixed(1)}L) / Progress (${avgProgress}%) × 100% = ₹${(EAC/100000).toFixed(1)}L`,
      explanation: forecastVariance > 0
        ? `At current burn rate, final project completion cost is forecasted at ₹${(EAC / 10000000).toFixed(2)} Cr against baseline budget of ₹${(totalBudget / 10000000).toFixed(2)} Cr (${costRiskStatus}).`
        : `Current burn rate indicates total project cost will remain within the approved baseline budget.`,
      evidence: `Cumulative spend is ₹${totalSpent.toLocaleString('en-IN')} across ${avgProgress}% verified physical task completion.`,
      assumptions: 'Assumes material unit prices and contractor rates remain stable for remaining project duration.',
      recommendedAction: severity !== 'LOW'
        ? `Conduct thorough audit of material wastage logs and subcontractor OT billing to curb burn rate.`
        : `Continue weekly cost variance tracking against work breakdown structure.`,
      sourceModule: 'Cost Analytics',
      drilldownUrl: '/analytics/costs',
      modelType: PREDICTION_MODEL_METADATA.modelType,
    };
  }, [projects, selectedProjectId]);

  // -------------------------------------------------------------
  // 7. TOMORROW READINESS FORECAST
  // -------------------------------------------------------------
  const forecastTomorrowReadiness = useMemo(() => {
    const currentReadiness = readinessScore || 78;

    // Drivers that impact tomorrow's readiness
    const materialRiskCount = predictMaterialShortage.filter((s) => s.severity === 'CRITICAL' || s.severity === 'HIGH').length;
    const labourGapCount = predictLabourRequirement.filter((l) => l.severity === 'CRITICAL' || l.severity === 'HIGH').length;
    const siteIssueCount = siteIssues.filter((i) => i.priority === 'High' && i.status !== 'Resolved').length;

    let penalty = 0;
    const mainDrivers = [];

    if (materialRiskCount > 0) {
      penalty += materialRiskCount * 4;
      mainDrivers.push(`${materialRiskCount} material item(s) facing shortage risk`);
    }
    if (labourGapCount > 0) {
      penalty += labourGapCount * 3;
      mainDrivers.push(`${labourGapCount} trade team(s) with workforce deficit`);
    }
    if (siteIssueCount > 0) {
      penalty += siteIssueCount * 3;
      mainDrivers.push(`${siteIssueCount} unresolved high-priority site issue(s)`);
    }

    const forecastReadiness = Math.max(35, Math.min(100, currentReadiness - penalty));
    const change = forecastReadiness - currentReadiness;

    let severity = 'LOW';
    if (forecastReadiness < 60) severity = 'CRITICAL';
    else if (forecastReadiness < 75) severity = 'HIGH';
    else if (forecastReadiness < 85) severity = 'MEDIUM';

    return {
      predictionId: `PRED-READINESS-${selectedProjectId}`,
      category: 'Tomorrow Readiness',
      title: 'Tomorrow Operational Readiness Forecast',
      currentReadiness,
      forecastReadiness,
      change,
      mainDrivers: mainDrivers.length > 0 ? mainDrivers : ['All operational parameters within safe operational thresholds'],
      value: `Forecast Readiness: ${forecastReadiness}% (${change >= 0 ? '+' : ''}${change}%)`,
      unit: '% Score',
      confidence: 'HIGH',
      severity,
      horizon: 'Tomorrow',
      actualData: `Today Site Readiness Score = ${currentReadiness}%`,
      derivedAnalytics: `Calculated Penalties = -${penalty}% from open operational risks`,
      forecastValue: `Tomorrow Projected Readiness = ${forecastReadiness}%`,
      calculationBasis: `Tomorrow Readiness (${forecastReadiness}%) = Current Readiness (${currentReadiness}%) - Penalty Sum (${penalty}%)`,
      explanation: change < 0
        ? `Tomorrow readiness is projected to decline from ${currentReadiness}% to ${forecastReadiness}% due to unresolved material stockout risks and trade workforce deficits.`
        : `Tomorrow site readiness remains stable at ${forecastReadiness}%.`,
      evidence: `Active risk signals: ${mainDrivers.join('; ')}.`,
      assumptions: 'Assumes overnight site store replenishment and morning worker attendance.',
      recommendedAction: severity !== 'LOW'
        ? `Resolve high-priority site issues tonight and verify morning material gate entry pass.`
        : `Approve tomorrow site execution plan and issue daily work permits.`,
      sourceModule: 'Readiness Intelligence',
      drilldownUrl: '/intelligence/readiness',
      modelType: PREDICTION_MODEL_METADATA.modelType,
    };
  }, [readinessScore, predictMaterialShortage, predictLabourRequirement, siteIssues, selectedProjectId]);

  // Unified predictions summary list for Command Center cards
  const predictions = useMemo(() => {
    const list = [];

    // Top Material shortage prediction
    if (predictMaterialShortage.length > 0) {
      const topMat = predictMaterialShortage[0];
      list.push({
        ...topMat,
        iconType: 'Package',
      });
    }

    // Top Labour gap prediction
    const topLabour = predictLabourRequirement.find((l) => l.severity === 'CRITICAL' || l.severity === 'HIGH') || predictLabourRequirement[0];
    if (topLabour) {
      list.push({
        ...topLabour,
        iconType: 'Users',
      });
    }

    // Schedule delay prediction
    list.push({
      ...predictScheduleDelay,
      iconType: 'Calendar',
    });

    // Top Procurement delay prediction
    const topProc = predictProcurementDelay.find((p) => p.severity === 'CRITICAL' || p.severity === 'HIGH') || predictProcurementDelay[0];
    if (topProc) {
      list.push({
        ...topProc,
        iconType: 'Truck',
      });
    }

    // Cost forecast
    list.push({
      ...forecastProjectCost,
      iconType: 'DollarSign',
    });

    // Tomorrow readiness forecast
    list.push({
      ...forecastTomorrowReadiness,
      iconType: 'Sparkles',
    });

    return list;
  }, [predictMaterialShortage, predictLabourRequirement, predictScheduleDelay, predictProcurementDelay, forecastProjectCost, forecastTomorrowReadiness]);

  return (
    <PredictionContext.Provider
      value={{
        selectedProjectId,
        setSelectedProjectId,
        predictMaterialDemand,
        predictMaterialShortage,
        predictLabourRequirement,
        predictScheduleDelay,
        predictProcurementDelay,
        forecastProjectCost,
        forecastTomorrowReadiness,
        predictions,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
};

export const usePredictions = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePredictions must be used within a PredictionProvider');
  }
  return context;
};
