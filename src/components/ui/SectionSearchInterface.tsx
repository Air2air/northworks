"use client";

/**
 * SectionSearchInterface - Search interface specifically for section-based content
 * Adapted from SearchInterface but designed for ContentSection arrays
 */

import React, { useState, useMemo } from "react";
import { FaSearch, FaSort, FaTimes } from "react-icons/fa";
import { ContentSection } from "@/lib/sectionParser";

interface SectionSearchInterfaceProps {
  onSearchChange: (query: string) => void;
  sections: ContentSection[];
  searchQuery: string;
}

export default function SectionSearchInterface({
  onSearchChange,
  sections,
  searchQuery,
}: SectionSearchInterfaceProps) {
  const [sortOrder, setSortOrder] = useState<'relevance' | 'length-asc' | 'length-desc'>('relevance');

  // Filter and sort sections
  const filteredSections = useMemo(() => {
    let filtered = [...sections];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(section => 
        section.content.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'length-asc':
          return a.content.length - b.content.length;
        case 'length-desc':
          return b.content.length - a.content.length;
        case 'relevance':
        default:
          if (searchQuery.trim()) {
            // Sort by relevance - count matches
            const queryLower = searchQuery.toLowerCase();
            const aMatches = (a.content.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
            const bMatches = (b.content.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
            if (aMatches !== bMatches) {
              return bMatches - aMatches;
            }
          }
          // Default to original order
          return a.index - b.index;
      }
    });
    
    return filtered;
  }, [sections, searchQuery, sortOrder]);

  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search across all publications..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-12 py-4 text-lg border border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Sort Controls */}
        <div className="flex items-center space-x-3">
          <FaSort className="w-4 h-4 text-gray-400" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-sky-500 focus:border-sky-500 bg-white"
          >
            <option value="relevance">Most Relevant</option>
            <option value="length-asc">Shorter First</option>
            <option value="length-desc">Longer First</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {searchQuery ? (
            <span>
              <span className="font-medium text-sky-600">{filteredSections.length}</span> of{' '}
              <span className="font-medium">{sections.length}</span> publications match
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="ml-2 text-sky-600 hover:text-sky-800 underline text-sm"
                >
                  Clear search
                </button>
              )}
            </span>
          ) : (
            <span>
              <span className="font-medium">{sections.length}</span> publication{sections.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Search helper text */}
      {searchQuery && (
        <div className="text-sm text-sky-600 text-center">
          Searching through titles, journal names, authors, and content
        </div>
      )}
    </div>
  );
}
