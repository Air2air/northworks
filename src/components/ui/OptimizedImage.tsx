"use client";

import React from 'react';
import Image from 'next/image';
import { FaCompass } from 'react-icons/fa';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false
}: OptimizedImageProps) {
  console.log('OptimizedImage: rendering', { src, alt, width, height });

  // Try regular img tag first to test if it's a Next.js Image issue
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{
        objectFit: 'cover',
        objectPosition: 'center top',
        width: '100%',
        height: '100%'
      }}
      onError={(e) => {
        console.error('Image failed to load:', src);
      }}
      onLoad={() => {
        console.log('Image loaded successfully:', src);
      }}
    />
  );
}
