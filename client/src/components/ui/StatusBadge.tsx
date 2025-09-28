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
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        animation: 'animate-pulse'
      },
      confirmed: {
        label: 'Confirmed',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle,
        animation: ''
      },
      preparing: {
        label: 'Preparing',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: Package,
        animation: ''
      },
      ready: {
        label: 'Ready for Pickup',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: CheckCircle,
        animation: ''
      },
      out_for_delivery: {
        label: 'Out for Delivery',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: Truck,
        animation: 'animate-bounce'
      },
      delivered: {
        label: 'Delivered',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        animation: ''
      },
      cancelled: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: AlertCircle,
        animation: ''
      }
    };
    return configs[status];
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      variant="custom" 
      className={`${config.color} ${config.animation} ${className}`}
    >
      <Icon className="w-4 h-4 mr-1" />
      {config.label}
    </Badge>
  );
};
