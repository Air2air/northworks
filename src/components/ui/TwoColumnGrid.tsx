/**
 * TWO COLUMN GRID COMPONENT
 * =========================
 * 
 * A custom two-column grid component designed specifically for homepage navigation
 * and featured content display. Provides responsive behavior and consistent spacing.
 * 
 * Features:
 * - Always two columns on medium screens and up
 * - Single column on mobile for better readability
 * - Customizable gap and padding
 * - Support for any child components
 * - Optional grid variants for different use cases
 */

import React from 'react';

// ===============================================
// TYPE DEFINITIONS
// ===============================================

export interface TwoColumnGridProps {
  /** Child components to render in the grid */
  children: React.ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Grid gap size */
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  
  /** Grid variant for different styling */
  variant?: 'default' | 'cards' | 'minimal' | 'featured';
  
  /** Custom styling for individual grid items */
  itemClassName?: string;
  
  /** Whether items should have equal height */
  equalHeight?: boolean;
  
  /** Responsive breakpoint for two-column layout */
  breakpoint?: 'sm' | 'md' | 'lg';
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

/**
 * Generate grid container classes based on props
 */
function getGridClasses(
  gap: TwoColumnGridProps['gap'],
  variant: TwoColumnGridProps['variant'],
  breakpoint: TwoColumnGridProps['breakpoint'],
  equalHeight: boolean
): string {
  // Base grid classes
  const baseClasses = 'grid grid-cols-1';
  
  // Responsive two-column classes
  const responsiveClasses = {
    'sm': 'sm:grid-cols-2',
    'md': 'md:grid-cols-2',
    'lg': 'lg:grid-cols-2'
  };
  
  // Gap classes
  const gapClasses = {
    'sm': 'gap-4',
    'md': 'gap-6',
    'lg': 'gap-8',
    'xl': 'gap-12'
  };
  
  // Variant-specific classes
  const variantClasses = {
    'default': '',
    'cards': 'p-4',
    'minimal': 'gap-2',
    'featured': 'gap-8 lg:gap-12'
  };
  
  // Equal height classes
  const heightClasses = equalHeight ? 'items-stretch' : '';
  
  // Combine all classes
  const classes = [
    baseClasses,
    responsiveClasses[breakpoint || 'md'],
    gapClasses[gap || 'md'],
    variantClasses[variant || 'default'],
    heightClasses
  ].filter(Boolean).join(' ');
  
  return classes;
}

/**
 * Generate item classes based on props
 */
function getItemClasses(
  variant: TwoColumnGridProps['variant'],
  equalHeight: boolean,
  itemClassName?: string
): string {
  // Base item classes
  const baseClasses = '';
  
  // Variant-specific item classes
  const variantClasses = {
    'default': '',
    'cards': 'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
    'minimal': '',
    'featured': 'bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300'
  };
  
  // Equal height classes for items
  const heightClasses = equalHeight ? 'h-full flex flex-col' : '';
  
  // Combine all classes
  const classes = [
    baseClasses,
    variantClasses[variant || 'default'],
    heightClasses,
    itemClassName
  ].filter(Boolean).join(' ');
  
  return classes;
}

// ===============================================
// MAIN COMPONENT
// ===============================================

export default function TwoColumnGrid({
  children,
  className = '',
  gap = 'md',
  variant = 'default',
  itemClassName = '',
  equalHeight = false,
  breakpoint = 'md'
}: TwoColumnGridProps) {
  
  // Generate CSS classes
  const gridClasses = getGridClasses(gap, variant, breakpoint, equalHeight);
  const itemClasses = getItemClasses(variant, equalHeight, itemClassName);
  
  // Convert children to array for easier manipulation
  const childArray = React.Children.toArray(children);
  
  return (
    <div className={`${gridClasses} ${className}`}>
      {childArray.map((child, index) => (
        <div key={index} className={itemClasses}>
          {child}
        </div>
      ))}
    </div>
  );
}

// ===============================================
// ADDITIONAL EXPORTS
// ===============================================

/**
 * Pre-configured variants for common use cases
 */
export const TwoColumnCardGrid = (props: Omit<TwoColumnGridProps, 'variant'>) => (
  <TwoColumnGrid {...props} variant="cards" />
);

export const TwoColumnFeaturedGrid = (props: Omit<TwoColumnGridProps, 'variant'>) => (
  <TwoColumnGrid {...props} variant="featured" equalHeight />
);

export const TwoColumnMinimalGrid = (props: Omit<TwoColumnGridProps, 'variant'>) => (
  <TwoColumnGrid {...props} variant="minimal" />
);
