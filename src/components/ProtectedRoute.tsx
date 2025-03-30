
import { Navigate, Outlet } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectTo = "/login"
}) => {
  const { user, roles, isLoading, refreshProfile } = useAuth();
  const [bypassForSuperUser, setBypassForSuperUser] = useState(false);

  // Special check for specific email user
  useEffect(() => {
    if (user?.email === "bo.kouru@gmail.com" && !roles.includes("superadmin")) {
      setBypassForSuperUser(true);
      // Refresh the profile to get updated roles
      refreshProfile().then(() => {
        if (!roles.includes("superadmin")) {
          toast.info("Granting admin access...");
          
          // Call our edge function to grant superadmin access
          fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/make-superadmin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            }
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              toast.success("Admin access granted! Refreshing your profile...");
              // Refresh the profile again to get the updated roles
              setTimeout(() => refreshProfile(), 1000);
            } else {
              toast.error("Could not grant admin access automatically");
              console.error("Error granting admin access:", data.error);
            }
          })
          .catch(error => {
            console.error("Error calling edge function:", error);
            toast.error("Error granting admin access. Please try again later.");
          });
        }
      });
    }
  }, [user, roles, refreshProfile]);

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

  // Special bypass for bo.kouru@gmail.com during setup phase
  if (user.email === "bo.kouru@gmail.com" && bypassForSuperUser) {
    return <Outlet />;
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
