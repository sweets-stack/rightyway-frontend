import React from 'react';
import Meta from '../components/seo/Meta';
import Button from '../components/ui/Button';

const ContactPage: React.FC = () => {
    return (
        <>
            <Meta title="Contact Us" description="Get in touch with Rightyway Aso-Oke for inquiries, custom orders, or customer support. We're here to help." />
            <div className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                     <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-maroon">Contact Us</h1>
                        <p className="mt-4 text-xl text-brand-slate">We'd Love to Hear From You</p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="p-8 bg-brand-cream rounded-lg shadow-md">
                            <h2 className="text-2xl font-serif font-bold text-brand-slate">Send us a Message</h2>
                            <form className="mt-6 space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-maroon focus:border-brand-maroon" />
                                </div>
                                 <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-maroon focus:border-brand-maroon" />
                                </div>
                                 <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea id="message" rows={5} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-maroon focus:border-brand-maroon"></textarea>
                                </div>
                                <div>
                                    <Button type="submit">Send Message</Button>
                                </div>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="text-lg">
                            <h2 className="text-2xl font-serif font-bold text-brand-slate">Our Information</h2>
                             <div className="mt-6 space-y-4 text-gray-700">
                                <p>
                                    <strong>Address:</strong><br/>
                                    123 Weavers Lane, Iseyin, Oyo State, Nigeria
                                </p>
                                <p>
                                    <strong>Email:</strong><br/>
                                    <a href="mailto:info@rightyway.example" className="text-brand-maroon hover:underline">info@rightyway.example</a>
                                </p>
                                <p>
                                    <strong>Phone / WhatsApp:</strong><br/>
                                    <a href="tel:+2348012345678" className="text-brand-maroon hover:underline">+234 80 1234 5678</a>
                                </p>
                                <p>
                                    <strong>Business Hours:</strong><br/>
                                    Monday - Saturday: 9:00 AM - 5:00 PM (WAT)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactPage;
