
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

interface FilterProps {
  propertyType: "short-term" | "long-term" | "for-sale" | "transport";
  onFilterChange: (filters: any) => void;
}

const SearchFilters = ({ propertyType, onFilterChange }: FilterProps) => {
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [bedrooms, setBedrooms] = useState("");
  const [hasTransport, setHasTransport] = useState(false);
  const [propertyCategory, setPropertyCategory] = useState("all");

  const handleFilterApply = () => {
    onFilterChange({
      location,
      priceRange,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      hasTransport,
      propertyCategory,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-semibold text-lg mb-4">Filters</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            type="text"
            placeholder="City, neighborhood, etc."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <Label>Price Range (Ksh)</Label>
          <div className="pt-6 pb-2">
            <Slider
              defaultValue={[0, 100000]}
              max={propertyType === "for-sale" ? 10000000 : 100000}
              step={propertyType === "for-sale" ? 100000 : 1000}
              onValueChange={(value) => setPriceRange(value as [number, number])}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Ksh {priceRange[0].toLocaleString()}</span>
            <span>Ksh {priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {propertyType !== "transport" && (
          <>
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger id="bedrooms">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="property-type">Property Type</Label>
              <Select value={propertyCategory} onValueChange={setPropertyCategory}>
                <SelectTrigger id="property-type">
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
          </>
        )}

        {(propertyType === "short-term" || propertyType === "long-term") && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="has-transport" 
              checked={hasTransport} 
              onCheckedChange={(checked) => setHasTransport(checked as boolean)} 
            />
            <Label htmlFor="has-transport" className="cursor-pointer">
              Include transport
            </Label>
          </div>
        )}

        <Button onClick={handleFilterApply} className="w-full">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
