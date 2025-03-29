
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
import { MapPin, Car, Calendar, Users } from "lucide-react";

export interface VehicleProps {
  id: string;
  title: string;
  type: "car" | "van" | "bus" | "taxi";
  location: string;
  price: number;
  priceUnit: string; // "day" | "trip" | "km"
  imageUrl: string;
  seats: number;
  rating?: number;
  reviews?: number;
}

const VehicleCard = ({ 
  id, 
  title, 
  type, 
  location, 
  price, 
  priceUnit, 
  imageUrl, 
  seats, 
  rating,
  reviews 
}: VehicleProps) => {
  const priceLabel = 
    priceUnit === "day" ? "/day" :
    priceUnit === "trip" ? "/trip" : "/km";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        <Badge className="absolute top-2 left-2 bg-primary capitalize">{type}</Badge>
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
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span className="font-medium">{seats}</span> Seats
            </div>
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
          <span>Ksh {price.toLocaleString()}</span>
          <span className="text-sm text-gray-500">{priceLabel}</span>
        </div>
        
        <Link to={`/vehicle/${id}`}>
          <Button variant="outline" size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
