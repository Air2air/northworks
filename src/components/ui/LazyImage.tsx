"use client";

/**
 * LazyImage - Optimized image component with lazy loading and performance features
 * Includes intersection observer, blur-up effect, and error handling
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FaCompass } from 'react-icons/fa';

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
  width,
  height,
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

  // Check if we should use responsive sizing (no explicit dimensions provided or responsive classes used)
  const isOverflowThumbnail = className.includes('overflow-thumbnail');
  const isResponsive = ((className.includes('w-full') && className.includes('h-full')) || (!width && !height)) && !isOverflowThumbnail;
  
  // For overflow-thumbnail, we want no explicit dimensions but also not responsive fill
  const containerWidth = isResponsive ? undefined : (isOverflowThumbnail ? undefined : (width || 400));
  const containerHeight = isResponsive ? undefined : (isOverflowThumbnail ? undefined : (height || 300));

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
        className={`flex items-center justify-center bg-gradient-to-br from-sky-100 to-sky-300 w-full h-full`}
        style={isResponsive ? {} : { width: containerWidth, height: containerHeight }}
      >
        <div className="text-center">
          <FaCompass className="w-8 h-8 mx-auto text-sky-400" />
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden w-full h-full`}
      style={isResponsive ? {} : { width: containerWidth, height: containerHeight }}
    >
      {/* Placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-sky-200 animate-pulse flex items-center justify-center">
          <FaCompass className="w-6 h-6 text-sky-400" />
        </div>
      )}
      
      {/* Actual image */}
      {(isInView || priority) && (
        <>
          {isOverflowThumbnail ? (
            // Background image approach for thumbnails - better overflow control
            <>
              <div 
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  opacity: isLoaded ? 1 : 0
                }}
              />
              {/* Hidden image for loading events */}
              <img
                src={src}
                alt={alt}
                style={{ display: 'none' }}
                onLoad={handleLoad}
                onError={handleError}
              />
            </>
          ) : (
            // Regular Next.js Image for non-thumbnails
            <div className="absolute inset-0">
              <Image
                src={src}
                alt={alt}
                {...(isResponsive ? {} : { width, height })}
                className={`transition-opacity duration-300 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                } ${className.includes('object-') ? className : 'object-cover w-full h-full'}`}
                placeholder="blur"
                blurDataURL={getPlaceholder()}
                priority={priority}
                onLoad={handleLoad}
                onError={handleError}
                style={{
                  objectPosition: 'center center'
                }}
                {...(isResponsive ? { fill: true } : {})}
                sizes={isResponsive ? '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw' : undefined}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default LazyImage;
export type { LazyImageProps };
