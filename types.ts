export interface Product {
    id: string;
    name: string;
    description: string;
    price_ngn: number;
    category: string;
    images: string[];
    stock: number;
    wholesale_threshold?: number;
    wholesale_price_ngn?: number;
    tags?: string[];
    colors?: string[];
    featured?: boolean;
    inStock?: boolean;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface BackendProduct {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    colors: string[];
    inStock: boolean;
    featured: boolean;
    tags: string[];
    stock?: number;
    createdAt: string;
    updatedAt: string;
}
