import type { ReactNode } from 'react';
import { PrivateRoute } from './PrivateRoute';
import { DashboardLayout } from './DashboardLayout';

interface ProtectedRouteLayoutProps {
  children: ReactNode;
}

export const ProtectedRouteLayout = ({ children }: ProtectedRouteLayoutProps) => {
  return (
    <PrivateRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </PrivateRoute>
  );
}; 