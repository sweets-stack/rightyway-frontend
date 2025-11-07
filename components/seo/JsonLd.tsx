import React from 'react';
import { Product } from '../../types';
import { BRAND_NAME, SITE_URL } from '../../constants';

interface JsonLdProps {
    product?: Product;
    type?: 'website' | 'product';
}

const JsonLd: React.FC<JsonLdProps> = ({ product, type = 'website' }) => {
    if (type === 'product' && product) {
        const productData = {
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product.name,
            image: product.images,
            description: product.description,
            sku: product.id,
            brand: {
                '@type': 'Brand',
                name: BRAND_NAME
            },
            offers: {
                '@type': 'Offer',
                url: `${SITE_URL}/product/${product.id}`,
                priceCurrency: 'NGN',
                price: product.price_ngn,
                availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                seller: {
                    '@type': 'Organization',
                    name: BRAND_NAME
                }
            }
        };

        return (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }}
            />
        );
    }

    // Default website structured data
    const websiteData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: BRAND_NAME,
        url: SITE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/shop?search={search_term_string}`,
            'query-input': 'required name=search_term_string'
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
        />
    );
};

export default JsonLd;
