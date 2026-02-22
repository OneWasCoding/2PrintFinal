import React, { createContext, useState, useContext } from 'react';

// 1. Create the Context (This is the empty backpack)
const CartContext = createContext();

// 2. Create the Provider (This is the manager that handles adding/removing items)
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Function to add a product to the cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if the exact card is already in the cart
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // If it is, just increase the quantity by 1 instead of adding a duplicate
        return prevItems.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      // If it's a new card, add it to the list with a quantity of 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Function to remove a product from the cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item._id !== id));
  };

  return (
    // We pass the cart data and the functions down to the rest of the app
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Custom Hook (A shortcut so your screens can easily access the backpack)
export const useCart = () => useContext(CartContext);