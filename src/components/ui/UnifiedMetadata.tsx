/**
 * Unified Metadata Display Component
 * Consolidates PublicationInfo, CardMetadata, and content metadata patterns
 */

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
import { formatDate } from '@/lib/dateUtils';

export interface MetadataField {
  icon?: React.ComponentType<any>;
  label: string;
  value: string;
  className?: string;
}

export interface UnifiedMetadataProps {
  // For UnifiedContentItem integration
  item?: UnifiedContentItem;
  
  // For manual metadata
  fields?: MetadataField[];
  
  // Display options
  variant?: 'card' | 'detail' | 'minimal';
  showIcons?: boolean;
  showLabels?: boolean;
  
  // Field visibility (when using item)
  showDate?: boolean;
  showAuthor?: boolean;
  showPublication?: boolean;
  showCategory?: boolean;
  showOrganization?: boolean;
  showPosition?: boolean;
  
  // Styling
  className?: string;
  title?: string;
}

/**
 * Unified metadata display component that consolidates all metadata patterns
 */
export default function UnifiedMetadata({
  item,
  fields: manualFields,
  variant = 'card',
  showIcons = true,
  showLabels = variant === 'detail',
  showDate = true,
  showAuthor = true,
  showPublication = true,
  showCategory = variant === 'card',
  showOrganization = true,
  showPosition = true,
  className = '',
  title
}: UnifiedMetadataProps) {
  
  // Generate fields from item if provided
  const fields = manualFields || (item ? generateFieldsFromItem(item, {
    showDate,
    showAuthor,
    showPublication,
    showCategory,
    showOrganization,
    showPosition
  }) : []);

  if (fields.length === 0) return null;

  const containerClass = getContainerClass(variant, className);
  const fieldClass = getFieldClass(variant);

  return (
    <div className={containerClass}>
      {title && variant === 'detail' && (
        <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
      )}
      
      <div className={variant === 'detail' ? 'space-y-1' : 'flex flex-wrap gap-2'}>
        {fields.map((field, index) => (
          <div key={index} className={`${fieldClass} ${field.className || ''}`}>
            {showIcons && field.icon && (
              <field.icon className="w-3 h-3 text-sky-400 flex-shrink-0" />
            )}
            {showLabels && (
              <span className="font-semibold">{field.label}:</span>
            )}
            <span className={showLabels ? '' : 'text-xs'}>{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Generate metadata fields from UnifiedContentItem
 */
function generateFieldsFromItem(
  item: UnifiedContentItem,
  options: {
    showDate: boolean;
    showAuthor: boolean;
    showPublication: boolean;
    showCategory: boolean;
    showOrganization: boolean;
    showPosition: boolean;
  }
): MetadataField[] {
  const fields: MetadataField[] = [];

  // Date
  if (options.showDate) {
    const date = getDisplayDate(item);
    if (date) {
      fields.push({
        icon: FaCalendarAlt,
        label: 'Date',
        value: date
      });
    }
  }

  // Author
  if (options.showAuthor) {
    const author = getDisplayAuthor(item);
    if (author) {
      fields.push({
        icon: FaUser,
        label: 'Author',
        value: author
      });
    }
  }

  // Publication
  if (options.showPublication) {
    const publication = getDisplayPublication(item);
    if (publication) {
      fields.push({
        icon: FaBuilding,
        label: 'Publication',
        value: publication
      });
    }
  }

  // Professional fields (organization, position)
  if (options.showOrganization && (item as any).organization) {
    fields.push({
      icon: FaBuilding,
      label: 'Organization',
      value: (item as any).organization
    });
  }

  if (options.showPosition && (item as any).position) {
    fields.push({
      icon: FaBriefcase,
      label: 'Position',
      value: (item as any).position
    });
  }

  // Category/Type
  if (options.showCategory) {
    const TypeIcon = getTypeIcon(item.type);
    fields.push({
      icon: TypeIcon,
      label: 'Type',
      value: item.category.charAt(0).toUpperCase() + item.category.slice(1)
    });
  }

  return fields;
}

/**
 * Helper functions for extracting display values
 */
function getDisplayDate(item: UnifiedContentItem): string | null {
  if (item.publishedDate) return formatDate(item.publishedDate);
  if (item.publication?.date) return formatDate(item.publication.date);
  if (item.createdDate) return formatDate(item.createdDate);
  return null;
}

function getDisplayAuthor(item: UnifiedContentItem): string | null {
  if (item.publication?.author) return item.publication.author;
  if ((item as any).interview?.interviewer?.name) return (item as any).interview.interviewer.name;
  return null;
}

function getDisplayPublication(item: UnifiedContentItem): string | null {
  if (item.publication?.publication) return item.publication.publication;
  if (item.publication?.publisher) return item.publication.publisher;
  return null;
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

/**
 * Get container CSS classes based on variant
 */
function getContainerClass(variant: string, className: string): string {
  const baseClasses = className;
  
  switch (variant) {
    case 'detail':
      return `bg-gray-50 rounded-lg p-4 mb-6 ${baseClasses}`;
    case 'minimal':
      return `text-xs text-gray-500 ${baseClasses}`;
    case 'card':
    default:
      return `text-sm text-gray-600 ${baseClasses}`;
  }
}

/**
 * Get field CSS classes based on variant
 */
function getFieldClass(variant: string): string {
  switch (variant) {
    case 'detail':
      return 'text-sm text-gray-600';
    case 'minimal':
      return 'flex items-center gap-1 text-xs';
    case 'card':
    default:
      return 'flex items-center gap-1 text-sm';
  }
}

/**
 * Preset configurations for common use cases
 */
export const METADATA_PRESETS = {
  cardMinimal: {
    variant: 'card' as const,
    showIcons: true,
    showLabels: false,
    showCategory: true
  },
  cardFull: {
    variant: 'card' as const,
    showIcons: true,
    showLabels: false,
    showCategory: true,
    showDate: true,
    showAuthor: true,
    showPublication: true
  },
  detailBox: {
    variant: 'detail' as const,
    showIcons: false,
    showLabels: true,
    showCategory: false
  },
  professional: {
    variant: 'detail' as const,
    showIcons: false,
    showLabels: true,
    showOrganization: true,
    showPosition: true,
    showDate: false,
    showCategory: false
  }
};
