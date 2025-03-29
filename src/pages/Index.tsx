
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PropertyCard, { PropertyProps } from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car, Calendar, Home, MapPin, Star, Users } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

// Mock data for featured properties
const featuredProperties: PropertyProps[] = [{
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
}, {
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
}, {
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
}, {
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
}];

// Popular destinations
const destinations = [
  {
    name: "Mombasa",
    image: "https://images.unsplash.com/photo-1589235072296-e7b1f9f9770e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    properties: 124
  },
  {
    name: "Nairobi",
    image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    properties: 287
  },
  {
    name: "Malindi",
    image: "https://images.unsplash.com/photo-1626317633477-b4722be9aab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    properties: 56
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Hero />
      
      {/* Featured Properties */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Properties</h2>
              <p className="text-muted-foreground mt-1">Explore our handpicked selection of exceptional properties</p>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="rounded-full">View All</Button>
            </Link>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {featuredProperties.map(property => (
                <CarouselItem key={property.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="animate-fade-in hover-lift h-full">
                    <PropertyCard {...property} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </div>
          </Carousel>
        </div>
      </section>
      
      {/* Popular Destinations */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Popular Destinations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Discover our most sought-after locations and find your next adventure</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <Link to={`/properties?location=${destination.name}`} key={destination.name}>
                <div className="relative overflow-hidden rounded-3xl group h-80 hover-lift">
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-2xl font-bold">{destination.name}</h3>
                    <p className="flex items-center gap-1 text-white/80 mt-1">
                      <Home className="w-4 h-4" />
                      <span>{destination.properties} properties</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Property Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Comprehensive solutions for all your property and travel needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-3xl overflow-hidden hover-lift border border-white/20">
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Short Term Rentals" className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
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
                  <Button className="w-full rounded-xl">Explore Short Term</Button>
                </Link>
              </div>
            </div>
            
            <div className="glass-card rounded-3xl overflow-hidden hover-lift border border-white/20">
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Long Term Rentals & Properties For Sale" className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xl font-semibold mb-2">
                  <Home className="h-5 w-5 text-primary" />
                  <h3>Long Term & For Sale</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Browse apartments, houses and properties for long-term rental or purchase.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/properties?type=long-term">
                    <Button variant="outline" className="w-full rounded-xl">Long Term</Button>
                  </Link>
                  <Link to="/properties?type=for-sale">
                    <Button variant="outline" className="w-full rounded-xl">For Sale</Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-3xl overflow-hidden hover-lift border border-white/20">
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Transportation Services" className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
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
                  <Button className="w-full rounded-xl">Explore Transport</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 animate-fade-in">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Top Rated Properties</h3>
              <p className="text-muted-foreground">Every property is vetted for quality and comfort to ensure an exceptional experience.</p>
            </div>
            
            <div className="p-6 animate-fade-in delay-100">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prime Locations</h3>
              <p className="text-muted-foreground">From beachfront villas to urban apartments, find properties in the most desirable locations.</p>
            </div>
            
            <div className="p-6 animate-fade-in delay-200">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">Our dedicated team is always available to assist you with any questions or concerns.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Join as Owner CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-foreground/20 text-white">
        <div className="container mx-auto px-4">
          <div className="glass-dark py-16 px-8 rounded-3xl text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">List Your Property or Vehicle</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8 text-white/90">
              Join thousands of property and vehicle owners earning income on RentAngo.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/owner-dashboard">
                <Button variant="secondary" className="text-primary font-semibold rounded-xl px-8 py-6 h-auto">
                  List Your Property
                </Button>
              </Link>
              <Link to="/owner-dashboard?tab=transportation">
                <Button variant="outline" className="text-white border-white bg-transparent hover:bg-white/10 rounded-xl px-8 py-6 h-auto">
                  List Your Vehicle
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
