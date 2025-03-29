
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
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
  House, 
  Car, 
  User, 
  BarChart, 
  Calendar, 
  Clock, 
  Plus,
  MessageSquare,
  Settings
} from "lucide-react";

const OwnerDashboard = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const defaultTab = params.get("tab") || "overview";
  
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-2">Owner Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage your properties, vehicles, and bookings</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-6 flex flex-col items-center text-center border-b">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <h2 className="font-semibold text-xl">John Doe</h2>
                <p className="text-gray-500">Property Owner</p>
              </div>
              
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <button 
                    className={`flex items-center gap-3 p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "overview" ? "bg-primary/5 border-l-4 border-primary font-medium" : ""}`}
                    onClick={() => setActiveTab("overview")}
                  >
                    <BarChart className="h-5 w-5" />
                    <span>Overview</span>
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
                    <Calendar className="h-5 w-5" />
                    <span>Bookings</span>
                  </button>
                  <button 
                    className={`flex items-center gap-3 p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "staff" ? "bg-primary/5 border-l-4 border-primary font-medium" : ""}`}
                    onClick={() => setActiveTab("staff")}
                  >
                    <User className="h-5 w-5" />
                    <span>Staff</span>
                  </button>
                  <button 
                    className={`flex items-center gap-3 p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "messages" ? "bg-primary/5 border-l-4 border-primary font-medium" : ""}`}
                    onClick={() => setActiveTab("messages")}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
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
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <House className="h-5 w-5 text-primary mr-2" />
                        <div className="text-2xl font-bold">5</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Car className="h-5 w-5 text-primary mr-2" />
                        <div className="text-2xl font-bold">3</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-primary mr-2" />
                        <div className="text-2xl font-bold">8</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>
                      Overview of your latest property and vehicle bookings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">B12345</TableCell>
                          <TableCell className="flex items-center gap-1">
                            <House className="h-4 w-4" /> Property
                          </TableCell>
                          <TableCell>Luxury Beach Villa</TableCell>
                          <TableCell>Jane Smith</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              Confirmed
                            </span>
                          </TableCell>
                          <TableCell>Ksh 45,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">B12346</TableCell>
                          <TableCell className="flex items-center gap-1">
                            <Car className="h-4 w-4" /> Vehicle
                          </TableCell>
                          <TableCell>Safari Land Cruiser</TableCell>
                          <TableCell>John Brown</TableCell>
                          <TableCell>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                              In Progress
                            </span>
                          </TableCell>
                          <TableCell>Ksh 16,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">B12347</TableCell>
                          <TableCell className="flex items-center gap-1">
                            <House className="h-4 w-4" /> Property
                          </TableCell>
                          <TableCell>Modern Apartment</TableCell>
                          <TableCell>Sarah Johnson</TableCell>
                          <TableCell>
                            <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs">
                              Pending
                            </span>
                          </TableCell>
                          <TableCell>Ksh 35,000</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === "properties" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Your Properties</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Button>
                </div>
                
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All Properties</TabsTrigger>
                    <TabsTrigger value="short-term">Short Term</TabsTrigger>
                    <TabsTrigger value="long-term">Long Term</TabsTrigger>
                    <TabsTrigger value="for-sale">For Sale</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-6">
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Title</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Luxury Beach Villa</TableCell>
                              <TableCell>Short Term</TableCell>
                              <TableCell>Diani Beach, Mombasa</TableCell>
                              <TableCell>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                  Active
                                </span>
                              </TableCell>
                              <TableCell>Ksh 15,000/night</TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  Manage
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Modern Apartment</TableCell>
                              <TableCell>Long Term</TableCell>
                              <TableCell>Westlands, Nairobi</TableCell>
                              <TableCell>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                  Active
                                </span>
                              </TableCell>
                              <TableCell>Ksh 45,000/month</TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  Manage
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Spacious Family Home</TableCell>
                              <TableCell>For Sale</TableCell>
                              <TableCell>Karen, Nairobi</TableCell>
                              <TableCell>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                  Active
                                </span>
                              </TableCell>
                              <TableCell>Ksh 25,000,000</TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  Manage
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="short-term" className="mt-6">
                    {/* Similar table with only short-term properties */}
                  </TabsContent>
                  
                  <TabsContent value="long-term" className="mt-6">
                    {/* Similar table with only long-term properties */}
                  </TabsContent>
                  
                  <TabsContent value="for-sale" className="mt-6">
                    {/* Similar table with only for-sale properties */}
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {activeTab === "transportation" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Your Vehicles</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Toyota Fortuner SUV</TableCell>
                          <TableCell>Car</TableCell>
                          <TableCell>Nairobi</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              Available
                            </span>
                          </TableCell>
                          <TableCell>Ksh 7,000/day</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Airport Transfer Mercedes</TableCell>
                          <TableCell>Taxi</TableCell>
                          <TableCell>Mombasa</TableCell>
                          <TableCell>
                            <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs">
                              Booked
                            </span>
                          </TableCell>
                          <TableCell>Ksh 3,500/trip</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Safari Land Cruiser</TableCell>
                          <TableCell>Car</TableCell>
                          <TableCell>Nairobi</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              Available
                            </span>
                          </TableCell>
                          <TableCell>Ksh 8,000/day</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Bookings</h2>
                
                <Tabs defaultValue="upcoming">
                  <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="current">Current</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming" className="mt-6">
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Booking ID</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Dates</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">B12345</TableCell>
                              <TableCell>Property</TableCell>
                              <TableCell>Luxury Beach Villa</TableCell>
                              <TableCell>Jane Smith</TableCell>
                              <TableCell>June 15-20, 2023</TableCell>
                              <TableCell>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                  Confirmed
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  Details
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">B12346</TableCell>
                              <TableCell>Vehicle</TableCell>
                              <TableCell>Safari Land Cruiser</TableCell>
                              <TableCell>John Brown</TableCell>
                              <TableCell>June 22-25, 2023</TableCell>
                              <TableCell>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                  Confirmed
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="current" className="mt-6">
                    {/* Similar table for current bookings */}
                  </TabsContent>
                  
                  <TabsContent value="past" className="mt-6">
                    {/* Similar table for past bookings */}
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {activeTab === "staff" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Staff Management</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Assigned To</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Michael Ochieng</TableCell>
                          <TableCell>Property Manager</TableCell>
                          <TableCell>Luxury Beach Villa</TableCell>
                          <TableCell>+254 7XX XXX XXX</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              Active
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">David Kamau</TableCell>
                          <TableCell>Driver</TableCell>
                          <TableCell>Safari Land Cruiser</TableCell>
                          <TableCell>+254 7XX XXX XXX</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              Active
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Sarah Wanjiku</TableCell>
                          <TableCell>Housekeeper</TableCell>
                          <TableCell>Modern Apartment</TableCell>
                          <TableCell>+254 7XX XXX XXX</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              Active
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
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

export default OwnerDashboard;
