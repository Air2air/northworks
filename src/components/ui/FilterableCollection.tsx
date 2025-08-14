"use client";

/**
 * FilterableCollection - HOC for reusable filtered lists
 * Works with any content type that matches ContentItem interface
 */

import React, { useState, useMemo } from 'react';
import { ContentCard, ContentItem } from './ContentCard';

interface FilterableCollectionProps {
  items: ContentItem[];
  title?: string;
  defaultView?: 'grid' | 'list';
  enableSearch?: boolean;
  enableCategoryFilter?: boolean;
  enableTypeFilter?: boolean;
  enableDateSort?: boolean;
  pageSize?: number;
  className?: string;
}

export function FilterableCollection({
  items,
  title,
  defaultView = 'grid',
  enableSearch = true,
  enableCategoryFilter = true,
  enableTypeFilter = true,
  enableDateSort = true,
  pageSize = 12,
  className = ''
}: FilterableCollectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'relevance'>('date');
  const [view, setView] = useState<'grid' | 'list'>(defaultView);
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique values for filters
  const categories = useMemo(() => {
    const cats = new Set(items.map(item => item.metadata.category));
    return Array.from(cats).sort();
  }, [items]);

  const types = useMemo(() => {
    const typeSet = new Set(items.map(item => item.metadata.type));
    return Array.from(typeSet).sort();
  }, [items]);

  // Filter and sort logic
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.content.title.toLowerCase().includes(term) ||
        item.content.summary?.toLowerCase().includes(term) ||
        item.tags?.some(tag => tag.toLowerCase().includes(term)) ||
        item.subject?.people?.some(person => 
          person.name.toLowerCase().includes(term) ||
          person.role.toLowerCase().includes(term)
        )
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.metadata.category === selectedCategory);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.metadata.type === selectedType);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          const dateA = new Date(a.publication?.date || '1900-01-01');
          const dateB = new Date(b.publication?.date || '1900-01-01');
          return dateB.getTime() - dateA.getTime();
        case 'title':
          return a.content.title.localeCompare(b.content.title);
        case 'relevance':
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, searchTerm, selectedCategory, selectedType, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedItems.length / pageSize);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedType, sortBy]);

  const inputStyles = `
    px-3 py-2 border border-gray-300 rounded-md text-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `;

  const selectStyles = `
    px-3 py-2 border border-gray-300 rounded-md text-sm bg-white
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `;

  const buttonStyles = (active: boolean) => `
    px-3 py-2 text-sm font-medium rounded-md transition-colors
    ${active 
      ? 'bg-blue-600 text-white' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }
  `;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <span className="text-sm text-gray-500">
            {filteredAndSortedItems.length} {filteredAndSortedItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
        {/* Search */}
        {enableSearch && (
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${inputStyles}`}
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2">
          {enableCategoryFilter && categories.length > 1 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={selectStyles}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          )}

          {enableTypeFilter && types.length > 1 && (
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={selectStyles}
            >
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          )}

          {enableDateSort && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'relevance')}
              className={selectStyles}
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="relevance">Sort by Relevance</option>
            </select>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex rounded-md overflow-hidden border border-gray-300">
          <button
            onClick={() => setView('grid')}
            className={buttonStyles(view === 'grid')}
          >
            Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={buttonStyles(view === 'list')}
          >
            List
          </button>
        </div>
      </div>

      {/* Results */}
      {paginatedItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No items found matching your criteria.</p>
        </div>
      ) : (
        <div className={`
          ${view === 'grid' 
            ? 'space-y-6' 
            : 'space-y-4'
          }
        `}>
          {paginatedItems.map((item) => (
            <ContentCard
              key={item.metadata.id}
              item={item}
              showImage={true}
              showTags={true}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`${buttonStyles(false)} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Previous
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-sm ${buttonStyles(currentPage === page)}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`${buttonStyles(false)} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
