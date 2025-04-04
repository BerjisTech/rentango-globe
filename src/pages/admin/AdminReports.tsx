
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Calendar, Download, Filter, Info 
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from "recharts";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Booking } from "@/types/admin";

type TimeRange = "week" | "month" | "year";

const AdminReports = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  
  // Fetch bookings from Supabase
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["reports-bookings", timeRange],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*");
        
        if (error) {
          toast({
            title: "Error fetching booking data",
            description: error.message,
            variant: "destructive"
          });
          return [];
        }
        
        return data as Booking[];
      } catch (error: any) {
        toast({
          title: "Error fetching booking data",
          description: error.message || "An unexpected error occurred",
          variant: "destructive"
        });
        return [];
      }
    }
  });

  // Sample revenue data that would usually be calculated from bookings
  const revenueData = [
    { name: "Jan", properties: 4000, vehicles: 2400 },
    { name: "Feb", properties: 3000, vehicles: 1398 },
    { name: "Mar", properties: 2000, vehicles: 9800 },
    { name: "Apr", properties: 2780, vehicles: 3908 },
    { name: "May", properties: 1890, vehicles: 4800 },
    { name: "Jun", properties: 2390, vehicles: 3800 },
    { name: "Jul", properties: 3490, vehicles: 4300 },
  ];

  // Sample booking distribution data
  const bookingDistributionData = [
    { name: "Properties", value: 60 },
    { name: "Vehicles", value: 40 }
  ];

  // Sample user growth data
  const userGrowthData = [
    { name: "Jan", users: 400 },
    { name: "Feb", users: 600 },
    { name: "Mar", users: 800 },
    { name: "Apr", users: 1000 },
    { name: "May", users: 1200 },
    { name: "Jun", users: 1500 },
    { name: "Jul", users: 2000 },
  ];

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Function to handle time range change with type safety
  const handleTimeRangeChange = (value: string) => {
    // Ensure the value is a valid TimeRange
    if (value === "week" || value === "month" || value === "year") {
      setTimeRange(value);
    }
  };

  // Function to download reports - in a real app, this would generate actual reports
  const handleDownloadReport = () => {
    toast({
      title: "Report Download Started",
      description: "Your report is being generated and will download shortly."
    });
    // Actual download logic would go here
  };

  return (
    <AdminLayout activeTab="reports">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <div className="flex space-x-2">
            <Select onValueChange={handleTimeRangeChange} value={timeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">
              <BarChart3 className="mr-2 h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="bookings">
              <Calendar className="mr-2 h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="users">
              <LineChartIcon className="mr-2 h-4 w-4" />
              User Growth
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Total revenue generated from properties and vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="properties" fill="#8884d8" name="Properties" />
                    <Bar dataKey="vehicles" fill="#82ca9d" name="Vehicles" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Distribution of revenue between properties and vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bookingDistributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {bookingDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>Number of bookings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="properties" stroke="#8884d8" name="Properties Bookings" />
                    <Line type="monotone" dataKey="vehicles" stroke="#82ca9d" name="Vehicles Bookings" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Number of new users over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" name="New Users" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
