// Fallback data for when Supabase connection fails

export const FALLBACK_PRODUCTS = [
  {
    id: '1',
    name: 'Smartphone X',
    description: 'Latest smartphone with advanced features',
    price: 29999,
    image_url: 'https://via.placeholder.com/400x400/f5f5f5/333333?text=Smartphone',
    stock_quantity: 10,
    category_id: 1
  },
  {
    id: '2',
    name: 'Laptop Pro',
    description: 'Powerful laptop for professionals',
    price: 79999,
    image_url: 'https://via.placeholder.com/400x400/f5f5f5/333333?text=Laptop',
    stock_quantity: 5,
    category_id: 1
  },
  {
    id: '3',
    name: 'Wireless Headphones',
    description: 'Premium sound quality with noise cancellation',
    price: 8999,
    image_url: 'https://via.placeholder.com/400x400/f5f5f5/333333?text=Headphones',
    stock_quantity: 15,
    category_id: 1
  },
  {
    id: '4',
    name: 'Smartwatch Fitness',
    description: 'Track your health and fitness goals',
    price: 12999,
    image_url: 'https://via.placeholder.com/400x400/f5f5f5/333333?text=Smartwatch',
    stock_quantity: 8,
    category_id: 1
  }
];

export const FALLBACK_CATEGORIES = [
  {
    id: 1,
    name: 'Electronics',
    image_url: 'https://via.placeholder.com/400x400/f5f5f5/333333?text=Electronics'
  },
  {
    id: 2,
    name: 'Clothing',
    image_url: 'https://via.placeholder.com/400x400/f5f5f5/333333?text=Clothing'
  },
  {
    id: 3,
    name: 'Home & Kitchen',
    image_url: 'https://via.placeholder.com/400x400/f5f5f5/333333?text=Home'
  },
  {
    id: 4,
    name: 'Books',
    image_url: 'https://via.placeholder.com/400x400/f5f5f5/333333?text=Books'
  },
  {
    id: 5,
    name: 'Beauty',
    image_url: 'https://via.placeholder.com/400x400/f5f5f5/333333?text=Beauty'
  },
  {
    id: 6,
    name: 'Sports',
    image_url: 'https://via.placeholder.com/400x400/f5f5f5/333333?text=Sports'
  }
]; 