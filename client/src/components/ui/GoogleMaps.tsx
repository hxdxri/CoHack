import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { MapPin, Search, Filter, Navigation } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { Card, CardContent } from './Card';

interface FarmLocation {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  productCount: number;
  specialties: string[];
  distance?: number;
  description?: string;
  established?: number;
  size?: string;
}

interface GoogleMapsProps {
  farms: FarmLocation[];
  onFarmSelect?: (farm: FarmLocation) => void;
  className?: string;
}

// Google Maps API key from environment variables
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

const MapComponent: React.FC<{
  farms: FarmLocation[];
  onFarmSelect?: (farm: FarmLocation) => void;
  selectedFarm?: FarmLocation | null;
}> = ({ farms, onFarmSelect, selectedFarm }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: 52.9399, lng: -106.4509 }, // Saskatchewan center
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      setMap(newMap);
    }
  }, [map]);

  // Create markers for farms
  useEffect(() => {
    if (map && farms.length > 0) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));

      const newMarkers = farms.map(farm => {
        const isSelected = selectedFarm?.id === farm.id;
        const marker = new google.maps.Marker({
          position: { lat: farm.coordinates.lat, lng: farm.coordinates.lng },
          map: map,
          title: farm.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="${isSelected ? '#DC2626' : '#1A7F5A'}" stroke="white" stroke-width="2"/>
                <g transform="translate(6, 6)">
                  <!-- Farm barn icon -->
                  <path d="M2 6h16v10H2V6z" fill="white"/>
                  <path d="M0 6l10-4 10 4v2H0V6z" fill="white"/>
                  <rect x="7" y="9" width="6" height="5" fill="${isSelected ? '#DC2626' : '#1A7F5A'}"/>
                  <circle cx="10" cy="11.5" r="1" fill="white"/>
                  <path d="M3 6h2v2H3V6z" fill="white"/>
                  <path d="M15 6h2v2h-2V6z" fill="white"/>
                </g>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 16)
          }
        });

        // Add click listener
        marker.addListener('click', () => {
          onFarmSelect?.(farm);
        });

        return marker;
      });

      setMarkers(newMarkers);
    }
  }, [map, farms, onFarmSelect]);

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-96 rounded-lg" />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <MapPin className="w-4 h-4" />
          <span>{farms.length} farms found</span>
        </div>
      </div>
    </div>
  );
};

const LoadingComponent: React.FC = () => (
  <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
    <div className="text-center text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p>Loading map...</p>
    </div>
  </div>
);

const ErrorComponent: React.FC<{ status: Status }> = ({ status }) => (
  <div className="w-full h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-lg border-2 border-green-300 relative overflow-hidden">
    {/* Saskatchewan Map Background */}
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='300' viewBox='0 0 400 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23e5e7eb' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='400' height='300' fill='%23f0fdf4'/%3E%3Crect width='400' height='300' fill='url(%23grid)'/%3E%3Ctext x='200' y='150' text-anchor='middle' font-family='Arial' font-size='24' fill='%23374151'%3ESaskatchewan%3C/text%3E%3C/svg%3E")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-green-50 bg-opacity-30" />
    </div>
    
    {/* Interactive Farm Markers */}
    <div className="absolute inset-0">
      {/* Sample farm markers positioned across Saskatchewan */}
      {[
        { x: 25, y: 35, name: 'Prairie Gold' },
        { x: 45, y: 60, name: 'Northern Lights' },
        { x: 35, y: 25, name: 'Valley Produce' },
        { x: 40, y: 55, name: 'Prairie Breeze' },
        { x: 30, y: 65, name: 'Sunny Acres' },
        { x: 55, y: 45, name: 'Greenfield' },
        { x: 20, y: 30, name: 'Heritage Grains' },
        { x: 60, y: 70, name: 'Crystal Lake' },
        { x: 50, y: 65, name: 'Riverside' },
        { x: 30, y: 20, name: 'Prairie Wind' },
      ].map((marker, index) => (
        <div
          key={index}
          className="absolute w-6 h-6 bg-primary-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200"
          style={{
            left: `${marker.x}%`,
            top: `${marker.y}%`,
          }}
          title={marker.name}
        >
          <MapPin className="w-3 h-3 text-white" />
        </div>
      ))}
    </div>

    {/* Map Legend */}
    <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
      <div className="flex items-center space-x-2 text-sm text-gray-700">
        <MapPin className="w-4 h-4" />
        <span>10 farms found</span>
      </div>
    </div>

    {/* API Key Setup Instructions */}
    <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-95 rounded-lg p-4 shadow-lg">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700 mb-2">Google Maps API Key Required</p>
        <div className="text-xs text-gray-600 space-y-1">
          <p>1. Get API key from <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Google Cloud Console</a></p>
          <p>2. Add to .env file: VITE_GOOGLE_MAPS_API_KEY=your_key_here</p>
          <p>3. Restart development server</p>
        </div>
      </div>
    </div>
  </div>
);

