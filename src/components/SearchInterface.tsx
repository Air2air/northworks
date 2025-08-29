"use client";

/**
 * SearchInterface - Client-side search interface component
 * Handles all interactive search functionality
 */

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import UnifiedCard from "@/components/ui/UnifiedCard";
import Pagination from "@/components/ui/Pagination";
import { UnifiedContentItem } from "@/schemas/unified-content-schema";
import { searchContent } from "@/lib/search";
import { CollectionType } from "@/types";

// Client-side search interface
export default function SearchInterface({
  allContent,
  collection,
}: {
  allContent: UnifiedContentItem[];
  collection?: CollectionType;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Initialize search term from URL parameters
  useEffect(() => {
    const queryParam = searchParams?.get("q");
    if (queryParam) {
      setSearchTerm(queryParam);
    }
  }, [searchParams]);

  // Update URL when search term changes
  const updateURL = (newSearchTerm: string) => {
    const params = new URLSearchParams();
    if (newSearchTerm) {
      params.set("q", newSearchTerm);
    }
    const newURL = params.toString()
      ? `/search?${params.toString()}`
      : "/search";
    router.replace(newURL, { scroll: false });
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset to first page when search changes
    updateURL(newSearchTerm);
  };

  // Use unified search function
  const searchResults = useMemo(() => {
    return searchContent(allContent, {
      query: searchTerm,
      collection: collection || 'global'
    });
  }, [allContent, searchTerm, collection]);

  // Pagination
  const totalPages = Math.ceil(searchResults.totalResults / pageSize);
  const paginatedContent = searchResults.results.slice(
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
      <div className="my-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search across all content..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-6 py-4 text-lg border border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-6">
              <svg
                className="w-5 h-5 text-sky-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          {/* {searchTerm && (
            <div className="mt-3 text-sm text-sky-600 text-center">
              Searching across interviews, articles, reviews, and professional content
            </div>
          )} */}
        </div>
      </div>

      {/* Results */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-sky-900">
            Search Results
          </h2>
          <span className="text-sky-600">
            {searchResults.totalResults}{" "}
            {searchResults.totalResults === 1 ? "result" : "results"}
          </span>
        </div>

        {paginatedContent.length === 0 ? (
          <div className="text-center py-12 bg-sky-50 rounded-lg">
            <p className="text-sky-500 text-lg">
              No content found matching your search criteria.
            </p>
            <p className="text-sm text-sky-400 mt-2">
              Try adjusting your search terms or filters.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedContent.map((item: UnifiedContentItem, index: number) => (
              <div key={`${item.id}-${index}`} className="relative">
                <UnifiedCard 
                  item={item} 
                  options={{ 
                    showTags: true,
                    showSummary: true,
                    showImage: true,
                    clickable: true,
                    layout: 'horizontal',
                    size: 'medium'
                  }} 
                  collection={collection}
                />
                {/* Type Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.type === "interview"
                        ? "bg-purple-100 text-purple-800"
                        : item.type === "article"
                        ? "bg-green-100 text-green-800"
                        : item.type === "review"
                        ? "bg-sky-100 text-sky-800"
                        : item.type === "professional"
                        ? "bg-sky-100 text-sky-800"
                        : item.type === "publication"
                        ? "bg-sky-100 text-sky-800"
                        : "bg-sky-100 text-sky-800"
                    }`}
                  >
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-8"
        />
      </div>
    </div>
  );
}
