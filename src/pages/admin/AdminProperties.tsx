
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { PlusCircle, Search, Building, Edit, Trash, Loader2, Image as ImageIcon, Wifi, WifiOff, Droplet, Zap, ZapOff, Car, ScrollText, Check, X, EyeOff } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types/admin";
import AddPropertyDialog from "@/components/dialogs/AddPropertyDialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

const AdminProperties = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [propertyToAction, setPropertyToAction] = useState<{id: string, name: string, action: 'delete' | 'approve' | 'reject' | 'pull-off-market'} | null>(null);
  const queryClient = useQueryClient();

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        
        return data as Property[];
      } catch (error: any) {
        toast({
          title: "Error fetching properties",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }
    }
  });

  const addPropertyMutation = useMutation({
    mutationFn: async (property: any) => {
      try {
        const propertyData = {
          name: property.title,
          location: property.location,
          price: parseFloat(property.price),
          price_unit: property.price_unit,
          bedrooms: property.bedrooms || property.units?.length || 0,
          bathrooms: property.bathrooms || Math.ceil(property.units?.length / 2) || 1,
          type: property.type === 'for-sale' ? 'Sale' : property.type === 'long-term' ? 'Long Term Rental' : 'Short Term Rental',
          images: property.images || [],
          kitchen_type: property.kitchen_type,
          ensuite_bathrooms: property.ensuite_bathrooms || 0,
          accessibility_features: property.accessibility_features || [],
          has_water: property.has_water,
          has_electricity: property.has_electricity,
          has_internet: property.has_internet,
          has_pool: property.has_pool,
          parking_spaces: property.parking_spaces || 0,
          distance_to_school: property.distance_to_school,
          distance_to_hospital: property.distance_to_hospital,
          amenities: property.amenities || [],
          status: 'pending_approval'
        };

        const { error } = await supabase
          .from("properties")
          .insert([propertyData]);
        
        if (error) throw error;
        
        return propertyData;
      } catch (error: any) {
        throw new Error(error.message || "Failed to add property");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({
        title: "Property added",
        description: "The property has been successfully added."
      });
      setIsAddingProperty(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding property",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const propertyActionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string, action: string }) => {
      try {
        let status = '';
        
        switch (action) {
          case 'approve':
            status = 'approved';
            break;
          case 'reject':
            status = 'rejected';
            break;
          case 'pull-off-market':
            status = 'off_market';
            break;
          case 'delete':
            const { error: deleteError } = await supabase
              .from("properties")
              .delete()
              .eq("id", id);
            
            if (deleteError) throw deleteError;
            return { id, action };
        }
        
        if (status) {
          const { error } = await supabase
            .from("properties")
            .update({ status })
            .eq("id", id);
          
          if (error) throw error;
        }
        
        return { id, action };
      } catch (error: any) {
        throw new Error(error.message || "Failed to perform action on property");
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      
      const actionMessages = {
        'delete': "Property has been deleted",
        'approve': "Property has been approved",
        'reject': "Property has been rejected",
        'pull-off-market': "Property has been pulled off market"
      };
      
      toast({
        title: "Success",
        description: actionMessages[result.action as keyof typeof actionMessages]
      });
      
      setPropertyToAction(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      setPropertyToAction(null);
    }
  });

  const handleAddProperty = (property: any) => {
    addPropertyMutation.mutate(property);
  };

  const handlePropertyAction = (property: Property, action: 'delete' | 'approve' | 'reject' | 'pull-off-market') => {
    setPropertyToAction({ id: property.id, name: property.name, action });
  };

  const executeAction = () => {
    if (propertyToAction) {
      propertyActionMutation.mutate({ 
        id: propertyToAction.id, 
        action: propertyToAction.action 
      });
    }
  };

  const getActionTitle = () => {
    if (!propertyToAction) return "";
    
    switch (propertyToAction.action) {
      case 'delete': return "Delete Property";
      case 'approve': return "Approve Property";
      case 'reject': return "Reject Property";
      case 'pull-off-market': return "Pull Off Market";
      default: return "";
    }
  };

  const getActionDescription = () => {
    if (!propertyToAction) return "";
    
    switch (propertyToAction.action) {
      case 'delete': 
        return `Are you sure you want to delete "${propertyToAction.name}"? This action cannot be undone.`;
      case 'approve': 
        return `Are you sure you want to approve "${propertyToAction.name}"? This will make it visible on the marketplace.`;
      case 'reject': 
        return `Are you sure you want to reject "${propertyToAction.name}"?`;
      case 'pull-off-market': 
        return `Are you sure you want to pull "${propertyToAction.name}" off the market? It will no longer be visible to customers.`;
      default: return "";
    }
  };

  const getActionButton = () => {
    if (!propertyToAction) return "";
    
    switch (propertyToAction.action) {
      case 'delete': return "Delete";
      case 'approve': return "Approve";
      case 'reject': return "Reject";
      case 'pull-off-market': return "Pull Off Market";
      default: return "Confirm";
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'pending_approval':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700">Pending Approval</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-700">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-700">Rejected</Badge>;
      case 'off_market':
        return <Badge variant="outline" className="bg-gray-100 text-gray-700">Off Market</Badge>;
      default:
        return null;
    }
  };

  const filteredProperties = properties?.filter(property => 
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPriceWithUnit = (price: number, unit?: string) => {
    if (!unit) return `$${price.toFixed(2)}`;
    
    if (unit === 'total') return `$${price.toFixed(2)}`;
    return `$${price.toFixed(2)}/${unit}`;
  };

  return (
    <AdminLayout activeTab="properties">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Properties Management</h1>
          <Button onClick={() => setIsAddingProperty(true)}>
            Add Property
            <PlusCircle className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <AddPropertyDialog 
          open={isAddingProperty} 
          onOpenChange={setIsAddingProperty} 
          onAddProperty={handleAddProperty} 
        />
        
        <AlertDialog open={!!propertyToAction} onOpenChange={(open) => !open && setPropertyToAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{getActionTitle()}</AlertDialogTitle>
              <AlertDialogDescription>
                {getActionDescription()}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={executeAction}
                className={
                  propertyToAction?.action === 'delete' || propertyToAction?.action === 'reject'
                    ? 'bg-destructive hover:bg-destructive/90'
                    : ''
                }
              >
                {getActionButton()}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Card>
          <CardHeader>
            <CardTitle>Properties Overview</CardTitle>
            <CardDescription>Manage all properties listed on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredProperties && filteredProperties.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Bedrooms</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amenities</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.name}</TableCell>
                      <TableCell>{property.location}</TableCell>
                      <TableCell>{property.type}</TableCell>
                      <TableCell>{property.bedrooms}</TableCell>
                      <TableCell>{formatPriceWithUnit(property.price, property.price_unit)}</TableCell>
                      <TableCell>{getStatusBadge(property.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {property.has_internet && <Badge variant="outline" className="bg-blue-50"><Wifi className="h-3 w-3 mr-1" /> WiFi</Badge>}
                          {property.has_water && <Badge variant="outline" className="bg-blue-50"><Droplet className="h-3 w-3 mr-1" /> Water</Badge>}
                          {property.has_electricity && <Badge variant="outline" className="bg-blue-50"><Zap className="h-3 w-3 mr-1" /> Power</Badge>}
                          {property.has_pool && <Badge variant="outline" className="bg-blue-50"><ScrollText className="h-3 w-3 mr-1" /> Pool</Badge>}
                          {property.parking_spaces && property.parking_spaces > 0 && 
                            <Badge variant="outline" className="bg-blue-50">
                              <Car className="h-3 w-3 mr-1" /> {property.parking_spaces}
                            </Badge>
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        {property.images && property.images.length > 0 ? (
                          <span className="flex items-center">
                            <ImageIcon className="h-4 w-4 mr-1" />
                            {property.images.length}
                          </span>
                        ) : (
                          "No images"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {(!property.status || property.status === 'pending_approval') && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-green-600"
                                onClick={() => handlePropertyAction(property, 'approve')}
                                title="Approve"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-600"
                                onClick={() => handlePropertyAction(property, 'reject')}
                                title="Reject"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {property.status === 'approved' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-gray-600"
                              onClick={() => handlePropertyAction(property, 'pull-off-market')}
                              title="Pull off market"
                            >
                              <EyeOff className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Property</DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handlePropertyAction(property, 'delete')}
                              >
                                Delete Property
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Building className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No properties found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery ? "Try a different search term" : "Add your first property to get started"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProperties;
