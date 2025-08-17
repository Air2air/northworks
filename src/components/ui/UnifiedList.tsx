/**
 * UNIFIED LIST COMPONENT
 * =====================
 * 
 * Single reusable list component that handles ALL content types:
 * - c-* content (interviews, articles, reviews)
 * - w-* content (professional, publications, background, projects)
 * 
 * Replaces: UniversalListComponent, ContentList, InterviewsListComponent, etc.
 * 
 * Features:
 * - Unified data structure
 * - Single column layout for consistency
 * - Built-in filtering, sorting, and search
 * - Pagination and infinite scroll
 * - Loading and error states
 * - Empty state handling
 */

"use client";

import React, { useState, useMemo } from 'react';
import UnifiedCard from './UnifiedCard';
import { 
  UnifiedContentItem, 
  ListDisplayOptions,
  CardDisplayOptions,
  SearchFilters,
  ContentType,
  ContentCategory
} from '@/schemas/unified-content-schema';
import { 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaSpinner,
  FaExclamationTriangle,
  FaImage
} from 'react-icons/fa';

// ===============================================
// COMPONENT INTERFACE
// ===============================================

export interface UnifiedListProps {
  items: UnifiedContentItem[];
  options?: ListDisplayOptions;
  onItemClick?: (item: UnifiedContentItem) => void;
  onSelectionChange?: (items: UnifiedContentItem[]) => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

// ===============================================
// MAIN COMPONENT
// ===============================================

export default function UnifiedList({
  items,
  options = {},
  onItemClick,
  onSelectionChange,
  loading = false,
  error,
  className = ''
}: UnifiedListProps) {

  // ===============================================
  // STATE MANAGEMENT
  // ===============================================

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(options.sortBy || 'date');
  const [sortOrder, setSortOrder] = useState(options.sortOrder || 'desc');
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});

  // ===============================================
  // CONFIGURATION - SIMPLIFIED & FORCED SINGLE COLUMN
  // ===============================================

  const config: Required<ListDisplayOptions> = {
    // Forced single column configuration - ignore any layout overrides
    layout: 'list',
    columns: 1,
    gap: 'medium',
    pagination: true,
    itemsPerPage: options.itemsPerPage || 12,
    sortBy: options.sortBy || 'date',
    sortOrder: options.sortOrder || 'desc',
    groupBy: 'none', // Force no grouping for simplicity
    searchable: options.searchable !== false,
    filterable: options.filterable !== false,
    selectable: false,
    emptyMessage: options.emptyMessage || 'No content available',
    loadingMessage: options.loadingMessage || 'Loading content...',
    cardOptions: {
      layout: 'horizontal',
      size: 'medium',
      showImage: true,
      showSummary: true,
      showTags: true,
      showDate: true,
      showAuthor: true,
      showCategory: true,
      showPublication: true,
      imageVariant: 'thumbnail',
      imagePosition: 'left',
      clickable: true,
      hoverable: true,
      selectable: false,
      variant: 'default',
      className: ''
    }
  };

  // Force single column layout by overriding after spread
  config.layout = 'list';
  config.columns = 1;

  // ===============================================
  // DATA PROCESSING
  // ===============================================

  const processedItems = useMemo(() => {
    let filtered = [...items];

    // Apply search filter
    if (config.searchable && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.summary?.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        item.subject?.people?.some(person => person.name.toLowerCase().includes(query)) ||
        item.publication?.author?.toLowerCase().includes(query)
      );
    }

    // Apply category/type filters
    if (activeFilters.types?.length) {
      filtered = filtered.filter(item => activeFilters.types!.includes(item.type));
    }

    if (activeFilters.categories?.length) {
      filtered = filtered.filter(item => activeFilters.categories!.includes(item.category));
    }

    // Apply tag filters
    if (activeFilters.tags?.length) {
      filtered = filtered.filter(item => 
        item.tags?.some(tag => activeFilters.tags!.includes(tag))
      );
    }

    // Apply date range filter
    if (activeFilters.dateRange) {
      filtered = filtered.filter(item => {
        const itemDate = item.publishedDate || item.publication?.date || item.createdDate;
        if (!itemDate) return false;
        
        const date = new Date(itemDate);
        const start = activeFilters.dateRange!.start ? new Date(activeFilters.dateRange!.start) : null;
        const end = activeFilters.dateRange!.end ? new Date(activeFilters.dateRange!.end) : null;
        
        if (start && date < start) return false;
        if (end && date > end) return false;
        
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'date':
          aValue = new Date(a.publishedDate || a.publication?.date || a.createdDate || 0);
          bValue = new Date(b.publishedDate || b.publication?.date || b.createdDate || 0);
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'relevance':
          // For relevance, use priority or featured status
          aValue = (a.priority || 0) + (a.featured ? 100 : 0);
          bValue = (b.priority || 0) + (b.featured ? 100 : 0);
          break;
        default:
          aValue = a.title;
          bValue = b.title;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? comparison : -comparison;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [items, searchQuery, activeFilters, sortField, sortOrder, config.searchable]);

  // ===============================================
  // PAGINATION
  // ===============================================

  const totalItems = processedItems.length;
  const totalPages = Math.ceil(totalItems / config.itemsPerPage);
  const startIndex = (currentPage - 1) * config.itemsPerPage;
  const endIndex = startIndex + config.itemsPerPage;
  const paginatedItems = config.pagination 
    ? processedItems.slice(startIndex, endIndex)
    : processedItems;

  // ===============================================
  // EVENT HANDLERS
  // ===============================================

  const handleItemClick = (item: UnifiedContentItem) => {
    if (config.selectable) {
      const isSelected = selectedItems.includes(item.id);
      const newSelection = isSelected
        ? selectedItems.filter(id => id !== item.id)
        : [...selectedItems, item.id];
      
      setSelectedItems(newSelection);
      
      const selectedItemObjects = processedItems.filter(item => 
        newSelection.includes(item.id)
      );
      onSelectionChange?.(selectedItemObjects);
    }
    
    onItemClick?.(item);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (filters: SearchFilters) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSortChange = (field: string, order: 'asc' | 'desc') => {
    setSortField(field as any);
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sorting
  };

  // ===============================================
  // GROUPING
  // ===============================================

  const groupedItems = useMemo(() => {
    if (config.groupBy === 'none') {
      return { 'All Content': paginatedItems };
    }

    const groups: Record<string, UnifiedContentItem[]> = {};

    paginatedItems.forEach(item => {
      let groupKey: string;

      switch (config.groupBy) {
        case 'type':
          groupKey = item.type.charAt(0).toUpperCase() + item.type.slice(1);
          break;
        case 'category':
          groupKey = item.category.charAt(0).toUpperCase() + item.category.slice(1);
          break;
        case 'date':
          const date = item.publishedDate || item.publication?.date || item.createdDate;
          groupKey = date ? new Date(date).getFullYear().toString() : 'Unknown';
          break;
        case 'author':
          groupKey = item.publication?.author || item.interview?.interviewer?.name || 'Unknown';
          break;
        default:
          groupKey = 'All Content';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });

    return groups;
  }, [paginatedItems, config.groupBy]);

  // ===============================================
  // STYLES
  // ===============================================

  const getLayoutClasses = () => {
    // SIMPLIFIED: Always return single column vertical layout
    return 'space-y-4';
  };

  // ===============================================
  // LOADING AND ERROR STATES
  // ===============================================

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-4" />
          <p className="text-sky-600">{config.loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <FaExclamationTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">Error Loading Content</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // ===============================================
  // EMPTY STATE
  // ===============================================

  if (processedItems.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <FaImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Found</h3>
        <p className="text-gray-600">{config.emptyMessage}</p>
        {(searchQuery || Object.keys(activeFilters).length > 0) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveFilters({});
              setCurrentPage(1);
            }}
            className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  // ===============================================
  // CONTROLS COMPONENT
  // ===============================================

  const Controls = () => (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      {config.searchable && (
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
      )}

      {/* Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Sort Controls */}
        <div className="flex items-center space-x-2">
          <FaSort className="w-4 h-4 text-gray-400" />
          <select
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              handleSortChange(field, order as 'asc' | 'desc');
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="relevance-desc">Most Relevant</option>
            <option value="category-asc">Category</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {totalItems === 1 ? '1 item' : `${totalItems} items`}
          {config.pagination && totalItems > config.itemsPerPage && (
            <span> • Page {currentPage} of {totalPages}</span>
          )}
        </div>
      </div>
    </div>
  );

  // ===============================================
  // PAGINATION COMPONENT
  // ===============================================

  const Pagination = () => {
    if (!config.pagination || totalPages <= 1) return null;

    return (
      <div className="mt-8 flex items-center justify-center space-x-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        
        {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
          let pageNumber;
          if (totalPages <= 7) {
            pageNumber = i + 1;
          } else if (currentPage <= 4) {
            pageNumber = i + 1;
          } else if (currentPage >= totalPages - 3) {
            pageNumber = totalPages - 6 + i;
          } else {
            pageNumber = currentPage - 3 + i;
          }

          return (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={`px-3 py-2 border rounded-md ${
                currentPage === pageNumber
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
        
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    );
  };

  // ===============================================
  // MAIN RENDER
  // ===============================================

  return (
    <div className={`w-full ${className}`}>
      <Controls />
      
      {config.groupBy === 'none' ? (
        <div className={getLayoutClasses()}>
          {paginatedItems.map((item) => (
            <UnifiedCard
              key={item.id}
              item={item}
              options={{
                ...config.cardOptions,
                selectable: config.selectable,
                className: config.layout === 'masonry' ? 'mb-4 break-inside-avoid' : ''
              }}
              onClick={handleItemClick}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([groupName, groupItems]) => (
            <div key={groupName}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                {groupName} ({groupItems.length})
              </h3>
              <div className={getLayoutClasses()}>
                {groupItems.map((item) => (
                  <UnifiedCard
                    key={item.id}
                    item={item}
                    options={{
                      ...config.cardOptions,
                      selectable: config.selectable,
                      className: config.layout === 'masonry' ? 'mb-4 break-inside-avoid' : ''
                    }}
                    onClick={handleItemClick}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Pagination />
    </div>
  );
}
