import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Filter, Navigation, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

interface FarmMapProps {
  farms: FarmLocation[];
  onFarmSelect?: (farm: FarmLocation) => void;
  className?: string;
}

export const FarmMap: React.FC<FarmMapProps> = ({
  farms,
  onFarmSelect,
  className = '',
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredFarms, setFilteredFarms] = useState<FarmLocation[]>(farms);
  const [selectedFarm, setSelectedFarm] = useState<FarmLocation | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 52.9399, lng: -106.4509 }); // Saskatchewan center
  const [mapZoom, setMapZoom] = useState(6);
  const mapRef = useRef<HTMLDivElement>(null);

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
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Search and Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite w-5 h-5" />
            <input
              type="text"
              placeholder="Search farms, locations, or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-lg bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
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
        {/* Saskatchewan Map */}
        <div className="relative">
          <div
            ref={mapRef}
            className="w-full h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-lg border-2 border-green-300 relative overflow-hidden"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='300' viewBox='0 0 400 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23e5e7eb' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='400' height='300' fill='%23f0fdf4'/%3E%3Crect width='400' height='300' fill='url(%23grid)'/%3E%3Ctext x='200' y='150' text-anchor='middle' font-family='Arial' font-size='24' fill='%23374151'%3ESaskatchewan%3C/text%3E%3C/svg%3E")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Map overlay with province outline */}
            <div className="absolute inset-0 bg-green-50 bg-opacity-30" />
            
            {/* Interactive Farm Markers */}
            <div className="absolute inset-0">
              {filteredFarms.map((farm, index) => {
                // Convert lat/lng to pixel coordinates for Saskatchewan
                const saskBounds = {
                  north: 60.0,
                  south: 49.0,
                  east: -101.0,
                  west: -110.0
                };
                
                const x = ((farm.coordinates.lng - saskBounds.west) / (saskBounds.east - saskBounds.west)) * 100;
                const y = ((saskBounds.north - farm.coordinates.lat) / (saskBounds.north - saskBounds.south)) * 100;
                
                return (
                  <button
                    key={farm.id}
                    onClick={() => handleFarmClick(farm)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
                      selectedFarm?.id === farm.id 
                        ? 'z-20' 
                        : 'z-10'
                    }`}
                    style={{
                      left: `${Math.max(5, Math.min(95, x))}%`,
                      top: `${Math.max(5, Math.min(95, y))}%`,
                    }}
                    title={`${farm.name} - ${farm.location}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                      selectedFarm?.id === farm.id
                        ? 'bg-primary-600 scale-125'
                        : 'bg-primary-500 hover:bg-primary-600'
                    }`}>
                      <MapPin className="w-3 h-3 text-white" />
                    </div>
                    
                    {/* Farm name tooltip */}
                    <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200 ${
                      selectedFarm?.id === farm.id ? 'opacity-100' : ''
                    }`}>
                      {farm.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <Map className="w-4 h-4" />
                <span>Saskatchewan Farms</span>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                {filteredFarms.length} farm{filteredFarms.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-1">
              <button
                onClick={() => setMapZoom(prev => Math.min(10, prev + 1))}
                className="w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-t-lg flex items-center justify-center text-gray-700 shadow-lg"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={() => setMapZoom(prev => Math.max(4, prev - 1))}
                className="w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-b-lg flex items-center justify-center text-gray-700 shadow-lg"
                title="Zoom Out"
              >
                −
              </button>
            </div>
          </div>
        </div>

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
                hover
                className={`cursor-pointer transition-all duration-200 ${
                  selectedFarm?.id === farm.id ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => handleFarmClick(farm)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-ink">{farm.name}</h3>
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
                        navigate('/auth');
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
