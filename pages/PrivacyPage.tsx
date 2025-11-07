import React from 'react';
import Meta from '../components/seo/Meta';

const PrivacyPage: React.FC = () => {
    return (
        <>
            <Meta 
                title="Privacy Policy - Rightyway Aso-Oke" 
                description="Learn about how Rightyway Aso-Oke protects your privacy and handles your personal information."
            />
            <div className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-serif font-bold text-brand-slate">Privacy Policy</h1>
                            <p className="mt-2 text-lg text-gray-600">Last updated: {new Date().getFullYear()}</p>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <section className="mb-8">
                                <h2 className="text-2xl font-serif font-bold text-brand-maroon mb-4">Information We Collect</h2>
                                <p className="text-gray-700 mb-4">
                                    We collect information you provide directly to us when you:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                    <li>Place an order through our website</li>
                                    <li>Create an account with us</li>
                                    <li>Contact our customer service team</li>
                                    <li>Subscribe to our newsletter</li>
                                    <li>Participate in surveys or promotions</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-serif font-bold text-brand-maroon mb-4">How We Use Your Information</h2>
                                <p className="text-gray-700 mb-4">
                                    We use the information we collect to:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                    <li>Process and fulfill your orders</li>
                                    <li>Send you order confirmations and updates</li>
                                    <li>Provide customer support</li>
                                    <li>Send you marketing communications (with your consent)</li>
                                    <li>Improve our products and services</li>
                                    <li>Prevent fraud and ensure security</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-serif font-bold text-brand-maroon mb-4">Data Security</h2>
                                <p className="text-gray-700 mb-4">
                                    We implement appropriate security measures to protect your personal information 
                                    against unauthorized access, alteration, disclosure, or destruction.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-serif font-bold text-brand-maroon mb-4">Contact Us</h2>
                                <p className="text-gray-700">
                                    If you have any questions about this Privacy Policy, please contact us at{' '}
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

export default PrivacyPage;
