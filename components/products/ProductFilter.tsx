import React from 'react';

interface ProductFilterProps {
  tags: string[];
  colors: string[];
  categories: string[];
  onSearchChange: (query: string) => void;
  onTagChange: (tag: string) => void;
  onColorChange: (color: string) => void;
  onCategoryChange: (category: string) => void;
  selectedTag: string;
  selectedColor: string;
  selectedCategory: string;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  tags,
  colors,
  categories,
  onSearchChange,
  onTagChange,
  onColorChange,
  onCategoryChange,
  selectedTag,
  selectedColor,
  selectedCategory
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by name or description..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Tag Filter */}
        <div>
          <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-2">
            Tag
          </label>
          <select
            id="tag"
            value={selectedTag}
            onChange={(e) => onTagChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
          >
            <option value="">All Tags</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Color Filter */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <select
            id="color"
            value={selectedColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
          >
            <option value="">All Colors</option>
            {colors.map(color => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedTag || selectedColor || selectedCategory) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedCategory && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-maroon text-white">
              Category: {selectedCategory}
              <button
                onClick={() => onCategoryChange('')}
                className="ml-2 hover:text-gray-200"
              >
                ×
              </button>
            </span>
          )}
          {selectedTag && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-gold text-white">
              Tag: {selectedTag}
              <button
                onClick={() => onTagChange('')}
                className="ml-2 hover:text-gray-200"
              >
                ×
              </button>
            </span>
          )}
          {selectedColor && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
              Color: {selectedColor}
              <button
                onClick={() => onColorChange('')}
                className="ml-2 hover:text-gray-200"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={() => {
              onCategoryChange('');
              onTagChange('');
              onColorChange('');
            }}
            className="text-sm text-brand-maroon hover:text-brand-gold"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
