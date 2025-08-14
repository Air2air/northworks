import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Interview {
  metadata: {
    id: string;
    type: string;
    category: string;
    subcategory: string;
    status: string;
  };
  content: {
    title: string;
    summary: string;
    url: string;
  };
  subject: {
    people: Array<{
      name: string;
      role: string;
    }>;
  };
  publication: {
    date: string | null;
    publisher: string | null;
    publication: string;
  };
  media: {
    images: Array<{
      url: string;
      type: string;
      alt: string;
    }>;
  };
  tags: string[];
}

interface InterviewsData {
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
  interviews: Interview[];
}

interface InterviewGridProps {
  data: InterviewsData;
  searchable?: boolean;
  filterable?: boolean;
  pageSize?: number;
}

export function InterviewGrid({ 
  data, 
  searchable = true, 
  filterable = true, 
  pageSize = 12 
}: InterviewGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique roles and publishers for filters
  const { roles, publishers } = useMemo(() => {
    const rolesSet = new Set<string>();
    const publishersSet = new Set<string>();
    
    data.interviews.forEach(interview => {
      if (interview.subject.people[0]?.role) {
        rolesSet.add(interview.subject.people[0].role);
      }
      if (interview.publication.publisher) {
        publishersSet.add(interview.publication.publisher);
      }
    });
    
    return {
      roles: Array.from(rolesSet).sort(),
      publishers: Array.from(publishersSet).sort()
    };
  }, [data.interviews]);

  // Filter and search interviews
  const filteredInterviews = useMemo(() => {
    return data.interviews.filter(interview => {
      // Search filter
      if (searchQuery) {
        const searchText = searchQuery.toLowerCase();
        const matchesName = interview.subject.people[0]?.name.toLowerCase().includes(searchText);
        const matchesTags = interview.tags.some(tag => tag.toLowerCase().includes(searchText));
        const matchesPublication = interview.publication.publication?.toLowerCase().includes(searchText);
        
        if (!matchesName && !matchesTags && !matchesPublication) {
          return false;
        }
      }
      
      // Role filter
      if (selectedRole && interview.subject.people[0]?.role !== selectedRole) {
        return false;
      }
      
      // Publisher filter
      if (selectedPublisher && interview.publication.publisher !== selectedPublisher) {
        return false;
      }
      
      return true;
    });
  }, [data.interviews, searchQuery, selectedRole, selectedPublisher]);

  // Pagination
  const totalPages = Math.ceil(filteredInterviews.length / pageSize);
  const paginatedInterviews = filteredInterviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRole('');
    setSelectedPublisher('');
    setCurrentPage(1);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.content.title}</h1>
        <p className="text-lg text-gray-600 mb-4">{data.content.summary}</p>
        <p className="text-sm text-gray-500">
          {filteredInterviews.length} of {data.interviews.length} interviews
        </p>
      </div>

      {/* Search and Filters */}
      {(searchable || filterable) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-4 items-end">
            {searchable && (
              <div className="flex-1 min-w-64">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search interviews
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by name, role, or publication..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            {filterable && (
              <>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All roles</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
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

      {/* Interview Grid */}
      <div className="grid gap-6 mb-8">
        {paginatedInterviews.map((interview) => (
          <div key={interview.metadata.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex">
              {/* Thumbnail */}
              {interview.media.images.length > 0 && (
                <div className="flex-shrink-0 w-48 h-32 relative">
                  <Image
                    src={interview.media.images[0].url}
                    alt={interview.media.images[0].alt}
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                </div>
              )}
              
              {/* Content */}
              <div className="flex-1 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link
                    href={`/interviews/${interview.metadata.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {interview.content.title}
                  </Link>
                </h3>
                
                <div className="text-sm text-gray-500 mb-3">
                  {interview.publication.date && (
                    <span>{interview.publication.date}</span>
                  )}
                  {interview.publication.publisher && (
                    <span> • {interview.publication.publisher}</span>
                  )}
                  {interview.subject.people[0]?.role && (
                    <span> • {interview.subject.people[0].role}</span>
                  )}
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {interview.tags.slice(0, 5).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {interview.tags.length > 5 && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      +{interview.tags.length - 5} more
                    </span>
                  )}
                </div>

                {interview.content.summary && (
                  <p className="text-gray-600 text-sm">
                    {interview.content.summary.length > 200 
                      ? `${interview.content.summary.substring(0, 200)}...`
                      : interview.content.summary
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
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
      {filteredInterviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No interviews found matching your criteria.</p>
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
