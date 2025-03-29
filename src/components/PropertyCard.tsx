
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
import { MapPin, Bed, Bath, ArrowRight, Home, SquareFeet } from "lucide-react";

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
  rating,
  reviews 
}: PropertyProps) => {
  const priceLabel = 
    type === "short-term" ? `/night` :
    type === "long-term" ? `/month` : "";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-0 shadow-sm rounded-2xl">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardHeader className="px-4 pt-4 pb-0">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <CardDescription className="flex items-center mt-1 text-gray-600">
              <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
              <span>{location}</span>
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">
              ${price.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              {priceLabel}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 py-3">
        <div className="flex items-center text-sm text-gray-600 space-x-4 border-t border-gray-100 pt-3">
          {beds && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1 text-gray-400" />
              <span>{beds} bd</span>
            </div>
          )}
          {baths && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1 text-gray-400" />
              <span>{baths} ba</span>
            </div>
          )}
          {area && (
            <div className="flex items-center">
              <SquareFeet className="h-4 w-4 mr-1 text-gray-400" />
              <span>{area} sqft</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pt-0 pb-4 flex justify-end">
        <Link to={`/property/${id}`}>
          <Button variant="outline" size="sm" className="rounded-full px-4">
            View more
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
