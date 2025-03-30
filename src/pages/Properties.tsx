
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard, { PropertyProps, PropertyType } from "@/components/PropertyCard";
import SearchFilters from "@/components/SearchFilters";
import Map from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, MapPin, List, Layers, X } from "lucide-react";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";

// Mock property data
const allProperties: PropertyProps[] = [
  {
    id: "prop1",
    title: "Luxury Beach Villa with Ocean View",
    location: "2922 Barnes Ave, New York",
    price: 505000,
    priceUnit: "total",
    type: "for-sale",
    imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    beds: 4,
    baths: 3,
    area: 1520,
    hasTransport: true,
    rating: 4.9,
    reviews: 128
  },
  {
    id: "prop2",
    title: "Modern Apartment in City Center",
    location: "636 E 92nd St, New York",
    price: 489000,
    priceUnit: "total",
    type: "for-sale",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    beds: 2,
    baths: 2,
    area: 1100,
    hasTransport: false,
    featured: true,
    rating: 4.7,
    reviews: 84
  },
  {
    id: "prop3",
    title: "Spacious Family Home with Garden",
    location: "4308 Avenue M, New York",
    price: 619900,
    priceUnit: "total",
    type: "for-sale",
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    beds: 5,
    baths: 4,
    area: 1624,
    hasTransport: false,
    rating: 4.8,
    reviews: 56
  },
  {
    id: "prop4",
    title: "Charming Cottage with Pool",
    location: "565 Broome St, New York",
    price: 360000,
    priceUnit: "total",
    type: "for-sale",
    imageUrl: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    beds: 3,
    baths: 2,
    area: 1320,
    hasTransport: true,
    featured: true,
    rating: 4.6,
    reviews: 92
  },
  {
    id: "prop5",
    title: "Penthouse Apartment with City Views",
    location: "Park Ave, New York",
    price: 760000,
    priceUnit: "total",
    type: "for-sale",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    beds: 3,
    baths: 3,
    area: 1450,
    hasTransport: false,
    rating: 4.5,
    reviews: 42
  },
  {
    id: "prop6",
    title: "Cozy Studio in Town",
    location: "Central Park West, New York",
    price: 158000,
    priceUnit: "total",
    type: "for-sale",
    imageUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    beds: 1,
    baths: 1,
    area: 650,
    hasTransport: true,
    rating: 4.4,
    reviews: 76
  }
];

const Properties = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const typeParam = params.get("type") as PropertyType || "for-sale";
  const locationParam = params.get("location") || "";

  const [propertyType, setPropertyType] = useState<PropertyType>(typeParam);
  const [searchQuery, setSearchQuery] = useState(locationParam);
  const [properties, setProperties] = useState<PropertyProps[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list" | "split">("split");
  const [selectedProperty, setSelectedProperty] = useState<PropertyProps | null>(null);
  const [filters, setFilters] = useState({
    location: locationParam,
    priceRange: [0, propertyType === "for-sale" ? 1000000 : 10000],
    bedrooms: undefined,
    hasTransport: false,
  });

  // Update properties based on type and filters
  useEffect(() => {
    let filtered = allProperties.filter(property => property.type === propertyType);
    
    // Apply location filter if provided
    if (filters.location) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Apply price filter
    filtered = filtered.filter(property => 
      property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1]
    );
    
    // Apply bedroom filter if provided
    if (filters.bedrooms) {
      filtered = filtered.filter(property => 
        property.beds ? property.beds >= filters.bedrooms! : false
      );
    }
    
    // Apply transport filter if selected
    if (filters.hasTransport) {
      filtered = filtered.filter(property => property.hasTransport);
    }
    
    setProperties(filtered);
    // Reset selected property when filters change
    setSelectedProperty(null);
  }, [propertyType, filters]);

  const handleSearch = () => {
    setFilters({
      ...filters,
      location: searchQuery,
    });
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters({
      ...filters,
      ...newFilters,
    });
    setShowFilters(false);
  };

  const handlePropertySelect = (property: PropertyProps) => {
    setSelectedProperty(property);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <div className="flex-1 flex flex-col">
        {/* Search Header */}
        <div className="bg-white shadow-sm border-b border-gray-100 py-4">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border-gray-200"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-1" />
                Filters
              </Button>
              
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "map" | "list" | "split")}>
                <ToggleGroupItem value="map" aria-label="Map view">
                  <MapPin className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="split" aria-label="Split view">
                  <Layers className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex container mx-auto p-4 gap-4">
          {/* Map View (Left Side) */}
          {(viewMode === "map" || viewMode === "split") && (
            <div className={`${viewMode === "split" ? "w-1/2" : "w-full"} h-[calc(100vh-12rem)] relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100`}>
              <Map 
                properties={properties} 
                selectedProperty={selectedProperty}
                onPropertySelect={handlePropertySelect}
              />
            </div>
          )}
          
          {/* Properties List (Right Side) */}
          {(viewMode === "list" || viewMode === "split") && (
            <div className={`${viewMode === "split" ? "w-1/2" : "w-full"} flex flex-col h-[calc(100vh-12rem)] overflow-hidden`}>
              {/* Results Header */}
              <div className="bg-white p-4 rounded-t-xl border border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-lg">
                  <span className="font-bold">{properties.length}</span> Results
                  {filters.location && <span className="font-normal text-base"> in {filters.location}</span>}
                </h2>
                
                <div className="text-sm text-gray-500 flex items-center">
                  Sort by: 
                  <span className="font-medium text-black ml-1">Price</span>
                </div>
              </div>
              
              {/* Property Cards */}
              <div className="flex-1 overflow-y-auto bg-white border-x border-gray-200 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {properties.length > 0 ? (
                  properties.map(property => (
                    <div 
                      key={property.id}
                      className={`cursor-pointer transition-all duration-200 ${selectedProperty?.id === property.id ? 'scale-[1.02] ring-2 ring-primary ring-offset-2' : ''}`}
                      onClick={() => handlePropertySelect(property)}
                    >
                      <PropertyCard {...property} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="font-semibold text-xl mb-2">No properties found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search filters to find more options
                    </p>
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              <div className="bg-white p-3 rounded-b-xl border border-gray-200 border-t-0 flex justify-center">
                <Button variant="outline" size="sm" className="rounded-full px-4">
                  Load More
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="fixed inset-y-0 right-0 w-72 bg-white shadow-xl z-50 transform transition-transform ease-in-out duration-300 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold">Filters</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <SearchFilters 
                propertyType={propertyType} 
                onFilterChange={handleFilterChange} 
              />
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Properties;
