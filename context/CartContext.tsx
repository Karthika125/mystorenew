"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  category_id: number;
  categories?: {
    id: number;
    name: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

// Helper function to debounce localStorage updates
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  
  // Load cart from localStorage on mount - only once
  useEffect(() => {
    if (cartLoaded) return;
    
    try {
      console.log('Loading cart from localStorage...');
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
        console.log('Cart loaded successfully');
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    } finally {
      setCartLoaded(true);
    }
  }, [cartLoaded]);
  
  // Debounced function to save cart to localStorage
  const debouncedSaveCart = useCallback(
    debounce((items: CartItem[]) => {
      try {
        console.log('Saving cart to localStorage...');
        localStorage.setItem('cart', JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }, 300),
    []
  );
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!cartLoaded) return;
    debouncedSaveCart(cartItems);
  }, [cartItems, cartLoaded, debouncedSaveCart]);
  
  const addToCart = useCallback((product: Product, quantity = 1) => {
    if (quantity <= 0) {
      console.warn('Attempted to add invalid quantity to cart:', quantity);
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // If item already exists, update quantity
        const updatedQuantity = existingItem.quantity + quantity;
        
        // Check if we have enough stock
        if (updatedQuantity > product.stock_quantity) {
          toast.error('Not enough stock available!');
          return prevItems;
        }
        
        console.log(`Updated ${product.name} quantity to ${updatedQuantity}`);
        toast.success(`Updated ${product.name} quantity in cart!`);
        return prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: updatedQuantity } 
            : item
        );
      } else {
        // If item doesn't exist, add it
        if (quantity > product.stock_quantity) {
          toast.error('Not enough stock available!');
          return prevItems;
        }
        
        console.log(`Added ${product.name} to cart (${quantity})`);
        toast.success(`Added ${product.name} to cart!`);
        return [...prevItems, { product, quantity }];
      }
    });
  }, []);
  
  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => {
      const item = prevItems.find(item => item.product.id === productId);
      if (item) {
        console.log(`Removed ${item.product.name} from cart`);
        toast.success(`Removed ${item.product.name} from cart!`);
      }
      return prevItems.filter(item => item.product.id !== productId);
    });
  }, []);
  
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems(prevItems => {
      const item = prevItems.find(item => item.product.id === productId);
      
      if (!item) return prevItems;
      
      // Check if we have enough stock
      if (quantity > item.product.stock_quantity) {
        toast.error('Not enough stock available!');
        return prevItems;
      }
      
      if (quantity <= 0) {
        // If quantity is 0 or negative, remove the item
        console.log(`Removed ${item.product.name} from cart (quantity updated to ${quantity})`);
        toast.success(`Removed ${item.product.name} from cart!`);
        return prevItems.filter(item => item.product.id !== productId);
      }
      
      // Otherwise update the quantity
      console.log(`Updated ${item.product.name} quantity to ${quantity}`);
      return prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      );
    });
  }, []);
  
  const clearCart = useCallback(() => {
    console.log('Clearing cart');
    setCartItems([]);
    toast.success('Cart cleared!');
  }, []);
  
  // Calculate total items and price - memoize these calculations
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity, 
    0
  );
  
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 