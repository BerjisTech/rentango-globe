
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check } from "lucide-react";

// Mock popular routes data
const popularRoutes = [
  { from: "Nairobi", to: "Mombasa" },
  { from: "Nairobi", to: "Nakuru" },
  { from: "Mombasa", to: "Malindi" },
  { from: "Nairobi", to: "Kisumu" },
  { from: "Nairobi", to: "Eldoret" },
  { from: "Kisumu", to: "Kakamega" },
  { from: "Nairobi", to: "Thika" },
  { from: "Mombasa", to: "Kilifi" },
  { from: "Nairobi", to: "Naivasha" },
  { from: "Nairobi", to: "Kitengela" },
  { from: "Mombasa", to: "Diani" },
  { from: "Eldoret", to: "Kitale" }
];

// Mock featured vehicles
const featuredVehicles = [
  { 
    id: "v1", 
    title: "Luxury Sedan", 
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    seats: 4
  },
  { 
    id: "v2", 
    title: "Family SUV", 
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    seats: 7
  },
  { 
    id: "v3", 
    title: "Minibus", 
    imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    seats: 14
  }
];

const Transportation = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("1");
  
  const handleSearch = () => {
    console.log("Searching for rides:", { pickup, dropoff, date, time, passengers });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-600 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20" 
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1489824904134-891ab64532f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1631&q=80)" }}
          />
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                RIDE SMARTER<br />SAVE TOGETHER
              </h1>
              <p className="text-white/80 text-lg mb-8 max-w-lg">
                Book reliable and affordable transportation services across Kenya with our modern fleet of vehicles.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Tabs defaultValue="ride" className="w-full mb-6">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="ride">Book a Ride</TabsTrigger>
                  <TabsTrigger value="rental">Rent a Vehicle</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ride" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Pick-up Location</label>
                      <Input 
                        type="text" 
                        placeholder="Enter pick-up location" 
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Drop-off Location</label>
                      <Input 
                        type="text" 
                        placeholder="Enter drop-off location" 
                        value={dropoff}
                        onChange={(e) => setDropoff(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Date</label>
                      <Input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Time</label>
                      <Input 
                        type="time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Passengers</label>
                      <Input 
                        type="number" 
                        min="1"
                        max="30"
                        value={passengers}
                        onChange={(e) => setPassengers(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleSearch} className="w-full mt-2">
                    Search
                  </Button>
                </TabsContent>
                
                <TabsContent value="rental" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Pick-up Location</label>
                      <Input 
                        type="text" 
                        placeholder="Enter pick-up location" 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Return Location</label>
                      <Input 
                        type="text" 
                        placeholder="Same as pick-up" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Pick-up Date</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Return Date</label>
                      <Input type="date" />
                    </div>
                  </div>
                  
                  <Button className="w-full mt-2">
                    Search Vehicles
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Find and book your ride</h3>
              <p className="text-gray-600">
                Enter your pickup and dropoff locations to find available rides in your area.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Travel with top-rated drivers</h3>
              <p className="text-gray-600">
                Our professional drivers provide safe, reliable, and comfortable transportation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Arrive safely at your destination</h3>
              <p className="text-gray-600">
                Track your ride in real-time and enjoy a seamless journey to your destination.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Safety Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">We keep you safe from scams and fraud</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-1 mt-1">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Trust, Safety and Transparency</h3>
                    <p className="text-gray-600">All our drivers are verified and background-checked for your safety.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-1 mt-1">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Secure Payment Systems</h3>
                    <p className="text-gray-600">We use secure payment methods to protect your financial information.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-1 mt-1">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Affordable rates for everyone</h3>
                    <p className="text-gray-600">Competitive pricing with no hidden fees or surprise charges.</p>
                  </div>
                </div>
              </div>
              
              <Button className="mt-8">
                Learn More
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1603459206747-b4ef50bbf4c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                alt="Safe transportation" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-lg shadow-lg max-w-xs">
                <p className="font-semibold text-lg">All our drivers have passed rigorous safety checks and training</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bonus Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1591639554185-7583ea23ae44?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80" 
                alt="Luxury vehicle" 
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-4">Enjoy a KES 500 carpool bonus for sharing your ride!</h2>
              <p className="mb-6">
                When you share your ride with other passengers going in the same direction, you'll receive a KES 500 bonus credit to use on your next booking.
              </p>
              <Button variant="secondary" className="bg-white text-blue-700 hover:bg-gray-100">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Routes Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">Plan Your Next Ride</h2>
          <p className="text-xl text-gray-600 mb-10">Where do you want to go?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {popularRoutes.slice(0, 6).map((route, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700 h-6 w-6 flex items-center justify-center p-0 rounded-full">
                      •
                    </Badge>
                    <span>{route.from} → {route.to}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {featuredVehicles.map((vehicle, index) => (
                <Card key={index} className="overflow-hidden">
                  <img 
                    src={vehicle.imageUrl}
                    alt={vehicle.title}
                    className="h-24 w-full object-cover"
                  />
                  <CardContent className="p-2 text-center">
                    <p className="text-sm font-medium">{vehicle.title}</p>
                    <p className="text-xs text-gray-500">{vehicle.seats} seats</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <Button>
              View All Routes <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Bus Routes Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Our buses take you to more than 300 cities for small prices</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <img 
              src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
              alt="Mini bus" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
              alt="Coach bus" 
              className="w-full h-48 object-cover rounded-lg md:col-span-2"
            />
          </div>
          
          <h3 className="text-2xl font-bold mb-6">Discover our top bus destinations</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularRoutes.map((route, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-700 h-6 w-6 flex items-center justify-center p-0 rounded-full">
                  •
                </Badge>
                <span className="text-sm">{route.from} → {route.to}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Transportation;
