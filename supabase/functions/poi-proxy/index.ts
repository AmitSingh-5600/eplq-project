
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lng, radius, category } = await req.json();
    
    // Validate input
    if (!lat || !lng || !radius) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Received search request for location (${lat}, ${lng}) with radius ${radius}km`);
    
    // Privacy enhancement: Apply location obfuscation
    // Shift the actual location by a small random amount to protect user privacy
    const obfuscatedLocation = obfuscateLocation(lat, lng);
    console.log(`Obfuscated location: (${obfuscatedLocation.lat}, ${obfuscatedLocation.lng})`);

    // In a production app, we would make an actual API call to a mapping service
    // For demo purposes, we'll generate synthetic POI data based on the obfuscated location
    const results = await generateSyntheticPOIs(obfuscatedLocation.lat, obfuscatedLocation.lng, radius, category);
    
    // Return the results with the original search coordinates for the client
    // This gives accurate distance calculations relative to the user
    const processedResults = results.map(poi => ({
      ...poi,
      distance: calculateDistance(lat, lng, poi.lat, poi.lng)
    }));

    return new Response(
      JSON.stringify(processedResults),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error processing request:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Function to obfuscate user location
function obfuscateLocation(lat: number, lng: number) {
  // Apply a random offset within 1km radius
  // This creates a privacy zone around the actual location
  const latOffset = (Math.random() - 0.5) * 0.02; // ~ 1km in latitude
  const lngOffset = (Math.random() - 0.5) * 0.02; // ~ 1km in longitude
  
  return {
    lat: lat + latOffset,
    lng: lng + lngOffset
  };
}

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

// Function to generate synthetic POIs
async function generateSyntheticPOIs(lat: number, lng: number, radius: number, category?: string) {
  // Categories of POIs with their probabilities
  const categories = ['Hospital', 'Police', 'Pharmacy', 'Park', 'Library', 'School', 'Restaurant', 'Grocery'];
  
  // Number of POIs to generate based on radius (more POIs for larger radius)
  const numPOIs = Math.min(Math.floor(radius * 3), 20);
  
  // Generate random POIs
  const pois = [];
  for (let i = 0; i < numPOIs; i++) {
    // Random angle and distance from center
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radius;
    
    // Convert angle and distance to lat/lng offset
    // 1 degree of latitude is approximately 111 km
    const latOffset = (distance / 111) * Math.sin(angle);
    // 1 degree of longitude varies with latitude
    const lngOffset = (distance / (111 * Math.cos(toRadians(lat)))) * Math.cos(angle);
    
    // Determine POI category
    let poiCategory = categories[Math.floor(Math.random() * categories.length)];
    if (category && category !== 'all') {
      poiCategory = category;
    }
    
    // Generate a plausible name based on category
    const name = generatePlausibleName(poiCategory);
    
    pois.push({
      id: i + 1,
      name,
      category: poiCategory,
      lat: lat + latOffset,
      lng: lng + lngOffset,
      distance // This will be recalculated client-side
    });
  }
  
  return pois;
}

function generatePlausibleName(category: string): string {
  const directions = ['North', 'South', 'East', 'West', 'Central', 'Downtown', 'Uptown', 'Riverside', 'Lakeside', 'Highland'];
  const adjectives = ['Community', 'Regional', 'City', 'County', 'Memorial', 'General', 'Public', 'Private'];
  
  const randomDirection = directions[Math.floor(Math.random() * directions.length)];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  
  switch (category) {
    case 'Hospital':
      return `${randomDirection} ${randomAdjective} Hospital`;
    case 'Police':
      return `${randomDirection} Police Station`;
    case 'Pharmacy':
      return `${randomDirection} ${randomAdjective} Pharmacy`;
    case 'Park':
      return `${randomDirection} ${randomAdjective} Park`;
    case 'Library':
      return `${randomDirection} ${randomAdjective} Library`;
    case 'School':
      return `${randomDirection} ${randomAdjective} School`;
    case 'Restaurant':
      return `${randomDirection} Bistro & Grill`;
    case 'Grocery':
      return `${randomDirection} Market`;
    default:
      return `${randomDirection} ${category}`;
  }
}
