import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';

// Auth
import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// Dashboard
import { DashboardPage } from '../pages/dashboard/DashboardPage';

// Projects
import { ProjectsPage } from '../pages/projects/ProjectsPage';
import { ProjectDetailPage } from '../pages/projects/ProjectDetailPage';
import { ProjectEditPage } from '../pages/projects/ProjectEditPage';
import { TasksPage } from '../pages/projects/TasksPage';
import { TimelinePage } from '../pages/projects/TimelinePage';
import { ProgressPage } from '../pages/projects/ProgressPage';

// Materials
import { MaterialsPage } from '../pages/materials/MaterialsPage';
import { InventoryPage } from '../pages/materials/InventoryPage';
import { RequestsPage } from '../pages/materials/RequestsPage';
import { MovementsPage } from '../pages/materials/MovementsPage';
import { MaterialDetailPage } from '../pages/materials/MaterialDetailPage';
import { PurchaseOrdersPage as OldMaterialPOPage } from '../pages/materials/PurchaseOrdersPage';
import { GRNPage as OldMaterialGRNPage } from '../pages/materials/GRNPage';
import { ConsumptionPage } from '../pages/materials/ConsumptionPage';
import { WastagePage } from '../pages/materials/WastagePage';

// Labour
import { LabourPage } from '../pages/labour/LabourPage';
import { WorkersPage } from '../pages/labour/WorkersPage';
import { WorkerDetailPage } from '../pages/labour/WorkerDetailPage';
import { AttendancePage } from '../pages/labour/AttendancePage';
import { AllocationPage } from '../pages/labour/AllocationPage';
import { ShiftsPage } from '../pages/labour/ShiftsPage';
import { WagesPage } from '../pages/labour/WagesPage';
import { ProductivityPage } from '../pages/labour/ProductivityPage';

// Suppliers & Procurement
import { SuppliersPage } from '../pages/suppliers/SuppliersPage';
import { SupplierDetailPage } from '../pages/suppliers/SupplierDetailPage';
import { ProcurementPage } from '../pages/procurement/ProcurementPage';
import { PurchaseRequestsPage } from '../pages/procurement/PurchaseRequestsPage';
import { PurchaseOrdersPage } from '../pages/procurement/PurchaseOrdersPage';
import { DeliveriesPage } from '../pages/procurement/DeliveriesPage';
import { GRNPage } from '../pages/procurement/GRNPage';
import { ProcurementHistoryPage } from '../pages/procurement/ProcurementHistoryPage';

// Site Operations
import { SiteOperationsPage } from '../pages/site/SiteOperationsPage';
import { DailyReportPage } from '../pages/site/DailyReportPage';
import { WorkProgressPage } from '../pages/site/WorkProgressPage';
import { SiteIssuesPage } from '../pages/site/SiteIssuesPage';
import { SafetyPage } from '../pages/site/SafetyPage';
import { SiteActivityPage } from '../pages/site/SiteActivityPage';
import { SiteEvidencePage } from '../pages/site/SiteEvidencePage';

// Intelligence
import { IntelligenceOverviewPage } from '../pages/intelligence/IntelligenceOverviewPage';
import { PredictionsPage as OldPredictionsPage } from '../pages/intelligence/PredictionsPage';
import { RiskRadarPage } from '../pages/intelligence/RiskRadarPage';
import { RecommendationsPage } from '../pages/intelligence/RecommendationsPage';
import { AIAssistantPage } from '../pages/intelligence/AIAssistantPage';
import { ReadinessPage } from '../pages/intelligence/ReadinessPage';
import { InsightsPage } from '../pages/intelligence/InsightsPage';

// Predictive Intelligence Phase 9
import { PredictionsPage as PredictionsCommandCenter } from '../pages/predictions/PredictionsPage';
import { MaterialDemandPage } from '../pages/predictions/MaterialDemandPage';
import { MaterialShortagePage } from '../pages/predictions/MaterialShortagePage';
import { LabourRequirementPage } from '../pages/predictions/LabourRequirementPage';
import { ScheduleDelayPage } from '../pages/predictions/ScheduleDelayPage';
import { ProcurementDelayPage } from '../pages/predictions/ProcurementDelayPage';
import { CostForecastPage } from '../pages/predictions/CostForecastPage';
import { ReadinessForecastPage } from '../pages/predictions/ReadinessForecastPage';
import { PredictionHistoryPage } from '../pages/predictions/PredictionHistoryPage';
import { ModelReadinessPage } from '../pages/predictions/ModelReadinessPage';

