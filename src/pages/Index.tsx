
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Map, UserCog } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-12 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="text-primary">EPLQ</span> - Privacy-Preserving Location Queries
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Search for Points of Interest without revealing your location. 
              Advanced encryption ensures your privacy while providing relevant results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Privacy-First"
              description="All location data is encrypted on your device before being sent to the server."
            />
            <FeatureCard 
              icon={<Map className="h-10 w-10 text-primary" />}
              title="Location Search"
              description="Find points of interest near you without revealing your exact location."
            />
            <FeatureCard 
              icon={<UserCog className="h-10 w-10 text-primary" />}
              title="Admin Controls"
              description="Administrators can add encrypted POI data to the database."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button 
              size="lg" 
              onClick={() => navigate("/user")}
              className="animate-pulse"
            >
              User Portal
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/admin")}
            >
              Admin Portal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) {
  return (
    <div className="flex flex-col items-center p-6 bg-background/50 border rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105">
      <div className="p-2 rounded-full bg-primary/10 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  );
}
