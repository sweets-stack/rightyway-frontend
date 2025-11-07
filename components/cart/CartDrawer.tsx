import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import CustomerDetails from '../../components/checkout/CustomerDetails';
import EmailLookup from '../../components/checkout/EmailLookup';
import Button from '../../components/ui/Button';

type CheckoutStep = 'cart' | 'email-lookup' | 'customer-details';

const CartDrawer: React.FC = () => {
  const { 
    cartItems, 
    isCartOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity, 
    cartCount, 
    cartTotal,
    customerDetails,
    clearCustomerDetails,
    checkoutViaWhatsApp
  } = useCart();
  
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');

  // Reset to cart view when drawer opens
  useEffect(() => {
    if (isCartOpen) {
      setCheckoutStep('cart');
    }
  }, [isCartOpen]);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    // Show email lookup first
    setCheckoutStep('email-lookup');
  };

  const handleNewCustomer = () => {
    // Clear any existing details and show form
    clearCustomerDetails();
    setCheckoutStep('customer-details');
  };

  const handleCustomerFound = () => {
    // Customer details loaded, show the form (prefilled)
    setCheckoutStep('customer-details');
  };

  const handleBackToCart = () => {
    setCheckoutStep('cart');
  };

  const handleBackToEmailLookup = () => {
    clearCustomerDetails();
    setCheckoutStep('email-lookup');
  };

  const handleQuickCheckout = () => {
    if (!customerDetails) {
      alert('Please save your delivery details first');
      return;
    }
    checkoutViaWhatsApp();
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={toggleCart}
        />
        
        <div className="absolute inset-y-0 right-0 max-w-full flex">
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    {checkoutStep === 'cart' && 'Shopping Cart'}
                    {checkoutStep === 'email-lookup' && 'Checkout'}
                    {checkoutStep === 'customer-details' && 'Delivery Details'}
                  </h2>
                  <button
                    type="button"
                    className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                    onClick={toggleCart}
                  >
                    <span className="sr-only">Close panel</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-2">
                  {checkoutStep === 'cart' && (
                    <>
                      <div className="flow-root">
                        {cartItems.length === 0 ? (
                          <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-gray-500 mt-2">Your cart is empty</p>
                            <Button onClick={toggleCart} variant="secondary" className="mt-4">
                              Continue Shopping
                            </Button>
                          </div>
                        ) : (
                          <ul className="-my-6 divide-y divide-gray-200">
                            {cartItems.map((item) => (
                              <li key={item.id} className="py-6 flex">
                                <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                  <img
                                    src={item.images[0]}
                                    alt={item.name}
                                    className="w-full h-full object-center object-cover"
                                  />
                                </div>

                                <div className="ml-4 flex-1 flex flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>{item.name}</h3>
                                      <p className="ml-4">
                                        ₦{(
                                          (item.wholesale_threshold && item.wholesale_price_ngn && item.quantity >= item.wholesale_threshold 
                                            ? item.wholesale_price_ngn 
                                            : item.price_ngn) * item.quantity
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                                    {item.wholesale_threshold && item.quantity >= item.wholesale_threshold && (
                                      <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
                                        Wholesale Price Applied!
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex-1 flex items-end justify-between text-sm">
                                    <div className="flex items-center space-x-3 border border-gray-300 rounded-md px-2 py-1">
                                      <button
                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        className="text-gray-600 hover:text-gray-800 font-medium w-6 h-6 flex items-center justify-center"
                                      >
                                        -
                                      </button>
                                      <span className="text-gray-900 font-medium min-w-[20px] text-center">{item.quantity}</span>
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="text-gray-600 hover:text-gray-800 font-medium w-6 h-6 flex items-center justify-center"
                                      >
                                        +
                                      </button>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => removeFromCart(item.id)}
                                      className="font-medium text-brand-maroon hover:text-brand-gold"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </>
                  )}

                  {checkoutStep === 'email-lookup' && (
                    <EmailLookup 
                      onNewCustomer={handleNewCustomer}
                      onCustomerFound={handleCustomerFound}
                    />
                  )}

                  {checkoutStep === 'customer-details' && (
                    <CustomerDetails 
                      onBack={handleBackToEmailLookup}
                    />
                  )}
                </div>
              </div>

              {checkoutStep === 'cart' && cartItems.length > 0 && (
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                    <p>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</p>
                    <p>₦{cartTotal.toLocaleString()}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500 mb-4">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="space-y-2">
                    <Button onClick={handleCheckout} className="w-full">
                      Proceed to Checkout
                    </Button>
                    <Button onClick={toggleCart} variant="secondary" className="w-full">
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              )}

              {checkoutStep === 'email-lookup' && (
                <div className="border-t border-gray-200 py-4 px-4 sm:px-6">
                  <Button onClick={handleBackToCart} variant="secondary" className="w-full">
                    Back to Cart
                  </Button>
                </div>
              )}

              {checkoutStep === 'customer-details' && customerDetails && (
                <div className="border-t border-gray-200 py-4 px-4 sm:px-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Order Total:</span>
                    <span className="text-lg font-bold text-brand-maroon">₦{cartTotal.toLocaleString()}</span>
                  </div>
                  <Button onClick={handleQuickCheckout} className="w-full">
                    Complete Checkout via WhatsApp
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;