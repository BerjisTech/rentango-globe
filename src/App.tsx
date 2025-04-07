
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Transportation from "./pages/Transportation";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminTransportation from "./pages/admin/AdminTransportation";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/transportation" element={<Transportation />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes - requires any authenticated user */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            
            {/* Routes that require specific roles */}
            <Route element={<ProtectedRoute allowedRoles={["owner", "admin", "superadmin"]} />}>
              <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-dashboard/properties" element={<AdminProperties />} />
              <Route path="/admin-dashboard/transportation" element={<AdminTransportation />} />
              <Route path="/admin-dashboard/bookings" element={<AdminBookings />} />
              <Route path="/admin-dashboard/reports" element={<AdminReports />} />
              <Route path="/admin-dashboard/settings" element={<AdminSettings />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
