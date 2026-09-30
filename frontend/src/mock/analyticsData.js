/**
 * Construction Analytics & Intelligence Benchmark Configurations & Thresholds
 * 
 * IMPORTANT: This file contains NO duplicate operational records.
 * It strictly contains configuration constants, benchmarks, metric definitions,
 * calculation bases, and deterministic rule schemas.
 */

export const ANALYTICS_THRESHOLDS = {
  schedule: {
    lowRiskVariancePct: -2,
    mediumRiskVariancePct: -5,
    highRiskVariancePct: -10,
  },
  material: {
    normalVariancePct: 5,
    highVariancePct: 10,
    criticalLowStockCount: 2,
  },
  labour: {
    targetProductivityPct: 95,
    underperformingPct: 85,
    shortageRatioThreshold: 0.85,
  },
  procurement: {
    targetOnTimeDeliveryPct: 90,
    warningOnTimeDeliveryPct: 80,
  },
  cost: {
    nearBudgetThresholdPct: 5,
    overBudgetThresholdPct: 10,
  },
  site: {
    highPriorityOpenIssuesThreshold: 2,
    criticalSafetyIncidentThreshold: 1,
  },
  readiness: {
    weights: {
      labour: 0.20,
      material: 0.25,
      procurement: 0.15,
      tasks: 0.15,
      issues: 0.15,
      safety: 0.10,
    },
    targetScore: 85,
  },
};

export const CALCULATION_BASIS = {
  scheduleVariance: {
    name: 'Schedule Variance',
    formula: 'Actual Progress (%) - Planned Progress (%)',
    explanation: 'Measures delay or advancement against the baseline construction timeline.',
  },
  costVariance: {
    name: 'Cost Variance',
    formula: 'Actual Spend (₹) - Baseline Budget (₹)',
    explanation: 'Identifies over-budget or cost-saving status across projects and cost heads.',
  },
  materialVariance: {
    name: 'Material Consumption Variance',
    formula: 'Actual Issued/Consumed Quantity - Planned Requirement Quantity',
    explanation: 'Tracks material utilization efficiency and over-consumption on site tasks.',
  },
  labourProductivity: {
    name: 'Workforce Productivity Index',
    formula: '(Completed Work Output / Planned Work Output) * 100',
    explanation: 'Evaluates crew performance per trade relative to daily progress quotas.',
  },
  onTimeDeliveryRate: {
    name: 'On-Time Delivery Rate',
    formula: '(On-Time Delivered POs / Total Scheduled PO Deliveries) * 100',
    explanation: 'Assesses supplier fulfillment speed and logistics reliability.',
  },
  tomorrowReadinessScore: {
    name: 'Tomorrow Operational Readiness Index',
    formula: 'Weighted average of workforce turnout, material availability, PO status, task prep, open issues, and safety clearances.',
    explanation: 'Evaluates site preparedness for the next 24-48 hours of scheduled operations.',
  },
};

export const TRADE_LIST = [
  'Mason',
  'Helper',
  'Carpenter',
  'Electrician',
  'Plumber',
  'Painter',
  'Welder',
  'Bar Bender',
  'Equipment Operator',
  'Surveyor',
  'Safety Officer',
  'Supervisor',
];
