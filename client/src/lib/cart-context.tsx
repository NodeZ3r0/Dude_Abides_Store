import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SaleorProductDetail } from './api';

export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  variantId: string;
  variantName: string;
  sku?: string;
  price: number;
  currency: string;
  quantity: number;
  thumbnail?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: SaleorProductDetail, variantId: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
  isInCart: (variantId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'dude-abides-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: SaleorProductDetail, variantId: string, quantity: number = 1) => {
    const variant = product.variants?.find(v => v.id === variantId);
    if (!variant) return;

    const existingIndex = items.findIndex(item => item.variantId === variantId);
    
    if (existingIndex >= 0) {
      setItems(prev => prev.map((item, index) => 
        index === existingIndex 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${variantId}`,
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        variantId: variant.id,
        variantName: variant.name,
        sku: variant.sku,
        price: variant.pricing?.price?.gross?.amount || 
               product.pricing?.priceRange?.start?.gross?.amount || 0,
        currency: variant.pricing?.price?.gross?.currency || 
                  product.pricing?.priceRange?.start?.gross?.currency || 'USD',
        quantity,
        thumbnail: product.thumbnail?.url,
      };
      setItems(prev => [...prev, newItem]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const isInCart = (variantId: string) => {
    return items.some(item => item.variantId === variantId);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount,
      getTotal,
      isInCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
