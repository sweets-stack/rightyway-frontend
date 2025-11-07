import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';

interface EmailLookupProps {
  onNewCustomer: () => void;
  onCustomerFound: () => void;
}

const EmailLookup: React.FC<EmailLookupProps> = ({ onNewCustomer, onCustomerFound }) => {
  const { fetchCustomerByEmail, setCustomerDetails } = useCart();
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSearching(true);

    // Validate email
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setIsSearching(false);
      return;
    }

    // Try to fetch customer details
    const savedDetails = fetchCustomerByEmail(email);

    if (savedDetails) {
      // Customer found - load their details
      setCustomerDetails(savedDetails);
      onCustomerFound();
    } else {
      // Customer not found - show error
      setError('No saved details found for this email. Click "Create New Account" to add your details.');
    }

    setIsSearching(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-serif font-bold text-brand-maroon mb-4">
        Welcome Back!
      </h2>
      <p className="text-gray-600 mb-6">
        Enter your email to retrieve your saved delivery details or create a new account.
      </p>

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
            placeholder="Enter your email address"
            required
          />
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Continue with Saved Details'}
          </Button>
          
          <Button 
            type="button"
            variant="secondary"
            onClick={onNewCustomer}
            className="w-full"
          >
            Create New Account
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-start space-x-2 text-sm text-gray-600">
          <svg className="w-5 h-5 text-brand-maroon flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium text-gray-700 mb-1">Why save your details?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Quick checkout on future orders</li>
              <li>No need to fill forms repeatedly</li>
              <li>Secure and private - stored locally on your device</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailLookup;