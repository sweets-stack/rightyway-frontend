
import React from 'react';
import Meta from '../components/seo/Meta';

const AboutPage: React.FC = () => {
    return (
        <>
            <Meta title="About Us" description="Learn about the story of Rightyway Aso-Oke Fabrics LTD., our mission to preserve Yoruba weaving heritage, and the talented artisans behind our creations." />
            <div className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-maroon">Our Story</h1>
                        <p className="mt-4 text-xl text-brand-slate">Preserving Heritage, Weaving the Future</p>
                    </div>

                    <div className="mt-12 max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed space-y-6">
                        <p>
                            Rightyway Aso-Oke Fabrics LTD. was born from a deep-rooted passion for the rich cultural tapestry of the Yoruba people. Founded by [Founder's Name], a descendant of a long line of master weavers, our brand is more than just a business—it is a mission to preserve, celebrate, and innovate the timeless art of Aso-Oke weaving.
                        </p>
                        <p>
                            Growing up surrounded by the rhythmic clatter of looms and the vibrant colors of freshly dyed threads, our founder witnessed firsthand the dedication and artistry that goes into every piece of Aso-Oke. We saw how this special fabric, woven for kings and queens, tells stories of celebration, identity, and community.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-8">
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-brand-slate mb-4">Our Mission</h2>
                                <p>
                                    Our mission is to bridge the gap between tradition and modernity. We aim to make the luxury and elegance of authentic, handcrafted Aso-Oke accessible to a global audience, ensuring that the legacy of our ancestors not only survives but thrives in the contemporary world. We are committed to ethical practices, fair wages for our artisans, and sustainable sourcing of materials.
                                </p>
                            </div>
                            <img src="https://picsum.photos/seed/artisan/800/600" alt="An artisan weaving Aso-Oke on a traditional loom" className="rounded-lg shadow-lg" />
                        </div>

                        <h2 className="text-3xl font-serif font-bold text-brand-slate text-center pt-8">Meet Our Artisans</h2>
                        <p className="text-center">
                            The heart and soul of Rightyway Aso-Oke Fabrics LTD. are our talented artisans. Working from their communities in the historic weaving towns of Iseyin and Oyo, they bring generations of skill and passion to every thread. We are proud to partner with these masters of their craft, providing them with the support they need to continue their invaluable work.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutPage;
