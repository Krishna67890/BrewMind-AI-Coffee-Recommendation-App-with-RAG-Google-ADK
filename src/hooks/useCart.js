import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('brewmind_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('brewmind_cart', JSON.stringify(newCart));
  };

  const addToCart = (product, customization = 'Standard Preparation') => {
    const existingItemIndex = cart.findIndex(item => item.id === product.id && item.customization === customization);

    if (existingItemIndex > -1) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
      saveCart(newCart);
    } else {
      saveCart([...cart, { ...product, quantity: 1, customization }]);
    }
  };

  const removeFromCart = (id) => {
    saveCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart };
};