// Analytics
import { AnalyticsPage } from '../pages/analytics/AnalyticsPage';
import { ProjectAnalyticsPage } from '../pages/analytics/ProjectAnalyticsPage';
import { MaterialAnalyticsPage } from '../pages/analytics/MaterialAnalyticsPage';
import { LabourAnalyticsPage } from '../pages/analytics/LabourAnalyticsPage';
import { ProcurementAnalyticsPage } from '../pages/analytics/ProcurementAnalyticsPage';
import { SiteAnalyticsPage } from '../pages/analytics/SiteAnalyticsPage';
import { CostAnalyticsPage } from '../pages/analytics/CostAnalyticsPage';
import { NotificationsPage } from '../pages/notifications/NotificationsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public / Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPasswordPage />
            </PublicOnlyRoute>
          }
        />
      </Route>

      {/* Main Application Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Projects */}
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/tasks" element={<TasksPage />} />
        <Route path="/projects/timeline" element={<TimelinePage />} />
        <Route path="/projects/progress" element={<ProgressPage />} />
        <Route path="/projects/:projectId/edit" element={<ProjectEditPage />} />
        <Route path="/projects/:id/edit" element={<ProjectEditPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />

        {/* Materials */}
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/materials/inventory" element={<InventoryPage />} />
        <Route path="/materials/requests" element={<RequestsPage />} />
        <Route path="/materials/movements" element={<MovementsPage />} />
        <Route path="/materials/purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="/materials/grn" element={<GRNPage />} />
        <Route path="/materials/consumption" element={<ConsumptionPage />} />
        <Route path="/materials/wastage" element={<WastagePage />} />
        <Route path="/materials/:materialId" element={<MaterialDetailPage />} />

        {/* Labour */}
        <Route path="/labour" element={<LabourPage />} />
        <Route path="/labour/workers" element={<WorkersPage />} />
        <Route path="/labour/workers/:workerId" element={<WorkerDetailPage />} />
        <Route path="/labour/attendance" element={<AttendancePage />} />
        <Route path="/labour/allocation" element={<AllocationPage />} />
        <Route path="/labour/shifts" element={<AllocationPage />} />
        <Route path="/labour/productivity" element={<ProductivityPage />} />
        <Route path="/labour/costs" element={<WagesPage />} />
        <Route path="/labour/wages" element={<WagesPage />} />

        {/* Suppliers */}
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/suppliers/performance" element={<SuppliersPage />} />
        <Route path="/suppliers/:supplierId" element={<SupplierDetailPage />} />

        {/* Procurement */}
        <Route path="/procurement" element={<ProcurementPage />} />
        <Route path="/procurement/requests" element={<PurchaseRequestsPage />} />
        <Route path="/procurement/orders" element={<PurchaseOrdersPage />} />
        <Route path="/procurement/deliveries" element={<DeliveriesPage />} />
        <Route path="/procurement/grn" element={<GRNPage />} />
        <Route path="/procurement/history" element={<ProcurementHistoryPage />} />

        {/* Site Operations */}
        <Route path="/site" element={<SiteOperationsPage />} />
        <Route path="/site/daily-report" element={<DailyReportPage />} />
        <Route path="/site/daily-reports" element={<DailyReportPage />} />
        <Route path="/site/work-progress" element={<WorkProgressPage />} />
        <Route path="/site/issues" element={<SiteIssuesPage />} />
        <Route path="/site/safety" element={<SafetyPage />} />
        <Route path="/site/inspections" element={<SafetyPage />} />
        <Route path="/site/activity" element={<SiteActivityPage />} />
        <Route path="/site/evidence" element={<SiteEvidencePage />} />
        <Route path="/site/photos" element={<SiteEvidencePage />} />

        {/* Intelligence */}
        <Route path="/intelligence" element={<IntelligenceOverviewPage />} />
        <Route path="/intelligence/overview" element={<IntelligenceOverviewPage />} />
        <Route path="/intelligence/risk-radar" element={<RiskRadarPage />} />
        <Route path="/intelligence/risk" element={<RiskRadarPage />} />
        <Route path="/intelligence/readiness" element={<ReadinessPage />} />
        <Route path="/intelligence/insights" element={<InsightsPage />} />
        <Route path="/intelligence/predictions" element={<PredictionsCommandCenter />} />
        <Route path="/intelligence/recommendations" element={<RecommendationsPage />} />
        <Route path="/intelligence/assistant" element={<AIAssistantPage />} />

        {/* Predictive Intelligence Phase 9 Routes */}
        <Route path="/predictions" element={<PredictionsCommandCenter />} />
        <Route path="/predictions/overview" element={<PredictionsCommandCenter />} />
        <Route path="/predictions/material-demand" element={<MaterialDemandPage />} />
        <Route path="/predictions/material-shortage" element={<MaterialShortagePage />} />
        <Route path="/predictions/labour-requirement" element={<LabourRequirementPage />} />
        <Route path="/predictions/schedule-delay" element={<ScheduleDelayPage />} />
        <Route path="/predictions/procurement-delay" element={<ProcurementDelayPage />} />
        <Route path="/predictions/cost-forecast" element={<CostForecastPage />} />
        <Route path="/predictions/readiness" element={<ReadinessForecastPage />} />
        <Route path="/predictions/history" element={<PredictionHistoryPage />} />
        <Route path="/predictions/model-readiness" element={<ModelReadinessPage />} />

        {/* Analytics */}
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/analytics/overview" element={<AnalyticsPage />} />
        <Route path="/analytics/projects" element={<ProjectAnalyticsPage />} />
        <Route path="/analytics/materials" element={<MaterialAnalyticsPage />} />
        <Route path="/analytics/labour" element={<LabourAnalyticsPage />} />
        <Route path="/analytics/procurement" element={<ProcurementAnalyticsPage />} />
        <Route path="/analytics/site" element={<SiteAnalyticsPage />} />
        <Route path="/analytics/costs" element={<CostAnalyticsPage />} />

        {/* Notifications & Settings */}
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};
