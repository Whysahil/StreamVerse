import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export function PrivateRoute() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-dark flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-netflix" />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
