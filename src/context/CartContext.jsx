// src/context/CartContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

// 1. Buat Context
const CartContext = createContext();

// 2. Hook Kustom (WAJIB ADA dan diexport)
export const useCart = () => useContext(CartContext);

// Initial State
const initialState = {
  cart: [],
};

// Reducer function for cart operations
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      // Logika menambahkan item ke keranjang
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
      
    case 'UPDATE_QUANTITY':
      // Logika update kuantitas
      return {
        ...state,
        cart: state.cart.map(item => 
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0), // Hapus jika kuantitas <= 0
      };

    case 'REMOVE_ITEM':
      // Logika hapus item
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.id),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
      
    default:
      return state;
  }
};

// 3. Context Provider (WAJIB diexport default atau bernama)
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Fungsi utilitas untuk menghitung total harga
  const calculateTotal = () => {
    return state.cart.reduce((total, item) => {
      // Membersihkan string harga menjadi format angka (contoh: "Rp 10.000" -> 10000)
      const price = parseFloat(item.price.toString().replace(/[^0-9,-]+/g, "").replace(",", ".")) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const value = {
    cart: state.cart,
    dispatch,
    calculateTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};