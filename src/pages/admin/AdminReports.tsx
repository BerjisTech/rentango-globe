
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Calendar, Download, Filter, Info, Loader2 
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
type ReportData = {
  month: string;
  properties: number;
  vehicles: number;
};

type BookingDistribution = {
  name: string;
  value: number;
};

type MonthlyUserData = {
  name: string;
  users: number;
};

const AdminReports = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  
  // Fetch bookings from Supabase
  const { data: bookings, isLoading: loadingBookings } = useQuery({
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

  // Fetch property and vehicle counts
  const { data: propertiesVehiclesData, isLoading: loadingPropertiesVehicles } = useQuery({
    queryKey: ["reports-properties-vehicles", timeRange],
    queryFn: async () => {
      try {
        // Get properties count
        const { data: properties, error: propertiesError } = await supabase
          .from('properties')
          .select('created_at');
          
        if (propertiesError) throw propertiesError;
        
        // Get vehicles count
        const { data: vehicles, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('created_at');
          
        if (vehiclesError) throw vehiclesError;

        // Process data for charts
        const propertyMonths = processDataByMonth(properties || []);
        const vehicleMonths = processDataByMonth(vehicles || []);
        
        // Get list of all months from both datasets
        const allMonths = [...new Set([...Object.keys(propertyMonths), ...Object.keys(vehicleMonths)])].sort();
        
        // Create combined dataset for chart
        const revenueData: ReportData[] = allMonths.map(month => ({
          month,
          properties: propertyMonths[month] || 0,
          vehicles: vehicleMonths[month] || 0
        }));

        // For pie chart - total distribution
        const totalProperties = properties?.length || 0;
        const totalVehicles = vehicles?.length || 0;
        
        const bookingDistributionData: BookingDistribution[] = [
          { name: "Properties", value: totalProperties },
          { name: "Vehicles", value: totalVehicles }
        ];
        
        return { revenueData, bookingDistributionData };
      } catch (error: any) {
        toast({
          title: "Error fetching properties/vehicles data",
          description: error.message || "An unexpected error occurred",
          variant: "destructive"
        });
        
        return { 
          revenueData: [], 
          bookingDistributionData: [
            { name: "Properties", value: 0 },
            { name: "Vehicles", value: 0 }
          ]
        };
      }
    }
  });

  // Fetch user growth data
  const { data: userGrowthData, isLoading: loadingUserGrowth } = useQuery({
    queryKey: ["reports-user-growth", timeRange],
    queryFn: async () => {
      try {
        const { data: users, error } = await supabase
          .from('profiles')
          .select('created_at');
          
        if (error) throw error;
        
        // Process user data by month
        const userMonths = processDataByMonth(users || []);
        
        // Convert to array format for chart
        const monthlyUserData: MonthlyUserData[] = Object.entries(userMonths)
          .map(([month, count]) => ({ name: month, users: count }))
          .sort((a, b) => {
            // Sort by month
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return months.indexOf(a.name) - months.indexOf(b.name);
          });
          
        return monthlyUserData;
      } catch (error: any) {
        toast({
          title: "Error fetching user growth data",
          description: error.message || "An unexpected error occurred",
          variant: "destructive"
        });
        return [];
      }
    }
  });

  // Helper function to process data by month
  function processDataByMonth(data: any[]) {
    const months: Record<string, number> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    data.forEach(item => {
      if (item.created_at) {
        const date = new Date(item.created_at);
        const monthName = monthNames[date.getMonth()];
        months[monthName] = (months[monthName] || 0) + 1;
      }
    });
    
    return months;
  }

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Function to handle time range change with type safety
  const handleTimeRangeChange = (value: string) => {
    // Ensure the value is a valid TimeRange
    if (value === "week" || value === "month" || value === "year") {
      setTimeRange(value);
    }
  };

  // Function to download reports
  const handleDownloadReport = () => {
    // Generate the report data
    let reportData: string;
    let filename: string;
    
    // Based on the active tab
    const activeTab = document.querySelector('[role="tablist"] [data-state="active"]')?.getAttribute('value') || 'revenue';
    
    if (activeTab === 'revenue') {
      // Revenue report
      reportData = 'Month,Properties,Vehicles\n';
      propertiesVehiclesData?.revenueData.forEach(item => {
        reportData += `${item.month},${item.properties},${item.vehicles}\n`;
      });
      filename = 'revenue-report.csv';
    } else if (activeTab === 'bookings') {
      // Bookings report
      reportData = 'ID,Item Name,Start Date,End Date,Total Amount,Payment Status\n';
      bookings?.forEach(booking => {
        reportData += `${booking.id},${booking.item_name},${booking.start_date},${booking.end_date},${booking.total_amount},${booking.payment_status}\n`;
      });
      filename = 'bookings-report.csv';
    } else {
      // User growth report
      reportData = 'Month,New Users\n';
      userGrowthData?.forEach(item => {
        reportData += `${item.name},${item.users}\n`;
      });
      filename = 'user-growth-report.csv';
    }
    
    // Create a blob and download it
    const blob = new Blob([reportData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Report Downloaded",
      description: `Your ${activeTab} report has been downloaded successfully.`
    });
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
                {loadingPropertiesVehicles ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={propertiesVehiclesData?.revenueData || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="properties" fill="#8884d8" name="Properties" />
                      <Bar dataKey="vehicles" fill="#82ca9d" name="Vehicles" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Distribution of revenue between properties and vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPropertiesVehicles ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={propertiesVehiclesData?.bookingDistributionData || []}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {propertiesVehiclesData?.bookingDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
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
                {loadingBookings ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : bookings && bookings.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={processBookingData(bookings)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" name="Bookings" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                    <Info className="h-12 w-12 mb-2" />
                    <p>No booking data available</p>
                  </div>
                )}
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
                {loadingUserGrowth ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : userGrowthData && userGrowthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="users" stroke="#8884d8" name="New Users" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                    <Info className="h-12 w-12 mb-2" />
                    <p>No user growth data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
  
  // Helper function to process booking data for charts
  function processBookingData(bookings: Booking[]) {
    // Group bookings by date
    const bookingsByDate: Record<string, number> = {};
    
    bookings.forEach(booking => {
      const date = new Date(booking.created_at).toLocaleDateString();
      bookingsByDate[date] = (bookingsByDate[date] || 0) + 1;
    });
    
    // Convert to array for chart
    return Object.entries(bookingsByDate).map(([date, count]) => ({
      date,
      count
    }));
  }
};

export default AdminReports;
