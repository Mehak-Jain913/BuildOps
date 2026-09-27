import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RoleProvider } from './hooks/useRole';
import { ToastProvider } from './hooks/useToast';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </RoleProvider>
    </BrowserRouter>
  );
}
