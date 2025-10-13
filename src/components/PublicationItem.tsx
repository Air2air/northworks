import React from 'react';
import Image from 'next/image';

interface PublicationItemProps {
  /** Thumbnail image path (relative to /images/pubs/) */
  thumbnail: string;
  /** Alt text for the thumbnail image */
  alt: string;
  /** Publication title (can include markdown-style formatting) */
  title: string;
  /** Optional authors or additional info */
  authors?: string;
  /** Optional publication details (journal, year, etc.) */
  details?: string;
  /** Optional link to the full publication */
  href?: string;
  /** Thumbnail width (default: 120px) */
  width?: number;
  /** Thumbnail height (default: 160px) */
  height?: number;
}

/**
 * PublicationItem component for displaying publications with thumbnail images
 * Designed to be used inline with markdown content, similar to the Figure component
 * 
 * Usage in MDX:
 * <PublicationItem
 *   thumbnail="book-understanding.gif"
 *   alt="Understanding Risk book cover"
 *   title="Understanding Risk: Informing Decisions in a Democratic Society"
 *   authors="Paul C. Stern and Harvey V. Fineberg (Eds.)"
 *   details="National Academy Press, 1996"
 *   href="/publications/understanding-risk"
 * />
 */
export default function PublicationItem({
  thumbnail,
  alt,
  title,
  authors,
  details,
  href,
  width = 120,
  height = 160
}: PublicationItemProps) {
  // Ensure thumbnail path includes /images/pubs/ prefix
  const imagePath = thumbnail.startsWith('/') 
    ? thumbnail 
    : thumbnail.startsWith('images/') 
      ? `/${thumbnail}`
      : `/images/pubs/${thumbnail}`;

  const content = (
    <div className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors my-4 not-prose">
      {/* Thumbnail Image */}
      <div className="flex-shrink-0">
        <Image
          src={imagePath}
          alt={alt}
          width={width}
          height={height}
          className="rounded shadow-sm"
        />
      </div>

      {/* Publication Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-semibold text-gray-900 mb-1 leading-tight">
          {title}
        </h4>
        {authors && (
          <p className="text-sm text-gray-700 mb-1">
            {authors}
          </p>
        )}
        {details && (
          <p className="text-sm text-gray-600">
            {details}
          </p>
        )}
      </div>
    </div>
  );

  // If there's a link, wrap the entire content in an anchor tag
  if (href) {
    return (
      <a
        href={href}
        className="block no-underline hover:no-underline"
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  return content;
}
