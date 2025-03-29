
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car, Calendar, User } from "lucide-react";

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
  hasTransport, 
  rating,
  reviews 
}: PropertyProps) => {
  const priceLabel = 
    type === "short-term" ? `/night` :
    type === "long-term" ? `/month` : "";

  const typeLabel = 
    type === "short-term" ? "Short-term" :
    type === "long-term" ? "Long-term" : "For Sale";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        <Badge className="absolute top-2 left-2 bg-primary">{typeLabel}</Badge>
        {hasTransport && (
          <Badge className="absolute top-2 right-2 bg-accent text-white flex items-center gap-1">
            <Car className="h-3 w-3" />
            <span>Transport Available</span>
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">{title}</CardTitle>
        </div>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>{location}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-600 space-x-4">
            {beds && (
              <div>
                <span className="font-medium">{beds}</span> Beds
              </div>
            )}
            {baths && (
              <div>
                <span className="font-medium">{baths}</span> Baths
              </div>
            )}
          </div>
          {rating && (
            <div className="flex items-center gap-1 text-sm">
              <span className="flex items-center bg-green-500 text-white px-1.5 py-0.5 rounded">
                {rating}★
              </span>
              <span className="text-gray-500">({reviews})</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-2">
        <div className="text-lg font-bold">
          {type === "for-sale" ? (
            <span>Ksh {price.toLocaleString()}</span>
          ) : (
            <div>
              <span>Ksh {price.toLocaleString()}</span>
              <span className="text-sm text-gray-500">{priceLabel}</span>
            </div>
          )}
        </div>
        
        <Link to={`/property/${id}`}>
          <Button variant="outline" size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
