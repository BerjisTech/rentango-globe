
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Activity = {
  id: string;
  created_at: string;
  activity_type: 'user_signup' | 'property_added' | 'vehicle_added' | 'booking_completed';
  user_email?: string;
  entity_name?: string;
  entity_id?: string;
  status: 'pending_approval' | 'completed' | 'requires_action' | 'verified';
};

export function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  async function fetchRecentActivities() {
    try {
      setLoading(true);
      
      // Fetch user registrations
      const { data: authUsers, error: authError } = await supabase
        .from('profiles')
        .select('id, created_at, first_name, last_name')
        .order('created_at', { ascending: false })
        .limit(2);
        
      if (authError) throw authError;
      
      // Fetch recent properties
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id, created_at, name')
        .order('created_at', { ascending: false })
        .limit(2);
        
      if (propertiesError) throw propertiesError;
      
      // Fetch recent vehicles
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('id, created_at, name')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (vehiclesError) throw vehiclesError;
      
      // Fetch recent bookings if available
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, created_at, item_name, payment_status')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (bookingsError) throw bookingsError;
      
      // Transform the data into a single activities array
      const combinedActivities: Activity[] = [
        ...(authUsers?.map(user => ({
          id: user.id,
          created_at: user.created_at,
          activity_type: 'user_signup' as const,
          user_email: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'New User',
          status: 'verified' as const
        })) || []),
        
        ...(properties?.map(property => ({
          id: property.id,
          created_at: property.created_at,
          activity_type: 'property_added' as const,
          entity_name: property.name,
          entity_id: property.id,
          status: 'pending_approval' as const
        })) || []),
        
        ...(vehicles?.map(vehicle => ({
          id: vehicle.id,
          created_at: vehicle.created_at,
          activity_type: 'vehicle_added' as const,
          entity_name: vehicle.name,
          entity_id: vehicle.id,
          status: 'pending_approval' as const
        })) || []),
        
        ...(bookings?.map(booking => ({
          id: booking.id,
          created_at: booking.created_at,
          activity_type: 'booking_completed' as const,
          entity_name: booking.item_name,
          entity_id: booking.id,
          status: booking.payment_status === 'completed' ? 'completed' as const : 'requires_action' as const
        })) || [])
      ];
      
      // Sort by created_at date (most recent first)
      combinedActivities.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setActivities(combinedActivities.slice(0, 5)); // Limit to most recent 5
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      toast({
        variant: "destructive",
        description: "Could not load recent activities. Please try again."
      });
    } finally {
      setLoading(false);
    }
  }

  const getActivityText = (activity: Activity) => {
    switch (activity.activity_type) {
      case 'user_signup':
        return "New User Registration";
      case 'property_added':
        return "New Property Listed";
      case 'vehicle_added':
        return "New Vehicle Listed";
      case 'booking_completed':
        return "Booking Completed";
      default:
        return "Unknown Activity";
    }
  };

  const getUserText = (activity: Activity) => {
    return activity.user_email || 'Unknown User';
  };

  const getStatusBadge = (status: Activity['status']) => {
    switch (status) {
      case 'pending_approval':
        return <span className="tag bg-amber-100 text-amber-700">Pending Approval</span>;
      case 'completed':
        return <span className="tag bg-green-100 text-green-700">Completed</span>;
      case 'requires_action':
        return <span className="tag bg-red-100 text-red-700">Requires Action</span>;
      case 'verified':
        return <span className="tag bg-green-100 text-green-700">Verified</span>;
      default:
        return <span className="tag bg-gray-100 text-gray-700">Unknown</span>;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd hh:mm a');
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
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
        {activities.length > 0 ? (
          activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">{formatDateTime(activity.created_at)}</TableCell>
              <TableCell>
                {getActivityText(activity)}
                {activity.entity_name && <div className="text-xs text-gray-500">{activity.entity_name}</div>}
              </TableCell>
              <TableCell>{getUserText(activity)}</TableCell>
              <TableCell>{getStatusBadge(activity.status)}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="rounded-full">
                  {activity.status === 'pending_approval' ? 'Review' : 'View'}
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              No recent activities found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
