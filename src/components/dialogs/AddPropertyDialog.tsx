import { useState, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HelpCircle, Image, X, Upload, Kitchen, Bed, BedDouble, Accessibility, Droplet, Zap, Wifi, Pool, Car, School, Hospital } from "lucide-react";
import * as z from "zod";

type PropertyType = "short-term" | "long-term" | "for-sale";

// Define the kitchen types
const kitchenTypes = [
  { value: "open", label: "Open Plan Kitchen" },
  { value: "closed", label: "Closed Kitchen" },
  { value: "semi-open", label: "Semi-Open Kitchen" },
  { value: "kitchenette", label: "Kitchenette" },
  { value: "none", label: "No Kitchen" }
];

// Define the accessibility features
const accessibilityFeatures = [
  { id: "wheelchair", label: "Wheelchair Accessible" },
  { id: "elevator", label: "Elevator Access" },
  { id: "ground-floor", label: "Ground Floor" },
  { id: "wide-doorway", label: "Wide Doorways" },
  { id: "step-free", label: "Step-free Access" },
  { id: "grab-bars", label: "Grab Bars" },
  { id: "accessible-parking", label: "Accessible Parking" }
];

// Define common amenities
const commonAmenities = [
  { id: "air-conditioning", label: "Air Conditioning" },
  { id: "heating", label: "Heating" },
  { id: "washer", label: "Washer" },
  { id: "dryer", label: "Dryer" },
  { id: "tv", label: "TV" },
  { id: "workspace", label: "Dedicated Workspace" },
  { id: "kitchen", label: "Kitchen" },
  { id: "dishwasher", label: "Dishwasher" },
  { id: "refrigerator", label: "Refrigerator" },
  { id: "microwave", label: "Microwave" },
  { id: "coffee-maker", label: "Coffee Maker" },
  { id: "hot-tub", label: "Hot Tub" },
  { id: "balcony", label: "Balcony" },
  { id: "patio", label: "Patio" },
  { id: "grill", label: "BBQ Grill" },
  { id: "gym", label: "Gym" },
  { id: "security-system", label: "Security System" },
  { id: "fire-extinguisher", label: "Fire Extinguisher" }
];

