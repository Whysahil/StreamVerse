import { Navigate, Outlet } from 'react-router-dom';
import { useProfileStore } from '@/store/useProfileStore';

export function ProfileRoute() {
  const { currentProfile } = useProfileStore();

  return currentProfile ? <Outlet /> : <Navigate to="/profiles" replace />;
}
