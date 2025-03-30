
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, ArrowRight, Home, Square } from "lucide-react";
import { Heart } from "lucide-react";

export type PropertyType = "short-term" | "long-term" | "for-sale";

export interface PropertyProps {
  id: string;
  title: string;
  location: string;
  price: number;
  priceUnit: string; // "night" | "month" | "total"
  type: PropertyType;
  imageUrl: string;
  beds?: number;
  baths?: number;
  area?: number;
  hasTransport?: boolean;
  featured?: boolean;
  rating?: number;
  reviews?: number;
}

const PropertyCard = ({ 
  id, 
  title, 
  location, 
  price, 
  priceUnit, 
  type,
  imageUrl, 
  beds, 
  baths, 
  area,
  hasTransport,
  featured,
  rating,
  reviews 
}: PropertyProps) => {
  const priceLabel = 
    type === "short-term" ? `/night` :
    type === "long-term" ? `/month` : "";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 shadow-sm rounded-xl relative">
      <div className="relative h-44 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <button className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors">
          <Heart className="h-4 w-4 text-gray-500" />
        </button>
        {featured && (
          <div className="absolute bottom-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded text-black font-medium">
            Featured
          </div>
        )}
      </div>
      
      <CardContent className="px-3 pt-3 pb-2">
        <div className="mb-1">
          <div className="text-lg font-semibold text-primary">${price.toLocaleString()}</div>
        </div>
        
        <div className="text-sm font-medium mb-1">{title}</div>
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-600 border-t border-gray-100 pt-2">
          {beds && (
            <div className="flex items-center">
              <Bed className="h-3.5 w-3.5 mr-1 text-gray-400" />
              <span>{beds} bd</span>
            </div>
          )}
          {baths && (
            <div className="flex items-center">
              <Bath className="h-3.5 w-3.5 mr-1 text-gray-400" />
              <span>{baths} ba</span>
            </div>
          )}
          {area && (
            <div className="flex items-center">
              <Square className="h-3.5 w-3.5 mr-1 text-gray-400" />
              <span>{area} ft²</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
