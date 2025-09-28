import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  MapPin, 
  CheckCircle, 
  Eye,
  Phone,
  Mail,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { PinEntryModal } from './PinEntryModal';
import { StatusBadge } from './StatusBadge';
import { Order } from '@/types';

interface OrderManagementTableProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Order Management Table
 * 
 * Displays a list of orders with status management, customer details,
 * and delivery confirmation functionality for farmers.
 */
export const OrderManagementTable: React.FC<OrderManagementTableProps> = ({
  orders,
  onUpdateOrderStatus,
  isLoading = false
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const getStatusBgColor = (status: Order['status']) => {
    const configs = {
      pending: 'bg-yellow-50',
      confirmed: 'bg-blue-50',
      preparing: 'bg-orange-50',
      ready: 'bg-purple-50',
      out_for_delivery: 'bg-indigo-50',
      delivered: 'bg-green-50',
      cancelled: 'bg-red-50'
    };
    return configs[status];
  };

  const canMarkAsDelivered = (status: Order['status']) => {
    return ['confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(status);
  };

  const handleMarkAsDelivered = (order: Order) => {
    setSelectedOrder(order);
    setIsPinModalOpen(true);
  };

  const handlePinVerification = async (pin: string): Promise<boolean> => {
    if (!selectedOrder) return false;

    // Mock PIN verification - in real app, this would call an API
    const isValidPin = pin === selectedOrder.deliveryPin || pin === '1234';
    
    if (isValidPin) {
      await onUpdateOrderStatus(selectedOrder.id, 'delivered');
      return true;
    }
    
    return false;
  };

  const handleClosePinModal = () => {
    setIsPinModalOpen(false);
    setSelectedOrder(null);
  };

  const toggleDropdown = (orderId: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    await onUpdateOrderStatus(orderId, newStatus);
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      newSet.delete(orderId);
      return newSet;
    });
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending Delivery' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready for Pickup' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isClickInsideDropdown = Array.from(dropdownRefs.current.values()).some(ref => 
        ref && ref.contains(target)
      );
      
      if (!isClickInsideDropdown) {
        setOpenDropdowns(new Set());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-graphite">Loading orders...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-graphite mb-2">No orders yet</h3>
          <p className="text-graphite">
            Orders from customers will appear here for you to manage.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {orders.map((order) => {
          const statusBgColor = getStatusBgColor(order.status);

          return (
            <Card key={order.id} className={`${statusBgColor} border-l-4 border-l-primary-500`}>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink">Order #{order.id}</h3>
                      <p className="text-sm text-graphite">
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Status Dropdown */}
                    <div 
                      className="relative"
                      ref={(el) => {
                        if (el) {
                          dropdownRefs.current.set(order.id, el);
                        } else {
                          dropdownRefs.current.delete(order.id);
                        }
                      }}
                    >
                      <button
                        onClick={() => toggleDropdown(order.id)}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <StatusBadge status={order.status} />
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </button>
                      
                      {openDropdowns.has(order.id) && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <div className="py-1">
                            {statusOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => handleStatusChange(order.id, option.value as Order['status'])}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                  order.status === option.value ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {canMarkAsDelivered(order.status) && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleMarkAsDelivered(order)}
                        className="whitespace-nowrap"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Customer Information */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-ink flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Customer Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-ink">{order.customerName}</p>
                      <div className="flex items-center text-graphite">
                        <Mail className="w-4 h-4 mr-2" />
                        {order.customerEmail}
                      </div>
                      {order.customerPhone && (
                        <div className="flex items-center text-graphite">
                          <Phone className="w-4 h-4 mr-2" />
                          {order.customerPhone}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-ink">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-medium text-ink">{item.productName}</span>
                            <span className="text-graphite ml-2">
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                          <span className="font-medium text-ink">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-2 flex justify-between items-center font-semibold">
                        <span className="text-ink">Total</span>
                        <span className="text-ink">{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-ink flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Delivery Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      {order.deliveryAddress ? (
                        <div>
                          <p className="font-medium text-ink mb-1">Address:</p>
                          <p className="text-graphite">{order.deliveryAddress}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-ink mb-1">Pickup Instructions:</p>
                          <p className="text-graphite">{order.pickupInstructions || 'No special instructions'}</p>
                        </div>
                      )}
                      
                      {order.deliveryDate && (
                        <div>
                          <p className="font-medium text-ink mb-1">Scheduled:</p>
                          <p className="text-graphite">{formatDate(order.deliveryDate)}</p>
                        </div>
                      )}
                      
                      {order.notes && (
                        <div>
                          <p className="font-medium text-ink mb-1">Notes:</p>
                          <p className="text-graphite">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* PIN Entry Modal */}
      {selectedOrder && (
        <PinEntryModal
          isOpen={isPinModalOpen}
          onClose={handleClosePinModal}
          onVerify={handlePinVerification}
          orderId={selectedOrder.id}
          customerName={selectedOrder.customerName}
        />
      )}
    </>
  );
};
