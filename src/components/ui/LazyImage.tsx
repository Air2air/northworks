"use client";

/**
 * LazyImage - Optimized image component with lazy loading and performance features
 * Includes intersection observer, blur-up effect, and error handling
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage = React.memo(function LazyImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  placeholder,
  priority = false,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Check if we should use responsive sizing
  const isResponsive = className.includes('w-full') && className.includes('h-full');
  const containerWidth = isResponsive ? undefined : width;
  const containerHeight = isResponsive ? undefined : height;

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Generate placeholder for blur effect
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    // Simple base64 placeholder
    const placeholderWidth = containerWidth || width;
    const placeholderHeight = containerHeight || height;
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${placeholderWidth}" height="${placeholderHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="14">
          Loading...
        </text>
      </svg>
    `)}`;
  };

  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={`flex items-center justify-center bg-gradient-to-br from-sky-100 to-sky-300 ${className}`}
        style={isResponsive ? {} : { width: containerWidth, height: containerHeight }}
      >
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={isResponsive ? {} : { width: containerWidth, height: containerHeight }}
    >
      {/* Placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-sky-200 animate-pulse flex items-center justify-center">
          <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}
      
      {/* Actual image */}
      {(isInView || priority) && (
        <Image
          src={src}
          alt={alt}
          {...(isResponsive ? {} : { width, height })}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          placeholder="blur"
          blurDataURL={getPlaceholder()}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }}
          {...(isResponsive ? { fill: true } : {})}
          sizes={isResponsive ? '(max-width: 768px) 100vw, 50vw' : undefined}
        />
      )}
    </div>
  );
});

export default LazyImage;
export type { LazyImageProps };
