import React from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import Meta from '../components/seo/Meta';
import JsonLd from '../components/seo/JsonLd';
import Button from '../components/ui/Button';
import { BRAND_NAME, SITE_URL } from '../constants';
import BackButton from '../components/ui/BackButton';


const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getProductById } = useProducts();
    const { addToCart } = useCart();
    
    const product = id ? getProductById(id) : undefined;

    if (!product) {
        return (
            <>
                <Meta title="Product Not Found - Rightyway Aso-Oke" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-2xl font-serif font-bold text-brand-slate">Product Not Found</h1>
                    <p className="mt-2 text-gray-600">The product you're looking for doesn't exist.</p>
                </div>
            </>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, 1);
    };

    return (
        <>
            <Meta 
                title={`${product.name} - ${BRAND_NAME}`}
                description={product.description}
                image={product.images[0]}
                url={`${SITE_URL}/product/${product.id}`}
            />
            <JsonLd product={product} type="product" />
            
            
            <div className="bg-white">
                <BackButton className="mb-6 px-4 py-4 mx-4 my-4 rounded bg-brand-maroon text-white" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                        {/* Image gallery */}
                        <div className="flex flex-col-reverse">
                            <div className="w-full max-w-2xl mx-auto mt-6 sm:block lg:max-w-none">
                                <div className="grid grid-cols-4 gap-2" aria-orientation="horizontal">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            className="relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
                                        >
                                            <span className="sr-only">View image {index + 1}</span>
                                            <span className="absolute inset-0 rounded-md overflow-hidden">
                                                <img src={image} alt="" className="w-full h-full object-center object-cover" />
                                            </span>
                                            <span className={`absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none ${index === 0 ? 'ring-brand-maroon' : 'ring-transparent'}`} aria-hidden="true" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full aspect-w-1 aspect-h-1">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-center object-cover sm:rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Product info */}
                        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                            <h1 className="text-3xl font-serif font-bold text-brand-slate">{product.name}</h1>

                            <div className="mt-3">
                                <h2 className="sr-only">Product information</h2>
                                <p className="text-3xl text-gray-900">₦{product.price_ngn.toLocaleString()}</p>
                            </div>

                            {product.wholesale_threshold && product.wholesale_price_ngn && (
                                <div className="mt-2">
                                    <p className="text-sm text-brand-maroon">
                                        Wholesale price: ₦{product.wholesale_price_ngn.toLocaleString()} (for {product.wholesale_threshold}+ items)
                                    </p>
                                </div>
                            )}

                            <div className="mt-6">
                                <h3 className="sr-only">Description</h3>
                                <div className="text-base text-gray-700 space-y-6">
                                    <p>{product.description}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex items-center">
                                    <h3 className="text-sm text-gray-600">Category:</h3>
                                    <p className="ml-2 text-sm font-medium text-gray-900">{product.category}</p>
                                </div>

                                <div className="mt-2 flex items-center">
                                    <h3 className="text-sm text-gray-600">Availability:</h3>
                                    <p className={`ml-2 text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10 flex">
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className="max-w-xs flex-1 bg-brand-maroon border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-brand-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-brand-maroon disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add to cart
                                </Button>
                            </div>

                            <section className="mt-12">
                                <h3 className="text-lg font-serif font-bold text-brand-slate">Product Details</h3>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Care Instructions</h4>
                                        <p className="mt-1 text-sm text-gray-600">Hand wash recommended. Dry clean optional.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Material</h4>
                                        <p className="mt-1 text-sm text-gray-600">100% premium cotton Aso-Oke fabric</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Origin</h4>
                                        <p className="mt-1 text-sm text-gray-600">Handcrafted in Nigeria</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetailPage;