export const GoogleMaps: React.FC<GoogleMapsProps> = ({
  farms,
  onFarmSelect,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredFarms, setFilteredFarms] = useState<FarmLocation[]>(farms);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<FarmLocation | null>(null);
  const farmCardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const categories = [
    { value: 'all', label: 'All Farms' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'grains', label: 'Grains' },
    { value: 'meat', label: 'Meat' },
  ];

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Calculate distances for all farms
          const farmsWithDistance = farms.map(farm => ({
            ...farm,
            distance: calculateDistance(latitude, longitude, farm.coordinates.lat, farm.coordinates.lng)
          }));
          
          setFilteredFarms(farmsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0)));
        },
        (error) => {
          console.error('Error getting location:', error);
          setFilteredFarms(farms);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setFilteredFarms(farms);
    }
  };

  // Filter farms based on search term and category
  useEffect(() => {
    let filtered = farms;

    if (searchTerm) {
      filtered = filtered.filter(farm =>
        farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farm.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farm.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(farm =>
        farm.specialties.some(specialty => 
          specialty.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );
    }

    // Add distance if user location is available
    if (userLocation) {
      filtered = filtered.map(farm => ({
        ...farm,
        distance: calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          farm.coordinates.lat, 
          farm.coordinates.lng
        )
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    setFilteredFarms(filtered);
  }, [searchTerm, selectedCategory, farms, userLocation]);

  const handleFarmClick = (farm: FarmLocation) => {
    setSelectedFarm(farm);
    onFarmSelect?.(farm);
    
    // Move the selected farm to the top of the list
    const updatedFarms = [
      farm,
      ...filteredFarms.filter(f => f.id !== farm.id)
    ];
    setFilteredFarms(updatedFarms);
    
    // Scroll the farm card to the top and highlight it
    setTimeout(() => {
      const farmCardElement = farmCardRefs.current[farm.id];
      if (farmCardElement) {
        farmCardElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <LoadingComponent />;
      case Status.FAILURE:
        return <ErrorComponent status={status} />;
      case Status.SUCCESS:
        return <MapComponent farms={filteredFarms} onFarmSelect={handleFarmClick} selectedFarm={selectedFarm} />;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Search and Filter Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search farms, locations, or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Button */}
          <Button
            onClick={getUserLocation}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Find Near Me
          </Button>
        </div>
      </div>

      {/* Map and Farm List */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Google Map */}
        <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render} />

        {/* Farm List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredFarms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No farms found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredFarms.map((farm) => (
              <Card
                key={farm.id}
                ref={(el) => (farmCardRefs.current[farm.id] = el)}
                hover
                className={`cursor-pointer transition-all duration-300 ${
                  selectedFarm?.id === farm.id 
                    ? 'bg-green-50 border-green-300 shadow-lg transform scale-105 animate-pulse' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleFarmClick(farm)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-ink">{farm.name}</h3>
                      {selectedFarm?.id === farm.id && (
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600">{farm.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{farm.location}</span>
                    {farm.distance && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {farm.distance.toFixed(1)} km away
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {farm.specialties.slice(0, 3).map((specialty, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded"
                      >
                        {specialty}
                      </span>
                    ))}
                    {farm.specialties.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{farm.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div className="flex flex-col">
                      <span>{farm.productCount} products available</span>
                      {farm.established && (
                        <span className="text-xs text-gray-500">Est. {farm.established}</span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFarmClick(farm);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
