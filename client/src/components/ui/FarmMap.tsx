import React, { useState, useEffect, useRef } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredFarms, setFilteredFarms] = useState<FarmLocation[]>(farms);
  const [selectedFarm, setSelectedFarm] = useState<FarmLocation | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
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
        {/* Map Placeholder */}
        <div className="relative">
          <div
            ref={mapRef}
            className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
          >
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-medium">Interactive Map</p>
              <p className="text-sm">Farm locations will be displayed here</p>
              <p className="text-xs mt-2 text-gray-400">
                {filteredFarms.length} farm{filteredFarms.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          {/* Map Markers (simulated) */}
          <div className="absolute inset-0 pointer-events-none">
            {filteredFarms.slice(0, 6).map((farm, index) => (
              <div
                key={farm.id}
                className="absolute w-4 h-4 bg-primary-500 rounded-full border-2 border-white shadow-lg"
                style={{
                  left: `${20 + (index * 12)}%`,
                  top: `${30 + (index * 8)}%`,
                }}
              />
            ))}
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
                    <span>{farm.productCount} products available</span>
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
