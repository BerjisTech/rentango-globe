
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PropertyCard, { PropertyProps } from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car, Calendar, House } from "lucide-react";

// Mock data for featured properties
const featuredProperties: PropertyProps[] = [
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
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      
      {/* Featured Properties */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Properties</h2>
            <Link to="/properties">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Property Categories */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                  alt="Short Term Rentals" 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xl font-semibold mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3>Short Term Rentals</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Find perfect vacation rentals and holiday homes across Kenya's most beautiful destinations.
                </p>
                <Link to="/properties?type=short-term">
                  <Button className="w-full">Explore Short Term</Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                  alt="Long Term Rentals & Properties For Sale" 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xl font-semibold mb-2">
                  <House className="h-5 w-5 text-primary" />
                  <h3>Long Term & For Sale</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Browse apartments, houses and properties for long-term rental or purchase.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/properties?type=long-term">
                    <Button variant="outline" className="w-full">Long Term</Button>
                  </Link>
                  <Link to="/properties?type=for-sale">
                    <Button variant="outline" className="w-full">For Sale</Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                  alt="Transportation Services" 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xl font-semibold mb-2">
                  <Car className="h-5 w-5 text-primary" />
                  <h3>Transportation</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Book transportation services including airport transfers, tour vehicles, and taxi services.
                </p>
                <Link to="/transportation">
                  <Button className="w-full">Explore Transport</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Join as Owner CTA */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">List Your Property or Vehicle</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join thousands of property and vehicle owners earning income on RentAngo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/owner-dashboard">
              <Button variant="secondary" className="text-primary font-semibold">
                List Your Property
              </Button>
            </Link>
            <Link to="/owner-dashboard?tab=transportation">
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                List Your Vehicle
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
