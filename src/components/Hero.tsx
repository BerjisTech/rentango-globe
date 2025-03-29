
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
    <div className="relative h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transform scale-110 transition-transform duration-10000 ease-in-out"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')",
        }}
      >
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      <div className="container mx-auto px-4 z-10 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect Stay & Travel Experience
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Search for vacation rentals, long-term stays, homes for sale, and transportation options
          </p>

          <div className="glass-card rounded-2xl shadow-2xl p-6 animate-scale-in">
            <Tabs defaultValue="short-term" onValueChange={setSearchType} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="short-term" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Short Term</span>
                </TabsTrigger>
                <TabsTrigger value="long-term" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                  <House className="h-4 w-4" />
                  <span className="hidden sm:inline">Long Term</span>
                </TabsTrigger>
                <TabsTrigger value="for-sale" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                  <House className="h-4 w-4" />
                  <span className="hidden sm:inline">For Sale</span>
                </TabsTrigger>
                <TabsTrigger value="transportation" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span className="hidden sm:inline">Transport</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="short-term" className="mt-0">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Where are you going?"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pr-24 bg-white/80 backdrop-blur-sm border-0 shadow-sm h-12 rounded-xl"
                  />
                  <Button 
                    onClick={handleSearch} 
                    className="absolute right-1 top-1 rounded-lg h-10 px-4"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="long-term" className="mt-0">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Where are you looking to rent?"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pr-24 bg-white/80 backdrop-blur-sm border-0 shadow-sm h-12 rounded-xl"
                  />
                  <Button 
                    onClick={handleSearch} 
                    className="absolute right-1 top-1 rounded-lg h-10 px-4"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="for-sale" className="mt-0">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Where are you looking to buy?"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pr-24 bg-white/80 backdrop-blur-sm border-0 shadow-sm h-12 rounded-xl"
                  />
                  <Button 
                    onClick={handleSearch} 
                    className="absolute right-1 top-1 rounded-lg h-10 px-4"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="transportation" className="mt-0">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Where do you need transportation?"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pr-24 bg-white/80 backdrop-blur-sm border-0 shadow-sm h-12 rounded-xl"
                  />
                  <Button 
                    onClick={() => navigate(`/transportation?location=${encodeURIComponent(searchLocation)}`)} 
                    className="absolute right-1 top-1 rounded-lg h-10 px-4"
                  >
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
