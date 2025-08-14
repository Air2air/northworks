"use client";

/**
 * ProfessionalLists - Optimized version with React.memo and performance improvements
 * Handles various types of professional content with consistent styling
 */

import React, { useState, useMemo, useCallback } from 'react';
import Tags from './Tags';
import { 
  FaRocket, 
  FaBook, 
  FaBuilding, 
  FaBriefcase, 
  FaBullseye, 
  FaTrophy, 
  FaGraduationCap, 
  FaClipboardList 
} from 'react-icons/fa';

// Base Professional List Item types
interface ProfessionalItem {
  id?: string;
  title?: string;
  description?: string;
  organization?: string;
  date?: string;
  dateRange?: string;
  url?: string;
  type?: string;
  category?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  content?: {
    title?: string;
    summary?: string;
    description?: string;
    url?: string;
  };
  text?: string;
  context?: string;
  sourceFile?: string;
  subItems?: string[];
}

// List categories mapping
interface ListsData {
  projects?: ProfessionalItem[];
  publications?: ProfessionalItem[];
  organizations?: ProfessionalItem[];
  positions?: ProfessionalItem[];
  expertise?: ProfessionalItem[];
  awards?: ProfessionalItem[];
  education?: ProfessionalItem[];
  miscellaneous?: ProfessionalItem[];
  [key: string]: ProfessionalItem[] | undefined;
}

interface ProfessionalListsProps {
  lists: ListsData;
  showSummary?: boolean;
  expandedByDefault?: boolean;
  maxItemsPreview?: number;
}

// Constants for better performance
const CATEGORY_ICONS: Record<string, React.ComponentType<{className?: string}>> = {
  projects: FaRocket,
  publications: FaBook,
  organizations: FaBuilding,
  positions: FaBriefcase,
  expertise: FaBullseye,
  awards: FaTrophy,
  education: FaGraduationCap,
  miscellaneous: FaClipboardList
};

const CATEGORY_COLORS: Record<string, string> = {
  projects: 'blue',
  publications: 'green',
  organizations: 'purple',
  positions: 'orange',
  expertise: 'red',
  awards: 'yellow',
  education: 'indigo',
  miscellaneous: 'gray'
};

// Memoized utility functions
const getCategoryIcon = (category: string) => {
  const IconComponent = CATEGORY_ICONS[category.toLowerCase()];
  return IconComponent ? <IconComponent className="w-5 h-5" /> : <FaClipboardList className="w-5 h-5" />;
};
const getCategoryColor = (category: string) => CATEGORY_COLORS[category.toLowerCase()] || 'gray';

// Memoized Color Class Helper
const getColorClass = (color: string) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    gray: 'bg-gray-100 text-gray-800'
  };
  return colorClasses[color] || colorClasses.gray;
};

