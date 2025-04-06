
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
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HelpCircle, Image, X, Upload } from "lucide-react";
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
  price_unit: z.string().default("night"),
  description: z.string().optional(),
  structureType: z.enum(["single", "multiple"]).optional(),
  blockFormat: z.enum(["alphabet", "numeric", "alphanumeric"]).optional(),
  doorFormat: z.enum(["alphabet", "numeric", "alphanumeric"]).optional(),
  blocksPerSet: z.string().optional(),
  unitsPerBlock: z.string().optional(),
  images: z.array(z.string()).optional(),
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
      // Create units based on the format and number of units
      const generatedUnits = generateUnits(data);
      
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="arrangement">Property Arrangement</TabsTrigger>
                <TabsTrigger value="images">Property Images</TabsTrigger>
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
                              <div className="flex items-center space-x-2">
                                <FormLabel>Block Naming Format</FormLabel>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                                        <HelpCircle className="h-4 w-4" />
                                        <span className="sr-only">Block format info</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-xs">
                                      <p>{formatHelpText[field.value as keyof typeof formatHelpText]}</p>
                                      <p className="mt-2 text-xs">Examples:</p>
                                      <ul className="list-disc pl-4 text-xs">
                                        <li>Alphabet: Block A, Block B, Block C</li>
                                        <li>Numeric: Block 1, Block 2, Block 3</li>
                                        <li>Alphanumeric: Block A1, Block A2, Block B1</li>
                                      </ul>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <Select 
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setBlockFormat(value);
                                }}
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

                        {blockFormat === "alphanumeric" ? (
                          <FormField
                            control={form.control}
                            name="blocksPerSet"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Number of Blocks per Set (e.g., A1-A4 is 4 blocks in set A)</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" {...field} />
                                </FormControl>
                                <FormDescription>
                                  How many blocks are in each alphabetic set? (e.g., A1-A4 is 4 blocks)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <FormField
                            control={form.control}
                            name="blocksPerSet"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Total Number of Blocks</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Total number of blocks in your property
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </>
                    )}
                    
                    <FormField
                      control={form.control}
                      name="doorFormat"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2">
                            <FormLabel>Door/Unit Naming Format</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                                  <HelpCircle className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent side="right" className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Door/Unit Naming Formats</h4>
                                  <p className="text-sm">Choose how individual units or doors are named in your property:</p>
                                  
                                  <div className="rounded-md bg-muted p-3">
                                    <h5 className="font-medium">Alphabetic (A, B, C...)</h5>
                                    <p className="text-xs text-muted-foreground">Uses letters for doors.</p>
                                    <p className="text-xs mt-1">Example: Door A, Door B, Door C</p>
                                  </div>
                                  
                                  <div className="rounded-md bg-muted p-3">
                                    <h5 className="font-medium">Numeric (1, 2, 3...)</h5>
                                    <p className="text-xs text-muted-foreground">Uses numbers for doors.</p>
                                    <p className="text-xs mt-1">Example: Door 1, Door 2, Door 3</p>
                                  </div>
                                  
                                  <div className="rounded-md bg-muted p-3">
                                    <h5 className="font-medium">Alphanumeric (A1, B2...)</h5>
                                    <p className="text-xs text-muted-foreground">Uses a combination of letters and numbers.</p>
                                    <p className="text-xs mt-1">Example: Door A1, Door B2, Door C3</p>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
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

                    <FormField
                      control={form.control}
                      name="unitsPerBlock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {structureType === "single" 
                              ? "Total Number of Units/Doors" 
                              : "Number of Units/Doors per Block"}
                          </FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormDescription>
                            {structureType === "single"
                              ? "How many total units or doors are in your property?"
                              : "How many units or doors are in each block?"}
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

                      {(form.watch("blocksPerSet") && form.watch("unitsPerBlock")) && (
                        <p className="mt-2 text-sm">
                          This will generate a total of {
                            structureType === "single" 
                              ? parseInt(form.watch("unitsPerBlock") || "0") 
                              : blockFormat === "alphanumeric"
                                ? 26 * parseInt(form.watch("blocksPerSet") || "0") * parseInt(form.watch("unitsPerBlock") || "0")
                                : parseInt(form.watch("blocksPerSet") || "0") * parseInt(form.watch("unitsPerBlock") || "0")
                          } units.
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
                  <Button 
                    type="button"
                    onClick={() => setActiveTab("images")}
                  >
                    Next
                  </Button>
                </div>
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
