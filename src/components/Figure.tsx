import React from 'react';
import Image from 'next/image';

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  href?: string;
  width?: number;
  height?: number;
}

/**
 * Figure component for displaying images with captions in academic papers
 * Handles the pattern: **Figure X. Caption text** [link]
 */
export default function Figure({ 
  src, 
  alt, 
  caption, 
  href,
  width = 600,
  height = 400 
}: FigureProps) {
  const imageElement = (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto object-contain"
        unoptimized={src.endsWith('.gif')}
      />
    </div>
  );

  return (
    <figure className="my-8 space-y-3">
      {href ? (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block hover:opacity-90 transition-opacity"
        >
          {imageElement}
        </a>
      ) : (
        imageElement
      )}
      
      {caption && (
        <figcaption className="text-sm text-gray-600 leading-relaxed px-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
