"use client";

import React, { useState, useCallback, useEffect } from 'react';
import SectionCard from './SectionCard';
import PageTitle from './PageTitle';
import SectionSearchInterface from './SectionSearchInterface';
import { parseContentSections, extractSectionPageMetadata, type ContentSection } from '@/lib/sectionParser';

export interface SectionGridProps {
  content: string;
  frontmatter?: any;
  className?: string;
}

export default function SectionGrid({ content, frontmatter, className }: SectionGridProps) {
  // Parse sections from content
  const sections = parseContentSections(content);
  const metadata = extractSectionPageMetadata(frontmatter);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search - now computed directly instead of using callback
  const filteredSections = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return sections;
    }

    const query = searchQuery.toLowerCase();
    return sections.filter(section => {
      // Search in section content only (ContentSection doesn't have title)
      return section.content.toLowerCase().includes(query);
    });
  }, [sections, searchQuery]);

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
        sections={sections}
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
