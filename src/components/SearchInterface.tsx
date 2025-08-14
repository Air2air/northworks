"use client";

/**
 * SearchInterface - Client-side search interface component
 * Handles all interactive search functionality
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ContentCard, ContentItem } from '@/components/ui/ContentCard';

// Client-side search interface
export default function SearchInterface({ 
  allContent, 
  warnerLists 
}: { 
  allContent: (ContentItem & { domain: string })[];
  warnerLists: Record<string, any[]>;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title'>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [showLists, setShowLists] = useState(false);
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

  // Get unique domains and types
  const domains = useMemo(() => {
    const domainSet = new Set(allContent.map(item => item.domain));
    return Array.from(domainSet).sort();
  }, [allContent]);

  const types = useMemo(() => {
    const typeSet = new Set(allContent.map(item => item.metadata.type));
    return Array.from(typeSet).sort();
  }, [allContent]);

  // Search and filter logic
  const filteredContent = useMemo(() => {
    let filtered = allContent;

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
        ) ||
        item.domain.toLowerCase().includes(term)
      );
    }

    // Domain filter
    if (selectedDomain !== 'all') {
      filtered = filtered.filter(item => item.domain === selectedDomain);
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
          // Simple relevance: items with search term in title ranked higher
          if (searchTerm) {
            const aInTitle = a.content.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0;
            const bInTitle = b.content.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0;
            return bInTitle - aInTitle;
          }
          return 0;
      }
    });

    return filtered;
  }, [allContent, searchTerm, selectedDomain, selectedType, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredContent.length / pageSize);
  const paginatedContent = filteredContent.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDomain, selectedType, sortBy]);

  // Calculate statistics
  const stats = {
    total: allContent.length,
    interviews: allContent.filter(item => item.metadata.type === 'interview').length,
    articles: allContent.filter(item => item.metadata.type === 'article').length,
    professional: allContent.filter(item => item.domain === 'Professional Portfolio').length,
    searchResults: filteredContent.length
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Unified Content Search
        </h1>
        <p className="text-lg text-gray-600 max-w-4xl">
          Search across classical music interviews, articles, and professional portfolio content. 
          Discover connections and insights across different domains with unified filtering and sorting.
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">{stats.interviews}</div>
            <div className="text-sm text-gray-600">Interviews</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">{stats.articles}</div>
            <div className="text-sm text-gray-600">Articles</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-orange-600 mb-1">{stats.professional}</div>
            <div className="text-sm text-gray-600">Professional</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-red-600 mb-1">{stats.searchResults}</div>
            <div className="text-sm text-gray-600">Results</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex flex-col gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search across all content..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4">
            {/* Domain Filter */}
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Domains</option>
              {domains.map((domain: string) => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              {types.map((type: string) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'title')}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>

            {/* Lists Toggle */}
            <button
              onClick={() => setShowLists(!showLists)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                showLists 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {showLists ? 'Hide Lists' : 'Show Lists'}
            </button>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedContent.map((item: ContentItem & { domain: string }, index: number) => (
              <div key={`${item.metadata.id}-${index}`} className="relative">
                <ContentCard item={item} variant="grid" />
                {/* Domain Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.domain === 'Classical Music' ? 'bg-purple-100 text-purple-800' :
                    item.domain === 'Articles & Reviews' ? 'bg-green-100 text-green-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {item.domain}
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

      {/* Professional Lists Section */}
      {showLists && Object.keys(warnerLists).length > 0 && (
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Lists</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(warnerLists).map(([category, items]) => (
              <div key={category} className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-gray-800 capitalize mb-2">{category}</h3>
                <div className="text-2xl font-bold text-blue-600">{items.length}</div>
                <div className="text-sm text-gray-600">
                  {items.length === 1 ? 'item' : 'items'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cross-Domain Compatibility Notice */}
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-sm font-medium text-green-800 mb-2">
          ✅ Cross-Domain Search Architecture
        </h3>
        <p className="text-sm text-green-700">
          This unified search demonstrates true cross-domain compatibility, seamlessly searching 
          across classical music content, articles, and professional portfolio using the same 
          ContentCard and filtering infrastructure. The consistent schema enables unified 
          search experiences across completely different subject areas.
        </p>
      </div>
    </div>
  );
}
