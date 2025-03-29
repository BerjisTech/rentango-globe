import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Car, Home, MapPin, Search } from "lucide-react";
const Hero = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState("");
  const [searchType, setSearchType] = useState("short-term");
  const handleSearch = () => {
    navigate(`/properties?type=${searchType}&location=${encodeURIComponent(searchLocation)}`);
  };
  return <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 bg-cover bg-center" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')"
    }}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="container mx-auto px-4 z-10 w-full max-w-5xl">
        <div className="mx-auto text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
            Find Your Perfect Home <span className="text-primary/90">Away</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Discover beautiful properties and unique experiences in incredible locations around the world
          </p>
        </div>

        <div className="glass-card rounded-3xl shadow-xl p-6 animate-scale-in mx-auto max-w-3xl">
          <Tabs defaultValue="short-term" onValueChange={setSearchType} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6 bg-muted/30 p-1 rounded-xl border border-white/10">
              <TabsTrigger value="short-term" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Short Term</span>
              </TabsTrigger>
              <TabsTrigger value="long-term" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Long Term</span>
              </TabsTrigger>
              <TabsTrigger value="for-sale" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>For Sale</span>
              </TabsTrigger>
              <TabsTrigger value="transportation" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                <Car className="h-4 w-4" />
                <span>Transport</span>
              </TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              <div className="relative">
                <div className="relative flex items-center overflow-hidden rounded-2xl">
                  <MapPin className="absolute left-4 text-gray-400" size={20} />
                  <Input type="text" placeholder="Where are you going?" value={searchLocation} onChange={e => setSearchLocation(e.target.value)} className="w-full pl-12 pr-24 bg-white/95 backdrop-blur-sm border-0 shadow-sm h-14 rounded-2xl" />
                  <Button onClick={handleSearch} className="absolute right-1 top-1 rounded-xl h-12 px-5 bg-white/30 backdrop-blur-md text-indigo-500">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="ghost" className="bg-white/20 rounded-full text-xs hover:bg-white/40 font-normal">
                  Popular: Mombasa
                </Button>
                <Button variant="ghost" className="bg-white/20 rounded-full text-xs hover:bg-white/40 font-normal">
                  Nairobi
                </Button>
                <Button variant="ghost" className="bg-white/20 rounded-full text-xs hover:bg-white/40 font-normal">
                  Malindi
                </Button>
                <Button variant="ghost" className="bg-white/20 rounded-full text-xs hover:bg-white/40 font-normal">
                  Lamu
                </Button>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>;
};
export default Hero;