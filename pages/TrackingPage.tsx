import React, { useState } from 'react';
import { API_BASE_URL } from '../constants';
import Meta from '../components/seo/Meta';
import { API_BASE_URL } from '../constants';
import Button from '../components/ui/Button';
import { API_BASE_URL } from '../constants';

interface TrackingInfo {
  orderNumber: string;
  status: string;
  trackingNumber: string;
  customer: {
    name: string;
  };
  estimatedDelivery: string;
  lastUpdated: string;
}

const TrackingPage: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/track/${trackingNumber}`);
      
      if (response.ok) {
        const data = await response.json();
        setTrackingInfo(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Order not found');
        setTrackingInfo(null);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setTrackingInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Meta 
        title="Track Your Order - Rightyway Aso-Oke" 
        description="Track your Rightyway Aso-Oke order with your tracking number. Get real-time updates on your delivery status."
      />
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-serif font-bold text-brand-slate">Track Your Order</h1>
              <p className="mt-2 text-lg text-gray-600">
                Enter your tracking number to check the status of your order
              </p>
            </div>

            {/* Tracking Form */}
            <div className="bg-white p-8 rounded-lg shadow-sm border mb-8">
              <form onSubmit={handleTrackOrder} className="space-y-4">
                <div>
                  <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    id="trackingNumber"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter your tracking number (e.g., RW123456789)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                  />
                </div>
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Tracking...' : 'Track Order'}
                </Button>
              </form>
            </div>

            {/* Tracking Results */}
            {trackingInfo && (
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <h2 className="text-2xl font-serif font-bold text-brand-maroon mb-6">
                  Order Tracking Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order Number</h3>
                    <p className="text-lg font-semibold text-gray-900">{trackingInfo.orderNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tracking Number</h3>
                    <p className="text-lg font-semibold text-gray-900">{trackingInfo.trackingNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                    <p className="text-lg font-semibold text-gray-900">{trackingInfo.customer.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Estimated Delivery</h3>
                    <p className="text-lg font-semibold text-gray-900">{trackingInfo.estimatedDelivery}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Current Status</h3>
                  <span className={`inline-flex px-4 py-2 text-lg font-semibold rounded-full ${getStatusColor(trackingInfo.status)}`}>
                    {trackingInfo.status.charAt(0).toUpperCase() + trackingInfo.status.slice(1)}
                  </span>
                </div>

                {/* Last Updated */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="text-sm text-gray-900">
                    {new Date(trackingInfo.lastUpdated).toLocaleString()}
                  </p>
                </div>

                {/* Status Timeline */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Journey</h3>
                  <div className="space-y-4">
                    {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, index) => (
                      <div key={status} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(trackingInfo.status) >= index 
                            ? 'bg-brand-maroon text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="ml-4">
                          <p className={`font-medium ${
                            ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(trackingInfo.status) >= index 
                              ? 'text-gray-900' 
                              : 'text-gray-400'
                          }`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="bg-gray-50 p-6 rounded-lg mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you're having trouble tracking your order or have any questions about your delivery, 
                please don't hesitate to contact us.
              </p>
              <div className="flex space-x-4">
                <Button variant="secondary" onClick={() => window.location.href = '/contact'}>
                  Contact Support
                </Button>
                <Button onClick={() => window.location.href = '/shipping'}>
                  Shipping Information
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackingPage;
