/**
 * BuildOps Phase 9 — Predictive Intelligence Configuration & Metadata
 * 
 * Contains thresholds, prediction horizons, model metadata, confidence rules,
 * default assumptions, and future ML model candidates.
 * 
 * NOTE: Does NOT contain duplicate project, material, labour, or procurement records.
 */

export const PREDICTION_HORIZONS = {
  TOMORROW: 'Tomorrow',
  NEXT_7_DAYS: 'Next 7 Days',
  NEXT_14_DAYS: 'Next 14 Days',
  PROJECT_COMPLETION: 'Project Completion',
};

export const CONFIDENCE_LEVELS = {
  HIGH: {
    label: 'HIGH',
    badgeClass: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
    description: 'High confidence derived from continuous daily logs and complete inventory & task records.',
  },
  MEDIUM: {
    label: 'MEDIUM',
    badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-300',
    description: 'Moderate confidence based on active operational state with partial historical window.',
  },
  LOW: {
    label: 'LOW',
    badgeClass: 'bg-slate-500/10 text-slate-700 border-slate-300',
    description: 'Low confidence due to sparse historical logs or newly initialized project data.',
  },
};

export const SEVERITY_LEVELS = {
  CRITICAL: {
    label: 'CRITICAL',
    badgeClass: 'bg-red-500 text-white border-red-600',
    cardClass: 'border-red-300 bg-red-50/40',
  },
  HIGH: {
    label: 'HIGH',
    badgeClass: 'bg-orange-500 text-white border-orange-600',
    cardClass: 'border-orange-300 bg-orange-50/30',
  },
  MEDIUM: {
    label: 'MEDIUM',
    badgeClass: 'bg-amber-500 text-slate-950 border-amber-600',
    cardClass: 'border-amber-300 bg-amber-50/20',
  },
  LOW: {
    label: 'LOW',
    badgeClass: 'bg-emerald-500 text-white border-emerald-600',
    cardClass: 'border-slate-200 bg-white',
  },
};

export const PREDICTION_MODEL_METADATA = {
  modelType: 'RULE_BASED_BASELINE',
  modelVersion: 'phase-9-v1.0-deterministic',
  predictionSource: 'derived-operational-data',
  engineName: 'BuildOps Deterministic Predictive Engine',
  executionMode: 'Client-Side Transparent Calculation',
};

export const FUTURE_MODEL_CANDIDATES = [
  {
    id: 'ML-MAT-01',
    name: 'Material Demand Forecasting Engine',
    type: 'Time-Series Gradient Boosting (XGBoost / LightGBM)',
    target: 'Predict daily consumption rate per material item per site block',
    inputFeatures: [
      'Historical daily store issue notes',
      'Phase & task structural completion schedule',
      'Weather delay forecasts (rainfall, extreme heat)',
      'Subcontractor daily workforce velocity',
    ],
    status: 'Architecture Baseline Ready (Target: Phase 10)',
    benefits: 'Reduces material buffer inventory holding cost by 18-24%',
  },
  {
    id: 'ML-LAB-02',
    name: 'Workforce Trade Demand Estimator',
    type: 'Multi-Task Neural Network / Random Forest',
    target: 'Forecast trade capacity requirement per milestone phase',
    inputFeatures: [
      'Active gang attendance & turnout ratio',
      'Structural stage (Foundation vs Superstructure vs Finishing)',
      'Trade productivity rate index (output/man-hour)',
      'Historical OT and gang absenteeism patterns',
    ],
    status: 'Architecture Baseline Ready (Target: Phase 10)',
    benefits: 'Prevents idle labour cost and avoids critical trade bottlenecks',
  },
  {
    id: 'ML-SCH-03',
    name: 'Schedule Delay Classifier & Milestone Estimator',
    type: 'Classification & Survival Analysis (Random Forest / Cox PH)',
    target: 'Probability of milestone slip (> 5 days overdue)',
    inputFeatures: [
      'Schedule progress variance trend',
      'Material stockout frequency',
      'High-priority open site issue count',
      'Subcontractor lead time reliability rating',
    ],
    status: 'Architecture Baseline Ready (Target: Phase 10)',
    benefits: 'Early warning signal 14-21 days prior to milestone target date',
  },
  {
    id: 'ML-PROC-04',
    name: 'Supplier Delivery Lead Time & Reliability Model',
    type: 'Bayesian Regression & Failure Analysis',
    target: 'Expected PO dispatch & lead time variance (days)',
    inputFeatures: [
      'Historical supplier On-Time In-Full (OTIF) score',
      'PO item quantity & custom spec complexity',
      'Supplier-to-site transit distance',
      'Seasonal supplier backlog factor',
    ],
    status: 'Architecture Baseline Ready (Target: Phase 10)',
    benefits: 'Mitigates material stockouts caused by vendor shipping delays',
  },
  {
    id: 'ML-COST-05',
    name: 'Project EAC (Estimate At Completion) Cost Predictor',
    type: 'Monte Carlo Cost Simulation & Regression',
    target: 'Final Cost at Completion variance & overrun probability',
    inputFeatures: [
      'Cumulative Earned Value (EV) & Actual Cost (AC)',
      'Unit material price inflation indices',
      'Subcontractor variation order trends',
      'Labour OT cost per structural unit',
    ],
    status: 'Architecture Baseline Ready (Target: Phase 10)',
    benefits: 'Prevents cost overruns through real-time EAC forecasting',
  },
];
