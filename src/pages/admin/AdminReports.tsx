
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon, Download, Loader2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

const AdminReports = () => {
  const [dateRange, setDateRange] = useState<"7days" | "30days" | "thisMonth">("30days");
  const [chartTypes, setChartTypes] = useState({
    revenue: true,
    bookings: true,
    distribution: true
  });

  // Calculate date range for the query
  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case "7days":
        return { start: subDays(now, 7), end: now };
      case "30days":
        return { start: subDays(now, 30), end: now };
      case "thisMonth":
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const { start, end } = getDateRange();

  // Fetch booking data from Supabase
  const { data: bookingsData, isLoading: isLoadingBookings } = useQuery({
    queryKey: ["reports", "bookings", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString())
        .order("created_at", { ascending: true });
      
      if (error) {
        toast({
          title: "Error fetching booking data",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }
      
      return data || [];
    }
  });

  // Prepare data for charts
  const prepareRevenueData = () => {
    if (!bookingsData) return { labels: [], datasets: [] };
    
    // Group by day and sum amounts
    const grouped = bookingsData.reduce((acc: Record<string, number>, booking: any) => {
      const day = format(new Date(booking.created_at), "MMM dd");
      acc[day] = (acc[day] || 0) + booking.total_amount;
      return acc;
    }, {});
    
    // Convert to array for chart
    const labels = Object.keys(grouped);
    const data = Object.values(grouped);
    
    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data,
          backgroundColor: "rgba(37, 99, 235, 0.2)",
          borderColor: "rgb(37, 99, 235)",
          borderWidth: 2,
        }
      ]
    };
  };

  const prepareBookingsCountData = () => {
    if (!bookingsData) return { labels: [], datasets: [] };
    
    // Group by day and count bookings
    const grouped = bookingsData.reduce((acc: Record<string, number>, booking: any) => {
      const day = format(new Date(booking.created_at), "MMM dd");
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array for chart
    const labels = Object.keys(grouped);
    const data = Object.values(grouped);
    
    return {
      labels,
      datasets: [
        {
          label: "Number of Bookings",
          data,
          borderColor: "rgb(220, 38, 38)",
          backgroundColor: "rgba(220, 38, 38, 0.1)",
          tension: 0.3,
          fill: true,
        }
      ]
    };
  };

  const prepareBookingTypeData = () => {
    if (!bookingsData) return { labels: [], datasets: [] };
    
    // Count by booking type
    const count = bookingsData.reduce((acc: Record<string, number>, booking: any) => {
      acc[booking.booking_type] = (acc[booking.booking_type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      labels: Object.keys(count).map(key => 
        key === "property" ? "Properties" : "Vehicles"
      ),
      datasets: [
        {
          label: "Booking Types",
          data: Object.values(count),
          backgroundColor: [
            "rgba(37, 99, 235, 0.7)",
            "rgba(220, 38, 38, 0.7)",
          ],
          borderColor: [
            "rgba(37, 99, 235, 1)",
            "rgba(220, 38, 38, 1)",
          ],
          borderWidth: 1,
        }
      ]
    };
  };

  // Fake data for platform usage when there's no real data
  const generateDummyData = () => {
    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Page Views",
          data: [3200, 2800, 3500, 4100, 3800, 2950, 3300],
          backgroundColor: "rgba(99, 102, 241, 0.5)",
          borderColor: "rgb(99, 102, 241)",
          borderWidth: 2,
        },
        {
          label: "User Sessions",
          data: [2100, 1800, 2200, 2600, 2400, 1900, 2000],
          backgroundColor: "rgba(14, 165, 233, 0.5)",
          borderColor: "rgb(14, 165, 233)",
          borderWidth: 2,
        }
      ]
    };
  };

  return (
    <AdminLayout activeTab="reports">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          
          <div className="flex space-x-2">
            <Button 
              variant={dateRange === "7days" ? "default" : "outline"}
              onClick={() => setDateRange("7days")}
            >
              Last 7 Days
            </Button>
            <Button
              variant={dateRange === "30days" ? "default" : "outline"}
              onClick={() => setDateRange("30days")}
            >
              Last 30 Days
            </Button>
            <Button
              variant={dateRange === "thisMonth" ? "default" : "outline"}
              onClick={() => setDateRange("thisMonth")}
            >
              This Month
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Revenue</CardTitle>
              <CardDescription>Total for selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${bookingsData?.reduce((sum, booking: any) => sum + booking.total_amount, 0).toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Bookings</CardTitle>
              <CardDescription>Total for selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{bookingsData?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Platform Usage</CardTitle>
              <CardDescription>Active users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">248</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex items-center mb-4 space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="showRevenue" 
              checked={chartTypes.revenue} 
              onCheckedChange={(checked) => setChartTypes(prev => ({ ...prev, revenue: !!checked }))}
            />
            <Label htmlFor="showRevenue" className="flex items-center">
              <BarChartIcon className="h-4 w-4 mr-2" />
              Revenue
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="showBookings" 
              checked={chartTypes.bookings} 
              onCheckedChange={(checked) => setChartTypes(prev => ({ ...prev, bookings: !!checked }))}
            />
            <Label htmlFor="showBookings" className="flex items-center">
              <LineChartIcon className="h-4 w-4 mr-2" />
              Bookings
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="showDistribution" 
              checked={chartTypes.distribution} 
              onCheckedChange={(checked) => setChartTypes(prev => ({ ...prev, distribution: !!checked }))}
            />
            <Label htmlFor="showDistribution" className="flex items-center">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Booking Types
            </Label>
          </div>
        </div>
        
        {isLoadingBookings ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {chartTypes.revenue && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChartIcon className="h-5 w-5 mr-2" />
                    Revenue Over Time
                  </CardTitle>
                  <CardDescription>Daily revenue for the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <BarChart data={prepareRevenueData()} />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {chartTypes.bookings && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChartIcon className="h-5 w-5 mr-2" />
                    Booking Trends
                  </CardTitle>
                  <CardDescription>Number of bookings per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <LineChart data={prepareBookingsCountData()} />
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chartTypes.distribution && (
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChartIcon className="h-5 w-5 mr-2" />
                      Booking Type Distribution
                    </CardTitle>
                    <CardDescription>Proportion of property vs vehicle bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <PieChart data={prepareBookingTypeData()} />
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Platform Usage</CardTitle>
                  <CardDescription>Page views and user sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <BarChart data={generateDummyData()} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
