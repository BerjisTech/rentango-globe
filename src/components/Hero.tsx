
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState("");
  const [searchType, setSearchType] = useState("short-term");

  const handleSearch = () => {
    navigate(`/properties?type=${searchType}&location=${encodeURIComponent(searchLocation)}`);
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-start overflow-hidden bg-sky-50">
      {/* Background Image */}
      <div className="absolute right-0 top-0 w-1/2 h-full z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{
            backgroundImage: "url('/lovable-uploads/64c0b3c1-bc93-46fd-a0b7-a17165b4566d.png')"
          }}
        />
        <div className="absolute left-0 bottom-36 -translate-x-1/2">
          <div className="h-12 w-12 bg-sky-100 rounded-full flex items-center justify-center">
            <div className="h-4 w-4 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-10 z-10 pt-12 pb-32">
        <div className="max-w-2xl">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-tight mb-6">
            Homes<br />
            That match.
          </h1>
          
          <p className="text-lg text-gray-600 mb-10">
            The #1 trusted site for real estate professionals
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-4 max-w-xl">
            <Tabs defaultValue="short-term" onValueChange={setSearchType} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="short-term" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Rent
                </TabsTrigger>
                <TabsTrigger value="for-sale" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Buy
                </TabsTrigger>
                <TabsTrigger value="long-term" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Sell
                </TabsTrigger>
              </TabsList>

              <div className="relative">
                <div className="relative flex items-center overflow-hidden rounded-xl">
                  <MapPin className="absolute left-4 text-gray-400" size={20} />
                  <Input 
                    type="text" 
                    placeholder="Enter location" 
                    value={searchLocation} 
                    onChange={e => setSearchLocation(e.target.value)} 
                    className="w-full pl-12 bg-white border border-gray-200 h-14 rounded-xl" 
                  />
                  <Button 
                    onClick={handleSearch} 
                    className="absolute right-1 top-1 rounded-lg h-12 px-5 bg-black text-white"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
