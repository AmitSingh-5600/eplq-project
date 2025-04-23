
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AddPOIForm } from "@/components/AddPOIForm";
import { POIList } from "@/components/POIList";
import { toast } from "@/hooks/use-toast";
import MainLayout from "@/components/layouts/MainLayout";
import { supabase } from "@/integrations/supabase/client";

// Define POI type interface to match our database table
interface POI {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  user_id?: string;
  created_at?: string;
}

export default function AdminPortal() {
  const navigate = useNavigate();
  const [pois, setPois] = useState<POI[]>([]);

  useEffect(() => {
    // Fetch POIs when the component mounts
    fetchPOIs();
  }, []);

  const fetchPOIs = async () => {
    const { data, error } = await supabase
      .from('points_of_interest')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching POIs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch POIs",
        variant: "destructive"
      });
    } else {
      setPois(data || []);
    }
  };

  const handleAddPOI = async (poiData: Omit<POI, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('points_of_interest')
        .insert(poiData)
        .select();

      if (error) {
        console.error("Error adding POI:", error);
        toast({
          title: "Error",
          description: "Failed to add POI",
          variant: "destructive"
        });
      } else if (data) {
        setPois((current) => [data[0], ...current]);
        toast({
          title: "POI Added",
          description: "The Point of Interest has been successfully added.",
        });
      }
    } catch (err) {
      console.error("Exception adding POI:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDeletePOI = async (id: string) => {
    try {
      const { error } = await supabase
        .from('points_of_interest')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting POI:", error);
        toast({
          title: "Error",
          description: "Failed to delete POI",
          variant: "destructive"
        });
      } else {
        setPois((current) => current.filter((poi) => poi.id !== id));
        toast({
          title: "POI Deleted",
          description: "The Point of Interest has been removed.",
        });
      }
    } catch (err) {
      console.error("Exception deleting POI:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
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
            <ShieldAlert className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold">Admin Portal</h1>
          </div>
        </div>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="add">Add POI</TabsTrigger>
            <TabsTrigger value="manage">Manage POIs</TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add Point of Interest</CardTitle>
                <CardDescription>
                  Add a new POI to the database. All data will be encrypted.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddPOIForm onSubmit={handleAddPOI} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Manage Points of Interest</CardTitle>
                <CardDescription>
                  View and manage encrypted POIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <POIList pois={pois} onDelete={handleDeletePOI} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
