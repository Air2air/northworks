"use client";

/**
 * ProfessionalLists - Comprehensive component library for displaying professional lists
 * Handles various types of professional content with consistent styling
 */

import React, { useState } from 'react';

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

// Individual List Component
function ProfessionalList({ 
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
  const displayItems = expanded ? items : items.slice(0, maxPreview);
  const hasMore = items.length > maxPreview;

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      projects: '🚀',
      publications: '📚',
      organizations: '🏢',
      positions: '💼',
      expertise: '🎯',
      awards: '🏆',
      education: '🎓',
      miscellaneous: '📋'
    };
    return icons[category.toLowerCase()] || '📄';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      projects: 'blue',
      publications: 'green',
      organizations: 'purple',
      positions: 'orange',
      expertise: 'red',
      awards: 'yellow',
      education: 'indigo',
      miscellaneous: 'gray'
    };
    return colors[category.toLowerCase()] || 'gray';
  };

  const color = getCategoryColor(title);
  const icon = getCategoryIcon(title);

  return (
    <div className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
      {/* Header */}
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
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
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            color === 'blue' ? 'bg-blue-100 text-blue-800' :
            color === 'green' ? 'bg-green-100 text-green-800' :
            color === 'purple' ? 'bg-purple-100 text-purple-800' :
            color === 'orange' ? 'bg-orange-100 text-orange-800' :
            color === 'red' ? 'bg-red-100 text-red-800' :
            color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
            color === 'indigo' ? 'bg-indigo-100 text-indigo-800' :
            'bg-gray-100 text-gray-800'
          }`}>
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
              <article 
                key={index} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex">
                  {/* Optional image placeholder - can be added later */}
                  <div className="flex-1 p-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {(item.content?.url || item.url) ? (
                        <a 
                          href={item.content?.url || item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.content?.title || item.title || item.text || 'Untitled'}
                        </a>
                      ) : (
                        <span>{item.content?.title || item.title || item.text || 'Untitled'}</span>
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
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.tags.slice(0, 5).map((tag, tagIndex) => (
                          <span 
                            key={tagIndex} 
                            className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 5 && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                            +{item.tags.length - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    {(item.content?.summary || item.description) && (
                      <p className="text-gray-600 text-sm mb-3">
                        {(() => {
                          const description = item.content?.summary || item.description || '';
                          return description.length > 200 
                            ? `${description.substring(0, 200)}...`
                            : description;
                        })()}
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
}

// Summary Grid Component
function ListSummaryGrid({ lists }: { lists: ListsData }) {
  const categories = Object.entries(lists).filter(([_, items]) => items && items.length > 0);
  
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {categories.map(([category, items]) => (
        <div key={category} className="bg-white p-4 rounded-lg shadow-md border text-center">
          <div className="text-2xl mb-2">
            {category === 'projects' && '🚀'}
            {category === 'publications' && '📚'}
            {category === 'organizations' && '🏢'}
            {category === 'positions' && '💼'}
            {category === 'expertise' && '🎯'}
            {category === 'awards' && '🏆'}
            {category === 'education' && '🎓'}
            {category === 'miscellaneous' && '📋'}
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
}

// Main Component - DEFAULT EXPORT
export default function ProfessionalLists({ 
  lists, 
  showSummary = true, 
  expandedByDefault = false,
  maxItemsPreview = 3
}: ProfessionalListsProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    expandedByDefault ? new Set(Object.keys(lists)) : new Set()
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const categories = Object.entries(lists).filter(([_, items]) => items && items.length > 0);

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
            onClick={() => setExpandedCategories(new Set(Object.keys(lists)))}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={() => setExpandedCategories(new Set())}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>
    </div>
  );
}
