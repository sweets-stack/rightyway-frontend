import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '../constants';
import { Product, BackendProduct } from '../types';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  updateProductStock: (productId: string, newStock: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform backend product to frontend product
  const transformProduct = (backendProduct: BackendProduct): Product => ({
    id: backendProduct._id,
    name: backendProduct.name,
    description: backendProduct.description,
    price_ngn: backendProduct.price,
    category: backendProduct.category,
    images: backendProduct.images,
    stock: backendProduct.stock || (backendProduct.inStock ? 10 : 0),
    tags: backendProduct.tags || [],
    colors: backendProduct.colors || [],
    featured: backendProduct.featured || false,
    inStock: backendProduct.inStock
  });

  // Fetch all products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/products`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      // Handle both response formats: { products: [...] } or [...]
      let backendProducts: BackendProduct[] = [];
      
      if (Array.isArray(data)) {
        backendProducts = data;
      } else if (data.products && Array.isArray(data.products)) {
        backendProducts = data.products;
      } else {
        console.error('Unexpected API response format:', data);
        throw new Error('Invalid API response format');
      }
      
      const transformedProducts = backendProducts.map(transformProduct);
      setProducts(transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Get single product by ID
  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  // Update product stock locally (for immediate UI update)
  const updateProductStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: newStock } : p
    ));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        getProductById,
        updateProductStock
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};
