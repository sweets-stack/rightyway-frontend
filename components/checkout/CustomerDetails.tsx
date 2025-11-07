import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';

interface CustomerDetailsForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  notes: string;
}

interface CustomerDetailsProps {
  onBack?: () => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ onBack }) => {
  const { customerDetails, saveCustomerDetails, checkoutViaWhatsApp } = useCart();
  const [formData, setFormData] = useState<CustomerDetailsForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    notes: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  // Load customer details if they exist
  useEffect(() => {
    if (customerDetails) {
      setFormData({
        name: customerDetails.name || '',
        email: customerDetails.email || '',
        phone: customerDetails.phone || '',
        address: customerDetails.address || '',
        city: customerDetails.city || '',
        state: customerDetails.state || '',
        country: customerDetails.country || 'Nigeria',
        notes: customerDetails.notes || ''
      });
      setIsSaved(true);
    }
  }, [customerDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save customer details
    saveCustomerDetails(formData);
    setIsSaved(true);
    
    // Show success message
    alert('Delivery details saved successfully! You can now proceed to checkout.');
  };

  const handleCheckout = () => {
    if (!isSaved) {
      alert('Please save your delivery details first');
      return;
    }
    checkoutViaWhatsApp();
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.address.trim() &&
      formData.city.trim() &&
      formData.state.trim() &&
      formData.country.trim()
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-bold text-brand-maroon">
          {customerDetails ? 'Your Delivery Details' : 'Delivery Details'}
        </h2>
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm text-brand-maroon hover:text-brand-gold flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
              placeholder="Enter your email"
              disabled={!!customerDetails} // Disable if loaded from saved details
            />
            {customerDetails && (
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed. This is your account identifier.
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Address *
          </label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
            placeholder="Enter your complete address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              required
              value={formData.state}
              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
              placeholder="State"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              required
              value={formData.country}
              onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
            >
              <option value="Nigeria">Nigeria</option>
              <option value="Ghana">Ghana</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
            placeholder="Any special delivery instructions..."
          />
        </div>

        {isSaved && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-green-800 text-sm font-medium">
                  Delivery details saved!
                </p>
                <p className="text-green-700 text-xs mt-1">
                  Your information has been saved for future orders. You can now proceed to checkout.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-4 pt-4">
          <Button 
            type="submit" 
            className="flex-1"
            disabled={!isFormValid()}
          >
            {isSaved ? 'Update Details' : 'Save Delivery Details'}
          </Button>
          <Button 
            type="button" 
            onClick={handleCheckout}
            disabled={!isSaved}
            className="flex-1"
          >
            Checkout via WhatsApp
          </Button>
        </div>

        {!isSaved && (
          <p className="text-sm text-gray-600 text-center">
            💡 Your details will be saved securely for faster checkout next time
          </p>
        )}
      </form>
    </div>
  );
};

export default CustomerDetails;