
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { PropertyProps } from "./PropertyCard";
import { supabase } from "@/integrations/supabase/client";

interface MapProps {
  properties: PropertyProps[];
  selectedProperty: PropertyProps | null;
  onPropertySelect: (property: PropertyProps) => void;
}

const Map = ({ properties, selectedProperty, onPropertySelect }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const popupsRef = useRef<{ [key: string]: mapboxgl.Popup }>({});
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  // Fetch the Mapbox token from Supabase edge function
  useEffect(() => {
    const fetchMapboxToken = async () => {
      const { data, error } = await supabase.functions.invoke("get-mapbox-token");
      
      if (error) {
        console.error("Error fetching Mapbox token:", error);
        return;
      }
      
      if (data?.token) {
        setMapboxToken(data.token);
      }
    };

    fetchMapboxToken();
  }, []);

  // Initialize the map once we have the token
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-74.5, 40], // Default to NYC area
      zoom: 9,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  // Add markers for properties
  useEffect(() => {
    if (!map.current || !mapboxToken || properties.length === 0) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    Object.values(popupsRef.current).forEach(popup => popup.remove());
    markersRef.current = {};
    popupsRef.current = {};

    // Create a bounds object to fit all markers
    const bounds = new mapboxgl.LngLatBounds();
    
    // Function to convert an address to coordinates (geocoding)
    // In a real app, you'd use Mapbox's geocoding API
    // For this demo, we'll use mock coordinates based on the location string
    const getCoordinatesFromLocation = (location: string) => {
      // Mock coordinates based on the location string
      // In a real app, you'd use Mapbox's geocoding API
      const hash = location.split("").reduce((acc, char) => {
        return char.charCodeAt(0) + acc;
      }, 0);
      
      // Generate coordinates around NYC
      const lng = -74.0 + (hash % 10) * 0.01;
      const lat = 40.7 + (hash % 7) * 0.01;
      
      return [lng, lat];
    };

    properties.forEach(property => {
      // Get coordinates from property location
      const coordinates = getCoordinatesFromLocation(property.location);
      
      // Create a popup
      const popup = new mapboxgl.Popup({ closeButton: false, offset: 25 }).setHTML(`
        <div style="max-width: 220px;">
          <img src="${property.imageUrl}" alt="${property.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px;" />
          <h3 style="margin: 8px 0; font-weight: 600;">${property.title}</h3>
          <p style="margin: 4px 0; color: #4f46e5; font-weight: 600;">$${property.price.toLocaleString()}</p>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">${property.location}</p>
        </div>
      `);

      // Create a marker element
      const el = document.createElement("div");
      el.className = "marker";
      el.style.width = "36px";
      el.style.height = "36px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = selectedProperty?.id === property.id ? "#4f46e5" : "#fff";
      el.style.border = "2px solid #4f46e5";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.color = selectedProperty?.id === property.id ? "#fff" : "#4f46e5";
      el.style.fontWeight = "bold";
      el.style.fontSize = "14px";
      el.innerHTML = `$${Math.round(property.price / 1000)}k`;
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
      
      // Create a marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat(coordinates as [number, number])
        .setPopup(popup);
      
      // Add click event to marker
      el.addEventListener("click", () => {
        onPropertySelect(property);
        popup.addTo(map.current!);
      });
      
      // Show popup for selected property
      if (selectedProperty?.id === property.id) {
        popup.addTo(map.current!);
      }
      
      marker.addTo(map.current!);
      markersRef.current[property.id] = marker;
      popupsRef.current[property.id] = popup;
      
      // Extend bounds to include this marker
      bounds.extend(coordinates as [number, number]);
    });
    
    // Fit the map to the bounds with padding
    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [properties, selectedProperty, mapboxToken, onPropertySelect]);

  // Update selected property marker
  useEffect(() => {
    if (!map.current || !selectedProperty) return;
    
    // Update marker styles
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      if (id === selectedProperty.id) {
        el.style.backgroundColor = "#4f46e5";
        el.style.color = "#fff";
        el.style.zIndex = "10";
        el.style.width = "42px";
        el.style.height = "42px";
        
        // Show the popup for the selected property
        if (popupsRef.current[id]) {
          popupsRef.current[id].addTo(map.current!);
        }
        
        // Pan to the selected marker
        const coordinates = marker.getLngLat();
        map.current!.easeTo({
          center: coordinates,
          zoom: 13,
          duration: 800
        });
      } else {
        el.style.backgroundColor = "#fff";
        el.style.color = "#4f46e5";
        el.style.zIndex = "1";
        el.style.width = "36px";
        el.style.height = "36px";
        
        // Hide popup for non-selected properties
        if (popupsRef.current[id] && popupsRef.current[id].isOpen()) {
          popupsRef.current[id].remove();
        }
      }
    });
  }, [selectedProperty]);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden">
      {!mapboxToken && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <div className="w-8 h-8 border-4 border-t-primary border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;
