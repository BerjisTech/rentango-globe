import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { PlusCircle, Search, Car, Edit, Trash, Loader2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Vehicle } from "@/types/admin";

const vehicleFormSchema = z.object({
  name: z.string().min(3, "Vehicle name must be at least 3 characters"),
  model: z.string().min(2, "Model must be at least 2 characters"),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1, "Year must be valid"),
  price_per_day: z.coerce.number().positive("Price must be a positive number"),
  seats: z.coerce.number().int().min(1, "Seats must be at least 1"),
  transmission: z.string().min(1, "Transmission type is required"),
  fuel_type: z.string().min(1, "Fuel type is required")
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

const AdminTransportation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      name: "",
      model: "",
      year: new Date().getFullYear(),
      price_per_day: 0,
      seats: 4,
      transmission: "Automatic",
      fuel_type: "Petrol"
    }
  });

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("vehicles")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) {
          toast({
            title: "Error fetching vehicles",
            description: error.message,
            variant: "destructive"
          });
          return [];
        }
        
        return data.map((vehicle: Vehicle) => ({
          ...vehicle,
          status: vehicle.status || 'pending_approval'
        })) as Vehicle[];
      } catch (error: any) {
        toast({
          title: "Error fetching vehicles",
          description: error.message || "An unexpected error occurred",
          variant: "destructive"
        });
        return [];
      }
    }
  });

  const addVehicleMutation = useMutation({
    mutationFn: async (values: VehicleFormValues) => {
      try {
        const vehicleData = {
          name: values.name,
          model: values.model,
          year: values.year,
          price_per_day: values.price_per_day,
          seats: values.seats,
          transmission: values.transmission,
          fuel_type: values.fuel_type
        };

        const { error } = await supabase
          .from("vehicles")
          .insert([vehicleData]);
        
        if (error) throw error;
        
        return vehicleData;
      } catch (error: any) {
        throw new Error(error.message || "Failed to add vehicle");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast({
        title: "Vehicle added",
        description: "The vehicle has been successfully added."
      });
      setIsAddingVehicle(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding vehicle",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleAddVehicle = (values: VehicleFormValues) => {
    addVehicleMutation.mutate(values);
  };

  const filteredVehicles = vehicles?.filter(vehicle => 
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.transmission.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.fuel_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout activeTab="transportation">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Transportation Management</h1>
          <Button onClick={() => setIsAddingVehicle(!isAddingVehicle)}>
            {isAddingVehicle ? "Cancel" : "Add Vehicle"}
            {!isAddingVehicle && <PlusCircle className="ml-2 h-4 w-4" />}
          </Button>
        </div>
        
        {isAddingVehicle && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Add New Vehicle</CardTitle>
              <CardDescription>Fill in the details to add a new vehicle to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddVehicle)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Mazda CX-3" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input placeholder="Touring" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input type="number" min="1950" max={new Date().getFullYear() + 1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price_per_day"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per day ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="seats"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seats</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" step="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="transmission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transmission</FormLabel>
                          <FormControl>
                            <Input placeholder="Automatic, Manual" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fuel_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuel Type</FormLabel>
                          <FormControl>
                            <Input placeholder="Gasoline, Diesel, Electric" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button type="submit">Add Vehicle</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Vehicles Overview</CardTitle>
            <CardDescription>Manage all vehicles listed on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vehicles..."
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
            ) : filteredVehicles && filteredVehicles.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Transmission</TableHead>
                    <TableHead>Price/Day</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.name}</TableCell>
                      <TableCell>{vehicle.model}</TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>{vehicle.transmission}</TableCell>
                      <TableCell>${vehicle.price_per_day.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Car className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No vehicles found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery ? "Try a different search term" : "Add your first vehicle to get started"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTransportation;
