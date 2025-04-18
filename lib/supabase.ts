import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fqyaxeyfusrshzlwnhec.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxeWF4ZXlmdXNyc2h6bHduaGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5ODg4MjUsImV4cCI6MjA2MDU2NDgyNX0.eoBwvbLD6HYOyWIaVXkPXPP7Y3IrxPoZCSPsAQHym04';

// Create a single supabase client for the entire app with optimized settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: fetch.bind(globalThis),
  },
});

// Cache for data to reduce duplicate requests
const cache = {
  categories: [] as any[],
  products: new Map(),
  categoryProducts: new Map(),
};

// Helper function for better error handling
const handleSupabaseError = (error: any, source: string) => {
  console.error(`Supabase error in ${source}:`, error);
  // You could add additional error reporting here
  return null;
};

export async function getCategories() {
  // Return from cache if available
  if (cache.categories.length > 0) {
    return cache.categories;
  }

  try {
    console.log('Fetching categories from Supabase...');
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      return handleSupabaseError(error, 'getCategories') || [];
    }
    
    // Cache the result
    cache.categories = data || [];
    return data || [];
  } catch (err) {
    console.error('Unexpected error in getCategories:', err);
    return [];
  }
}

export async function getProducts(categoryId?: number) {
  // Create a cache key
  const cacheKey = categoryId ? `category-${categoryId}` : 'all';
  
  // Return from cache if available
  if (categoryId && cache.categoryProducts.has(cacheKey)) {
    return cache.categoryProducts.get(cacheKey);
  } else if (!categoryId && cache.products.has('all')) {
    return cache.products.get('all');
  }
  
  try {
    console.log(`Fetching products${categoryId ? ` for category ${categoryId}` : ''}...`);
    let query = supabase
      .from('products')
      .select('*, categories(*)');
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return handleSupabaseError(error, 'getProducts') || [];
    }
    
    // Cache the result
    if (categoryId) {
      cache.categoryProducts.set(cacheKey, data || []);
    } else {
      cache.products.set('all', data || []);
    }
    
    return data || [];
  } catch (err) {
    console.error('Unexpected error in getProducts:', err);
    return [];
  }
}

export async function getProductById(id: string) {
  // Return from cache if available
  if (cache.products.has(id)) {
    return cache.products.get(id);
  }
  
  try {
    console.log(`Fetching product ${id}...`);
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      return handleSupabaseError(error, 'getProductById');
    }
    
    // Cache the result
    if (data) {
      cache.products.set(id, data);
    }
    
    return data;
  } catch (err) {
    console.error('Unexpected error in getProductById:', err);
    return null;
  }
}

export async function searchProducts(searchTerm: string) {
  try {
    console.log(`Searching products with term: ${searchTerm}...`);
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .ilike('name', `%${searchTerm}%`)
      .order('name');
    
    if (error) {
      return handleSupabaseError(error, 'searchProducts') || [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Unexpected error in searchProducts:', err);
    return [];
  }
}

// Function to clear cache when needed (e.g., after updates)
export function clearCache() {
  cache.categories = [];
  cache.products.clear();
  cache.categoryProducts.clear();
  console.log('Supabase cache cleared');
} 