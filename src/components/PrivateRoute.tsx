import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  if (loading) return <div className="text-center mt-10">Загрузка...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}; 