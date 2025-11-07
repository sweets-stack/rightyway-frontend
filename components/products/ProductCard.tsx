
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const formattedPrice = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(product.price_ngn);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-w-3 aspect-h-4 bg-gray-200 sm:aspect-none sm:h-80">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center sm:h-full sm:w-full"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-lg font-medium text-brand-slate">
          <Link to={`/product/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-xl font-bold text-brand-maroon">{formattedPrice}</p>
        </div>
      </div>
       <div className="p-4 pt-0">
          <Button onClick={handleAddToCart} className="w-full">Add to cart</Button>
       </div>
    </div>
  );
};

export default ProductCard;
