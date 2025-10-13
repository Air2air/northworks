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
  // Fixed display width of 400px for all figures
  const displayWidth = 400;
  
  const imageElement = (
    <Image
      src={src}
      alt={alt}
      width={width || 640}
      height={height || 480}
      // className="mx-auto"
      // style={{ width: '400px', height: 'auto', maxWidth: '100%' }}
    />
  );

  return (
    <figure className="my-8 px-6 py-6 flex flex-col items-center space-y-4 bg-gray-100 rounded-lg not-prose w-full">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block">
          {imageElement}
        </a>
      ) : (
        <div className="block">
          {imageElement}
        </div>
      )}
      {caption && (
        <figcaption className="text-sm text-gray-600 leading-relaxed text-left px-4 w-full">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
