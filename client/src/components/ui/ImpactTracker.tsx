import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Users, 
  Truck, 
  Heart, 
  Globe, 
  Shield,
  TrendingUp
} from 'lucide-react';

interface ImpactStat {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  unit: string;
  color: string;
  bgColor: string;
}

/**
 * ImpactTracker Component
 * 
 * Clean, compact display of live environmental and social impact statistics.
 * Uses a modern horizontal layout with subtle animations.
 */
export const ImpactTracker: React.FC = () => {
  const [stats, setStats] = useState<ImpactStat[]>([
    {
      id: 'emissions-saved',
      icon: Leaf,
      label: 'CO₂ Saved',
      value: 0,
      unit: 'tons',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'customers-served',
      icon: Users,
      label: 'Customers',
      value: 0,
      unit: '',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'miles-reduced',
      icon: Truck,
      label: 'Miles Saved',
      value: 0,
      unit: '',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'animals-protected',
      icon: Heart,
      label: 'Animals',
      value: 0,
      unit: '',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      id: 'water-saved',
      icon: Globe,
      label: 'Water Saved',
      value: 0,
      unit: 'gal',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      id: 'farms-supported',
      icon: Shield,
      label: 'Farms',
      value: 0,
      unit: '',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]);

  const [isVisible, setIsVisible] = useState(false);

  // Simulate live data updates
  useEffect(() => {
    const updateStats = () => {
      setStats(prevStats => 
        prevStats.map(stat => {
          let newValue = stat.value;
          
          switch (stat.id) {
            case 'emissions-saved':
              newValue = Math.floor(Math.random() * 50) + 1250;
              break;
            case 'customers-served':
              newValue = Math.floor(Math.random() * 200) + 4850;
              break;
            case 'miles-reduced':
              newValue = Math.floor(Math.random() * 10) + 45;
              break;
            case 'animals-protected':
              newValue = Math.floor(Math.random() * 50) + 1250;
              break;
            case 'water-saved':
              newValue = Math.floor(Math.random() * 5) + 95;
              break;
            case 'farms-supported':
              newValue = Math.floor(Math.random() * 5) + 145;
              break;
            default:
              newValue = stat.value;
          }
          
          return { ...stat, value: newValue };
        })
      );
    };

    // Initial load with delay for animation
    const timer = setTimeout(() => {
      updateStats();
      setIsVisible(true);
    }, 300);
    
    // Update every 30 seconds
    const interval = setInterval(updateStats, 30000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <section className="py-16 bg-gradient-to-r from-green-50 via-blue-50 to-green-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <Leaf className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ink">
              Our Impact
            </h2>
          </div>
          <p className="text-lg text-graphite max-w-2xl mx-auto">
            Building a sustainable future together through local farming
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.id}
              className={`group text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transitionDelay: `${index * 150}ms`
              }}
            >
              {/* Icon Container */}
              <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              
              {/* Value */}
              <div className="mb-2">
                <div className="flex items-center justify-center">
                  <span className="text-2xl md:text-3xl font-bold text-ink group-hover:text-primary-600 transition-colors duration-300">
                    {formatNumber(stat.value)}
                  </span>
                  {stat.unit && (
                    <span className="text-sm text-graphite ml-1">
                      {stat.unit}
                    </span>
                  )}
                </div>
                
                {/* Live indicator */}
                <div className="flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                  <span className="text-xs text-graphite font-medium">Live</span>
                </div>
              </div>
              
              {/* Label */}
              <h3 className="text-sm font-semibold text-ink">
                {stat.label}
              </h3>
            </div>
          ))}
        </div>

        {/* Bottom Status */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-white/20">
            <TrendingUp className="w-4 h-4 text-primary-600 mr-2" />
            <span className="text-sm text-graphite font-medium">
              Real-time updates every 30 seconds
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
