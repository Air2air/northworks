/**
 * Unified Content Display Component
 * Consolidates UnifiedList usage patterns with preset configurations
 */

import React from 'react';
import UnifiedList from '@/components/ui/UnifiedList';
import { UnifiedContentItem, ListDisplayOptions } from '@/schemas/unified-content-schema';

export interface UnifiedContentDisplayProps {
  // Data
  items: UnifiedContentItem[];
  
  // Content configuration
  title?: string;
  description?: string;
  contentListTitle?: string;
  
  // Display options
  preset?: keyof typeof CONTENT_DISPLAY_PRESETS;
  listOptions?: Partial<ListDisplayOptions>;
  
  // Layout
  className?: string;
}

/**
 * Preset configurations for different content display types
 */
export const CONTENT_DISPLAY_PRESETS = {
  // Warner content preset
  warnerContent: {
    title: 'Featured Articles & Reviews',
    listOptions: {
      layout: 'list' as const,
      searchable: true,
      filterable: true,
      sortBy: 'date' as const,
      pagination: true,
      groupBy: 'category' as const,
      cardOptions: {
        layout: 'horizontal' as const,
        showDate: true,
        showCategory: true,
        showExcerpt: true,
        compactMode: false
      }
    }
  },

  // Cheryl content preset
  cherylContent: {
    title: 'Articles & Professional Work',
    listOptions: {
      layout: 'list' as const,
      searchable: true,
      filterable: true,
      sortBy: 'date' as const,
      pagination: true,
      groupBy: 'category' as const,
      cardOptions: {
        layout: 'vertical' as const,
        showDate: true,
        showCategory: true,
        showExcerpt: true,
        compactMode: false
      }
    }
  }
};

/**
 * Unified content display component that consolidates list patterns
 */
export default function UnifiedContentDisplay({
  items,
  title,
  description,
  contentListTitle,
  preset,
  listOptions = {},
  className = ''
}: UnifiedContentDisplayProps) {
  
  // Get preset configuration
  const presetConfig = preset ? CONTENT_DISPLAY_PRESETS[preset] : null;
  
  // Merge preset with provided options
  const finalTitle = title || presetConfig?.title || 'Content';
  const finalListOptions = {
    ...presetConfig?.listOptions,
    ...listOptions
  };

  return (
    <div className={className}>
      {/* Content List Section */}
      <div className="mb-6">
        <h2 className="section-heading">{finalTitle}</h2>
        {description && (
          <p className="text-metadata mb-6">{description}</p>
        )}
      </div>

      <UnifiedList 
        items={items}
        options={finalListOptions}
      />
    </div>
  );
}
