
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Lock, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface AddPOIFormProps {
  onSubmit: (data: any) => void;
}

export function AddPOIForm({ onSubmit }: AddPOIFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    lat: 40.7128,
    lng: -74.006,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleLocationDemo = () => {
    // Simulate getting a random location for demo purposes
    const randomLat = 40.7 + (Math.random() * 0.1);
    const randomLng = -74.0 + (Math.random() * 0.1);
    
    setFormData((prev) => ({
      ...prev,
      lat: parseFloat(randomLat.toFixed(4)),
      lng: parseFloat(randomLng.toFixed(4)),
    }));
    
    toast({
      title: "Location Updated",
      description: "Random location has been set for demonstration.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate encryption and API call
    setTimeout(() => {
      // In a real app, this would encrypt the data before submitting
      onSubmit(formData);
      
      setFormData({
        name: "",
        description: "",
        category: "",
        lat: 40.7128,
        lng: -74.006,
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">POI Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Central Hospital"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of this location..."
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={handleCategoryChange} required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hospital">Hospital</SelectItem>
              <SelectItem value="Police">Police Station</SelectItem>
              <SelectItem value="Pharmacy">Pharmacy</SelectItem>
              <SelectItem value="Park">Park</SelectItem>
              <SelectItem value="Library">Library</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />
      
      <div>
        <Label className="block mb-2">Location</Label>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="space-y-1">
            <Label htmlFor="latitude" className="text-xs">Latitude</Label>
            <Input
              id="latitude"
              name="lat"
              type="number"
              step="0.0001"
              value={formData.lat}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="longitude" className="text-xs">Longitude</Label>
            <Input
              id="longitude"
              name="lng"
              type="number"
              step="0.0001"
              value={formData.lng}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={handleLocationDemo}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Set Demo Location
        </Button>
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Encrypting & Saving...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Encrypt & Save POI
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
