import React, { createContext, useContext, ReactNode, useState } from 'react';
import { CartItem, Product } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  notes?: string;
}

interface SavedCustomer {
  email: string;
  details: CustomerDetails;
  lastUpdated: string;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  customerDetails: CustomerDetails | null;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  cartCount: number;
  cartTotal: number;
  setCustomerDetails: (details: CustomerDetails) => void;
  checkoutViaWhatsApp: () => void;
  getCartSession: () => string;
  fetchCustomerByEmail: (email: string) => CustomerDetails | null;
  saveCustomerDetails: (details: CustomerDetails) => void;
  clearCustomerDetails: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('cartItems', []);
  const [isCartOpen, setIsCartOpen] = useLocalStorage('isCartOpen', false);
  const [customerDetails, setCustomerDetailsState] = useState<CustomerDetails | null>(null);
  const [cartSessionId] = useLocalStorage('cartSessionId', `cart_${Date.now()}`);
  const [savedCustomers, setSavedCustomers] = useLocalStorage<SavedCustomer[]>('savedCustomers', []);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    if (!isCartOpen) setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const clearCustomerDetails = () => {
    setCustomerDetailsState(null);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const cartTotal = cartItems.reduce((total, item) => {
      const isWholesale = item.wholesale_threshold && item.wholesale_price_ngn && item.quantity >= item.wholesale_threshold;
      const price = isWholesale ? item.wholesale_price_ngn! : item.price_ngn;
      return total + price * item.quantity;
  }, 0);

  const setCustomerDetails = (details: CustomerDetails) => {
    setCustomerDetailsState(details);
  };

  // Fetch customer details by email
  const fetchCustomerByEmail = (email: string): CustomerDetails | null => {
    const normalizedEmail = email.toLowerCase().trim();
    const customer = savedCustomers.find(
      c => c.email.toLowerCase() === normalizedEmail
    );
    
    if (customer) {
      return customer.details;
    }
    return null;
  };

  // Save customer details with email as key
  const saveCustomerDetails = (details: CustomerDetails) => {
    const normalizedEmail = details.email.toLowerCase().trim();
    
    // Update or add customer
    setSavedCustomers(prevCustomers => {
      const existingIndex = prevCustomers.findIndex(
        c => c.email.toLowerCase() === normalizedEmail
      );
      
      const savedCustomer: SavedCustomer = {
        email: normalizedEmail,
        details: details,
        lastUpdated: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        // Update existing customer
        const updated = [...prevCustomers];
        updated[existingIndex] = savedCustomer;
        return updated;
      } else {
        // Add new customer
        return [...prevCustomers, savedCustomer];
      }
    });

    // Set as current customer details
    setCustomerDetailsState(details);
  };

  const checkoutViaWhatsApp = () => {
    if (!customerDetails) {
      alert('Please fill in your delivery details before checkout');
      return;
    }

    const phoneNumber = '2348012345678'; // Replace with actual phone number
    let message = `Hello Rightyway Aso-Oke! I would like to place an order:\n\n`;
    
    // Customer details
    message += `*Customer Details:*\n`;
    message += `Name: ${customerDetails.name}\n`;
    message += `Email: ${customerDetails.email}\n`;
    message += `Phone: ${customerDetails.phone}\n`;
    message += `Address: ${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state}, ${customerDetails.country}\n`;
    if (customerDetails.notes) {
      message += `Notes: ${customerDetails.notes}\n`;
    }
    message += `\n`;
    
    // Order items
    message += `*Order Items:*\n`;
    cartItems.forEach(item => {
        const isWholesale = item.wholesale_threshold && item.wholesale_price_ngn && item.quantity >= item.wholesale_threshold;
        const price = isWholesale ? item.wholesale_price_ngn! : item.price_ngn;
        const formattedPrice = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
        message += `• ${item.name} (x${item.quantity}) - ${formattedPrice} each\n`;
    });

    const formattedTotal = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(cartTotal);
    message += `\n*Total: ${formattedTotal}*`;
    message += `\n\nCart Reference: ${cartSessionId}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after successful checkout
    clearCart();
    // Don't clear customer details - keep them for next time
  };

  const getCartSession = () => cartSessionId;

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      isCartOpen, 
      customerDetails,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      toggleCart, 
      cartCount, 
      cartTotal, 
      setCustomerDetails,
      checkoutViaWhatsApp,
      getCartSession,
      fetchCustomerByEmail,
      saveCustomerDetails,
      clearCustomerDetails
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};