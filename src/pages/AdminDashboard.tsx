
import { useState } from "react";
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
  DollarSign
} from "lucide-react";
import { Input } from "@/components/ui/input";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6 flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white mr-3">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Manage all platform activities and users</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Admin Panel</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <button 
                    className={`flex items-center gap-3 p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "overview" ? "bg-primary/5 border-l-4 border-primary font-medium" : ""}`}
                    onClick={() => setActiveTab("overview")}
                  >
                    <BarChart className="h-5 w-5" />
                    <span>Dashboard</span>
                  </button>
                  <button 
                    className={`flex items-center gap-3 p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "users" ? "bg-primary/5 border-l-4 border-primary font-medium" : ""}`}
                    onClick={() => setActiveTab("users")}
                  >
                    <Users className="h-5 w-5" />
                    <span>Users</span>
                  </button>
                  <button 
                    className={`flex items-center gap-3 p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "properties" ? "bg-primary/5 border-l-4 border-primary font-medium" : ""}`}
                    onClick={() => setActiveTab("properties")}
                  >
                    <House className="h-5 w-5" />
                    <span>Properties</span>
                  </button>
                  <button 
                    className={`flex items-center gap-3 p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "transportation" ? "bg-primary/5 border-l-4 border-primary font-medium" : ""}`}
                    onClick={() => setActiveTab("transportation")}
                  >
                    <Car className="h-5 w-5" />
                    <span>Transportation</span>
                  </button>
                  <button 
                    className={`flex items-center gap-3 p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "bookings" ? "bg-primary/5 border-l-4 border-primary font-medium" : ""}`}
                    onClick={() => setActiveTab("bookings")}
                  >
                    <DollarSign className="h-5 w-5" />
                    <span>Bookings & Payments</span>
                  </button>
                  <button 
                    className={`flex items-center gap-3 p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "reports" ? "bg-primary/5 border-l-4 border-primary font-medium" : ""}`}
                    onClick={() => setActiveTab("reports")}
                  >
                    <AlertTriangle className="h-5 w-5" />
                    <span>Reports</span>
                  </button>
                  <button 
                    className={`flex items-center gap-3 p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "settings" ? "bg-primary/5 border-l-4 border-primary font-medium" : ""}`}
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-4">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-primary mr-2" />
                        <div className="text-2xl font-bold">1,248</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Properties Listed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <House className="h-5 w-5 text-primary mr-2" />
                        <div className="text-2xl font-bold">542</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Vehicles Listed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Car className="h-5 w-5 text-primary mr-2" />
                        <div className="text-2xl font-bold">178</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-primary mr-2" />
                        <div className="text-2xl font-bold">Ksh 9.4M</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="bg-white">
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
                            <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs">
                              Pending Approval
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Review</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">2023-06-15 09:45 AM</TableCell>
                          <TableCell>Booking Completed</TableCell>
                          <TableCell>Jane Smith</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              Completed
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">2023-06-15 09:15 AM</TableCell>
                          <TableCell>User Reported Issue</TableCell>
                          <TableCell>Mark Wilson</TableCell>
                          <TableCell>
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                              Requires Action
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Resolve</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">2023-06-15 08:30 AM</TableCell>
                          <TableCell>New User Registration</TableCell>
                          <TableCell>Sarah Johnson</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              Verified
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle>System Alerts</CardTitle>
                    <CardDescription>
                      Important notifications that require attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex items-start">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">5 properties require verification</p>
                          <p className="text-sm text-gray-600">Recently uploaded properties need review before being listed</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          Review
                        </Button>
                      </div>
                      
                      <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">3 reported issues need attention</p>
                          <p className="text-sm text-gray-600">Users have reported issues with bookings that require immediate action</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">User Management</h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search users..."
                        className="pl-8 w-64"
                      />
                    </div>
                    <Button>Add User</Button>
                  </div>
                </div>
                
                <Card>
                  <CardContent className="p-0">
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
                          <TableCell>Property Owner</TableCell>
                          <TableCell>5</TableCell>
                          <TableCell>2</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              Active
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Manage</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Jane Smith</TableCell>
                          <TableCell>jane.smith@example.com</TableCell>
                          <TableCell>User</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              Active
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Manage</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Sam Johnson</TableCell>
                          <TableCell>sam.johnson@example.com</TableCell>
                          <TableCell>Admin</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              Active
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Manage</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Mark Wilson</TableCell>
                          <TableCell>mark.wilson@example.com</TableCell>
                          <TableCell>Property Owner</TableCell>
                          <TableCell>3</TableCell>
                          <TableCell>1</TableCell>
                          <TableCell>
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                              Suspended
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Manage</Button>
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
