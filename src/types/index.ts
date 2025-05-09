
export interface Product {
  id: string;
  name: {
    en: string;
    th: string;
  };
  description: {
    en: string;
    th: string;
  };
  shortDescription: {
    en: string;
    th: string;
  };
  price: number;
  image: string;
  category: 'curry-pastes' | 'stir-fry-sauces' | 'dipping-sauces';
  ingredients: {
    en: string[];
    th: string[];
  };
  useIn: {
    en: string[];
    th: string[];
  };
}

export interface Recipe {
  id: string;
  name: {
    en: string;
    th: string;
  };
  description: {
    en: string;
    th: string;
  };
  servings: number;
  time: number;
  image: string;
  ingredients: {
    en: string[];
    th: string[];
  };
  steps: {
    en: string[];
    th: string[];
  };
  relatedProducts: string[]; // Product IDs
  category: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
