import { useState } from "react";
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
  Database 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-primary/10 text-primary mr-3">
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="text-2xl font-bold">1,248</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Properties Listed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-primary/10 text-primary mr-3">
                          <House className="h-5 w-5" />
                        </div>
                        <div className="text-2xl font-bold">542</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Vehicles Listed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-primary/10 text-primary mr-3">
                          <Car className="h-5 w-5" />
                        </div>
                        <div className="text-2xl font-bold">178</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-primary/10 text-primary mr-3">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div className="text-2xl font-bold">Ksh 9.4M</div>
                      </div>
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
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">2023-06-15 10:24 AM</TableCell>
                          <TableCell>New Property Listed</TableCell>
                          <TableCell>John Doe</TableCell>
                          <TableCell>
                            <span className="tag bg-amber-100 text-amber-700">
                              Pending Approval
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="rounded-full">Review</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">2023-06-15 09:45 AM</TableCell>
                          <TableCell>Booking Completed</TableCell>
                          <TableCell>Jane Smith</TableCell>
                          <TableCell>
                            <span className="tag bg-green-100 text-green-700">
                              Completed
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="rounded-full">View</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">2023-06-15 09:15 AM</TableCell>
                          <TableCell>User Reported Issue</TableCell>
                          <TableCell>Mark Wilson</TableCell>
                          <TableCell>
                            <span className="tag bg-red-100 text-red-700">
                              Requires Action
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="rounded-full">Resolve</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">2023-06-15 08:30 AM</TableCell>
                          <TableCell>New User Registration</TableCell>
                          <TableCell>Sarah Johnson</TableCell>
                          <TableCell>
                            <span className="tag bg-green-100 text-green-700">
                              Verified
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="rounded-full">View</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
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
                    <div className="space-y-4">
                      <div className="glass-card rounded-xl p-4 flex items-start border-l-4 border-yellow-400">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">5 properties require verification</p>
                          <p className="text-sm text-gray-600">Recently uploaded properties need review before being listed</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto rounded-full">
                          Review
                        </Button>
                      </div>
                      
                      <div className="glass-card rounded-xl p-4 flex items-start border-l-4 border-red-400">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">3 reported issues need attention</p>
                          <p className="text-sm text-gray-600">Users have reported issues with bookings that require immediate action</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto rounded-full">
                          Resolve
                        </Button>
                      </div>
                    </div>
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
                    <Button className="rounded-full">Add User</Button>
                  </div>
                </div>
                
                <Card className="glass-card border-0 shadow-lg">
                  <CardContent className="p-0 overflow-hidden">
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
                        <TableRow>
                          <TableCell className="font-medium">John Doe</TableCell>
                          <TableCell>john.doe@example.com</TableCell>
                          <TableCell>
                            <span className="tag">Property Owner</span>
                          </TableCell>
                          <TableCell>5</TableCell>
                          <TableCell>2</TableCell>
                          <TableCell>
                            <span className="tag bg-green-100 text-green-700">
                              Active
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="rounded-full">Manage</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Jane Smith</TableCell>
                          <TableCell>jane.smith@example.com</TableCell>
                          <TableCell>
                            <span className="tag">User</span>
                          </TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>
                            <span className="tag bg-green-100 text-green-700">
                              Active
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="rounded-full">Manage</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Sam Johnson</TableCell>
                          <TableCell>sam.johnson@example.com</TableCell>
                          <TableCell>
                            <span className="tag">Admin</span>
                          </TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>
                            <span className="tag bg-green-100 text-green-700">
                              Active
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="rounded-full">Manage</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Mark Wilson</TableCell>
                          <TableCell>mark.wilson@example.com</TableCell>
                          <TableCell>
                            <span className="tag">Property Owner</span>
                          </TableCell>
                          <TableCell>3</TableCell>
                          <TableCell>1</TableCell>
                          <TableCell>
                            <span className="tag bg-gray-100 text-gray-700">
                              Suspended
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="rounded-full">Manage</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Add other tab contents as needed */}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
