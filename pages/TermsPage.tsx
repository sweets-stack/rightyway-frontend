import React from 'react';
import Meta from '../components/seo/Meta';

const TermsPage: React.FC = () => {
    return (
        <>
            <Meta 
                title="Terms of Service - Rightyway Aso-Oke" 
                description="Read the terms and conditions for using Rightyway Aso-Oke's website and services."
            />
            <div className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-serif font-bold text-brand-slate">Terms of Service</h1>
                            <p className="mt-2 text-lg text-gray-600">Last updated: {new Date().getFullYear()}</p>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <section className="mb-8">
                                <h2 className="text-2xl font-serif font-bold text-brand-maroon mb-4">Agreement to Terms</h2>
                                <p className="text-gray-700 mb-4">
                                    By accessing and using Rightyway Aso-Oke's website and services, you agree to be 
                                    bound by these Terms of Service and our Privacy Policy.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-serif font-bold text-brand-maroon mb-4">Orders and Payment</h2>
                                <p className="text-gray-700 mb-4">
                                    All orders are subject to acceptance and availability. We reserve the right to 
                                    refuse or cancel any order for any reason, including limitations on quantities 
                                    available for purchase.
                                </p>
                                <p className="text-gray-700 mb-4">
                                    Prices are subject to change without notice. We are not responsible for 
                                    typographical errors in pricing.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-serif font-bold text-brand-maroon mb-4">Shipping and Delivery</h2>
                                <p className="text-gray-700 mb-4">
                                    Shipping times are estimates and begin from the date your order is shipped, 
                                    not the date it is placed. We are not responsible for delays caused by 
                                    shipping carriers or customs.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-serif font-bold text-brand-maroon mb-4">Returns and Refunds</h2>
                                <p className="text-gray-700 mb-4">
                                    Please refer to our Shipping & Returns policy for detailed information about 
                                    returns, exchanges, and refunds.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-serif font-bold text-brand-maroon mb-4">Intellectual Property</h2>
                                <p className="text-gray-700 mb-4">
                                    All content on this website, including text, graphics, logos, and images, 
                                    is the property of Rightyway Aso-Oke and is protected by copyright laws.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-serif font-bold text-brand-maroon mb-4">Contact Information</h2>
                                <p className="text-gray-700">
                                    For any questions about these Terms of Service, please contact us at{' '}
                                    <a href="mailto:support@rightywayasooke.com" className="text-brand-maroon hover:text-brand-gold">
                                        support@rightywayasooke.com
                                    </a>
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsPage;
