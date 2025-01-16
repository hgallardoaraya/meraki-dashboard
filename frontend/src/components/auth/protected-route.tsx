import { AuthState } from '@/auth/authSlice';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[];  
  children: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const {role, isLoggedIn} = useSelector((state: { auth: AuthState }) => state.auth);  

  if(!isLoggedIn) {
    return <Navigate to="/login"/>
  }

  return allowedRoles.includes(role) ? (
    children
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default ProtectedRoute;
