
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserSearch } from "@/components/UserSearch";
import { POIResults } from "@/components/POIResults";
import { toast } from "@/hooks/use-toast";
import { BookUser, ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { supabase } from "@/integrations/supabase/client";

export default function UserPortal() {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async (location: { lat: number; lng: number }, radius: number, category: string) => {
    setIsSearching(true);
    
    try {
      // Call our privacy-focused proxy edge function
      const { data, error } = await supabase.functions.invoke('poi-proxy', {
        body: { lat: location.lat, lng: location.lng, radius, category }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSearchResults(data || []);
      toast({
        title: "Search completed",
        description: `Found ${data.length} POIs within ${radius}km of your location.`,
      });
    } catch (error) {
      console.error("Error searching for POIs:", error);
      toast({
        title: "Search error",
        description: "There was an error searching for POIs. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center">
            <BookUser className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold">User Portal</h1>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
          <Shield className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-800">Privacy Protection Active</h3>
            <p className="text-sm text-blue-600">
              Your location data is obfuscated before being used for searches. 
              External mapping services can't directly associate searches with your actual location.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Privacy-First Search</CardTitle>
              <CardDescription>
                Find Points of Interest nearby with privacy protection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserSearch onSearch={handleSearch} isSearching={isSearching} />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Secure POI Results</CardTitle>
              <CardDescription>
                Results are processed through a privacy-preserving proxy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <POIResults results={searchResults} isLoading={isSearching} />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
