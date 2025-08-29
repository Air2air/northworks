import UnifiedCard from './UnifiedCard';
import { UnifiedContentItem } from '@/schemas/unified-content-schema';
import { CollectionType } from '@/types';

export type LandingGridVariant = 'default' | 'minimal' | 'text-only' | 'no-tags';

export interface LandingGridProps {
  items: UnifiedContentItem[];
  className?: string;
  collection?: CollectionType;
  variant?: LandingGridVariant;
}

/**
 * LandingGrid - Responsive grid component for landing page navigation cards
 * Provides consistent 1→2→3 column layout for main navigation sections
 * 
 * Variants:
 * - default: Shows images, tags, and summary
 * - minimal: Shows images and summary, no tags
 * - text-only: Shows summary only, no images or tags
 * - no-tags: Shows images and summary, no tags
 */
export default function LandingGrid({ 
  items, 
  className = "mt-12",
  collection = "global",
  variant = "default"
}: LandingGridProps) {
  
  // Configure card options based on variant
  const getCardOptions = () => {
    const baseOptions = {
      layout: "vertical" as const,
      size: "medium" as const,
      showSummary: true,
      clickable: true,
      hoverable: true,
    };

    switch (variant) {
      case 'minimal':
        return {
          ...baseOptions,
          showTags: false,
          showImage: true,
          imageVariant: "hero" as const
        };
        
      case 'text-only':
        return {
          ...baseOptions,
          showTags: false,
          showImage: false
        };
        
      case 'no-tags':
        return {
          ...baseOptions,
          showTags: false,
          showImage: true,
          imageVariant: "hero" as const
        };
        
      case 'default':
      default:
        return {
          ...baseOptions,
          showTags: true,
          showImage: true,
          imageVariant: "hero" as const
        };
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6 ${className}`}>
      {items.map((item) => (
        <UnifiedCard
          key={item.id}
          item={item}
          options={getCardOptions()}
          collection={collection}
        />
      ))}
    </div>
  );
}
