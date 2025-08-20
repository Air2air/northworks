"use client";

import React from 'react';
import Link from 'next/link';
import { FaExternalLinkAlt, FaFileDownload, FaBuilding, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import { extractAndResolveLinks } from '@/lib/linkResolver';

export interface SectionCardProps {
  content: string;
  index?: number;
  className?: string;
}

export default function SectionCard({ content, index, className = '' }: SectionCardProps) {
  if (!content || !content.trim()) {
    return null;
  }

  // Parse content for structured elements
  const parseContent = (text: string) => {
    // Use the link resolver to extract and resolve links
    const resolvedLinks = extractAndResolveLinks(text);
    const links = resolvedLinks.map(link => ({
      title: link.title,
      url: link.resolvedUrl, // Use resolved URL directly
      isPdf: link.isPdf,
      isExternal: link.isExternal,
      isBroken: link.isBroken // Use the broken flag from resolver
    }));

    // Extract years/dates (4-digit years)
    const yearRegex = /\b(19|20)\d{2}\b/g;
    const years = [...text.matchAll(yearRegex)].map(m => m[0]);

    // Extract organization patterns (text in bold or all caps)
    const orgRegex = /\*\*([^*]+)\*\*/g;
    const organizations = [...text.matchAll(orgRegex)].map(m => m[1]);

    // Clean content by removing markdown formatting for display
    const cleanContent = text
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just titles
      .trim();

    return {
      cleanContent,
      links,
      years: [...new Set(years)], // Remove duplicates
      organizations: [...new Set(organizations)], // Remove duplicates
      hasStructuredData: links.length > 0 || years.length > 0 || organizations.length > 0
    };
  };

  const parsed = parseContent(content);

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 ${className}`}>
      {/* Main content */}
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-700 leading-relaxed mb-4">
          {parsed.cleanContent}
        </p>
      </div>

      {/* Structured metadata */}
      {parsed.hasStructuredData && (
        <div className="border-t border-gray-100 pt-4 mt-4">
          {/* Years/Dates */}
          {parsed.years.length > 0 && (
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <FaCalendarAlt className="w-3 h-3 mr-2 text-sky-400" />
              <span>{parsed.years.join(', ')}</span>
            </div>
          )}

          {/* Organizations */}
          {parsed.organizations.length > 0 && (
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <FaBuilding className="w-3 h-3 mr-2 text-sky-400" />
              <span>{parsed.organizations.slice(0, 3).join(', ')}</span>
              {parsed.organizations.length > 3 && (
                <span className="ml-1">+{parsed.organizations.length - 3} more</span>
              )}
            </div>
          )}

          {/* Links */}
          {parsed.links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {parsed.links.slice(0, 3).map((link, idx) => (
                <Link
                  key={idx}
                  href={link.url}
                  className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors no-underline ${
                    link.isBroken 
                      ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                      : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                  }`}
                  target={link.isExternal ? '_blank' : undefined}
                  rel={link.isExternal ? 'noopener noreferrer' : undefined}
                >
                  {link.isBroken ? (
                    <FaExclamationTriangle className="w-3 h-3 mr-1" />
                  ) : link.isPdf ? (
                    <FaFileDownload className="w-3 h-3 mr-1" />
                  ) : link.isExternal ? (
                    <FaExternalLinkAlt className="w-3 h-3 mr-1" />
                  ) : null}
                  {link.title}
                </Link>
              ))}
              {parsed.links.length > 3 && (
                <span className="inline-flex items-center px-3 py-1.5 text-xs text-gray-500">
                  +{parsed.links.length - 3} more links
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
