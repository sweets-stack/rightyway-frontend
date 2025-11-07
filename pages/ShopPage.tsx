import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilter from '../components/products/ProductFilter';
import Meta from '../components/seo/Meta';

const ShopPage: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get filter values from URL params or defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  // Save scroll position before leaving page
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem('shopPageScrollPosition', window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Restore scroll position when returning to page
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('shopPageScrollPosition');
    if (savedScrollPosition) {
      // Delay scroll restoration to ensure content is loaded
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
      }, 100);
    }
  }, []);

  // Update URL params when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedTag) params.tag = selectedTag;
    if (selectedColor) params.color = selectedColor;
    if (selectedCategory) params.category = selectedCategory;
    
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedTag, selectedColor, selectedCategory, setSearchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag ? (product.tags || []).includes(selectedTag) : true;
      const matchesColor = selectedColor ? (product.colors || []).includes(selectedColor) : true;
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      return matchesSearch && matchesTag && matchesColor && matchesCategory;
    });
  }, [products, searchQuery, selectedTag, selectedColor, selectedCategory]);

  const allTags = useMemo(() => {
      const tags = new Set<string>();
      products.forEach(p => {
        (p.tags || []).forEach(t => tags.add(t));
      });
      return Array.from(tags).sort();
  }, [products]);

  const allColors = useMemo(() => {
      const colors = new Set<string>();
      products.forEach(p => {
        (p.colors || []).forEach(c => colors.add(c));
      });
      return Array.from(colors).sort();
  }, [products]);

  const allCategories = useMemo(() => {
      const categories = new Set<string>();
      products.forEach(p => {
        if (p.category) categories.add(p.category);
      });
      return Array.from(categories).sort();
  }, [products]);

  return (
    <>
      <Meta title="Shop All Collections" description="Browse our full collection of handcrafted Aso-Oke fabrics. Filter by color, style, and more to find the perfect piece for your occasion." />
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-brand-slate">Our Collections</h1>
            <p className="mt-2 text-lg text-gray-600">Find the perfect Aso-Oke for any event.</p>
          </div>

          <ProductFilter
            tags={allTags}
            colors={allColors}
            categories={allCategories}
            onSearchChange={setSearchQuery}
            onTagChange={setSelectedTag}
            onColorChange={setSelectedColor}
            onCategoryChange={setSelectedCategory}
            selectedTag={selectedTag}
            selectedColor={selectedColor}
            selectedCategory={selectedCategory}
          />

          {loading && (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">Loading products...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          )}
          
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">No products found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag('');
                  setSelectedColor('');
                  setSelectedCategory('');
                }}
                className="mt-2 px-4 py-2 bg-brand-maroon text-white rounded hover:bg-brand-gold"
              >
                Clear Filters
              </button>
            </div>
          )}
          
          {!loading && !error && filteredProducts.length > 0 && (
            <>
              <div className="mb-6 text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </div>
              <ProductGrid products={filteredProducts} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ShopPage;