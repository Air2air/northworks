import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface Article {
  metadata: {
    id: string;
    type: string;
    category: string;
    subcategory: string;
    status: string;
  };
  content: {
    title: string;
    headline?: string;
    summary: string;
    url: string;
  };
  publication: {
    date: string | null;
    publisher: string | null;
    publication: string;
    section?: string | null;
  };
  tags: string[];
}

interface ArticlesData {
  metadata: {
    id: string;
    type: string;
    category: string;
    subcategory: string;
    status: string;
    featured: boolean;
  };
  content: {
    title: string;
    summary: string;
    body: string;
  };
  articles: Article[];
}

interface ArticleListProps {
  data: ArticlesData;
  searchable?: boolean;
  filterable?: boolean;
  pageSize?: number;
  layout?: 'list' | 'grid';
}

export function ArticleList({ 
  data, 
  searchable = true, 
  filterable = true, 
  pageSize = 10,
  layout = 'list'
}: ArticleListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique values for filters
  const { types, publishers, years } = useMemo(() => {
    const typesSet = new Set<string>();
    const publishersSet = new Set<string>();
    const yearsSet = new Set<string>();
    
    data.articles.forEach(article => {
      if (article.metadata.subcategory) {
        typesSet.add(article.metadata.subcategory);
      }
      if (article.publication.publisher) {
        publishersSet.add(article.publication.publisher);
      }
      if (article.publication.date) {
        const year = article.publication.date.substring(0, 4);
        yearsSet.add(year);
      }
    });
    
    return {
      types: Array.from(typesSet).sort(),
      publishers: Array.from(publishersSet).sort(),
      years: Array.from(yearsSet).sort().reverse() // Most recent first
    };
  }, [data.articles]);

  // Filter and search articles
  const filteredArticles = useMemo(() => {
    return data.articles.filter(article => {
      // Search filter
      if (searchQuery) {
        const searchText = searchQuery.toLowerCase();
        const matchesTitle = article.content.title.toLowerCase().includes(searchText);
        const matchesHeadline = article.content.headline?.toLowerCase().includes(searchText);
        const matchesSummary = article.content.summary.toLowerCase().includes(searchText);
        const matchesTags = article.tags.some(tag => tag.toLowerCase().includes(searchText));
        
        if (!matchesTitle && !matchesHeadline && !matchesSummary && !matchesTags) {
          return false;
        }
      }
      
      // Type filter
      if (selectedType && article.metadata.subcategory !== selectedType) {
        return false;
      }
      
      // Publisher filter
      if (selectedPublisher && article.publication.publisher !== selectedPublisher) {
        return false;
      }
      
      // Year filter
      if (selectedYear && !article.publication.date?.startsWith(selectedYear)) {
        return false;
      }
      
      return true;
    });
  }, [data.articles, searchQuery, selectedType, selectedPublisher, selectedYear]);

  // Sort by date (most recent first)
  const sortedArticles = useMemo(() => {
    return [...filteredArticles].sort((a, b) => {
      const dateA = a.publication.date || '1970-01-01';
      const dateB = b.publication.date || '1970-01-01';
      return dateB.localeCompare(dateA);
    });
  }, [filteredArticles]);

  // Pagination
  const totalPages = Math.ceil(sortedArticles.length / pageSize);
  const paginatedArticles = sortedArticles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedPublisher('');
    setSelectedYear('');
    setCurrentPage(1);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.content.title}</h1>
        <p className="text-lg text-gray-600 mb-4">{data.content.summary}</p>
        <p className="text-sm text-gray-500">
          {filteredArticles.length} of {data.articles.length} articles
        </p>
      </div>

      {/* Search and Filters */}
      {(searchable || filterable) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-4 items-end">
            {searchable && (
              <div className="flex-1 min-w-64">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search articles
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by title, headline, or tags..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            {filterable && (
              <>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    id="type"
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All types</option>
                    {types.map(type => (
                      <option key={type} value={type}>{formatType(type)}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">
                    Publisher
                  </label>
                  <select
                    id="publisher"
                    value={selectedPublisher}
                    onChange={(e) => {
                      setSelectedPublisher(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All publishers</option>
                    {publishers.map(publisher => (
                      <option key={publisher} value={publisher}>{publisher}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    id="year"
                    value={selectedYear}
                    onChange={(e) => {
                      setSelectedYear(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All years</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {/* Articles */}
      <div className="grid gap-6 mb-8">
        {paginatedArticles.map((article) => (
          <article 
            key={article.metadata.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="flex">
              {/* Optional image placeholder - can be added later if needed */}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {formatType(article.metadata.subcategory)}
                  </span>
                  <time className="text-sm text-gray-500">
                    {formatDate(article.publication.date)}
                  </time>
                </div>
                
                {/* Title and headline */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {article.content.title}
                </h3>
                
                {article.content.headline && article.content.headline !== article.content.title && (
                  <h4 className="font-medium text-lg text-gray-700 mb-2">
                    {article.content.headline}
                  </h4>
                )}
                
                {/* Publication info */}
                <div className="text-sm text-gray-500 mb-3">
                  <span className="font-medium">{article.publication.publisher}</span>
                  {article.publication.section && (
                    <span> • {article.publication.section}</span>
                  )}
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.tags.slice(0, 5).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 5 && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      +{article.tags.length - 5} more
                    </span>
                  )}
                </div>
                
                {/* Summary */}
                {article.content.summary && (
                  <p className="text-gray-600 text-sm">
                    {article.content.summary.length > 200 
                      ? `${article.content.summary.substring(0, 200)}...`
                      : article.content.summary
                    }
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* No Results */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No articles found matching your criteria.</p>
          <button
            onClick={resetFilters}
            className="mt-2 text-blue-600 hover:text-blue-800 underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
