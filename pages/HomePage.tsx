import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/products/ProductGrid';
import Button from '../components/ui/Button';
import Meta from '../components/seo/Meta';
import JsonLd from '../components/seo/JsonLd';

const HomePage: React.FC = () => {
    const { products, loading } = useProducts();
    const bestSellers = products.slice(0, 3);

    // Hero carousel state
    const heroImages = [
        { src: '/IMAGE1.png', alt: 'Aso-Oke fabric collection 1' },
        { src: '/IMAGE2.png', alt: 'Aso-Oke fabric collection 2' },
        { src: '/IMAGE3.png', alt: 'Aso-Oke fabric collection 3' },
        { src: '/IMAGE4.png', alt: 'Aso-Oke fabric collection 4' },
        { src: '/IMAGE5.png', alt: 'Aso-Oke fabric collection 5' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Stats animation state
    const [statsVisible, setStatsVisible] = useState(false);
    const [animatedStats, setAnimatedStats] = useState({
        years: 0,
        clients: 0,
        products: 0,
        artisans: 0
    });

    // Final stats values
    const finalStats = {
        years: 15,
        clients: 5000,
        products: 200,
        artisans: 50
    };

    // Check screen size on mount and resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Stats animation on scroll
    useEffect(() => {
        const handleScroll = () => {
            const statsSection = document.getElementById('stats-section');
            if (statsSection) {
                const rect = statsSection.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
                
                if (isVisible && !statsVisible) {
                    setStatsVisible(true);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check on mount
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [statsVisible]);

    // Animate stats numbers
    useEffect(() => {
        if (statsVisible) {
            const duration = 2000; // 2 seconds
            const steps = 60;
            const stepDuration = duration / steps;

            let currentStep = 0;

            const interval = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;

                setAnimatedStats({
                    years: Math.floor(finalStats.years * progress),
                    clients: Math.floor(finalStats.clients * progress),
                    products: Math.floor(finalStats.products * progress),
                    artisans: Math.floor(finalStats.artisans * progress)
                });

                if (currentStep >= steps) {
                    setAnimatedStats(finalStats);
                    clearInterval(interval);
                }
            }, stepDuration);

            return () => clearInterval(interval);
        }
    }, [statsVisible]);

    // Auto-play functionality
    useEffect(() => {
        const interval = setInterval(() => {
            goToNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const goToNext = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setCurrentIndex((prev) => (prev + 1) % heroImages.length);
            setTimeout(() => setIsAnimating(false), 500);
        }
    };

    const goToPrevious = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
            setTimeout(() => setIsAnimating(false), 500);
        }
    };

    const goToSlide = (index: number) => {
        if (!isAnimating && index !== currentIndex) {
            setIsAnimating(true);
            setCurrentIndex(index);
            setTimeout(() => setIsAnimating(false), 500);
        }
    };

    // Get visible images based on screen size
    const getVisibleImages = () => {
        const showCount = isMobile ? 3 : 5;
        const images = [];
        
        for (let i = -Math.floor(showCount/2); i <= Math.floor(showCount/2); i++) {
            const index = (currentIndex + i + heroImages.length) % heroImages.length;
            images.push({ ...heroImages[index], position: i, index });
        }
        return images;
    };

    const visibleImages = getVisibleImages();

    return (
        <>
            <Meta />
            <JsonLd type="Organization" />
            
            {/* Hero Section */}
            <section className="bg-brand-cream py-8 sm:py-12 lg:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Text Content */}
                    <div className="text-center mb-8 lg:mb-12">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-brand-maroon mb-4">
                            Rightyway Aso-Oke Fabrics
                        </h1>
                        <p className="text-xl sm:text-2xl font-serif text-brand-slate mb-4">
                            Woven with Culture. Designed for Today.
                        </p>
                        <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto mb-6">
                            Experience the elegance of handcrafted Aso-Oke woven with precision, passion, and pride. Rightyway blends timeless Yoruba weaving artistry with modern fashion creativity.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <Button asLink="/shop" size="lg" variant="primary">Shop Now</Button>
                            <Button asLink="/wholesale" size="lg" variant="outline">Wholesale Inquiry</Button>
                        </div>
                    </div>

                    {/* Image Carousel - Perfectly Centered */}
                    <div className="relative mt-8 sm:mt-12 flex items-center justify-center">
                        {/* Left Navigation Arrow - Outside carousel */}
                        <button
                            onClick={goToPrevious}
                            disabled={isAnimating}
                            className="flex-shrink-0 mr-2 sm:mr-4 md:mr-6 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed z-40"
                            aria-label="Previous image"
                        >
                            <svg className="w-4 h-4 sm:w-6 sm:h-6 text-brand-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Carousel Container - Centered */}
                        <div className="relative w-full max-w-[90vw] lg:max-w-[1200px] h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden flex-shrink">
                            <div className="absolute inset-0 flex items-center justify-center">
                                {visibleImages.map((image, idx) => {
                                    const position = image.position;
                                    const isCenterImage = position === 0;

                                    let translateX = 0;
                                    let scale = 1;
                                    let zIndex = 1;
                                    let opacity = 1;
                                    let maxWidth = '300px';
                                    const spacing = isMobile ? 200 : 300;

                                    if (isMobile) {
                                        maxWidth = '200px';
                                        if (isCenterImage) {
                                            translateX = 0;
                                            scale = 1;
                                            zIndex = 30;
                                            opacity = 1;
                                        } else if (position === -1) {
                                            translateX = -spacing;
                                            scale = 0.75;
                                            zIndex = 10;
                                            opacity = 0.65;
                                        } else if (position === 1) {
                                            translateX = spacing;
                                            scale = 0.75;
                                            zIndex = 10;
                                            opacity = 0.65;
                                        }
                                    } else {
                                        maxWidth = '280px';
                                        if (isCenterImage) {
                                            translateX = 0;
                                            scale = 1;
                                            zIndex = 30;
                                            opacity = 1;
                                        } else if (position === -1) {
                                            translateX = -spacing;
                                            scale = 0.8;
                                            zIndex = 20;
                                            opacity = 0.75;
                                        } else if (position === 1) {
                                            translateX = spacing;
                                            scale = 0.8;
                                            zIndex = 20;
                                            opacity = 0.75;
                                        } else if (position === -2) {
                                            translateX = -spacing * 2;
                                            scale = 0.65;
                                            zIndex = 10;
                                            opacity = 0.5;
                                        } else if (position === 2) {
                                            translateX = spacing * 2;
                                            scale = 0.65;
                                            zIndex = 10;
                                            opacity = 0.5;
                                        }
                                    }

                                    return (
                                        <div
                                            key={`${image.index}-${idx}`}
                                            className="absolute transition-all duration-500 ease-in-out cursor-pointer"
                                            style={{
                                                transform: `translateX(${translateX}px) scale(${scale})`,
                                                zIndex,
                                                opacity,
                                                maxWidth,
                                                left: '50%',
                                                top: '50%',
                                                marginLeft: `-${parseInt(maxWidth) / 2}px`,
                                            }}
                                            onClick={() => !isCenterImage && goToSlide(image.index)}
                                        >
                                            <img
                                                src={image.src}
                                                alt={image.alt}
                                                className="w-full h-auto object-contain rounded-lg shadow-xl"
                                                style={{
                                                    maxHeight: isMobile ? '250px' : '380px',
                                                    display: 'block',
                                                    transform: 'translateY(-50%)',
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Navigation Arrow - Outside carousel */}
                        <button
                            onClick={goToNext}
                            disabled={isAnimating}
                            className="flex-shrink-0 ml-2 sm:ml-4 md:ml-6 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed z-40"
                            aria-label="Next image"
                        >
                            <svg className="w-4 h-4 sm:w-6 sm:h-6 text-brand-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Navigation Dots - Below carousel */}
                    </div>
                    <div className="flex justify-center gap-2 sm:gap-3 mt-8">
                        {heroImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                disabled={isAnimating}
                                className={`transition-all duration-300 rounded-full ${
                                    index === currentIndex
                                        ? 'w-6 sm:w-8 h-2 bg-brand-maroon'
                                        : 'w-2 h-2 bg-gray-400 hover:bg-gray-600'
                                } disabled:cursor-not-allowed`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section - NEW */}
            <section id="stats-section" className="py-12 sm:py-16 bg-brand-gold text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {/* Years of Excellence */}
                        <div className="text-center">
                            <div className="mb-3">
                                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-brand-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                                {animatedStats.years}+
                            </div>
                            <div className="text-sm sm:text-base text-brand-cream/90">
                                Years of Excellence
                            </div>
                        </div>

                        {/* Happy Clients */}
                        <div className="text-center">
                            <div className="mb-3">
                                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-brand-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                                {animatedStats.clients.toLocaleString()}+
                            </div>
                            <div className="text-sm sm:text-base text-brand-cream/90">
                                Happy Clients
                            </div>
                        </div>

                        {/* Unique Products */}
                        <div className="text-center">
                            <div className="mb-3">
                                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-brand-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                                {animatedStats.products}+
                            </div>
                            <div className="text-sm sm:text-base text-brand-cream/90">
                                Unique Products
                            </div>
                        </div>

                        {/* Skilled Artisans */}
                        <div className="text-center">
                            <div className="mb-3">
                                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-brand-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                                </svg>
                            </div>
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                                {animatedStats.artisans}+
                            </div>
                            <div className="text-sm sm:text-base text-brand-cream/90">
                                Skilled Artisans
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Rightyway Section */}
            <section className="py-16 sm:py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-slate">Why Choose Rightyway?</h2>
                        <p className="mt-2 text-base sm:text-lg text-gray-600">Authenticity and Quality in Every Thread</p>
                    </div>
                    <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 text-center">
                        <div className="p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-brand-maroon">Authentic Craftsmanship</h3>
                            <p className="mt-2 text-sm sm:text-base text-gray-600">Each piece is handwoven by skilled artisans in Nigeria, preserving traditional techniques.</p>
                        </div>
                        <div className="p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-brand-maroon">Premium Materials</h3>
                            <p className="mt-2 text-sm sm:text-base text-gray-600">We use only the finest cotton, silk, and metallic threads for a luxurious feel and lasting durability.</p>
                        </div>
                        <div className="p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-brand-maroon">Modern Designs</h3>
                            <p className="mt-2 text-sm sm:text-base text-gray-600">Our collections merge timeless patterns with contemporary styles, perfect for any occasion.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Best Sellers Section */}
            <section className="py-16 sm:py-20 bg-brand-cream">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-slate">Our Best Sellers</h2>
                        <p className="mt-2 text-base sm:text-lg text-gray-600">Discover the pieces our customers love the most.</p>
                    </div>
                    {loading ? <p>Loading...</p> : <ProductGrid products={bestSellers} />}
                    <div className="text-center mt-8 sm:mt-12">
                        <Button asLink="/shop" size="lg" variant="secondary">View All Collections</Button>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="bg-brand-maroon text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold">Ready to Own a Piece of Heritage?</h2>
                    <p className="mt-3 sm:mt-4 text-base sm:text-lg max-w-2xl mx-auto">Explore our exclusive Aso-Oke collections or get in touch for a custom design consultation.</p>
                    <div className="mt-6 sm:mt-8">
                        <Button asLink="/contact" size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-maroon">
                            Contact Us Today
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;