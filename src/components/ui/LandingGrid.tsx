import UnifiedCard from './UnifiedCard';
import { UnifiedContentItem } from '@/schemas/unified-content-schema';
import { CollectionType } from '@/types';

export interface LandingGridProps {
  items: UnifiedContentItem[];
  className?: string;
  collection?: CollectionType;
}

/**
 * LandingGrid - Responsive grid component for landing page navigation cards
 * Provides consistent 1→2→3 column layout for main navigation sections
 */
export default function LandingGrid({ 
  items, 
  className = "mt-12",
  collection = "global" 
}: LandingGridProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ${className}`}>
      {items.map((item) => (
        <UnifiedCard
          key={item.id}
          item={item}
          options={{
            layout: "vertical",
            size: "medium",
            showTags: true,
            showSummary: true,
            clickable: true,
            hoverable: true,
            imageVariant: "hero"
          }}
          collection={collection}
        />
      ))}
    </div>
  );
}