// Define the form validation schema
const propertyFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  type: z.enum(["short-term", "long-term", "for-sale"]),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }),
  price: z.string().min(1, { message: "Price is required." }),
  price_unit: z.string().default("night"),
  description: z.string().optional(),
  bedrooms: z.number().int().min(0).default(1),
  bathrooms: z.number().int().min(0).default(1),
  ensuite_bathrooms: z.number().int().min(0).default(0),
  kitchen_type: z.string().optional(),
  has_water: z.boolean().default(true),
  has_electricity: z.boolean().default(true),
  has_internet: z.boolean().default(false),
  has_pool: z.boolean().default(false),
  parking_spaces: z.number().int().min(0).default(0),
  accessibility_features: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
  distance_to_school: z.number().min(0).nullable().default(null),
  distance_to_hospital: z.number().min(0).nullable().default(null),
  structureType: z.enum(["single", "multiple"]).optional(),
  blockFormat: z.enum(["alphabet", "numeric", "alphanumeric"]).optional(),
  doorFormat: z.enum(["alphabet", "numeric", "alphanumeric"]).optional(),
  blocksPerSet: z.string().optional(),
  unitsPerBlock: z.string().optional(),
  images: z.array(z.string()).default([]),
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
  const [blockFormat, setBlockFormat] = useState<string>("alphabet");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<z.infer<typeof propertyFormSchema>>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      type: "short-term",
      location: "",
      price: "",
      price_unit: "night",
      description: "",
      bedrooms: 1,
      bathrooms: 1,
      ensuite_bathrooms: 0,
      kitchen_type: "open",
      has_water: true,
      has_electricity: true,
      has_internet: false,
      has_pool: false,
      parking_spaces: 0,
      accessibility_features: [],
      amenities: [],
      distance_to_school: null,
      distance_to_hospital: null,
      structureType: "single",
      blockFormat: "alphabet",
      doorFormat: "numeric",
      blocksPerSet: "",
      unitsPerBlock: "",
      images: [],
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Limit to 5 images total
      if (imageFiles.length + newFiles.length > 5) {
        toast.error("You can upload a maximum of 5 images per property");
        return;
      }
      
      setImageFiles(prev => [...prev, ...newFiles]);
      
      // Create URLs for preview
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...newUrls]);
      
      // Update form value
      form.setValue("images", [...(form.getValues("images") || []), ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newUrls = [...imageUrls];
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(newUrls[index]);
    
    newFiles.splice(index, 1);
    newUrls.splice(index, 1);
    
    setImageFiles(newFiles);
    setImageUrls(newUrls);
    
    // Update form value
    form.setValue("images", newUrls);
  };

  const onSubmit = (data: z.infer<typeof propertyFormSchema>) => {
    try {
      // Create units based on the format and number of units if applicable
      const generatedUnits = data.structureType ? generateUnits(data) : [];
      
      onAddProperty({
        ...data,
        price: parseFloat(data.price),
        status: "Active",
        units: generatedUnits,
        images: imageUrls,
      });

      form.reset();
      setActiveTab("basic");
      setImageFiles([]);
      setImageUrls([]);
      onOpenChange(false);
      toast.success("Property added successfully!");
    } catch (error) {
      toast.error("Failed to add property. Please try again.");
      console.error("Error adding property:", error);
    }
  };

  // Function to generate units based on the selected formats and numbers
  const generateUnits = (data: z.infer<typeof propertyFormSchema>) => {
    const units = [];
    
    if (data.structureType === "single") {
      // For single buildings, just use door format
      const numUnits = parseInt(data.unitsPerBlock || "0", 10);
      
      for (let i = 1; i <= numUnits; i++) {
        units.push({
          id: `unit-${i}`,
          name: formatDoorName(i, data.doorFormat || "numeric")
        });
      }
    } else if (data.structureType === "multiple") {
      // For multiple buildings, use block and door format
      const numBlocksPerSet = parseInt(data.blocksPerSet || "0", 10);
      const numUnitsPerBlock = parseInt(data.unitsPerBlock || "0", 10);
      
      if (data.blockFormat === "alphanumeric") {
        // Handle alphanumeric blocks (e.g., A1, A2, B1, B2)
        for (let letter = 0; letter < 26; letter++) {
          const blockLetter = String.fromCharCode(65 + letter); // A, B, C, ...
          
          for (let blockNum = 1; blockNum <= numBlocksPerSet; blockNum++) {
            const blockName = `${blockLetter}${blockNum}`;
            
            for (let doorNum = 1; doorNum <= numUnitsPerBlock; doorNum++) {
              const doorName = formatDoorName(doorNum, data.doorFormat || "numeric");
              units.push({
                id: `${blockName}-${doorNum}`,
                name: `${blockName} - ${doorName}`,
                block: blockName,
                door: doorName
              });
            }
          }
        }
      } else {
        // Handle regular blocks (alphabet or numeric)
        const totalBlocks = numBlocksPerSet;
        
        for (let blockIdx = 1; blockIdx <= totalBlocks; blockIdx++) {
          const blockName = formatBlockName(blockIdx, data.blockFormat || "alphabet");
          
          for (let doorIdx = 1; doorIdx <= numUnitsPerBlock; doorIdx++) {
            const doorName = formatDoorName(doorIdx, data.doorFormat || "numeric");
            units.push({
              id: `${blockName}-${doorIdx}`,
              name: `${blockName} - ${doorName}`,
              block: blockName,
              door: doorName
            });
          }
        }
      }
    }
    
    return units;
  };
  
  const formatBlockName = (index: number, format: string): string => {
    if (format === "alphabet") {
      // A, B, C, ...
      return String.fromCharCode(64 + index);
    } else if (format === "numeric") {
      // 1, 2, 3, ...
      return String(index);
    }
    return String(index);
  };
  
  const formatDoorName = (index: number, format: string): string => {
    if (format === "alphabet") {
      // A, B, C, ...
      return String.fromCharCode(64 + index);
    } else if (format === "numeric") {
      // 1, 2, 3, ...
      return String(index);
    } else if (format === "alphanumeric") {
      // A1, B2, C3, ...
      const letter = String.fromCharCode(64 + Math.ceil(index / 26));
      return `${letter}${index}`;
    }
    return String(index);
  };
  
  const formatHelpText = {
    alphabet: "Uses letters (A, B, C...) for naming blocks or doors.",
    numeric: "Uses numbers (1, 2, 3...) for naming blocks or doors.",
    alphanumeric: "Uses a combination of letters and numbers (A1, B2, C3...) for naming blocks or doors."
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="arrangement">Units</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
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
                          
                          // Set default price unit based on property type
                          if (value === "short-term") form.setValue("price_unit", "night");
                          else if (value === "long-term") form.setValue("price_unit", "month");
                          else form.setValue("price_unit", "total");
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
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="e.g. 15000"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price_unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select price unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hour">Per Hour</SelectItem>
                            <SelectItem value="day">Per Day</SelectItem>
                            <SelectItem value="night">Per Night</SelectItem>
                            <SelectItem value="week">Per Week</SelectItem>
                            <SelectItem value="month">Per Month</SelectItem>
                            <SelectItem value="year">Per Year</SelectItem>
                            {propertyType === "for-sale" && (
                              <SelectItem value="total">Total Price</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            step="0.5"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of the property" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("features")}
                    className="mt-2"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4 mt-4">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="kitchen_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Kitchen className="h-4 w-4 mr-2" />
                          Kitchen Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select kitchen type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {kitchenTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ensuite_bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <BedDouble className="h-4 w-4 mr-2" />
                          En-suite Bathrooms
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            max={form.watch("bedrooms")}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            value={field.value || 0}
                          />
                        </FormControl>
                        <FormDescription>Number of bedrooms with en-suite bathrooms</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <h3 className="text-md font-medium flex items-center">
                      <Accessibility className="h-4 w-4 mr-2" />
                      Accessibility Features
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {accessibilityFeatures.map((feature) => (
                        <FormField
                          key={feature.id}
                          control={form.control}
                          name="accessibility_features"
                          render={({ field }) => (
                            <FormItem key={feature.id} className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(feature.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedFeatures = checked
                                      ? [...field.value || [], feature.id]
                                      : field.value?.filter(value => value !== feature.id) || [];
                                    field.onChange(updatedFeatures);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {feature.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="has_water"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center">
                              <Droplet className="h-4 w-4 mr-2" />
                              Water Supply
                            </FormLabel>
                            <FormDescription>
                              Property has running water
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="has_electricity"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center">
                              <Zap className="h-4 w-4 mr-2" />
                              Electricity
                            </FormLabel>
                            <FormDescription>
                              Property has electricity
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="has_internet"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center">
                              <Wifi className="h-4 w-4 mr-2" />
                              Internet/WiFi
                            </FormLabel>
                            <FormDescription>
                              Property has internet access
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="has_pool"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center">
                              <Pool className="h-4 w-4 mr-2" />
                              Swimming Pool
                            </FormLabel>
                            <FormDescription>
                              Property has a pool
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="parking_spaces"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Car className="h-4 w-4 mr-2" />
                          Parking Spaces
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            value={field.value || 0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {propertyType === "long-term" && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="distance_to_school"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <School className="h-4 w-4 mr-2" />
                              Distance to School (km)
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                min="0"
                                step="0.1"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="distance_to_hospital"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Hospital className="h-4 w-4 mr-2" />
                              Distance to Hospital (km)
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                min="0"
                                step="0.1"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-md font-medium">Other Amenities</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {commonAmenities.map((amenity) => (
                        <FormField
                          key={amenity.id}
                          control={form.control}
                          name="amenities"
                          render={({ field }) => (
                            <FormItem key={amenity.id} className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(amenity.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedAmenities = checked
                                      ? [...field.value || [], amenity.id]
                                      : field.value?.filter(value => value !== amenity.id) || [];
                                    field.onChange(updatedAmenities);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {amenity.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("basic")}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setActiveTab("arrangement")}
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="arrangement" className="space-y-4 mt-4">
                {(propertyType === "long-term" || propertyType === "short-term") && (
                  <div>
                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab("features")}
                      >
                        Back
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => setActiveTab("images")}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="images" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                      Click to upload images (max 5)
                      <br />
                      <span className="text-xs">JPG, PNG, GIF up to 5MB each</span>
                    </p>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </div>
                  
                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden h-32 bg-gray-100">
                          <img 
                            src={url} 
                            alt={`Property image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                          >
                            <X className="h-4 w-4 text-gray-700" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("arrangement")}
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
