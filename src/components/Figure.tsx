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
  width,
  height 
}: FigureProps) {
  const imageElement = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="w-full h-auto"
    />
  );

  return (
    <figure className="my-8 px-6 py-6 flex flex-col items-center space-y-4 bg-gray-100 rounded-lg">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="max-w-4xl">
          {imageElement}
        </a>
      ) : (
        <div className="max-w-4xl">
          {imageElement}
        </div>
      )}
      {caption && (
        <figcaption className="text-sm text-gray-600 leading-relaxed text-left max-w-4xl px-4">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