// Memoized Item Component
const ProfessionalItem = React.memo(function ProfessionalItem({ 
  item, 
  index 
}: { 
  item: ProfessionalItem; 
  index: number; 
}) {
  const itemTitle = item.content?.title || item.title || item.text || 'Untitled';
  const itemUrl = item.content?.url || item.url;
  const itemDescription = item.content?.summary || item.description || '';
  
  const truncatedDescription = useMemo(() => 
    itemDescription.length > 200 
      ? `${itemDescription.substring(0, 200)}...`
      : itemDescription
  , [itemDescription]);

  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex">
        <div className="flex-1 p-6">
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            {itemUrl ? (
              <a 
                href={itemUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
                onClick={handleLinkClick}
              >
                {itemTitle}
              </a>
            ) : (
              <span>{itemTitle}</span>
            )}
          </h4>
          
          {/* Metadata row */}
          <div className="text-sm text-gray-500 mb-3">
            {(item.date || item.dateRange) && (
              <span>{item.date || item.dateRange}</span>
            )}
            {item.organization && (
              <span>{(item.date || item.dateRange) ? ' • ' : ''}{item.organization}</span>
            )}
            {item.type && (
              <span>{(item.date || item.dateRange || item.organization) ? ' • ' : ''}{item.type}</span>
            )}
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="mb-3">
              <Tags 
                tags={item.tags} 
                maxVisible={5} 
                variant="compact"
              />
            </div>
          )}

          {/* Description */}
          {truncatedDescription && (
            <p className="text-gray-600 text-sm mb-3">
              {truncatedDescription}
            </p>
          )}
          
          {/* Sub-items */}
          {item.subItems && item.subItems.length > 0 && (
            <ul className="mt-3 ml-4 space-y-1">
              {item.subItems.map((subItem, subIndex) => (
                <li key={subIndex} className="text-sm text-gray-600 flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  {subItem}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
});

// Individual List Component - Memoized
const ProfessionalList = React.memo(function ProfessionalList({ 
  title, 
  items, 
  expanded, 
  onToggle, 
  maxPreview 
}: {
  title: string;
  items: ProfessionalItem[];
  expanded: boolean;
  onToggle: () => void;
  maxPreview: number;
}) {
  const displayItems = useMemo(() => 
    expanded ? items : items.slice(0, maxPreview)
  , [expanded, items, maxPreview]);
  
  const hasMore = items.length > maxPreview;
  const color = getCategoryColor(title);
  const icon = getCategoryIcon(title);
  const colorClass = getColorClass(color);

  return (
    <div className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
      {/* Header */}
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="text-blue-600 text-xl">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {title}
            </h3>
            <p className="text-sm text-gray-600">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
            {items.length}
          </span>
          <svg 
            className={`w-5 h-5 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div className="px-4 pb-4">
          <div className="space-y-4">
            {displayItems.map((item, index) => (
              <ProfessionalItem
                key={item.id || index}
                item={item}
                index={index}
              />
            ))}
          </div>
          
          {!expanded && hasMore && (
            <div className="mt-3 text-center">
              <button 
                onClick={onToggle}
                className={`font-medium text-sm ${
                  color === 'blue' ? 'text-blue-600 hover:text-blue-800' :
                  color === 'green' ? 'text-green-600 hover:text-green-800' :
                  color === 'purple' ? 'text-purple-600 hover:text-purple-800' :
                  color === 'orange' ? 'text-orange-600 hover:text-orange-800' :
                  color === 'red' ? 'text-red-600 hover:text-red-800' :
                  color === 'yellow' ? 'text-yellow-600 hover:text-yellow-800' :
                  color === 'indigo' ? 'text-indigo-600 hover:text-indigo-800' :
                  'text-gray-600 hover:text-gray-800'
                }`}
              >
                Show {items.length - maxPreview} more items
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// Summary Grid Component - Memoized
const ListSummaryGrid = React.memo(function ListSummaryGrid({ lists }: { lists: ListsData }) {
  const categories = useMemo(() => 
    Object.entries(lists).filter(([_, items]) => items && items.length > 0)
  , [lists]);
  
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {categories.map(([category, items]) => (
        <div key={category} className="bg-white p-4 rounded-lg shadow-md border text-center">
          <div className="text-2xl mb-2">
            {getCategoryIcon(category)}
          </div>
          <div className="text-xl font-bold text-gray-900 mb-1">
            {items?.length || 0}
          </div>
          <div className="text-sm text-gray-600 capitalize">
            {category}
          </div>
        </div>
      ))}
    </div>
  );
});

// Main Component - DEFAULT EXPORT with optimization
export default function ProfessionalLists({ 
  lists, 
  showSummary = true, 
  expandedByDefault = false,
  maxItemsPreview = 3
}: ProfessionalListsProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    expandedByDefault ? new Set(Object.keys(lists)) : new Set()
  );

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(category)) {
        newExpanded.delete(category);
      } else {
        newExpanded.add(category);
      }
      return newExpanded;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedCategories(new Set(Object.keys(lists)));
  }, [lists]);

  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  const categories = useMemo(() => 
    Object.entries(lists).filter(([_, items]) => items && items.length > 0)
  , [lists]);

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No professional lists available.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Grid */}
      {showSummary && <ListSummaryGrid lists={lists} />}
      
      {/* Individual Lists */}
      <div className="space-y-6">
        {categories.map(([category, items]) => (
          <ProfessionalList
            key={category}
            title={category}
            items={items || []}
            expanded={expandedCategories.has(category)}
            onToggle={() => toggleCategory(category)}
            maxPreview={maxItemsPreview}
          />
        ))}
      </div>
      
      {/* Actions */}
      <div className="mt-8 text-center">
        <div className="flex gap-4 justify-center">
          <button
            onClick={expandAll}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>
    </div>
  );
}

// Type exports for external usage
export type { ProfessionalItem, ListsData, ProfessionalListsProps };
