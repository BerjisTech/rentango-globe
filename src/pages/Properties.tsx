
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard, { PropertyProps, PropertyType } from "@/components/PropertyCard";
import SearchFilters from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock property data
const allProperties: PropertyProps[] = [
  {
    id: "prop1",
    title: "Luxury Beach Villa with Ocean View",
    location: "Diani Beach, Mombasa",
    price: 15000,
    priceUnit: "night",
    type: "short-term",
    imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    beds: 4,
    baths: 3,
    hasTransport: true,
    rating: 4.9,
    reviews: 128
  },
  {
    id: "prop2",
    title: "Modern Apartment in City Center",
    location: "Westlands, Nairobi",
    price: 45000,
    priceUnit: "month",
    type: "long-term",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    beds: 2,
    baths: 2,
    hasTransport: false,
    rating: 4.7,
    reviews: 84
  },
  {
    id: "prop3",
    title: "Spacious Family Home with Garden",
    location: "Karen, Nairobi",
    price: 25000000,
    priceUnit: "total",
    type: "for-sale",
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    beds: 5,
    baths: 4,
    hasTransport: false,
    rating: 4.8,
    reviews: 56
  },
  {
    id: "prop4",
    title: "Charming Cottage with Pool",
    location: "Malindi, Coast",
    price: 12000,
    priceUnit: "night",
    type: "short-term",
    imageUrl: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    beds: 3,
    baths: 2,
    hasTransport: true,
    rating: 4.6,
    reviews: 92
  },
  {
    id: "prop5",
    title: "Penthouse Apartment with City Views",
    location: "Kilimani, Nairobi",
    price: 60000,
    priceUnit: "month",
    type: "long-term",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    beds: 3,
    baths: 3,
    hasTransport: false,
    rating: 4.5,
    reviews: 42
  },
  {
    id: "prop6",
    title: "Cozy Studio in Town",
    location: "Nyali, Mombasa",
    price: 8000,
    priceUnit: "night",
    type: "short-term",
    imageUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    beds: 1,
    baths: 1,
    hasTransport: true,
    rating: 4.4,
    reviews: 76
  },
  {
    id: "prop7",
    title: "Elegant Townhouse Near Park",
    location: "Lavington, Nairobi",
    price: 18000000,
    priceUnit: "total",
    type: "for-sale",
    imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    beds: 4,
    baths: 3,
    hasTransport: false,
    rating: 4.7,
    reviews: 28
  },
  {
    id: "prop8",
    title: "Lake View Vacation Home",
    location: "Naivasha, Rift Valley",
    price: 18000,
    priceUnit: "night",
    type: "short-term",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    beds: 3,
    baths: 2,
    hasTransport: true,
    rating: 4.8,
    reviews: 112
  }
];

const Properties = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const typeParam = params.get("type") as PropertyType || "short-term";
  const locationParam = params.get("location") || "";

  const [propertyType, setPropertyType] = useState<PropertyType>(typeParam);
  const [searchQuery, setSearchQuery] = useState(locationParam);
  const [properties, setProperties] = useState<PropertyProps[]>([]);
  const [filters, setFilters] = useState({
    location: locationParam,
    priceRange: [0, propertyType === "for-sale" ? 50000000 : 100000],
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
  };

  const getTypeTitle = () => {
    switch(propertyType) {
      case "short-term":
        return "Short Term Rentals";
      case "long-term":
        return "Long Term Rentals";
      case "for-sale":
        return "Properties For Sale";
      default:
        return "Properties";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-primary/10 py-10 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">{getTypeTitle()}</h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={handleSearch} className="whitespace-nowrap">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 flex-1 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SearchFilters
              propertyType={propertyType}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
              </p>
              <div className="flex gap-2">
                <Button 
                  variant={propertyType === "short-term" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPropertyType("short-term")}
                >
                  Short Term
                </Button>
                <Button 
                  variant={propertyType === "long-term" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPropertyType("long-term")}
                >
                  Long Term
                </Button>
                <Button 
                  variant={propertyType === "for-sale" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPropertyType("for-sale")}
                >
                  For Sale
                </Button>
              </div>
            </div>
            
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map(property => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-xl mb-2">No properties found</h3>
                <p className="text-gray-600">
                  Try adjusting your search filters to find more options
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Properties;
