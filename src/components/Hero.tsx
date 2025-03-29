
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Car, House, Search } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState("");
  const [searchType, setSearchType] = useState("short-term");

  const handleSearch = () => {
    navigate(`/properties?type=${searchType}&location=${encodeURIComponent(searchLocation)}`);
  };

  return (
    <div className="relative h-[600px] flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')",
        }}
      >
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Find Your Perfect Stay & Travel Experience
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Search for vacation rentals, long-term stays, homes for sale, and transportation options
          </p>

          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <Tabs defaultValue="short-term" onValueChange={setSearchType}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="short-term" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Short Term</span>
                </TabsTrigger>
                <TabsTrigger value="long-term" className="flex items-center gap-2">
                  <House className="h-4 w-4" />
                  <span className="hidden sm:inline">Long Term</span>
                </TabsTrigger>
                <TabsTrigger value="for-sale" className="flex items-center gap-2">
                  <House className="h-4 w-4" />
                  <span className="hidden sm:inline">For Sale</span>
                </TabsTrigger>
                <TabsTrigger value="transportation" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span className="hidden sm:inline">Transport</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="short-term" className="mt-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Where are you going?"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button onClick={handleSearch} className="whitespace-nowrap">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="long-term" className="mt-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Where are you looking to rent?"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button onClick={handleSearch} className="whitespace-nowrap">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="for-sale" className="mt-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Where are you looking to buy?"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button onClick={handleSearch} className="whitespace-nowrap">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="transportation" className="mt-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Where do you need transportation?"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button onClick={() => navigate(`/transportation?location=${encodeURIComponent(searchLocation)}`)} className="whitespace-nowrap">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
