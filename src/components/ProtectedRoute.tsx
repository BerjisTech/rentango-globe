
import { Navigate, Outlet } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectTo = "/login"
}) => {
  const { user, roles, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} />;
  }

  // If specific roles are required, check if user has at least one of them
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = roles.some(role => allowedRoles.includes(role));
    
    if (!hasRequiredRole) {
      return <Navigate to="/" />;
    }
  }

  // User is authenticated and has required role, render the outlet
  return <Outlet />;
};

export default ProtectedRoute;
