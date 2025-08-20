import React from 'react';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import type { ComponentProps } from 'react';
import ImageGallery from '../components/ImageGallery';
import type { ContentImage } from '@/types/content';

// Shared MDX configuration for consistent rendering
export const mdxOptions: MDXRemoteProps['options'] = {
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
};

// Shared MDX components for consistent styling
export const mdxComponents: MDXRemoteProps['components'] = {
  // Images - convert inline markdown images to ImageGallery component with consistent 240px width
  img: ({ src, alt, ...props }: ComponentProps<'img'>) => {
    if (!src || typeof src !== 'string') return null;
    
    // Create a ContentImage object for the ImageGallery with enforced 280px width
    const image: ContentImage = {
      src,
      alt: alt || '',
      width: 280, // Enforce 280px width for all inline images
      height: undefined, // Auto height to maintain aspect ratio
    };
    
    return <ImageGallery images={[image]} inline={true} />;
  },

  // Links
  a: ({ href, children, ...props }: ComponentProps<'a'>) => (
    <a
      href={href}
      {...props}
      className="text-sky-600 hover:text-sky-800 underline transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  
  // Headings with better styling
  h1: ({ children, ...props }: ComponentProps<'h1'>) => (
    <h1 {...props} className="text-3xl font-bold mb-6 text-gray-900">
      {children}
    </h1>
  ),
  
  h2: ({ children, ...props }: ComponentProps<'h2'>) => (
    <h2 {...props} className="text-2xl font-semibold mb-4 mt-8 text-gray-900">
      {children}
    </h2>
  ),
  
  h3: ({ children, ...props }: ComponentProps<'h3'>) => (
    <h3 {...props} className="text-xl font-medium mb-3 mt-6 text-gray-900">
      {children}
    </h3>
  ),
  
  // Paragraphs
  p: ({ children, ...props }: ComponentProps<'p'>) => (
    <p {...props} className="mb-4 leading-relaxed text-gray-700">
      {children}
    </p>
  ),
  
  // Lists
  ul: ({ children, ...props }: ComponentProps<'ul'>) => (
    <ul {...props} className="mb-4 list-disc list-inside space-y-1">
      {children}
    </ul>
  ),
  
  ol: ({ children, ...props }: ComponentProps<'ol'>) => (
    <ol {...props} className="mb-4 list-decimal list-inside space-y-1">
      {children}
    </ol>
  ),
  
  li: ({ children, ...props }: ComponentProps<'li'>) => (
    <li {...props} className="text-gray-700">
      {children}
    </li>
  ),
  
  // Blockquotes
  blockquote: ({ children, ...props }: ComponentProps<'blockquote'>) => (
    <blockquote {...props} className="border-l-4 border-sky-200 pl-4 italic text-gray-600 my-4">
      {children}
    </blockquote>
  ),
  
  // Code
  code: ({ children, ...props }: ComponentProps<'code'>) => (
    <code {...props} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  ),
  
  pre: ({ children, ...props }: ComponentProps<'pre'>) => (
    <pre {...props} className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
      {children}
    </pre>
  ),
};
