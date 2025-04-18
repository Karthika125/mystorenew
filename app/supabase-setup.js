// This file is used to set up the necessary tables in Supabase
// You would run this script once manually to initialize your database

import { supabase } from './lib/supabase';

async function setupSupabaseTables() {
  console.log('Setting up Supabase tables...');

  // Create orders table if it doesn't exist
  const { error: ordersError } = await supabase.rpc('create_table_if_not_exists', {
    table_name: 'orders',
    columns: `
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      order_id TEXT UNIQUE NOT NULL,
      amount NUMERIC NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      receipt TEXT,
      status TEXT NOT NULL DEFAULT 'created',
      payment_status TEXT NOT NULL DEFAULT 'pending',
      payment_id TEXT,
      user_id uuid REFERENCES auth.users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `
  });

  if (ordersError) {
    console.error('Error creating orders table:', ordersError);
  } else {
    console.log('Orders table created or already exists');
  }

  // Create categories table if it doesn't exist
  const { error: categoriesError } = await supabase.rpc('create_table_if_not_exists', {
    table_name: 'categories',
    columns: `
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      image_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `
  });

  if (categoriesError) {
    console.error('Error creating categories table:', categoriesError);
  } else {
    console.log('Categories table created or already exists');
  }

  // Create products table if it doesn't exist
  const { error: productsError } = await supabase.rpc('create_table_if_not_exists', {
    table_name: 'products',
    columns: `
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      description TEXT,
      price NUMERIC NOT NULL,
      image_url TEXT,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      category_id INTEGER REFERENCES categories(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `
  });

  if (productsError) {
    console.error('Error creating products table:', productsError);
  } else {
    console.log('Products table created or already exists');
  }
  
  console.log('Supabase setup complete');
}

// Run the setup function
setupSupabaseTables(); 