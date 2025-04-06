import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PropertyCard, { PropertyProps } from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowRight, Building, Home, Badge, DollarSign, MapPin, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Property } from "@/types/admin";
import { useQuery } from "@tanstack/react-query";

// Stats data
const statsData = [
  { value: "7239", label: "Homes For Sale" },
  { value: "79+", label: "States" },
  { value: "1091", label: "Homes To Buy" },
  { value: "216+", label: "Agents" }
];

// Service features
const services = [
  {
    id: 1,
    title: "Find Out How Much You Can Afford",
    description: "We help you understand what you can budget for your next home.",
    icon: DollarSign,
  },
  {
    id: 2,
    title: "Understand Your Monthly Costs",
    description: "We'll help you figure out what your monthly payments would be.",
    icon: Home,
  },
  {
    id: 3,
    title: "Get Help With Your Down Payment",
    description: "You may be eligible for a special program to help with your down payment.",
    icon: Badge,
  },
];

const Index = () => {
  const [featuredProperties, setFeaturedProperties] = useState<PropertyProps[]>([]);
  
  // Fetch properties from Supabase
  const { data: properties, isLoading } = useQuery({
    queryKey: ["homepage-properties"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6);
        
        if (error) throw error;
        
        return data as Property[];
      } catch (error: any) {
        toast.error(`Error fetching properties: ${error.message}`);
        return [];
      }
    }
  });

  // Transform fetched properties to match the PropertyCard component format
  useEffect(() => {
    if (properties && properties.length > 0) {
      const transformedProperties: PropertyProps[] = properties.map(property => {
        // Determine property type and price unit
        let type: "short-term" | "long-term" | "for-sale";
        if (property.type === "Sale") type = "for-sale";
        else if (property.type === "Long Term Rental") type = "long-term";
        else type = "short-term";
        
        return {
          id: property.id,
          title: property.name,
          location: property.location,
          price: property.price,
          priceUnit: property.price_unit || "total",
          type,
          imageUrl: property.images && property.images.length > 0 
            ? property.images[0] 
            : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
          beds: property.bedrooms,
          baths: property.bathrooms,
          hasInternet: property.has_internet,
          hasPool: property.has_pool,
          hasWater: property.has_water,
          parkingSpaces: property.parking_spaces,
        };
      });
      
      setFeaturedProperties(transformedProperties);
    }
  }, [properties]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      
      {/* Featured Properties Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-10">
          <h2 className="text-3xl font-bold text-center mb-16">
            The #1 Site Real Estate<br />Professionals Trust*
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProperties.slice(0, 3).map(property => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No properties available yet</p>
            </div>
          )}
          
          <div className="flex justify-center mt-8">
            <Link to="/properties?type=for-sale">
              <Button variant="outline" className="rounded-full px-6">
                View more <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3">
              <h2 className="text-4xl font-bold mb-4">
                Discover<br />
                How We Can<br />
                Help You
              </h2>
            </div>
            
            <div className="md:w-2/3">
              <div className="space-y-8">
                {services.map((service) => (
                  <div key={service.id} className="flex items-start gap-6 p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex-shrink-0 h-10 w-10 bg-black text-white rounded-full flex items-center justify-center">
                      <service.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <Button variant="outline" className="rounded-full text-sm px-4">
                        Learn more <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newly Listed Homes */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="bg-gray-900 rounded-3xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-12 text-white">
                <h2 className="text-4xl font-bold mb-4">
                  Newly Listed<br />
                  Homes In<br />
                  Newton
                </h2>
                <p className="text-gray-300 mb-10">
                  We've found the properties that can match your needs. Take a look at what we've got for you.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Agent Listing</p>
                    <p className="text-xl">24,960</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Others</p>
                    <p className="text-xl">10,845 MLS Listings</p>
                  </div>
                </div>
                
                <div className="mt-10">
                  <Button className="rounded-full px-6 bg-white text-black hover:bg-gray-100">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/2 relative min-h-[400px]">
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')"
                  }}
                />
                <div className="absolute right-6 bottom-6 bg-white rounded-xl p-4 shadow-lg">
                  <p className="text-sm font-semibold">Newton Resident</p>
                  <Button variant="outline" size="sm" className="mt-2 rounded-full text-xs px-3">
                    Learn more <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {statsData.map((stat, index) => (
              <div key={index}>
                <p className="text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Home Loan Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                alt="Home loan" 
                className="rounded-3xl"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-6">
                Need a Home<br />
                Loan?
              </h2>
              
              <div className="flex gap-4 mt-8">
                <Link to="/mortgage">
                  <Button variant="outline" className="rounded-full px-6">
                    Get Pre-Approved Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/disclosure">
                  <Button variant="outline" className="rounded-full px-6">
                    Advertising Disclosure <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Neighborhood Section */}
      <section className="py-16 lg:py-24 bg-sky-100">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Check Out a<br />
              Neighborhood
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Learn about the schools, safety, and community in any neighborhood you're considering.
            </p>
            
            <div className="flex justify-center mt-8">
              <div className="relative max-w-md w-full">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input 
                  type="text" 
                  placeholder="Enter a neighborhood" 
                  className="pl-12 pr-24 bg-white border border-gray-200 h-14 rounded-xl" 
                />
                <Button className="absolute right-1 top-1 rounded-lg h-12 px-5 bg-black text-white">
                  Search
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="overflow-hidden rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1625178551411-62eea1351c37?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                alt="Neighborhood 1" 
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                alt="Neighborhood 2" 
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
