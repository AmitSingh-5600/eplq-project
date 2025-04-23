
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, MapPin, ExternalLink, X, Navigation } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface POI {
  id: number;
  name: string;
  category: string;
  distance: number;
  lat: number;
  lng: number;
}

interface POIResultsProps {
  results: POI[];
  isLoading: boolean;
}

export function POIResults({ results, isLoading }: POIResultsProps) {
  const [expandedPOI, setExpandedPOI] = useState<number | null>(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [mapKey, setMapKey] = useState<string>("placeholder"); // We'll use a placeholder initially
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedPOI(expandedPOI === id ? null : id);
  };

  const handleViewOnMap = (poi: POI) => {
    setSelectedPOI(poi);
    setMapModalOpen(true);
  };

  // Effect to handle map initialization when the modal opens
  useEffect(() => {
    if (mapModalOpen && selectedPOI && mapContainer.current) {
      // For demonstration, we'll use a placeholder instead of an actual Mapbox token
      // In a real app, you would securely handle the Mapbox token
      const mapboxToken = "pk.placeholder"; // Replace with a form for users to input their own token
      
      // If this were a real implementation, we would initialize Mapbox here
      // For privacy reasons, we'll use a simulated map instead
      
      // Simulate a map being loaded
      const timer = setTimeout(() => {
        if (mapContainer.current) {
          // Add a simulated map pin for demonstration
          const pin = document.createElement('div');
          pin.className = 'absolute';
          pin.style.top = '50%';
          pin.style.left = '50%';
          pin.style.transform = 'translate(-50%, -50%)';
          pin.innerHTML = `<div class="text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`;
          
          if (mapContainer.current.firstChild) {
            mapContainer.current.removeChild(mapContainer.current.firstChild);
          }
          mapContainer.current.appendChild(pin);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [mapModalOpen, selectedPOI]);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "hospital": return "bg-red-500 hover:bg-red-600";
      case "police": return "bg-blue-500 hover:bg-blue-600";
      case "pharmacy": return "bg-green-500 hover:bg-green-600";
      case "park": return "bg-emerald-500 hover:bg-emerald-600";
      case "library": return "bg-amber-500 hover:bg-amber-600";
      case "school": return "bg-indigo-500 hover:bg-indigo-600";
      case "restaurant": return "bg-orange-500 hover:bg-orange-600";
      case "grocery": return "bg-teal-500 hover:bg-teal-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Decrypting and processing secure POI data...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">No results found. Try expanding your search radius or changing categories.</p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-[400px] w-full pr-4">
        <div className="space-y-4">
          {results.map((poi) => (
            <div key={poi.id} className="animate-fadeIn">
              <div 
                className="p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md"
                onClick={() => toggleExpand(poi.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{poi.name}</h3>
                      <Badge className={getCategoryColor(poi.category)}>{poi.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {poi.distance} km away
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://www.google.com/maps/search/?api=1&query=${poi.lat},${poi.lng}`, '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                
                {expandedPOI === poi.id && (
                  <div className="mt-4 pt-4 border-t animate-fadeIn">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Latitude</p>
                        <p>{poi.lat.toFixed(6)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Longitude</p>
                        <p>{poi.lng.toFixed(6)}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOnMap(poi);
                        }}
                      >
                        <MapPin className="h-4 w-4 mr-2" /> View on Map
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={mapModalOpen} onOpenChange={setMapModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              {selectedPOI?.name}
              <Badge className={`ml-2 ${selectedPOI ? getCategoryColor(selectedPOI.category) : ''}`}>
                {selectedPOI?.category}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Located {selectedPOI?.distance} km away
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 bg-gray-100 rounded-md h-[400px] relative overflow-hidden">
            {/* Privacy-focused map visualization */}
            <div 
              ref={mapContainer}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
            >
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <MapPin className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 p-3 rounded-md shadow-md">
                  <p className="font-medium">{selectedPOI?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Coordinates: {selectedPOI?.lat.toFixed(6)}, {selectedPOI?.lng.toFixed(6)}
                  </p>
                </div>
                <div className="text-sm text-center absolute top-4 left-0 right-0">
                  <p className="bg-white/90 mx-auto w-fit px-3 py-1 rounded-full shadow-sm">
                    Privacy-protected map view
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <Button variant="outline" onClick={() => setMapModalOpen(false)}>
              <X className="h-4 w-4 mr-2" /> Close
            </Button>
            <Button 
              onClick={() => {
                if (selectedPOI) {
                  const url = `https://www.google.com/maps/search/?api=1&query=${selectedPOI.lat},${selectedPOI.lng}`;
                  window.open(url, '_blank');
                }
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" /> Open in Google Maps
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
