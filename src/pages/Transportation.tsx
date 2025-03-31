
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Check, 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Search,
  Shield, 
  CreditCard, 
  Smile, 
  ChevronRight
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Mock popular routes data
const popularRoutes = [
  { from: "Los Angeles", to: "San Francisco" },
  { from: "New York", to: "Boston" },
  { from: "Birmingham", to: "London" },
  { from: "Paris", to: "Nice" },
  { from: "Barcelona", to: "Madrid" },
  { from: "Berlin", to: "Munich" },
  { from: "Rome", to: "Milan" },
  { from: "Amsterdam", to: "Rotterdam" },
  { from: "Brussels", to: "Paris" }
];

// Mock featured vehicles
const featuredVehicles = [
  { 
    id: "v1", 
    title: "Comfort", 
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    seats: 4
  },
  { 
    id: "v2", 
    title: "Premium", 
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    seats: 7
  },
  { 
    id: "v3", 
    title: "Economy", 
    imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    seats: 4
  },
  { 
    id: "v4", 
    title: "Van", 
    imageUrl: "https://images.unsplash.com/photo-1617469767053-8fd632fca4b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    seats: 8
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
        <div className="absolute inset-0 bg-black overflow-hidden">
          {/* Dark showroom gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-900/95 to-zinc-800 opacity-95" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=3847&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay" />
          
          {/* Elegant spotlight effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-gradient-to-b from-zinc-200/5 to-transparent blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              RIDE SMARTER SAVE<br />TOGETHER.
            </h1>
            
            <div className="w-full max-w-5xl mx-auto my-8">
              <img 
                src="https://www.pngkey.com/png/full/918-9183571_new-2019-mazda-cx-3-touring-2019-mazda.png" 
                alt="Mazda CX-3" 
                className="w-full h-auto object-contain"
              />
            </div>
            
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl p-4 mt-4">
              <Tabs defaultValue="ride" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="ride" className="rounded-full">One-way trip</TabsTrigger>
                  <TabsTrigger value="round" className="rounded-full">Round trip</TabsTrigger>
                  <TabsTrigger value="hourly" className="rounded-full">Hourly hire</TabsTrigger>
                  <TabsTrigger value="airport" className="rounded-full">Airport transfer</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ride" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <div className="p-2 border rounded-lg">
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Pick-up Location</label>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-blue-500 mr-2" />
                        <Input 
                          type="text" 
                          placeholder="Enter location" 
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                          className="border-0 p-0 h-6 text-sm focus-visible:ring-0"
                        />
                      </div>
                    </div>
                    
                    <div className="p-2 border rounded-lg">
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Drop-off Location</label>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-blue-500 mr-2" />
                        <Input 
                          type="text" 
                          placeholder="Enter location" 
                          value={dropoff}
                          onChange={(e) => setDropoff(e.target.value)}
                          className="border-0 p-0 h-6 text-sm focus-visible:ring-0"
                        />
                      </div>
                    </div>
                    
                    <div className="p-2 border rounded-lg">
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Pick-up Date</label>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                        <Input 
                          type="date" 
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="border-0 p-0 h-6 text-sm focus-visible:ring-0"
                        />
                      </div>
                    </div>
                    
                    <div className="p-2 border rounded-lg">
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Pick-up Time</label>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-blue-500 mr-2" />
                        <Input 
                          type="time" 
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="border-0 p-0 h-6 text-sm focus-visible:ring-0"
                        />
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <Button onClick={handleSearch} className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white">
                        Search
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="round" className="space-y-4">
                  {/* Similar structure for round trip */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    {/* Input fields for round trip */}
                    <div className="p-2">
                      <Button onClick={handleSearch} className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white">
                        Search
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="hourly" className="space-y-4">
                  {/* Hourly hire form */}
                </TabsContent>
                
                <TabsContent value="airport" className="space-y-4">
                  {/* Airport transfer form */}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            How <span className="text-yellow-500 font-bold">It Works</span>
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Experience a seamless journey with our easy-to-use platform. Book, ride, and enjoy the convenience of our service.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="text-blue-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find and book your ride</h3>
              <p className="text-gray-600">
                Enter your pickup and dropoff locations to find available rides in your area.
              </p>
              <Button variant="outline" size="sm" className="mt-4 rounded-full">
                Learn more
              </Button>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-blue-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Travel with top-rated drivers</h3>
              <p className="text-gray-600">
                Our professional drivers provide safe, reliable, and comfortable transportation.
              </p>
              <Button variant="outline" size="sm" className="mt-4 rounded-full">
                Learn more
              </Button>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smile className="text-blue-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Arrive safely at your destination</h3>
              <p className="text-gray-600">
                Track your ride in real-time and enjoy a seamless journey to your destination.
              </p>
              <Button variant="outline" size="sm" className="mt-4 rounded-full">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Safety Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                We help you <span className="text-blue-600">stay safe</span> from scams and fraud
              </h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border border-gray-200 rounded-lg px-4 mb-3">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-100 text-blue-600 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                        •
                      </Badge>
                      <span>Trust, Safety and Transparency</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    All our drivers are verified and background-checked for your safety. We ensure transparency in all our operations.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border border-gray-200 rounded-lg px-4 mb-3">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-100 text-blue-600 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                        •
                      </Badge>
                      <span>Secure Payment Systems</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    We use secure payment methods to protect your financial information. All transactions are encrypted.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-100 text-blue-600 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                        •
                      </Badge>
                      <span>Affordable rates for everyone</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    Competitive pricing with no hidden fees or surprise charges. We offer the best rates in the market.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1603459206747-b4ef50bbf4c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                alt="Safe transportation" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-white text-black p-6 rounded-lg shadow-lg max-w-xs">
                <p className="font-semibold mb-2">Verified Drivers</p>
                <p className="text-sm text-gray-600 mb-4">All our drivers have passed rigorous safety checks and training</p>
                <Button size="sm" className="rounded-full">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bonus Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80" 
                alt="Luxury blue car" 
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-yellow-500 mb-4">
                Enjoy a €25 carpool bonus<br/>for sharing your ride!
              </h2>
              <p className="mb-6 text-gray-600">
                When you share your ride with other passengers going in the same direction, you'll receive a €25 bonus credit to use on your next booking.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">MINIMUM 2 PEOPLE REQUIRED</p>
                  <p className="text-lg">€25 per passenger</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">VALID UNTIL JUNE 30, 2024</p>
                  <p className="text-lg">All destinations</p>
                </div>
              </div>
              
              <Button className="bg-blue-600 hover:bg-blue-700 rounded-full">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Routes Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">
            Plan Your Next Ride<span className="text-blue-600">—where</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10">do you want to go?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 gap-4">
                {popularRoutes.slice(0, 3).map((route, index) => (
                  <div key={index} className="flex items-center p-2 border rounded-full">
                    <Badge className="bg-blue-100 text-blue-600 h-6 w-6 flex items-center justify-center p-0 rounded-full mr-3">
                      •
                    </Badge>
                    <span>{route.from} → {route.to}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {featuredVehicles.map((vehicle, index) => (
                <Card key={index} className="overflow-hidden">
                  <img 
                    src={vehicle.imageUrl}
                    alt={vehicle.title}
                    className="h-32 w-full object-cover"
                  />
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium">{vehicle.title}</p>
                    <p className="text-xs text-gray-500">{vehicle.seats} seats</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-full">
              View All Routes <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Bus Routes Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Our buses take you to more than 300 cities<br/>
            <span className="text-blue-600">for small prices.</span>
          </h2>
          
          <div className="grid grid-cols-4 gap-4 mb-12">
            <div className="col-span-1">
              <img 
                src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                alt="Mini bus" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="col-span-2">
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                alt="Coach bus" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="col-span-1">
              <img 
                src="https://images.unsplash.com/photo-1464219789935-c2d9d9eb75d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                alt="City bus" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-6">
            Discover our top <span className="text-blue-600">bus destinations</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {popularRoutes.map((route, index) => (
              <div key={index} className="flex items-center p-2 border rounded-full">
                <Badge className="bg-blue-100 text-blue-600 h-6 w-6 flex items-center justify-center p-0 rounded-full mr-3">
                  •
                </Badge>
                <span>{route.from} → {route.to}</span>
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
