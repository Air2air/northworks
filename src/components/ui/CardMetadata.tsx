/**
 * CARD METADATA COMPONENT
 * ======================
 * 
 * Handles metadata display for UnifiedCard with:
 * - Date, author, publication info
 * - Category and type indicators
 * - Responsive layout
 * - Icon integration
 */

"use client";

import React from 'react';
import { 
  FaCalendarAlt, 
  FaBuilding, 
  FaUser,
  FaMusic, 
  FaCompass,
  FaGraduationCap,
  FaBriefcase,
  FaNewspaper,
  FaMicrophone
} from 'react-icons/fa';
import { UnifiedContentItem, ContentType } from '@/schemas/unified-content-schema';

interface CardMetadataProps {
  item: UnifiedContentItem;
  showDate?: boolean;
  showAuthor?: boolean;
  showPublication?: boolean;
  showCategory?: boolean;
  className?: string;
}

export default function CardMetadata({ 
  item, 
  showDate = true,
  showAuthor = true,
  showPublication = true,
  showCategory = true,
  className = "" 
}: CardMetadataProps) {
  const metadata = getDisplayMetadata(item);
  const TypeIcon = getTypeIcon(item.type);
  
  const hasAnyMetadata = (
    (showDate && metadata.date) ||
    (showAuthor && metadata.author) ||
    (showPublication && metadata.publication) ||
    showCategory
  );

  if (!hasAnyMetadata) return null;

  return (
    <div className={`text-metadata ${className}`}>
      {showDate && metadata.date && (
        <div className="text-metadata-item">
          <FaCalendarAlt className="text-sky-400" />
          <span>{metadata.date}</span>
        </div>
      )}
      
      {showAuthor && metadata.author && (
        <div className="text-metadata-item">
          <FaUser className="text-sky-400" />
          <span>{metadata.author}</span>
        </div>
      )}
      
      {showPublication && metadata.publication && (
        <div className="text-metadata-item">
          <FaBuilding className="text-sky-400" />
          <span>{metadata.publication}</span>
        </div>
      )}
      
      {showCategory && (
        <div className="text-metadata-item">
          <TypeIcon className="w-3 h-3 text-sky-400" />
          <span className="capitalize">{item.category}</span>
        </div>
      )}
    </div>
  );
}

function getDisplayMetadata(item: UnifiedContentItem) {
  const metadata: {
    date?: string;
    author?: string;
    publication?: string;
  } = {};

  // Date handling
  if (item.publishedDate) {
    metadata.date = new Date(item.publishedDate).toLocaleDateString();
  } else if (item.publication?.date) {
    metadata.date = new Date(item.publication.date).toLocaleDateString();
  } else if (item.createdDate) {
    metadata.date = new Date(item.createdDate).toLocaleDateString();
  }

  // Author handling
  if (item.publication?.author) {
    metadata.author = item.publication.author;
  } else if (item.interview?.interviewer?.name) {
    metadata.author = item.interview.interviewer.name;
  }

  // Publication handling
  if (item.publication?.publication) {
    metadata.publication = item.publication.publication;
  } else if (item.publication?.publisher) {
    metadata.publication = item.publication.publisher;
  }

  return metadata;
}

function getTypeIcon(type: ContentType) {
  const iconMap: Record<ContentType, any> = {
    interview: FaMicrophone,
    article: FaNewspaper,
    review: FaMusic,
    professional: FaBriefcase,
    publication: FaGraduationCap,
    background: FaCompass,
    project: FaBriefcase,
    bio: FaUser,
    company: FaBuilding,
    other: FaCompass,
  };
  
  return iconMap[type] || FaCompass;
}
