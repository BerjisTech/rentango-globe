
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  House, 
  Car, 
  Users, 
  User, 
  Shield, 
  MessageSquare, 
  Settings,
  Search,
  AlertTriangle,
  DollarSign,
  ChevronLeft,
  Menu,
  LayoutDashboard,
  Flag,
  CreditCard,
  Database,
  Loader2 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RecentActivities } from "@/components/admin/RecentActivities";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const sidebarItems = [
    { id: "overview", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", path: "/admin-dashboard" },
    { id: "users", icon: <Users className="h-5 w-5" />, label: "Users", path: "/admin-dashboard" },
    { id: "properties", icon: <Database className="h-5 w-5" />, label: "Properties", path: "/admin-dashboard/properties" },
    { id: "transportation", icon: <Car className="h-5 w-5" />, label: "Transportation", path: "/admin-dashboard/transportation" },
    { id: "bookings", icon: <CreditCard className="h-5 w-5" />, label: "Bookings & Payments", path: "/admin-dashboard/bookings" },
    { id: "reports", icon: <BarChart className="h-5 w-5" />, label: "Reports", path: "/admin-dashboard/reports" },
    { id: "settings", icon: <Settings className="h-5 w-5" />, label: "Settings", path: "/admin-dashboard/settings" },
  ];

  const { data: statsData, isLoading: loadingStats } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      try {
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });
        
        if (usersError) throw usersError;
        
        const { count: propertiesCount, error: propertiesError } = await supabase
          .from('properties')
          .select('id', { count: 'exact', head: true });
        
        if (propertiesError) throw propertiesError;
        
        const { count: vehiclesCount, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('id', { count: 'exact', head: true });
        
        if (vehiclesError) throw vehiclesError;
        
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('total_amount');
        
        if (bookingsError) throw bookingsError;
        
        // Convert total_amount to number before summing
        const totalRevenue = bookingsData.reduce((sum, booking) => {
          return sum + (Number(booking.total_amount) || 0);
        }, 0);
        
        return {
          usersCount: usersCount || 0,
          propertiesCount: propertiesCount || 0,
          vehiclesCount: vehiclesCount || 0,
          totalRevenue: totalRevenue || 0
        };
      } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
        toast({
          variant: "destructive",
          title: "Error loading dashboard statistics",
          description: "Could not fetch dashboard statistics. Please try again later."
        });
        return {
          usersCount: 0,
          propertiesCount: 0,
          vehiclesCount: 0,
          totalRevenue: 0
        };
      }
    }
  });

  const { data: systemAlerts, isLoading: loadingAlerts } = useQuery({
    queryKey: ['admin-dashboard-alerts'],
    queryFn: async () => {
      try {
        const { data: pendingProperties, error: propertiesError } = await supabase
          .from('properties')
          .select('id')
          .eq('status', 'pending_approval');
        
        if (propertiesError) throw propertiesError;
        
        const { data: unresolvedBookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('id')
          .eq('payment_status', 'requires_action');
        
        if (bookingsError) throw bookingsError;
        
        return {
          pendingPropertiesCount: pendingProperties?.length || 0,
          unresolvedBookingsCount: unresolvedBookings?.length || 0
        };
      } catch (error) {
        console.error('Error fetching system alerts:', error);
        toast({
          variant: "destructive",
          title: "Error loading system alerts",
          description: "Could not fetch system alerts. Please try again later."
        });
        return {
          pendingPropertiesCount: 0,
          unresolvedBookingsCount: 0
        };
      }
    }
  });

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-dashboard-users'],
    queryFn: async () => {
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url');
        
        if (profilesError) throw profilesError;
        
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');
        
        if (rolesError) throw rolesError;
        
        // Get properties and vehicles, but don't try to access owner_id since it doesn't exist
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select('id');
        
        if (propertiesError) throw propertiesError;
        
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('id');
        
        if (vehiclesError) throw vehiclesError;
        
        // Since we don't have owner relationships in the database, we'll just show
        // zero counts for properties and vehicles owned
        const combinedUsers = profilesData.map(profile => {
          const userRoles = rolesData.filter(r => r.user_id === profile.id).map(r => r.role);
          
          return {
            id: profile.id,
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User',
            email: 'user@example.com',
            role: userRoles.length > 0 ? userRoles[0] : 'user',
            properties: 0, // No owner_id relationship
            vehicles: 0,   // No owner_id relationship
            status: 'active'
          };
        });
        
        return combinedUsers;
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          variant: "destructive",
          title: "Error loading users",
          description: "Could not fetch user data. Please try again later."
        });
        return [];
      }
    },
    enabled: activeTab === "users"
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

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
                      onClick={() => setActiveTab(item.id)}
                    >
                      {item.icon}
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </Link>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>
          
          <div className={cn(
            "transition-all duration-300",
            sidebarCollapsed ? "lg:col-span-4" : "lg:col-span-4"
          )}>
            {activeTab === "overview" && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="glass-card border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingStats ? (
                        <div className="flex items-center">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-3" />
                          <span className="text-muted-foreground">Loading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-primary/10 text-primary mr-3">
                            <Users className="h-5 w-5" />
                          </div>
                          <div className="text-2xl font-bold">{statsData?.usersCount || 0}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Properties Listed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingStats ? (
                        <div className="flex items-center">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-3" />
                          <span className="text-muted-foreground">Loading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-primary/10 text-primary mr-3">
                            <House className="h-5 w-5" />
                          </div>
                          <div className="text-2xl font-bold">{statsData?.propertiesCount || 0}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Vehicles Listed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingStats ? (
                        <div className="flex items-center">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-3" />
                          <span className="text-muted-foreground">Loading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-primary/10 text-primary mr-3">
                            <Car className="h-5 w-5" />
                          </div>
                          <div className="text-2xl font-bold">{statsData?.vehiclesCount || 0}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingStats ? (
                        <div className="flex items-center">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-3" />
                          <span className="text-muted-foreground">Loading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-primary/10 text-primary mr-3">
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <div className="text-2xl font-bold">{formatCurrency(statsData?.totalRevenue || 0)}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="glass-card border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>
                      Overview of the latest activities on the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentActivities />
                  </CardContent>
                </Card>
                
                <Card className="glass-card border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>System Alerts</CardTitle>
                    <CardDescription>
                      Important notifications that require attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingAlerts ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {systemAlerts?.pendingPropertiesCount > 0 && (
                          <div className="glass-card rounded-xl p-4 flex items-start border-l-4 border-yellow-400">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                            <div>
                              <p className="font-medium">{systemAlerts.pendingPropertiesCount} properties require verification</p>
                              <p className="text-sm text-gray-600">Recently uploaded properties need review before being listed</p>
                            </div>
                            <Link to="/admin-dashboard/properties">
                              <Button variant="outline" size="sm" className="ml-auto rounded-full">
                                Review
                              </Button>
                            </Link>
                          </div>
                        )}
                        
                        {systemAlerts?.unresolvedBookingsCount > 0 && (
                          <div className="glass-card rounded-xl p-4 flex items-start border-l-4 border-red-400">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                            <div>
                              <p className="font-medium">{systemAlerts.unresolvedBookingsCount} reported issues need attention</p>
                              <p className="text-sm text-gray-600">Users have reported issues with bookings that require immediate action</p>
                            </div>
                            <Link to="/admin-dashboard/bookings">
                              <Button variant="outline" size="sm" className="ml-auto rounded-full">
                                Resolve
                              </Button>
                            </Link>
                          </div>
                        )}
                        
                        {systemAlerts?.pendingPropertiesCount === 0 && systemAlerts?.unresolvedBookingsCount === 0 && (
                          <div className="glass-card rounded-xl p-4 flex items-start border-l-4 border-green-400">
                            <div className="p-1 rounded-full bg-green-100 text-green-600 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">All systems normal</p>
                              <p className="text-sm text-gray-600">No alerts requiring attention at the moment</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === "users" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">User Management</h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search users..."
                        className="pl-10 w-64 rounded-full"
                      />
                    </div>
                    <Link to="/admin-dashboard/settings">
                      <Button className="rounded-full">Add User</Button>
                    </Link>
                  </div>
                </div>
                
                <Card className="glass-card border-0 shadow-lg">
                  <CardContent className="p-0 overflow-hidden">
                    {loadingUsers ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Properties</TableHead>
                            <TableHead>Vehicles</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users && users.length > 0 ? (
                            users.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <span className="tag bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                    {user.role === 'owner' ? 'Property Owner' : 
                                     user.role === 'admin' ? 'Admin' : 
                                     user.role === 'superadmin' ? 'Super Admin' : 'User'}
                                  </span>
                                </TableCell>
                                <TableCell>{user.properties}</TableCell>
                                <TableCell>{user.vehicles}</TableCell>
                                <TableCell>
                                  <span className="tag bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                    {user.status}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm" className="rounded-full">Manage</Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8">
                                No users found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Keep other tab contents as they are */}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
