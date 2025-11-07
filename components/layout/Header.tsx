import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { NAV_LINKS, BRAND_NAME } from '../../constants';
import CartIcon from '../cart/CartIcon';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-brand-cream/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" className="block" aria-label="Homepage">
                            <img src="/header-logo.png" alt={`${BRAND_NAME} logo`} className="h-12 w-auto" />
                        </Link>
                    </div>

                    <nav className="hidden md:flex md:space-x-8">
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-lg font-medium transition-colors duration-200 ${isActive ? 'text-brand-maroon' : 'text-brand-slate hover:text-brand-maroon'}`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <CartIcon />
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-brand-slate hover:text-brand-maroon hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-maroon"
                                aria-expanded={isMenuOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                                <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {NAV_LINKS.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-brand-maroon text-white' : 'text-brand-slate hover:bg-brand-cream hover:text-brand-maroon'}`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;
