
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

interface FilterProps {
  propertyType: "short-term" | "long-term" | "for-sale" | "transport";
  onFilterChange: (filters: any) => void;
}

const SearchFilters = ({ propertyType, onFilterChange }: FilterProps) => {
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [bedrooms, setBedrooms] = useState<string>("");
  const [hasTransport, setHasTransport] = useState(false);
  const [propertyCategory, setPropertyCategory] = useState("all");
  const [selectedBeds, setSelectedBeds] = useState<number | null>(null);

  const handleFilterApply = () => {
    onFilterChange({
      location,
      priceRange,
      bedrooms: selectedBeds || undefined,
      hasTransport,
      propertyCategory,
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="price-range" className="block mb-2 text-sm font-medium">Price Range</Label>
        <div className="pt-4 pb-2">
          <Slider
            defaultValue={[0, 1000000]}
            max={propertyType === "for-sale" ? 1000000 : 10000}
            step={propertyType === "for-sale" ? 10000 : 100}
            onValueChange={(value) => setPriceRange(value as [number, number])}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <div>
        <Label className="block mb-3 text-sm font-medium">Bedrooms</Label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <Toggle
              key={num}
              pressed={selectedBeds === num}
              onPressedChange={() => setSelectedBeds(selectedBeds === num ? null : num)}
              className="rounded-full px-3 h-8 text-sm data-[state=on]:bg-primary data-[state=on]:text-white"
            >
              {num === 5 ? "5+" : num} {num === 1 ? "Bed" : "Beds"}
            </Toggle>
          ))}
        </div>
      </div>

      {propertyType !== "transport" && (
        <div>
          <Label htmlFor="property-type" className="block mb-2 text-sm font-medium">Property Type</Label>
          <Select value={propertyCategory} onValueChange={setPropertyCategory}>
            <SelectTrigger id="property-type" className="w-full rounded-lg">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {(propertyType === "short-term" || propertyType === "long-term") && (
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="has-transport" 
            checked={hasTransport} 
            onCheckedChange={(checked) => setHasTransport(checked as boolean)} 
          />
          <Label htmlFor="has-transport" className="cursor-pointer text-sm">
            Include transport
          </Label>
        </div>
      )}

      <div className="space-y-2 pt-4">
        <Button onClick={handleFilterApply} className="w-full rounded-lg">
          Apply Filters
        </Button>
        <Button variant="outline" className="w-full rounded-lg">
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
