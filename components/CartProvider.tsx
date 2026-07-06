'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync logic when session changes
  useEffect(() => {
    async function loadCart() {
      setIsLoading(true);
      if (status === 'authenticated') {
        try {
          const raw = localStorage.getItem('seseme_cart');
          const localCart = raw ? JSON.parse(raw) : [];
          if (localCart.length > 0) {
            await fetch('/api/cart/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: localCart }),
            });
            localStorage.removeItem('seseme_cart');
          }

          const res = await fetch('/api/cart');
          if (res.ok) {
            const data = await res.json();
            setItems(data.items || []);
          }
        } catch (error) {
          console.error('Failed to load cart', error);
        }
      } else if (status === 'unauthenticated') {
        try {
          const raw = localStorage.getItem('seseme_cart');
          setItems(raw ? JSON.parse(raw) : []);
        } catch {
          setItems([]);
        }
      }
      setIsLoading(false);
    }

    if (status !== 'loading') {
      loadCart();
    }
  }, [status]);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const saveLocalCart = (newItems: CartItem[]) => {
    localStorage.setItem('seseme_cart', JSON.stringify(newItems));
    setItems(newItems);
  };

  const addToCart = async (product: Omit<CartItem, 'quantity'>, quantity: number) => {
    const existingItem = items.find((i) => i.id === product.id);
    let newItems = [...items];

    if (existingItem) {
      newItems = newItems.map((i) =>
        i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
      );
    } else {
      newItems.push({ ...product, quantity });
    }

    setItems(newItems); // Optimistic update

    if (status === 'authenticated') {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
    } else {
      saveLocalCart(newItems);
    }
  };

  const removeFromCart = async (productId: string) => {
    const newItems = items.filter((i) => i.id !== productId);
    setItems(newItems);

    if (status === 'authenticated') {
      await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
      });
    } else {
      saveLocalCart(newItems);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    const newItems = items.map((i) => (i.id === productId ? { ...i, quantity } : i));
    setItems(newItems);

    if (status === 'authenticated') {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
    } else {
      saveLocalCart(newItems);
    }
  };

  const clearCart = () => {
    setItems([]);
    if (status === 'unauthenticated') {
      localStorage.removeItem('seseme_cart');
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading,
      }}
    >
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
