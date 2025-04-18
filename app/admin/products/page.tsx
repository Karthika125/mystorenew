'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiEdit, FiTrash2, FiPlus, FiUpload, FiX, FiShield } from 'react-icons/fi';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { uploadImage, deleteImage, createBucketIfNotExists } from '@/lib/supabase-storage';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import { Product } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();

  useEffect(() => {
    // Check if user is admin
    if (!isAdminLoading) {
      if (!user) {
        router.push('/signin?redirect=/admin/products');
        return;
      }
      
      if (!isAdmin) {
        toast.error('You do not have permission to access this page');
        router.push('/');
        return;
      }
      
      fetchProducts();
      fetchCategories();
      
      // Ensure the storage bucket exists
      createBucketIfNotExists('products', true);
    }
  }, [user, isAdmin, isAdminLoading, router]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)');
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric values
    if (name === 'price' || name === 'stock_quantity') {
      setCurrentProduct({
        ...currentProduct,
        [name]: parseFloat(value) || 0
      });
    } else {
      setCurrentProduct({
        ...currentProduct,
        [name]: value
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    
    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadProductImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    
    try {
      setIsUploading(true);
      return await uploadImage(imageFile, 'products', 'product-images');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First upload the image if there is one
      let imageUrl: string | undefined = currentProduct.image_url;
      
      if (imageFile) {
        const uploadedUrl = await uploadProductImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else if (!currentProduct.image_url) {
          toast.error('Failed to upload image');
          return;
        }
      }
      
      // Prepare product data
      const productData = {
        ...currentProduct,
        image_url: imageUrl || undefined
      };
      
      if (currentProduct.id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', currentProduct.id);
        
        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) throw error;
        toast.success('Product created successfully');
      }
      
      // Refresh product list and close modal
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      // Get the product to access its image URL
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Delete the product
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      
      // Delete the image if it exists
      if (product?.image_url) {
        await deleteImage(product.image_url, 'products');
      }
      
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const openCreateModal = () => {
    setCurrentProduct({
      name: '',
      description: '',
      price: 0,
      stock_quantity: 0,
      category_id: categories[0]?.id || 1,
      image_url: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setImageFile(null);
    setImagePreview(product.image_url || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct({});
    setImageFile(null);
    setImagePreview(null);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setCurrentProduct({
      ...currentProduct,
      image_url: ''
    });
  };

  if (isLoading || isAdminLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
          <div className="mb-6 text-6xl text-red-500">
            <FiShield />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this admin area.
          </p>
          <Button 
            onClick={() => router.push('/')}
            variant="primary"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <Button 
          onClick={openCreateModal}
          variant="primary"
          leftIcon={<FiPlus />}
        >
          Add Product
        </Button>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-12 w-12 relative rounded overflow-hidden bg-gray-100">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            No image
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.categories?.name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock_quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-primary hover:text-primary-dark mr-3"
                      >
                        <FiEdit className="inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 className="inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentProduct.id ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Product Information */}
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={currentProduct.name || ''}
                        onChange={handleInputChange}
                        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={currentProduct.description || ''}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={currentProduct.price || ''}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                          Stock Quantity *
                        </label>
                        <input
                          type="number"
                          id="stock_quantity"
                          name="stock_quantity"
                          value={currentProduct.stock_quantity || ''}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        id="category_id"
                        name="category_id"
                        value={currentProduct.category_id || ''}
                        onChange={handleInputChange}
                        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Right Column - Image Upload */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Image
                      </label>
                      
                      {imagePreview ? (
                        <div className="relative h-48 w-full mb-4 rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={imagePreview}
                            alt="Product preview"
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-contain"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-48 w-full bg-gray-100 rounded-md border-2 border-dashed border-gray-300 mb-4">
                          <div className="text-center px-6 py-10">
                            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-1 text-sm text-gray-600">
                              Drag and drop an image here, or click to select
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              PNG, JPG, GIF up to 2MB
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <input
                          type="file"
                          id="image"
                          name="image"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="image"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
                        >
                          <FiUpload className="mr-2 -ml-1" />
                          Select Image
                        </label>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Image Tips:</h3>
                      <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
                        <li>Use high-quality images with good lighting</li>
                        <li>Show the product from multiple angles if possible</li>
                        <li>Use a consistent style for all product images</li>
                        <li>Optimal dimensions: 1200 x 1200 pixels</li>
                        <li>Use PNG or JPG format for best quality</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    className="mr-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isUploading}
                  >
                    {currentProduct.id ? 'Update Product' : 'Create Product'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 