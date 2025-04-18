'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiShare2, FiCheck, FiChevronRight, FiStar, FiTruck } from 'react-icons/fi';
import Button from '@/components/Button';
import ProductCard from '@/components/ProductCard';
import { getProductById, getProducts } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlist, setIsWishlist] = useState(false);

  // Placeholder data
  const [reviews, setReviews] = useState([
    { id: 1, user: 'Ravi Kumar', rating: 5, date: '2023-10-15', comment: 'Excellent product, exactly as described. Quick delivery and great quality!' },
    { id: 2, user: 'Priya Singh', rating: 4, date: '2023-10-10', comment: 'Very good product. The only reason for 4 stars is the packaging could be better.' },
    { id: 3, user: 'Ajith Thomas', rating: 5, date: '2023-09-25', comment: 'Amazing quality and great value for money. Highly recommended!' },
  ]);

  // Product placeholder images for gallery view
  const [productImages, setProductImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const productData = await getProductById(id as string);
        
        if (!productData) {
          toast.error('Product not found');
          router.push('/');
          return;
        }
        
        setProduct(productData);
        
        // Generate placeholder images for the gallery (in a real app, these would come from the database)
        const mainImage = productData.image_url || 'https://via.placeholder.com/600x600?text=Product+Image';
        const images = [
          mainImage,
          `https://via.placeholder.com/600x600/f5f5f5/333333?text=Image+2`,
          `https://via.placeholder.com/600x600/f5f5f5/333333?text=Image+3`,
          `https://via.placeholder.com/600x600/f5f5f5/333333?text=Image+4`,
        ];
        setProductImages(images);
        
        // Fetch related products from the same category
        if (productData.category_id) {
          const allProducts = await getProducts(productData.category_id);
          // Filter out the current product and take up to 4 related products
          const related = allProducts
            .filter(p => p.id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart`);
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product && product.stock_quantity && value > product.stock_quantity) {
      toast.error(`Sorry, only ${product.stock_quantity} items in stock`);
      return;
    }
    setQuantity(value);
  };

  const toggleWishlist = () => {
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image skeleton */}
            <div className="w-full md:w-1/2">
              <div className="bg-gray-100 rounded-lg h-[400px] animate-pulse"></div>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg h-20 animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="w-full md:w-1/2">
              <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse mb-4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse mb-6"></div>
              <div className="h-6 bg-gray-100 rounded w-1/4 animate-pulse mb-6"></div>
              <div className="h-4 bg-gray-100 rounded w-full animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-100 rounded w-full animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse mb-8"></div>
              <div className="h-12 bg-gray-100 rounded w-full animate-pulse mb-4"></div>
              <div className="h-12 bg-gray-100 rounded w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center flex-wrap">
            <li className="flex items-center">
              <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
              <FiChevronRight className="mx-2 text-gray-400" />
            </li>
            <li className="flex items-center">
              <Link href="/categories" className="text-gray-500 hover:text-primary">Categories</Link>
              <FiChevronRight className="mx-2 text-gray-400" />
            </li>
            {product.categories && (
              <li className="flex items-center">
                <Link 
                  href={`/categories/${product.categories.id}`} 
                  className="text-gray-500 hover:text-primary"
                >
                  {product.categories.name}
                </Link>
                <FiChevronRight className="mx-2 text-gray-400" />
              </li>
            )}
            <li className="text-gray-800 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Images */}
            <div className="w-full md:w-1/2">
              <div className="relative rounded-lg overflow-hidden bg-white h-[400px] mb-4">
                <Image
                  src={productImages[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((img, index) => (
                  <div 
                    key={index}
                    className={`relative h-20 rounded-md overflow-hidden bg-white cursor-pointer border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={img}
                      alt={`Product view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full md:w-1/2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              
              {/* Ratings */}
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={`${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} w-5 h-5`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500 ml-1">({reviews.length} reviews)</span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <span className="text-2xl font-bold text-gray-800">₹{product.price.toFixed(2)}</span>
                {product.compare_at_price && (
                  <>
                    <span className="text-lg text-gray-500 line-through ml-2">
                      ₹{(product.price * 1.2).toFixed(2)}
                    </span>
                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                      20% OFF
                    </span>
                  </>
                )}
              </div>
              
              {/* Short Description */}
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              {/* Availability */}
              <div className="flex items-center mb-6">
                {product.stock_quantity > 0 ? (
                  <>
                    <FiCheck className="text-green-500 mr-2" />
                    <span className="text-green-600 font-medium">In Stock</span>
                    <span className="text-gray-500 ml-2">({product.stock_quantity} available)</span>
                  </>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </div>
              
              {/* Delivery */}
              <div className="flex items-center mb-6 text-gray-600">
                <FiTruck className="mr-2" />
                <span>Free delivery available</span>
              </div>
              
              {/* Quantity Selector */}
              <div className="flex items-center mb-6">
                <span className="mr-4 text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    className="px-3 py-1 border-r border-gray-300 text-gray-600 hover:bg-gray-100"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    min="1" 
                    max={product.stock_quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    className="w-12 text-center py-1 border-none focus:outline-none"
                  />
                  <button 
                    className="px-3 py-1 border-l border-gray-300 text-gray-600 hover:bg-gray-100"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={handleAddToCart}
                  leftIcon={<FiShoppingCart />}
                  disabled={product.stock_quantity < 1}
                  size="lg"
                  variant="primary"
                  fullWidth
                >
                  Add to Cart
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={toggleWishlist}
                    leftIcon={<FiHeart className={isWishlist ? 'fill-red-500 text-red-500' : ''} />}
                    variant="outline"
                    size="lg"
                  >
                    {isWishlist ? 'Saved' : 'Wishlist'}
                  </Button>
                  
                  <Button 
                    onClick={shareProduct}
                    leftIcon={<FiShare2 />}
                    variant="outline"
                    size="lg"
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs: Description, Specs, Reviews */}
          <div className="mt-12">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'description'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('specifications')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'specifications'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reviews'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Reviews ({reviews.length})
                </button>
              </nav>
            </div>

            <div className="py-6">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-gray-600 mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Quisque at
                    magna auctor, iaculis lectus et, sodales erat. Ut ac nisl eu lorem vestibulum luctus.
                    Maecenas et sagittis justo. Morbi pulvinar ipsum ac nisi hendrerit, at volutpat tellus viverra.
                  </p>
                  <p className="text-gray-600 mt-4">
                    Nullam consectetur elit non dui tincidunt, a consectetur augue finibus. Duis commodo
                    facilisis enim, vel aliquet ex sollicitudin a. Proin elementum velit et tellus feugiat,
                    eget sagittis erat tempor.
                  </p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  <h3 className="font-medium text-lg mb-4">Product Specifications</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="divide-y divide-gray-200">
                        <tr className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                            Brand
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            MyStore Brand
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                            Category
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.categories?.name || 'General'}
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                            Weight
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            0.5 kg
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                            Dimensions
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            10 × 10 × 10 cm
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                            Warranty
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            1 Year
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-medium text-lg">Customer Reviews</h3>
                    <Button variant="outline" size="sm">Write a Review</Button>
                  </div>

                  {/* Reviews summary */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <p className="text-4xl font-bold text-gray-800">{averageRating.toFixed(1)}</p>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FiStar 
                              key={i} 
                              className={`${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} w-4 h-4`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{reviews.length} reviews</p>
                      </div>
                      
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = reviews.filter(review => review.rating === rating).length;
                          const percentage = (count / reviews.length) * 100;
                          
                          return (
                            <div key={rating} className="flex items-center mb-1">
                              <span className="text-sm text-gray-600 w-3">{rating}</span>
                              <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400 ml-1 mr-2" />
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-yellow-400 h-2 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 ml-2">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Review list */}
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium text-gray-800">{review.user}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex mb-3">
                          {[...Array(5)].map((_, i) => (
                            <FiStar 
                              key={i} 
                              className={`${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} w-4 h-4`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
} 