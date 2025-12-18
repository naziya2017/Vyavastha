/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();
const BASE_URL = 'https://vyavastha-backend.onrender.com/';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [savings, setSavings] = useState(0);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/cart`, { headers: getAuthHeader() });
      setItems(res.data.cart.items || []);
    } catch (err) {
      setError("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item) => {
    try {
      await axios.post(`${BASE_URL}/api/cart/add`, item, { headers: getAuthHeader() });
      await fetchCart();
      return { success: true };
    } catch (err) {
      setError("Failed to add item");
      return { success: false };
    }
  };

  const updateQuantity = async (serviceId, quantity) => {
    try {
      await axios.patch(`${BASE_URL}/api/cart/update/${serviceId}`, { quantity }, { headers: getAuthHeader() });
      await fetchCart();
    } catch (err) {
      console.error("Update quantity error:", err?.response?.data || err.message);
      setError("Failed to update quantity");
    }
  };

  const removeFromCart = async (serviceId) => {
    try {
      await axios.delete(`${BASE_URL}/api/cart/remove/${serviceId}`, { headers: getAuthHeader() });
      await fetchCart();
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/cart/clear`, { headers: getAuthHeader() });
      setItems([]);
    } catch (err) {
      setError("Failed to clear cart");
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (!Array.isArray(items)) return;

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalSavings = items.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);

    setTotal(totalPrice);
    setSavings(totalSavings);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        error,
        total,
        savings,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
