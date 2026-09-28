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
import { RequestsPage } from '../pages/materials/RequestsPage';
import { PurchaseOrdersPage } from '../pages/materials/PurchaseOrdersPage';
import { GRNPage } from '../pages/materials/GRNPage';
import { ConsumptionPage } from '../pages/materials/ConsumptionPage';
import { WastagePage } from '../pages/materials/WastagePage';

// Labour
import { LabourPage } from '../pages/labour/LabourPage';
import { AttendancePage } from '../pages/labour/AttendancePage';
import { ShiftsPage } from '../pages/labour/ShiftsPage';
import { WagesPage } from '../pages/labour/WagesPage';
import { ProductivityPage } from '../pages/labour/ProductivityPage';

// Suppliers
import { SuppliersPage } from '../pages/suppliers/SuppliersPage';

// Site Operations
import { DailyReportsPage } from '../pages/site/DailyReportsPage';
import { IssuesPage } from '../pages/site/IssuesPage';
import { PhotosPage } from '../pages/site/PhotosPage';
import { InspectionsPage } from '../pages/site/InspectionsPage';

// Intelligence
import { IntelligenceOverviewPage } from '../pages/intelligence/IntelligenceOverviewPage';
import { PredictionsPage } from '../pages/intelligence/PredictionsPage';
import { RiskRadarPage } from '../pages/intelligence/RiskRadarPage';
import { RecommendationsPage } from '../pages/intelligence/RecommendationsPage';
import { AIAssistantPage } from '../pages/intelligence/AIAssistantPage';

// Analytics, Notifications, Settings
import { AnalyticsPage } from '../pages/analytics/AnalyticsPage';
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
        <Route path="/materials/requests" element={<RequestsPage />} />
        <Route path="/materials/purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="/materials/grn" element={<GRNPage />} />
        <Route path="/materials/consumption" element={<ConsumptionPage />} />
        <Route path="/materials/wastage" element={<WastagePage />} />

        {/* Labour */}
        <Route path="/labour" element={<LabourPage />} />
        <Route path="/labour/attendance" element={<AttendancePage />} />
        <Route path="/labour/shifts" element={<ShiftsPage />} />
        <Route path="/labour/wages" element={<WagesPage />} />
        <Route path="/labour/productivity" element={<ProductivityPage />} />

        {/* Suppliers */}
        <Route path="/suppliers" element={<SuppliersPage />} />

        {/* Site Operations */}
        <Route path="/site/daily-reports" element={<DailyReportsPage />} />
        <Route path="/site/issues" element={<IssuesPage />} />
        <Route path="/site/photos" element={<PhotosPage />} />
        <Route path="/site/inspections" element={<InspectionsPage />} />

        {/* Intelligence */}
        <Route path="/intelligence" element={<IntelligenceOverviewPage />} />
        <Route path="/intelligence/predictions" element={<PredictionsPage />} />
        <Route path="/intelligence/risk" element={<RiskRadarPage />} />
        <Route path="/intelligence/recommendations" element={<RecommendationsPage />} />
        <Route path="/intelligence/assistant" element={<AIAssistantPage />} />

        {/* Analytics, Notifications, Settings */}
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};
