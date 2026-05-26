"use client";

import React, { useMemo, useState } from 'react';
import SectionCard from './SectionCard';
import PageTitle from './PageTitle';
import SectionSearchInterface from './SectionSearchInterface';
import { parseContentSections, extractSectionPageMetadata, type ContentSection } from '@/lib/sectionParser';
import { SectionGridProps } from '@/types';

type SortOrder = 'relevance' | 'length-asc' | 'length-desc';

function countMatches(haystack: string, needle: string): number {
  if (!needle) return 0;

  let count = 0;
  let startIndex = 0;
  let nextIndex = haystack.indexOf(needle, startIndex);

  while (nextIndex !== -1) {
    count += 1;
    startIndex = nextIndex + needle.length;
    nextIndex = haystack.indexOf(needle, startIndex);
  }

  return count;
}

export default function SectionGrid({ content, frontmatter, className }: SectionGridProps) {
  // Parse sections from content once per content change.
  const sections = useMemo(() => parseContentSections(content), [content]);
  const metadata = extractSectionPageMetadata(frontmatter);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('relevance');

  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let filtered = sections;

    if (query) {
      filtered = sections.filter((section) => section.content.toLowerCase().includes(query));
    }

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      switch (sortOrder) {
        case 'length-asc':
          return a.content.length - b.content.length;
        case 'length-desc':
          return b.content.length - a.content.length;
        case 'relevance':
        default:
          if (query) {
            const aMatches = countMatches(a.content.toLowerCase(), query);
            const bMatches = countMatches(b.content.toLowerCase(), query);
            if (aMatches !== bMatches) {
              return bMatches - aMatches;
            }
          }
          return a.index - b.index;
      }
    });

    return sorted;
  }, [sections, searchQuery, sortOrder]);

  return (
    <div className={`space-y-8 ${className || ''}`}>
      {/* Page Title */}
      <PageTitle 
        title={metadata.title}
        description={`Comprehensive collection of ${sections.length} publications and research papers`}
        align="left"
        size="large"
      />

      {/* Search Interface - Now only handles search input, no callback needed */}
      <SectionSearchInterface
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        matchCount={filteredSections.length}
        totalCount={sections.length}
      />

      {/* No Results Message */}
      {filteredSections.length === 0 && searchQuery && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-2">No publications found for "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-sky-600 hover:text-sky-800 underline"
          >
            Clear search to see all publications
          </button>
        </div>
      )}

      {/* Sections Grid */}
      {filteredSections.length > 0 && (
        <div className="space-y-6">
          {filteredSections.map((section: ContentSection) => (
            <SectionCard
              key={`section-${section.index}`}
              content={section.content}
              index={section.index}
              className="animate-fade-in"
            />
          ))}
        </div>
      )}

      {/* Footer Stats */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>
          {filteredSections.length} section{filteredSections.length !== 1 ? 's' : ''} displayed • 
          {' '}{content.length.toLocaleString()} total characters
        </p>
      </div>
    </div>
  );
}
