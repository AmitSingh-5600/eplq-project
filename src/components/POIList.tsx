
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Trash2, Lock, Eye, EyeOff } from "lucide-react";

interface POI {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
}

interface POIListProps {
  pois: POI[];
  onDelete: (id: string) => void;
}

export function POIList({ pois, onDelete }: POIListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEncrypted, setShowEncrypted] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState<string | null>(null);

  const filteredPOIs = pois.filter((poi) => 
    poi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poi.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEncryptedValue = (value: string | number) => {
    return showEncrypted ? value : "••••••••••••••";
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "hospital": return "bg-red-500 hover:bg-red-600";
      case "police": return "bg-blue-500 hover:bg-blue-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const handleConfirmDelete = () => {
    if (selectedPOI) {
      onDelete(selectedPOI);
      setSelectedPOI(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search POIs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowEncrypted(!showEncrypted)}
          title={showEncrypted ? "Hide encrypted data" : "Show encrypted data"}
        >
          {showEncrypted ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="border rounded-md">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPOIs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                    No POIs found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPOIs.map((poi) => (
                  <TableRow key={poi.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Lock className="h-3 w-3 mr-2 text-muted-foreground" />
                        {showEncrypted ? poi.name : getEncryptedValue(poi.name)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(poi.category)}>
                        {showEncrypted ? poi.category : getEncryptedValue(poi.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {showEncrypted ? (
                          <>
                            Lat: {poi.lat}, Lng: {poi.lng}
                          </>
                        ) : (
                          getEncryptedValue("Lat: 00.0000, Lng: 00.0000")
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => setSelectedPOI(poi.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the encrypted POI data.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmDelete}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
