
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Check, X, Eye } from "lucide-react";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [entityDetails, setEntityDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  useEffect(() => {
    if (selectedActivity && isDrawerOpen) {
      fetchEntityDetails(selectedActivity);
    }
  }, [selectedActivity, isDrawerOpen]);

  async function fetchRecentActivities() {
    try {
      setLoading(true);
      
      const { data: authUsers, error: authError } = await supabase
        .from('profiles')
        .select('id, created_at, first_name, last_name')
        .order('created_at', { ascending: false })
        .limit(2);
        
      if (authError) throw authError;
      
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id, created_at, name')
        .order('created_at', { ascending: false })
        .limit(2);
        
      if (propertiesError) throw propertiesError;
      
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('id, created_at, name')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (vehiclesError) throw vehiclesError;
      
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, created_at, item_name, payment_status')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (bookingsError) throw bookingsError;
      
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
      
      combinedActivities.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setActivities(combinedActivities.slice(0, 5));
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

  async function fetchEntityDetails(activity: Activity) {
    setLoadingDetails(true);
    try {
      let details = null;
      
      switch (activity.activity_type) {
        case 'user_signup':
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', activity.id)
            .single();
          
          if (userError) throw userError;
          details = userData;
          break;
          
        case 'property_added':
          const { data: propertyData, error: propertyError } = await supabase
            .from('properties')
            .select('*')
            .eq('id', activity.entity_id)
            .single();
          
          if (propertyError) throw propertyError;
          details = propertyData;
          break;
          
        case 'vehicle_added':
          const { data: vehicleData, error: vehicleError } = await supabase
            .from('vehicles')
            .select('*')
            .eq('id', activity.entity_id)
            .single();
          
          if (vehicleError) throw vehicleError;
          details = vehicleData;
          break;
          
        case 'booking_completed':
          const { data: bookingData, error: bookingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', activity.entity_id)
            .single();
          
          if (bookingError) throw bookingError;
          details = bookingData;
          break;
      }
      
      setEntityDetails(details);
    } catch (error) {
      console.error("Error fetching entity details:", error);
      toast({
        variant: "destructive",
        description: "Failed to load details. Please try again."
      });
    } finally {
      setLoadingDetails(false);
    }
  }

  const handleApprove = async () => {
    if (!selectedActivity || !selectedActivity.entity_id) return;
    
    try {
      // Fixed: Using a type check to determine the table name instead of a variable
      if (selectedActivity.activity_type === 'property_added') {
        const { error } = await supabase
          .from('properties')
          .update({ /* removed status field as it doesn't exist */ })
          .eq('id', selectedActivity.entity_id);
        
        if (error) throw error;
      } else if (selectedActivity.activity_type === 'vehicle_added') {
        const { error } = await supabase
          .from('vehicles')
          .update({ /* removed status field as it doesn't exist */ })
          .eq('id', selectedActivity.entity_id);
        
        if (error) throw error;
      } else {
        return;
      }
      
      toast({
        description: `${selectedActivity.entity_name || 'Item'} has been approved successfully.`
      });
      
      fetchRecentActivities();
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error approving item:", error);
      toast({
        variant: "destructive",
        description: "Failed to approve. Please try again."
      });
    }
  };

  const handleReject = async () => {
    if (!selectedActivity || !selectedActivity.entity_id) return;
    
    try {
      // Fixed: Using a type check to determine the table name instead of a variable
      if (selectedActivity.activity_type === 'property_added') {
        const { error } = await supabase
          .from('properties')
          .update({ /* removed status field as it doesn't exist */ })
          .eq('id', selectedActivity.entity_id);
        
        if (error) throw error;
      } else if (selectedActivity.activity_type === 'vehicle_added') {
        const { error } = await supabase
          .from('vehicles')
          .update({ /* removed status field as it doesn't exist */ })
          .eq('id', selectedActivity.entity_id);
        
        if (error) throw error;
      } else {
        return;
      }
      
      toast({
        description: `${selectedActivity.entity_name || 'Item'} has been rejected.`
      });
      
      fetchRecentActivities();
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error rejecting item:", error);
      toast({
        variant: "destructive",
        description: "Failed to reject. Please try again."
      });
    }
  };

  const openActivityDrawer = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsDrawerOpen(true);
  };

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

  const renderDrawerContent = () => {
    if (!selectedActivity) return null;
    
    const isLoading = loadingDetails;
    const details = entityDetails;
    
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {selectedActivity.activity_type === 'user_signup' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p>{details?.first_name} {details?.last_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{selectedActivity.user_email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Registered</p>
                <p>{formatDateTime(selectedActivity.created_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>{details?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>
        )}
        
        {selectedActivity.activity_type === 'property_added' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Property Name</p>
                <p>{details?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p>{details?.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Price</p>
                <p>Ksh {details?.price} / {details?.price_unit || 'night'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p>{details?.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Bedrooms</p>
                <p>{details?.bedrooms}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Bathrooms</p>
                <p>{details?.bathrooms}</p>
              </div>
            </div>
            
            {details?.images && details.images.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Images</p>
                <div className="grid grid-cols-3 gap-2">
                  {details.images.slice(0, 3).map((img: string, i: number) => (
                    <img 
                      key={i} 
                      src={img} 
                      alt={`Property ${i+1}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {selectedActivity.activity_type === 'vehicle_added' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Vehicle Name</p>
                <p>{details?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Model</p>
                <p>{details?.model}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Year</p>
                <p>{details?.year}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Price per Day</p>
                <p>Ksh {details?.price_per_day}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Seats</p>
                <p>{details?.seats}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Transmission</p>
                <p>{details?.transmission}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Fuel Type</p>
                <p>{details?.fuel_type}</p>
              </div>
            </div>
          </div>
        )}
        
        {selectedActivity.activity_type === 'booking_completed' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Booking ID</p>
                <p>{selectedActivity.entity_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Item Name</p>
                <p>{details?.item_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p>{details?.start_date && format(new Date(details.start_date), 'PP')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">End Date</p>
                <p>{details?.end_date && format(new Date(details.end_date), 'PP')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p>Ksh {details?.total_amount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Status</p>
                <p>{details?.payment_status}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => openActivityDrawer(activity)}
                  >
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

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>
              {selectedActivity && getActivityText(selectedActivity)}
            </DrawerTitle>
            <DrawerDescription>
              {selectedActivity && formatDateTime(selectedActivity?.created_at)}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 py-2 overflow-y-auto max-h-[60vh]">
            {renderDrawerContent()}
          </div>
          
          <DrawerFooter className="border-t pt-4">
            {selectedActivity?.status === 'pending_approval' && (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleReject}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  className="w-full"
                  onClick={handleApprove}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            )}
            
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
