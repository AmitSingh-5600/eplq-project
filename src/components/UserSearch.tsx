
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserSearchProps {
  onSearch: (location: { lat: number; lng: number }, radius: number, category: string) => void;
  isSearching: boolean;
}

export function UserSearch({ onSearch, isSearching }: UserSearchProps) {
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.006 });
  const [radius, setRadius] = useState(5);
  const [category, setCategory] = useState("all");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(newLocation);
          setIsGettingLocation(false);
          toast({
            title: "Location updated",
            description: "Your current location has been set.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsGettingLocation(false);
          toast({
            title: "Location error",
            description: "Unable to get your location. Using default location instead.",
            variant: "destructive",
          });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setIsGettingLocation(false);
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    onSearch(location, radius, category);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Your Location</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="latitude" className="text-xs">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="0.0001"
              value={location.lat}
              onChange={(e) => setLocation({ ...location, lat: parseFloat(e.target.value) })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="longitude" className="text-xs">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="0.0001"
              value={location.lng}
              onChange={(e) => setLocation({ ...location, lng: parseFloat(e.target.value) })}
            />
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-2" 
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
        >
          {isGettingLocation ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="mr-2 h-4 w-4" />
          )}
          Get Current Location
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={category} 
            onValueChange={(value) => setCategory(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Hospital">Hospitals</SelectItem>
              <SelectItem value="Police">Police Stations</SelectItem>
              <SelectItem value="Pharmacy">Pharmacies</SelectItem>
              <SelectItem value="Park">Parks</SelectItem>
              <SelectItem value="Library">Libraries</SelectItem>
              <SelectItem value="School">Schools</SelectItem>
              <SelectItem value="Restaurant">Restaurants</SelectItem>
              <SelectItem value="Grocery">Grocery Stores</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="radius">Search Radius (km)</Label>
            <span className="text-sm text-muted-foreground">{radius} km</span>
          </div>
          <Slider
            id="radius"
            min={1}
            max={20}
            step={1}
            value={[radius]}
            onValueChange={(value) => setRadius(value[0])}
            className="py-4"
          />
        </div>
      </div>

      <Button 
        className="w-full" 
        onClick={handleSearch}
        disabled={isSearching}
      >
        {isSearching ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Search className="mr-2 h-4 w-4" />
        )}
        Search Securely
      </Button>
    </div>
  );
}
