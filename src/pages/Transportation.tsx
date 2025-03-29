
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard, { VehicleProps } from "@/components/VehicleCard";
import SearchFilters from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock vehicle data
const allVehicles: VehicleProps[] = [
  {
    id: "v1",
    title: "Toyota Fortuner SUV",
    type: "car",
    location: "Nairobi",
    price: 7000,
    priceUnit: "day",
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    seats: 7,
    rating: 4.8,
    reviews: 42
  },
  {
    id: "v2",
    title: "Airport Transfer Mercedes",
    type: "taxi",
    location: "Mombasa",
    price: 3500,
    priceUnit: "trip",
    imageUrl: "https://images.unsplash.com/photo-1551373280-c99943f47a75?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    seats: 4,
    rating: 4.9,
    reviews: 87
  },
  {
    id: "v3",
    title: "Safari Land Cruiser",
    type: "car",
    location: "Nairobi",
    price: 8000,
    priceUnit: "day",
    imageUrl: "https://images.unsplash.com/photo-1591639554185-7583ea23ae44?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
    seats: 8,
    rating: 4.7,
    reviews: 35
  },
  {
    id: "v4",
    title: "Tour Bus with Guide",
    type: "bus",
    location: "Nairobi",
    price: 25000,
    priceUnit: "day",
    imageUrl: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1472&q=80", 
    seats: 30,
    rating: 4.6,
    reviews: 18
  },
  {
    id: "v5",
    title: "City Taxi Service",
    type: "taxi",
    location: "Nairobi",
    price: 60,
    priceUnit: "km",
    imageUrl: "https://images.unsplash.com/photo-1603459206747-b4ef50bbf4c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    seats: 4,
    rating: 4.5,
    reviews: 120
  },
  {
    id: "v6",
    title: "Family Van with Driver",
    type: "van",
    location: "Mombasa",
    price: 6000,
    priceUnit: "day",
    imageUrl: "https://images.unsplash.com/photo-1532010940201-c31e6beacd39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    seats: 12,
    rating: 4.4,
    reviews: 27
  }
];

const Transportation = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const locationParam = params.get("location") || "";

  const [searchQuery, setSearchQuery] = useState(locationParam);
  const [vehicles, setVehicles] = useState<VehicleProps[]>([]);
  const [activeType, setActiveType] = useState<string>("all");
  const [filters, setFilters] = useState({
    location: locationParam,
    priceRange: [0, 30000],
  });

  // Update vehicles based on filters
  useEffect(() => {
    let filtered = [...allVehicles];
    
    // Apply location filter if provided
    if (filters.location) {
      filtered = filtered.filter(vehicle => 
        vehicle.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Apply price filter
    filtered = filtered.filter(vehicle => 
      vehicle.price >= filters.priceRange[0] && vehicle.price <= filters.priceRange[1]
    );
    
    // Apply type filter
    if (activeType !== "all") {
      filtered = filtered.filter(vehicle => vehicle.type === activeType);
    }
    
    setVehicles(filtered);
  }, [filters, activeType]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-primary/10 py-10 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Transportation Services</h1>
          
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
              propertyType="transport"
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} found
              </p>
              <div className="flex gap-2">
                <Button 
                  variant={activeType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveType("all")}
                >
                  All
                </Button>
                <Button 
                  variant={activeType === "car" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveType("car")}
                >
                  Cars
                </Button>
                <Button 
                  variant={activeType === "taxi" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveType("taxi")}
                >
                  Taxis
                </Button>
                <Button 
                  variant={activeType === "bus" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveType("bus")}
                >
                  Buses
                </Button>
              </div>
            </div>
            
            {vehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map(vehicle => (
                  <VehicleCard key={vehicle.id} {...vehicle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-xl mb-2">No vehicles found</h3>
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

export default Transportation;
