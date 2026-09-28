import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { RoleProvider } from './hooks/useRole';
import { ToastProvider } from './hooks/useToast';
import { ProjectProvider } from './hooks/useProjects';
import { MaterialProvider } from './hooks/useMaterials';
import { LabourProvider } from './hooks/useLabour';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoleProvider>
          <ToastProvider>
            <ProjectProvider>
              <MaterialProvider>
                <LabourProvider>
                  <AppRoutes />
                </LabourProvider>
              </MaterialProvider>
            </ProjectProvider>
          </ToastProvider>
        </RoleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

