
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Bed,
  Bath,
  MapPin,
  Wifi,
  ScrollText,
  Droplet,
  Car,
  Info,
  Phone,
  Mail,
  Share,
  Heart
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types/admin";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const PropertyDetails = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();
        
        if (error) throw error;
        
        return data as Property;
      } catch (error: any) {
        toast.error(`Error fetching property: ${error.message}`);
        return null;
      }
    }
  });

  // Format price label based on price unit
  const formatPriceLabel = (unit?: string) => {
    switch(unit) {
      case "hour": return "/hour";
      case "night": return "/night";
      case "month": return "/month";
      case "year": return "/year";
      case "total": return "";
      default: return `/${unit || "month"}`;
    }
  };

  const handleScheduleTour = () => {
    toast.success("Tour scheduled! We'll contact you soon to confirm the details.");
  };

  const handleRequestInfo = () => {
    toast.success("Information request sent! Our team will get back to you shortly.");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center">
          <h2 className="text-2xl font-semibold mb-4">Property not found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/properties">
            <Button>View All Properties</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <div className="text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-700">Home</Link> {" / "}
            <Link to="/properties" className="hover:text-gray-700">Properties</Link> {" / "}
            <span className="text-gray-700">{property.name}</span>
          </div>
        </div>
        
        {/* Property Header */}
        <div className="container mx-auto px-4 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-semibold text-primary">
                ${property.price.toLocaleString()}{formatPriceLabel(property.price_unit)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {property.type === "Sale" ? "For Sale" : 
                 property.type === "Long Term Rental" ? "Long Term Rental" : 
                 "Short Term Rental"}
              </div>
            </div>
          </div>
        </div>
        
        {/* Property Images */}
        <div className="container mx-auto px-4 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-xl overflow-hidden aspect-video relative">
              <img 
                src={property.images && property.images.length > activeImage 
                  ? property.images[activeImage] 
                  : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"}
                alt={property.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-white rounded-full"
                  onClick={handleShare}
                >
                  <Share className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-white rounded-full"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {property.images && property.images.length > 1 ? (
                property.images.slice(1, 5).map((img, index) => (
                  <div 
                    key={index} 
                    className="aspect-square rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => setActiveImage(index + 1)}
                  >
                    <img 
                      src={img} 
                      alt={`${property.name} ${index + 2}`} 
                      className="w-full h-full object-cover hover:opacity-90 transition"
                    />
                  </div>
                ))
              ) : (
                <>
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No additional images</span>
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No additional images</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Property Content */}
        <div className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.bedrooms && (
                    <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                      <Bed className="h-5 w-5 text-primary mb-1" />
                      <span className="text-lg font-medium">{property.bedrooms}</span>
                      <span className="text-xs text-gray-500">Bedrooms</span>
                    </div>
                  )}
                  
                  {property.bathrooms && (
                    <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                      <Bath className="h-5 w-5 text-primary mb-1" />
                      <span className="text-lg font-medium">{property.bathrooms}</span>
                      <span className="text-xs text-gray-500">Bathrooms</span>
                    </div>
                  )}
                  
                  {property.parking_spaces !== null && property.parking_spaces !== undefined && (
                    <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                      <Car className="h-5 w-5 text-primary mb-1" />
                      <span className="text-lg font-medium">{property.parking_spaces}</span>
                      <span className="text-xs text-gray-500">Parking</span>
                    </div>
                  )}
                  
                  {property.ensuite_bathrooms && (
                    <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                      <Bath className="h-5 w-5 text-primary mb-1" />
                      <span className="text-lg font-medium">{property.ensuite_bathrooms}</span>
                      <span className="text-xs text-gray-500">Ensuite</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                  {property.has_internet && (
                    <div className="flex items-center">
                      <Wifi className="h-5 w-5 mr-2 text-primary" />
                      <span>Internet</span>
                    </div>
                  )}
                  
                  {property.has_pool && (
                    <div className="flex items-center">
                      <ScrollText className="h-5 w-5 mr-2 text-primary" />
                      <span>Pool</span>
                    </div>
                  )}
                  
                  {property.has_water && (
                    <div className="flex items-center">
                      <Droplet className="h-5 w-5 mr-2 text-primary" />
                      <span>Water</span>
                    </div>
                  )}
                  
                  {property.kitchen_type && (
                    <div className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-primary" />
                      <span>{property.kitchen_type} Kitchen</span>
                    </div>
                  )}
                  
                  {property.accessibility_features && property.accessibility_features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <Info className="h-5 w-5 mr-2 text-primary" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Location</h2>
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                  {/* Placeholder for map - can be connected to Map component */}
                  <div className="text-gray-500">Map location for {property.location}</div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.distance_to_school && (
                    <div className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-primary" />
                      <span>{property.distance_to_school} km to nearest school</span>
                    </div>
                  )}
                  
                  {property.distance_to_hospital && (
                    <div className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-primary" />
                      <span>{property.distance_to_hospital} km to nearest hospital</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Schedule a tour</h3>
                <p className="text-gray-600 mb-4">Get the full experience by visiting this property</p>
                
                <div className="mb-4">
                  <Button variant="outline" className="w-full mb-2 flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Tour
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="text-xl font-semibold mb-4">Contact</h3>
                
                <div className="space-y-3">
                  <Button onClick={handleScheduleTour} className="w-full mb-2 flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Tour
                  </Button>
                  
                  <Button onClick={handleRequestInfo} variant="outline" className="w-full mb-2 flex items-center justify-center gap-2">
                    <Info className="h-4 w-4" />
                    Request Information
                  </Button>
                  
                  <Button variant="outline" className="w-full mb-2 flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    Call Agent
                  </Button>
                  
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Agent
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PropertyDetails;
