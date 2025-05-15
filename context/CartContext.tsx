import React, { createContext, useState, ReactNode } from 'react';

export type FoodItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number; 
};

interface CartContextType {
  cartItems: FoodItem[];
  setCartItems: React.Dispatch<React.SetStateAction<FoodItem[]>>;
  addToCart: (item: FoodItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  setCartItems: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<FoodItem[]>([]);

  const addToCart = (item: FoodItem) => {
    const existing = cartItems.find(ci => ci.id === item.id);
    if (existing) {
      const updated = cartItems.map(ci =>
        ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
      );
      setCartItems(updated);
    } else {
      setCartItems(prev => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
