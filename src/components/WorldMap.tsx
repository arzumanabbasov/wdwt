
import { useEffect, useRef, useState } from 'react';
import { CountryAnalysis } from '../types';

// Instead of importing from the module directly, we'll use the global L variable
// that's available from the script tag in index.html
declare const L: any;

interface WorldMapProps {
  countries: CountryAnalysis[];
  onCountryClick: (country: CountryAnalysis) => void;
}

const WorldMap = ({ countries, onCountryClick }: WorldMapProps) => {
  const mapRef = useRef<any | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Wait a moment for the DOM to be ready
    const initMap = setTimeout(() => {
      try {
        // Initialize map if it doesn't exist
        if (!mapRef.current) {
          console.log("Initializing map");
          mapRef.current = L.map(mapContainer.current).setView([20, 0], 2);
    
          // Add the base tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(mapRef.current);
    
          // Disable scroll wheel zoom for smoother experience
          mapRef.current.scrollWheelZoom.disable();
        }
    
        // Create a mapping of country names to our analysis data
        const countryMap = new Map<string, CountryAnalysis>();
        
        // Create a more comprehensive country name mapping to handle variations
        const countryNameMap: Record<string, string> = {
          'UNITED STATES': 'USA',
          'UNITED STATES OF AMERICA': 'USA', 
          'UNITED KINGDOM': 'UK',
          'GREAT BRITAIN': 'UK',
          'RUSSIA': 'RUSSIAN FEDERATION',
          'SOUTH KOREA': 'KOREA, REPUBLIC OF',
          'NORTH KOREA': "KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF",
          'UAE': 'UNITED ARAB EMIRATES',
          'USA': 'UNITED STATES',
          'UK': 'UNITED KINGDOM',
          'IVORY COAST': "CÔTE D'IVOIRE",
          'COTE D\'IVOIRE': "CÔTE D'IVOIRE",
          'MYANMAR': 'BURMA',
          'ESWATINI': 'SWAZILAND',
          'CZECHIA': 'CZECH REPUBLIC',
          'DEMOCRATIC REPUBLIC OF THE CONGO': 'CONGO, THE DEMOCRATIC REPUBLIC OF THE',
          'REPUBLIC OF THE CONGO': 'CONGO',
          'DR CONGO': 'CONGO, THE DEMOCRATIC REPUBLIC OF THE',
          'CONGO-BRAZZAVILLE': 'CONGO',
          'CONGO-KINSHASA': 'CONGO, THE DEMOCRATIC REPUBLIC OF THE',
          'EAST TIMOR': 'TIMOR-LESTE',
          'VATICAN CITY': 'HOLY SEE (VATICAN CITY STATE)',
          'PALESTINE': 'PALESTINIAN TERRITORY, OCCUPIED',
          'TAIWAN': 'TAIWAN, PROVINCE OF CHINA',
          'NORTH MACEDONIA': 'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF',
          'MACEDONIA': 'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF'
        };
        
        if (Array.isArray(countries)) {
          countries.forEach(country => {
            if (country && country.countryName) {
              const normalizedName = country.countryName.toUpperCase();
              countryMap.set(normalizedName, country);
              
              // Add mapped variations if they exist
              if (countryNameMap[normalizedName]) {
                countryMap.set(countryNameMap[normalizedName], country);
              }
            }
          });
        }
    
        console.log("Countries data loaded:", countries.length, "countries");
        console.log("Country map created with", countryMap.size, "entries");
    
        // Add GeoJSON data for countries
        fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
          .then(response => response.json())
          .then(data => {
            let countryHits = 0;
            let countryMisses = 0;
            let missedCountries = [];
            
            function getColor(feature: any): string {
              if (!feature || !feature.properties || !feature.properties.name) {
                countryMisses++;
                return '#e5e7eb'; // Default gray
              }
              
              const countryName = feature.properties.name?.toUpperCase();
              let countryData = countryMap.get(countryName);
              
              // Try alternative names if direct lookup fails
              if (!countryData && countryNameMap[countryName]) {
                countryData = countryMap.get(countryNameMap[countryName]);
              }
              
              if (!countryData) {
                countryMisses++;
                missedCountries.push(feature.properties.name);
                return '#e5e7eb'; // Default gray for countries we don't have data for
              }
              
              countryHits++;
              switch (countryData.stance) {
                case 'agree': return '#22c55e'; // Green
                case 'disagree': return '#ef4444'; // Red
                case 'mixed': return '#eab308'; // Yellow
                default: return '#e5e7eb'; // Gray for unknown
              }
            }
    
            // Add the GeoJSON layer
            if (mapRef.current) {
              const geoJsonLayer = L.geoJSON(data, {
                style: (feature: any) => ({
                  fillColor: getColor(feature),
                  weight: 1,
                  opacity: 1,
                  color: 'white',
                  fillOpacity: 0.7
                }),
                onEachFeature: (feature: any, layer: any) => {
                  const countryName = feature.properties.name?.toUpperCase();
                  let countryData = countryMap.get(countryName);
                  
                  // Try alternative names if direct lookup fails
                  if (!countryData && countryNameMap[countryName]) {
                    countryData = countryMap.get(countryNameMap[countryName]);
                  }
                  
                  if (countryData) {
                    layer.bindTooltip(`
                      <strong>${countryData.countryName}</strong><br>
                      Stance: ${countryData.stance.toUpperCase()}<br>
                      ${countryData.summary}
                    `);
                    
                    layer.on('click', () => {
                      onCountryClick(countryData);
                    });
                  } else {
                    layer.bindTooltip(`${feature.properties.name}<br>No data available`);
                  }
                }
              });
              
              // Clear existing layers and add the new one
              mapRef.current.eachLayer((layer: any) => {
                if (layer instanceof L.TileLayer) return; // Keep the base tile layer
                mapRef.current?.removeLayer(layer);
              });
              
              geoJsonLayer.addTo(mapRef.current);
              
              // Update map size to ensure it renders properly
              mapRef.current.invalidateSize();
              
              // Log statistics
              console.log(`Map rendering complete - Matched: ${countryHits} countries, Unmatched: ${countryMisses} countries`);
              console.log("Countries without data:", missedCountries.join(", "));
            }
          })
          .catch(error => {
            console.error("Error loading GeoJSON:", error);
            setMapError("Failed to load map data");
          });
      } catch (err) {
        console.error("Error initializing map:", err);
        setMapError("Failed to initialize map");
      }
    }, 500);
    
    // Cleanup function
    return () => {
      clearTimeout(initMap);
      // We don't destroy the map here to avoid re-initialization,
      // but we would in a full unmount scenario
    };
  }, [countries, onCountryClick]); // Re-run when countries data changes

  return (
    <div className="relative">
      {mapError && (
        <div className="absolute top-0 left-0 right-0 bg-red-100 text-red-800 p-2 text-sm text-center z-10">
          {mapError}
        </div>
      )}
      <div ref={mapContainer} className="world-map-container h-[400px] rounded-lg shadow-lg" />
    </div>
  );
};

export default WorldMap;
