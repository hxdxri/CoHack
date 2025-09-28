import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  Package, 
  Truck, 
  AlertCircle 
} from 'lucide-react';
import { Badge } from './Badge';
import { Order } from '@/types';

interface StatusBadgeProps {
  status: Order['status'];
  className?: string;
}

/**
 * Status Badge Component
 * 
 * Displays order status with appropriate colors, icons, and animations.
 * Provides consistent status representation across the application.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  className = '' 
}) => {
  const getStatusConfig = (status: Order['status']) => {
    const configs = {
      pending: {
        label: 'Pending Delivery',
        icon: Clock
      },
      confirmed: {
        label: 'Confirmed',
        icon: CheckCircle
      },
      preparing: {
        label: 'Preparing',
        icon: Package
      },
      ready: {
        label: 'Ready for Pickup',
        icon: CheckCircle
      },
      out_for_delivery: {
        label: 'Out for Delivery',
        icon: Truck
      },
      delivered: {
        label: 'Delivered',
        icon: CheckCircle
      },
      cancelled: {
        label: 'Cancelled',
        icon: AlertCircle
      }
    };
    return configs[status];
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={`${className}`}
    >
      <Icon className="w-4 h-4 mr-1" />
      {config.label}
    </Badge>
  );
};
