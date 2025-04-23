
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center space-y-8">
        <div className="flex justify-center">
          <FileQuestion className="h-24 w-24 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate("/")} className="mt-4">
          <Home className="mr-2 h-4 w-4" /> Return Home
        </Button>
      </div>
    </div>
  );
}
