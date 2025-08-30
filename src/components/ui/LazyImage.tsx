"use client";

/**
 * LazyImage - Simplified image component for debugging
 */

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { FaCompass } from 'react-icons/fa';
import type { LazyImageProps } from '@/types';

const LazyImage = React.memo(function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  console.log('LazyImage rendering:', { src, alt, width, height, className });

  const handleLoad = useCallback(() => {
    console.log('Image loaded successfully:', src);
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad, src]);

  const handleLoadingComplete = useCallback(() => {
    console.log('Image loading complete:', src);
    setIsLoaded(true);
  }, [src]);

  const handleError = useCallback((error: any) => {
    console.error('Image failed to load:', src, error);
    setHasError(true);
    onError?.();
  }, [onError, src]);

  if (hasError) {
    return (
      <div className="flex items-center justify-center bg-gray-200 w-full h-48">
        <div className="text-center">
          <FaCompass className="w-8 h-8 mx-auto text-gray-400" />
          <p className="text-xs text-gray-500 mt-2">Failed to load: {src}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
          <FaCompass className="w-6 h-6 text-gray-400" />
          <span className="sr-only">Loading...</span>
        </div>
      )}
      
      {/* Actual image */}
      <Image
        src={src}
        alt={alt}
        width={width || 400}
        height={height || 300}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        onLoadingComplete={handleLoadingComplete}
        style={{
          objectFit: 'cover',
          objectPosition: 'center center'
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
    </div>
  );
});

export default LazyImage;
