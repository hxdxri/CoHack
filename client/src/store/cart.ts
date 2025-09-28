import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';
import toast from 'react-hot-toast';

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  farmerId: string;
  farmerName: string;
}

export interface VendorCart {
  farmerId: string;
  farmerName: string;
  farmerLocation?: string;
  farmerImage?: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  
  // Actions
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  clearVendorCart: (farmerId: string) => void;
  getItemQuantity: (productId: string) => number;
  getVendorCarts: () => VendorCart[];
  getVendorCart: (farmerId: string) => VendorCart | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addToCart: (product: Product, quantity: number) => {
        const state = get();
        const existingItem = state.items.find(item => item.productId === product.id);
        
        if (existingItem) {
          // Update existing item quantity
          const newQuantity = existingItem.quantity + quantity;
          const updatedItems = state.items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
          
          set({
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
          });
          
          toast.success(`Updated ${product.name} quantity to ${newQuantity}`);
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            product,
            quantity,
            farmerId: product.farmerId,
            farmerName: product.farmer?.farmName || 'Unknown Farm'
          };
          
          const updatedItems = [...state.items, newItem];
          
          set({
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
          });
          
          toast.success(`Added ${quantity} ${product.name} to cart`);
        }
      },

      removeFromCart: (itemId: string) => {
        const state = get();
        const updatedItems = state.items.filter(item => item.id !== itemId);
        
        set({
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        });
        
        toast.success('Item removed from cart');
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        const state = get();
        const updatedItems = state.items.map(item =>
          item.id === itemId
            ? { ...item, quantity }
            : item
        );
        
        set({
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0
        });
        
        toast.success('Cart cleared');
      },

      getItemQuantity: (productId: string) => {
        const state = get();
        const item = state.items.find(item => item.productId === productId);
        return item ? item.quantity : 0;
      },

      clearVendorCart: (farmerId: string) => {
        const state = get();
        const updatedItems = state.items.filter(item => item.farmerId !== farmerId);
        
        set({
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        });
        
        toast.success('Vendor cart cleared');
      },

      getVendorCarts: () => {
        const state = get();
        const vendorMap = new Map<string, VendorCart>();
        
        state.items.forEach(item => {
          if (!vendorMap.has(item.farmerId)) {
            vendorMap.set(item.farmerId, {
              farmerId: item.farmerId,
              farmerName: item.farmerName,
              farmerLocation: item.product.farmer?.location,
              items: [],
              subtotal: 0,
              itemCount: 0
            });
          }
          
          const vendorCart = vendorMap.get(item.farmerId)!;
          vendorCart.items.push(item);
          vendorCart.subtotal += item.product.price * item.quantity;
          vendorCart.itemCount += item.quantity;
        });
        
        return Array.from(vendorMap.values());
      },

      getVendorCart: (farmerId: string) => {
        const state = get();
        const vendorItems = state.items.filter(item => item.farmerId === farmerId);
        
        if (vendorItems.length === 0) return undefined;
        
        return {
          farmerId,
          farmerName: vendorItems[0].farmerName,
          farmerLocation: vendorItems[0].product.farmer?.location,
          items: vendorItems,
          subtotal: vendorItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
          itemCount: vendorItems.reduce((sum, item) => sum + item.quantity, 0)
        };
      }
    }),
    {
      name: 'harvest-cart',
      partialize: (state) => ({ items: state.items })
    }
  )
);
