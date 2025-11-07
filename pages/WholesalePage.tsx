import React from 'react';
import Meta from '../components/seo/Meta';
import Button from '../components/ui/Button';

const WholesalePage: React.FC = () => {
    return (
        <>
            <Meta title="Wholesale" description="Partner with Rightyway Aso-Oke for your wholesale needs. We offer special pricing for bulk orders of our handcrafted fabrics." />
            <div className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-maroon">Wholesale Inquiries</h1>
                        <p className="mt-4 text-xl text-brand-slate">Partner with Us for Bulk Orders</p>
                    </div>

                    <div className="mt-12 max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed space-y-6">
                        <p>
                            Rightyway Aso-Oke is pleased to offer special pricing and services for retailers, event planners, and designers who wish to purchase our products in bulk. We are dedicated to building strong partnerships and helping you bring the beauty of authentic Aso-Oke to your clients.
                        </p>
                        
                        <h2 className="text-3xl font-serif font-bold text-brand-slate pt-8">Why Partner with Us?</h2>
                         <ul>
                            <li className="list-disc ml-6"><strong>Competitive Pricing:</strong> Enjoy significant discounts on bulk orders.</li>
                            <li className="list-disc ml-6"><strong>Authentic Quality:</strong> Provide your customers with genuine, handwoven Aso-Oke from Nigerian artisans.</li>
                            <li className="list-disc ml-6"><strong>Custom Orders:</strong> We can work with you to create custom designs, colors, and patterns to meet your specific needs (minimum order quantities apply).</li>
                            <li className="list-disc ml-6"><strong>Dedicated Support:</strong> Our wholesale team is here to assist you with your order from start to finish.</li>
                        </ul>

                         <div className="mt-12 p-8 bg-brand-cream rounded-lg shadow-md">
                            <h2 className="text-2xl font-serif font-bold text-brand-slate text-center">Get in Touch</h2>
                             <p className="text-center mt-2">Fill out the form below to start your wholesale journey with us.</p>
                             <form className="mt-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input type="text" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-maroon focus:border-brand-maroon" />
                                    </div>
                                    <div>
                                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company Name</label>
                                        <input type="text" id="company" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-maroon focus:border-brand-maroon" />
                                    </div>
                                </div>
                                 <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-maroon focus:border-brand-maroon" />
                                </div>
                                 <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Tell us about your needs</label>
                                    <textarea id="message" rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-maroon focus:border-brand-maroon"></textarea>
                                </div>
                                <div className="text-center">
                                    <Button type="submit">Submit Inquiry</Button>
                                </div>
                             </form>
                         </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WholesalePage;
