
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Search, CreditCard, CheckCircle, XCircle, Loader2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

// Booking interface
interface Booking {
  id: string;
  user_id: string;
  user_email?: string;
  property_id?: string;
  vehicle_id?: string;
  item_name: string;
  booking_type: "property" | "vehicle";
  start_date: string;
  end_date: string;
  total_amount: number;
  payment_status: "pending" | "completed" | "failed" | "refunded";
  created_at: string;
}

const AdminBookings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Fetch bookings from Supabase
  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles:user_id (
            email
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) {
        toast({
          title: "Error fetching bookings",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }
      
      // Transform the data to match our interface
      return data.map((booking: any) => ({
        ...booking,
        user_email: booking.profiles?.email || "Unknown"
      })) as Booking[];
    }
  });

  const updatePaymentStatus = async (bookingId: string, newStatus: Booking["payment_status"]) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ payment_status: newStatus })
        .eq("id", bookingId);
      
      if (error) throw error;
      
      toast({
        title: "Status updated",
        description: `Payment status successfully changed to ${newStatus}`
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Filter and sort bookings
  const filteredBookings = bookings
    ?.filter(booking => 
      (statusFilter ? booking.payment_status === statusFilter : true) &&
      (searchQuery ? 
        booking.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchQuery.toLowerCase())
        : true
      )
    );

  // Get total revenue stats
  const completedBookingsAmount = bookings
    ?.filter(booking => booking.payment_status === "completed")
    .reduce((sum, booking) => sum + booking.total_amount, 0) || 0;

  const pendingBookingsAmount = bookings
    ?.filter(booking => booking.payment_status === "pending")
    .reduce((sum, booking) => sum + booking.total_amount, 0) || 0;

  return (
    <AdminLayout activeTab="bookings">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Bookings & Payments</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Revenue</CardTitle>
              <CardDescription>Completed payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">${completedBookingsAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Revenue</CardTitle>
              <CardDescription>Payments awaiting completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">${pendingBookingsAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Bookings</CardTitle>
              <CardDescription>All-time bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{bookings?.length || 0}</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Transactions Overview</CardTitle>
            <CardDescription>Manage all bookings and payments on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={statusFilter === null ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter(null)}
                >
                  All
                </Button>
                <Button 
                  variant={statusFilter === "pending" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending
                </Button>
                <Button 
                  variant={statusFilter === "completed" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter("completed")}
                >
                  Completed
                </Button>
                <Button 
                  variant={statusFilter === "failed" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter("failed")}
                >
                  Failed
                </Button>
                <Button 
                  variant={statusFilter === "refunded" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter("refunded")}
                >
                  Refunded
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredBookings && filteredBookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-xs">
                        {booking.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">{booking.item_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {booking.booking_type === "property" ? "Property" : "Vehicle"}
                        </Badge>
                      </TableCell>
                      <TableCell>{booking.user_email}</TableCell>
                      <TableCell className="text-xs">
                        {format(new Date(booking.start_date), "MMM d, yyyy")} - 
                        {format(new Date(booking.end_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>${booking.total_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            booking.payment_status === "completed" ? "default" :
                            booking.payment_status === "pending" ? "outline" :
                            booking.payment_status === "refunded" ? "secondary" : "destructive"
                          }
                        >
                          {booking.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {booking.payment_status === "pending" && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updatePaymentStatus(booking.id, "completed")}
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updatePaymentStatus(booking.id, "failed")}
                              >
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                          {booking.payment_status === "completed" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updatePaymentStatus(booking.id, "refunded")}
                            >
                              Refund
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No bookings found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery || statusFilter ? "Try different search terms or filters" : "Bookings will appear here once created"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
