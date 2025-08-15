"use client";

/**
 * SearchInterface - Client-side search interface component
 * Handles all interactive search functionality
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ContentCard } from '@/components/ui/ContentCard';
import { UnifiedContentItem } from '@/types/content';

// Client-side search interface
export default function SearchInterface({ 
  allContent 
}: { 
  allContent: UnifiedContentItem[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Initialize search term from URL parameters
  useEffect(() => {
    const queryParam = searchParams?.get('q');
    if (queryParam) {
      setSearchTerm(queryParam);
    }
  }, [searchParams]);

  // Update URL when search term changes
  const updateURL = (newSearchTerm: string) => {
    const params = new URLSearchParams();
    if (newSearchTerm) {
      params.set('q', newSearchTerm);
    }
    const newURL = params.toString() ? `/search?${params.toString()}` : '/search';
    router.replace(newURL, { scroll: false });
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset to first page when search changes
    updateURL(newSearchTerm);
  };

  // Simplified search logic - only search term based
  const filteredContent = useMemo(() => {
    let filtered = allContent;

    // Search filter only
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.content.title.toLowerCase().includes(term) ||
        item.content.summary?.toLowerCase().includes(term) ||
        item.content.body?.toLowerCase().includes(term) ||
        item.tags?.some(tag => tag.toLowerCase().includes(term)) ||
        item.subject?.people?.some(person => 
          person.name.toLowerCase().includes(term) ||
          (person.role && person.role.toLowerCase().includes(term))
        ) ||
        item.subject?.organizations?.some(org => 
          org.name.toLowerCase().includes(term)
        ) ||
        item.metadata.type.toLowerCase().includes(term) ||
        item.metadata.category.toLowerCase().includes(term)
      );
    }

    // Default sorting by relevance (search term in title gets priority)
    filtered.sort((a, b) => {
      if (searchTerm) {
        const aInTitle = a.content.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0;
        const bInTitle = b.content.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0;
        if (aInTitle !== bInTitle) {
          return bInTitle - aInTitle;
        }
      }
      // Secondary sort by date (newest first)
      const dateA = new Date(a.publication?.date || '1900-01-01');
      const dateB = new Date(b.publication?.date || '1900-01-01');
      return dateB.getTime() - dateA.getTime();
    });

    return filtered;
  }, [allContent, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredContent.length / pageSize);
  const paginatedContent = filteredContent.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset pagination when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div>
      {/* Search Interface */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search across all content..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-6">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {searchTerm && (
            <div className="mt-3 text-sm text-gray-600 text-center">
              Searching across interviews, articles, reviews, and professional content
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Search Results
          </h2>
          <span className="text-gray-600">
            {filteredContent.length} {filteredContent.length === 1 ? 'result' : 'results'}
          </span>
        </div>

        {paginatedContent.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No content found matching your search criteria.</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedContent.map((item: UnifiedContentItem, index: number) => (
              <div key={`${item.metadata.id}-${index}`} className="relative">
                <ContentCard item={item} showImage={true} showTags={true} />
                {/* Type Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.metadata.type === 'interview' ? 'bg-purple-100 text-purple-800' :
                    item.metadata.type === 'article' ? 'bg-green-100 text-green-800' :
                    item.metadata.type === 'review' ? 'bg-blue-100 text-blue-800' :
                    item.metadata.type === 'professional' ? 'bg-orange-100 text-orange-800' :
                    item.metadata.type === 'publication' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.metadata.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let page;
                if (totalPages <= 7) {
                  page = i + 1;
                } else if (currentPage <= 4) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  page = totalPages - 6 + i;
                } else {
                  page = currentPage - 3 + i;
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Cross-Domain Compatibility Notice */}
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-sm font-medium text-green-800 mb-2">
          ✅ Unified Search Experience
        </h3>
        <p className="text-sm text-green-700">
          Search seamlessly across classical music interviews, articles, reviews, and professional 
          portfolio content. Results are automatically sorted by relevance and recency to show 
          the most pertinent content first.
        </p>
      </div>
    </div>
  );
}
