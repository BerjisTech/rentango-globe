
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Car, 
  Shield, 
  Settings,
  ChevronLeft,
  Menu,
  LayoutDashboard,
  Database,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

type AdminLayoutProps = {
  children: React.ReactNode;
  activeTab?: string;
};

const AdminLayout = ({ children, activeTab = "overview" }: AdminLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Define the sidebar menu items with proper icons and routes
  const sidebarItems = [
    { id: "overview", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", path: "/admin-dashboard" },
    { id: "properties", icon: <Database className="h-5 w-5" />, label: "Properties", path: "/admin-dashboard/properties" },
    { id: "transportation", icon: <Car className="h-5 w-5" />, label: "Transportation", path: "/admin-dashboard/transportation" },
    { id: "bookings", icon: <CreditCard className="h-5 w-5" />, label: "Bookings & Payments", path: "/admin-dashboard/bookings" },
    { id: "reports", icon: <BarChart className="h-5 w-5" />, label: "Reports", path: "/admin-dashboard/reports" },
    { id: "settings", icon: <Settings className="h-5 w-5" />, label: "Settings", path: "/admin-dashboard/settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mr-3">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage all platform activities and users</p>
            </div>
          </div>
          <Button variant="outline" className="hidden md:flex rounded-full" onClick={toggleSidebar}>
            {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span className="ml-2">{sidebarCollapsed ? "Expand" : "Collapse"} Sidebar</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Improved Sidebar with collapsible functionality */}
          <div className={cn(
            "lg:block col-span-1 transition-all duration-300",
            sidebarCollapsed ? "lg:w-16" : "lg:w-full"
          )}>
            <Card className="glass-card border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {!sidebarCollapsed && <CardTitle className="text-lg">Admin Panel</CardTitle>}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`flex items-center gap-3 p-4 text-left hover:bg-primary/5 transition-colors rounded-lg ${activeTab === item.id ? "bg-primary/10 font-medium text-primary" : ""}`}
                    >
                      {item.icon}
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </Link>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className={cn(
            "transition-all duration-300",
            sidebarCollapsed ? "lg:col-span-4" : "lg:col-span-4"
          )}>
            {children}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminLayout;
