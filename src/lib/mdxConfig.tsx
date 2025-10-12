import React from 'react';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import type { ComponentProps, ReactNode } from 'react';
import ImageGallery from '../components/ImageGallery';
import Figure from '../components/Figure';
import { findImageForFigure } from './figureUtils';

// Shared MDX configuration for consistent rendering
export const mdxOptions: MDXRemoteProps['options'] = {
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
};

interface ContentImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
}

/**
 * Helper function to extract figure information from paragraph children
 * Looks for pattern: **Figure X. Caption** [link text](url)
 */
function extractFigureInfo(children: ReactNode): { 
  isFigure: boolean; 
  caption?: string; 
  href?: string; 
  figureNum?: string;
  fullCaption?: string;
} {
  if (!children) return { isFigure: false };
  
  // Convert children to string to check for pattern
  let textContent = '';
  let href: string | undefined;
  
  const childArray = React.Children.toArray(children);
  
  for (const child of childArray) {
    if (typeof child === 'string') {
      textContent += child;
    } else if (typeof child === 'object' && child && 'props' in child) {
      const element = child as { type?: unknown; props?: { children?: ReactNode; href?: string } };
      
      // Extract text from strong/bold elements
      if (element.props?.children) {
        const innerText = React.Children.toArray(element.props.children).join('');
        textContent += innerText;
      }
      
      // Extract href from links
      if (element.type === 'a' && element.props?.href) {
        const linkText = String(element.props.children || '').trim();
        // Only capture "Click to enlarge" type links
        if (linkText.includes('Click to enlarge') || linkText.includes('Figure')) {
          href = element.props.href;
        }
      }
    }
  }
  
  // Check if this is a figure caption
  const figureMatch = textContent.match(/^(?:\*\*)?Figure\s+(\d+[a-z]?)\.\s*(.+?)(?:\*\*)?/i);
  if (!figureMatch) return { isFigure: false };
  
  const figureNum = figureMatch[1];
  const captionText = figureMatch[2].replace(/\s*\[.*?\]\(.*?\)\s*/g, '').trim(); // Remove link text
  const fullCaption = `Figure ${figureNum}. ${captionText}`;
  
  return { 
    isFigure: true, 
    caption: captionText, 
    href, 
    figureNum,
    fullCaption
  };
}

/**
 * Create MDX components with access to frontmatter images for figure matching
 * This allows figure captions in markdown to be matched with images from frontmatter
 */
export function createMdxComponents(frontmatterImages?: ContentImage[]): MDXRemoteProps['components'] {
  const images = frontmatterImages || [];
  const usedImages = new Set<string>();

  return {
  // Images - convert to ImageGallery for proper thumbnail display
  img: ({ src, alt, ...props }: ComponentProps<'img'>) => {
    if (!src || typeof src !== 'string') return null;
    
    // Create image object for ImageGallery
    const image = {
      src,
      alt: alt || '',
      caption: alt || '',
      width: 300,
      height: 200
    };
    
    // Use ImageGallery for proper thumbnail display
    return (
      <ImageGallery 
        images={[image]} 
        inline={true}
      />
    );
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
  
  // Paragraphs - with figure caption detection and image matching
  p: ({ children, ...props }: ComponentProps<'p'>) => {
    const figureInfo = extractFigureInfo(children);
    
    // If this is a figure caption, try to match it with an image
    if (figureInfo.isFigure && figureInfo.figureNum) {
      const matchedImage = findImageForFigure(figureInfo.figureNum, images);
      
      // If we found a matching image and haven't used it yet, display it with the caption
      if (matchedImage && !usedImages.has(matchedImage.src)) {
        usedImages.add(matchedImage.src);
        
        return (
          <Figure
            src={matchedImage.src}
            alt={`Figure ${figureInfo.figureNum}`}
            caption={figureInfo.fullCaption || figureInfo.caption}
            href={figureInfo.href}
            width={matchedImage.width || 700}
            height={matchedImage.height || 500}
          />
        );
      }
      
      // If no image found, still render the caption as a styled block
      return (
        <div className="my-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold">Figure {figureInfo.figureNum}.</span>
            {' '}
            {figureInfo.caption}
          </p>
          {figureInfo.href && (
            <a 
              href={figureInfo.href}
              className="inline-block text-xs text-sky-600 hover:text-sky-800 underline mt-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click to view full size →
            </a>
          )}
        </div>
      );
    }
    
    return (
      <p {...props} className="mb-4 leading-relaxed text-gray-700">
        {children}
      </p>
    );
  },
  
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
}

// Default components without image matching (for backward compatibility)
export const mdxComponents = createMdxComponents();
