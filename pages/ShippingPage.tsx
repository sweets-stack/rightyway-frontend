import React from 'react';
import Meta from '../components/seo/Meta';

const ShippingPage: React.FC = () => {
    return (
        <>
            <Meta 
                title="Shipping & Returns - Rightyway Aso-Oke" 
                description="Learn about Rightyway Aso-Oke's shipping options, delivery times, and return policy."
            />
            <div className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-serif font-bold text-brand-slate">Shipping & Returns</h1>
                            <p className="mt-2 text-lg text-gray-600">We make it easy to get your Aso-Oke fabrics</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-serif font-bold text-brand-maroon mb-4">Shipping Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Processing Time</h4>
                                        <p className="text-gray-700">1-3 business days</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Shipping Methods</h4>
                                        <p className="text-gray-700">Standard & Express options available</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Delivery Areas</h4>
                                        <p className="text-gray-700">Nigeria & International shipping</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Tracking</h4>
                                        <p className="text-gray-700">All orders include tracking numbers</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-serif font-bold text-brand-maroon mb-4">Return Policy</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Return Window</h4>
                                        <p className="text-gray-700">14 days from delivery</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Condition</h4>
                                        <p className="text-gray-700">Items must be unused with tags</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Return Process</h4>
                                        <p className="text-gray-700">Contact us for return authorization</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Refunds</h4>
                                        <p className="text-gray-700">Processed within 5-7 business days</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <section className="mb-8">
                                <h2 className="text-2xl font-serif font-bold text-brand-maroon mb-4">Shipping Details</h2>
                                <p className="text-gray-700 mb-4">
                                    We ship worldwide using trusted carriers. Shipping costs are calculated at 
                                    checkout based on your location and the selected shipping method.
                                </p>
                                <p className="text-gray-700 mb-4">
                                    For Nigerian orders, standard shipping typically takes 3-5 business days. 
                                    International shipping times vary by destination.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-serif font-bold text-brand-maroon mb-4">Returns & Exchanges</h2>
                                <p className="text-gray-700 mb-4">
                                    We want you to love your Rightyway Aso-Oke purchase. If you're not completely 
                                    satisfied, you may return unworn, unwashed items with original tags within 
                                    14 days of delivery.
                                </p>
                                <p className="text-gray-700 mb-4">
                                    To initiate a return, please contact our customer service team with your 
                                    order number and reason for return.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-serif font-bold text-brand-maroon mb-4">Damaged or Defective Items</h2>
                                <p className="text-gray-700 mb-4">
                                    If you receive a damaged or defective item, please contact us within 48 hours 
                                    of delivery. We will arrange for a replacement or refund.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-serif font-bold text-brand-maroon mb-4">Contact Support</h2>
                                <p className="text-gray-700">
                                    Need help with shipping or returns? Contact us at{' '}
                                    <a href="mailto:support@rightywayasooke.com" className="text-brand-maroon hover:text-brand-gold">
                                        support@rightywayasooke.com
                                    </a>
                                    {' '}or use our{' '}
                                    <a href="/contact" className="text-brand-maroon hover:text-brand-gold">
                                        contact form
                                    </a>.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShippingPage;
