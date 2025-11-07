
import React from 'react';
import { useCart } from '../../context/CartContext';

const CartIcon: React.FC = () => {
    const { cartCount, toggleCart } = useCart();

    return (
        <button onClick={toggleCart} className="relative p-2 text-brand-slate hover:text-brand-maroon transition-colors duration-200">
            <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-brand-maroon rounded-full">
                    {cartCount}
                </span>
            )}
            <span className="sr-only">View shopping cart</span>
        </button>
    );
};

export default CartIcon;
