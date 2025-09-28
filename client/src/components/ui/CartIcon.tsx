import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Store } from 'lucide-react';
import { useCartStore } from '@/store/cart';

interface CartIconProps {
  className?: string;
}

export const CartIcon: React.FC<CartIconProps> = ({ className = '' }) => {
  const { totalItems, getVendorCarts } = useCartStore();
  const vendorCarts = getVendorCarts();

  return (
    <Link 
      to="/customer/cart" 
      className={`relative inline-flex items-center justify-center p-2 text-gray-700 hover:text-primary-500 transition-colors ${className}`}
    >
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <div className="absolute -top-1 -right-1">
          <span className="bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        </div>
      )}
    </Link>
  );
};
