"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from './Button';

interface Slide {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    imageUrl: 'https://via.placeholder.com/1920x1080/3498db/ffffff?text=Summer+Collection',
    title: 'Summer Collection',
    description: 'Discover the latest trends for your summer wardrobe.',
    ctaText: 'Shop Now',
    ctaLink: '/categories/clothing',
  },
  {
    id: 2,
    imageUrl: 'https://via.placeholder.com/1920x1080/e74c3c/ffffff?text=Tech+Deals',
    title: 'Tech Deals',
    description: 'Save big on electronics and gadgets this season.',
    ctaText: 'View Deals',
    ctaLink: '/categories/electronics',
  },
  {
    id: 3,
    imageUrl: 'https://via.placeholder.com/1920x1080/27ae60/ffffff?text=Home+Essentials',
    title: 'Home Essentials',
    description: 'Transform your living space with our home collection.',
    ctaText: 'Explore',
    ctaLink: '/categories/home-kitchen',
  },
];

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  return (
    <div className="relative h-[500px] overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundColor: index === 0 ? '#3498db' : index === 1 ? '#e74c3c' : '#27ae60',
                backgroundImage: `url(${slide.imageUrl})` 
              }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            </div>
            
            {/* Content */}
            <div className="relative h-full flex items-center z-10">
              <div className="container mx-auto px-4">
                <div className="max-w-xl text-white">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                  <p className="text-xl mb-8">{slide.description}</p>
                  <Link href={slide.ctaLink}>
                    <Button size="lg" variant="secondary">
                      {slide.ctaText}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors z-20"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <FiChevronLeft className="text-2xl" />
      </button>
      
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors z-20"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <FiChevronRight className="text-2xl" />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-secondary' : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel; 