
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

type PropertyType = "short-term" | "long-term" | "for-sale";

// Define the form validation schema
const propertyFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  type: z.enum(["short-term", "long-term", "for-sale"]),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  price: z.string().min(1, {
    message: "Price is required.",
  }),
  description: z.string().optional(),
  structureType: z.enum(["single", "multiple"]).optional(),
  blockFormat: z.enum(["alphabet", "numeric", "alphanumeric"]).optional(),
  doorFormat: z.enum(["alphabet", "numeric", "alphanumeric"]).optional(),
});

interface AddPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProperty: (property: any) => void;
}

const AddPropertyDialog: React.FC<AddPropertyDialogProps> = ({
  open,
  onOpenChange,
  onAddProperty
}) => {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [propertyType, setPropertyType] = useState<PropertyType>("short-term");
  const [structureType, setStructureType] = useState<string>("single");
  
  const form = useForm<z.infer<typeof propertyFormSchema>>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      type: "short-term",
      location: "",
      price: "",
      description: "",
      structureType: "single",
      blockFormat: "alphabet",
      doorFormat: "numeric",
    },
  });

  const onSubmit = (data: z.infer<typeof propertyFormSchema>) => {
    try {
      onAddProperty({
        ...data,
        status: "Active",
      });
      form.reset();
      setActiveTab("basic");
      onOpenChange(false);
      toast.success("Property added successfully!");
    } catch (error) {
      toast.error("Failed to add property. Please try again.");
      console.error("Error adding property:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="arrangement">Property Arrangement</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Luxury Beach Villa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select 
                        onValueChange={(value: PropertyType) => {
                          field.onChange(value);
                          setPropertyType(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="short-term">Short Term Rental</SelectItem>
                          <SelectItem value="long-term">Long Term Rental</SelectItem>
                          <SelectItem value="for-sale">For Sale</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Diani Beach, Mombasa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={
                            propertyType === "short-term" 
                              ? "e.g. 15,000/night" 
                              : propertyType === "long-term" 
                                ? "e.g. 45,000/month" 
                                : "e.g. 25,000,000"
                          } 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of the property" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("arrangement")}
                    className="mt-2"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="arrangement" className="space-y-4 mt-4">
                {(propertyType === "long-term" || propertyType === "short-term") && (
                  <>
                    <FormField
                      control={form.control}
                      name="structureType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Structure Type</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setStructureType(value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select structure type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="single">Single Building/Unit</SelectItem>
                              <SelectItem value="multiple">Multiple Buildings/Blocks</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose if your property is a single unit or has multiple blocks
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {structureType === "multiple" && (
                      <>
                        <FormField
                          control={form.control}
                          name="blockFormat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Block Naming Format</FormLabel>
                              <Select 
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select block format" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="alphabet">Alphabetic (A, B, C...)</SelectItem>
                                  <SelectItem value="numeric">Numeric (1, 2, 3...)</SelectItem>
                                  <SelectItem value="alphanumeric">Alphanumeric (A1, B2...)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                How are your blocks or buildings named?
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    
                    <FormField
                      control={form.control}
                      name="doorFormat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Door/Unit Naming Format</FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select door format" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="alphabet">Alphabetic (A, B, C...)</SelectItem>
                              <SelectItem value="numeric">Numeric (1, 2, 3...)</SelectItem>
                              <SelectItem value="alphanumeric">Alphanumeric (A1, B2...)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            How are individual doors or units named?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="mt-4 p-4 bg-gray-100 rounded-md">
                      <h3 className="font-medium mb-2">Example Format Preview:</h3>
                      {structureType === "single" ? (
                        <p>
                          Units will be named as: {form.watch("doorFormat") === "alphabet" ? "Door A, Door B, Door C..." : 
                                                   form.watch("doorFormat") === "numeric" ? "Door 1, Door 2, Door 3..." : 
                                                   "Door A1, Door B2, Door C3..."}
                        </p>
                      ) : (
                        <p>
                          Units will be named as: {form.watch("blockFormat") === "alphabet" ? 
                                                  (form.watch("doorFormat") === "alphabet" ? "Block A - Door A, Block B - Door B..." : 
                                                   form.watch("doorFormat") === "numeric" ? "Block A - Door 1, Block B - Door 2..." : 
                                                   "Block A - Door A1, Block B - Door B2...") :
                                                   form.watch("blockFormat") === "numeric" ?
                                                  (form.watch("doorFormat") === "alphabet" ? "Block 1 - Door A, Block 2 - Door B..." : 
                                                   form.watch("doorFormat") === "numeric" ? "Block 1 - Door 1, Block 2 - Door 2..." : 
                                                   "Block 1 - Door A1, Block 2 - Door B2...") :
                                                  (form.watch("doorFormat") === "alphabet" ? "Block A1 - Door A, Block B2 - Door B..." : 
                                                   form.watch("doorFormat") === "numeric" ? "Block A1 - Door 1, Block B2 - Door 2..." : 
                                                   "Block A1 - Door A1, Block B2 - Door B2...")}
                        </p>
                      )}
                    </div>
                  </>
                )}
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("basic")}
                  >
                    Back
                  </Button>
                  <Button type="submit">Add Property</Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
        
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyDialog;
