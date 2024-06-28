// product.interface.ts

export interface Product {
    uid: string;
    categoryId: string;
    name: string;
    description: string;
    // image: string[];
    price: number;
    stock: 'InStock' | 'OutOfStock';
    tax: string;
    variants: Variant[];
    specialTags: string[];
    rating: number;
    nonVegetarian: boolean;
    
  }
  
  export interface Variant {
    name: string;
    price: number;
    // image: string[];
  }