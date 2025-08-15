/**
 * Phase 1 Enhanced Components - Backward Compatible Enhanced Content Handling
 */

import React from 'react';
import { ContentData, ContentFrontmatter } from '@/types/content';
import { EnhancedFrontmatter, isEnhancedFrontmatter } from '@/types/enhancedFrontmatter';
import ContentLayout from '@/components/layouts/ContentLayout';
import PageTitle from '@/components/ui/PageTitle';
import Image from 'next/image';
import Link from 'next/link';

interface EnhancedContentPageProps {
  contentData: ContentData;
  children: React.ReactNode;
}

export function EnhancedContentPage({ contentData, children }: EnhancedContentPageProps) {
  const { frontmatter } = contentData;
  const isEnhanced = isEnhancedFrontmatter(frontmatter);
  
  // Extract data from enhanced or legacy frontmatter
  const title = isEnhanced 
    ? frontmatter.enhanced_seo?.meta_title || frontmatter.title
    : frontmatter.title;
    
  const description = isEnhanced
    ? frontmatter.enhanced_seo?.meta_description
    : undefined;
    
  const heroImage = isEnhanced
    ? frontmatter.hero_image
    : (frontmatter as any).images?.[0];

  return (
    <ContentLayout frontmatter={frontmatter}>
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Hero Section */}
        {heroImage && (
          <div className="mb-8">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={heroImage.src}
                alt={heroImage.alt || title}
                fill
                className="object-cover"
              />
            </div>
            {isEnhanced && frontmatter.hero_image?.caption && (
              <p className="mt-2 text-sm text-gray-600 italic">
                {frontmatter.hero_image.caption}
                {frontmatter.hero_image.photographer && (
                  <span className="ml-2">Photo: {frontmatter.hero_image.photographer}</span>
                )}
              </p>
            )}
          </div>
        )}

        {/* Enhanced Title and Metadata */}
        <div className="mb-8">
          <PageTitle title={title} />
          
          {description && (
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
          
          {/* Enhanced Performance Info (for reviews) */}
          {isEnhanced && frontmatter.performance && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Performance Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><strong>Date:</strong> {new Date(frontmatter.performance.date).toLocaleDateString()}</div>
                {frontmatter.performance.time && (
                  <div><strong>Time:</strong> {frontmatter.performance.time}</div>
                )}
                <div><strong>Venue:</strong> {frontmatter.performance.venue}</div>
                <div><strong>Organization:</strong> {frontmatter.performance.organization}</div>
                {frontmatter.performance.conductor && (
                  <div><strong>Conductor:</strong> {frontmatter.performance.conductor}</div>
                )}
              </div>
              
              {/* Program */}
              {frontmatter.performance.program && frontmatter.performance.program.length > 0 && (
                <div className="mt-3">
                  <strong>Program:</strong>
                  <ul className="mt-1 space-y-1">
                    {frontmatter.performance.program.map((piece, index) => (
                      <li key={index} className="text-sm">
                        {piece.composer}: <em>{piece.work}</em>
                        {piece.duration && <span className="text-gray-500 ml-2">({piece.duration})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Cast */}
              {frontmatter.performance.cast && frontmatter.performance.cast.length > 0 && (
                <div className="mt-3">
                  <strong>Cast:</strong>
                  <ul className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
                    {frontmatter.performance.cast.map((member, index) => (
                      <li key={index}>
                        <strong>{member.name}</strong> as {member.role}
                        {member.voice_type && <span className="text-gray-500 ml-1">({member.voice_type})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* Enhanced Publication Info */}
          {isEnhanced && frontmatter.enhanced_publication && (
            <div className="mt-4 text-sm text-gray-600">
              <div>
                Originally published {new Date(frontmatter.enhanced_publication.original_date).toLocaleDateString()}
                {frontmatter.enhanced_publication.publication_name && (
                  <span> in <em>{frontmatter.enhanced_publication.publication_name}</em></span>
                )}
                {frontmatter.enhanced_publication.byline && (
                  <span> {frontmatter.enhanced_publication.byline}</span>
                )}
              </div>
              {frontmatter.enhanced_publication.updated_date && (
                <div className="mt-1">
                  Updated {new Date(frontmatter.enhanced_publication.updated_date).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {children}
        </div>

        {/* Enhanced Related Content */}
        {isEnhanced && frontmatter.enhanced_subjects && (
          <RelatedContentSection frontmatter={frontmatter} />
        )}
      </div>
    </ContentLayout>
  );
}

function RelatedContentSection({ frontmatter }: { frontmatter: EnhancedFrontmatter }) {
  const { enhanced_subjects } = frontmatter;
  
  if (!enhanced_subjects) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-semibold mb-6">Related Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* People */}
        {enhanced_subjects.people && enhanced_subjects.people.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Featured Artists</h4>
            <ul className="space-y-1">
              {enhanced_subjects.people.map((person, index) => (
                <li key={index} className="text-sm">
                  {person.bio_link ? (
                    <Link href={person.bio_link} className="text-blue-600 hover:underline">
                      {person.name}
                    </Link>
                  ) : (
                    <span>{person.name}</span>
                  )}
                  {person.role && <span className="text-gray-500 ml-1">({person.role})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Organizations */}
        {enhanced_subjects.organizations && enhanced_subjects.organizations.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Organizations</h4>
            <ul className="space-y-1">
              {enhanced_subjects.organizations.map((org, index) => (
                <li key={index} className="text-sm">
                  {org.website ? (
                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {org.name}
                    </a>
                  ) : (
                    <span>{org.name}</span>
                  )}
                  {org.location && <span className="text-gray-500 ml-1">({org.location})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Works */}
        {enhanced_subjects.works && enhanced_subjects.works.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Musical Works</h4>
            <ul className="space-y-1">
              {enhanced_subjects.works.map((work, index) => (
                <li key={index} className="text-sm">
                  <em>{work.title}</em> by {work.composer}
                  {work.premiere_year && <span className="text-gray-500 ml-1">({work.premiere_year})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced List Component for Phase 1
interface EnhancedListItem {
  id: string;
  title: string;
  date?: string;
  venue?: string;
  organization?: string;
  featured?: boolean;
  reading_time?: number;
  link: string;
  excerpt?: string;
}

interface EnhancedListComponentProps {
  items: EnhancedListItem[];
  title: string;
  showFilters?: boolean;
  layout?: 'grid' | 'list';
}

export function EnhancedListComponent({ 
  items, 
  title, 
  showFilters = false, 
  layout = 'grid' 
}: EnhancedListComponentProps) {
  const [filteredItems, setFilteredItems] = React.useState(items);
  const [featuredOnly, setFeaturedOnly] = React.useState(false);

  React.useEffect(() => {
    if (featuredOnly) {
      setFilteredItems(items.filter(item => item.featured));
    } else {
      setFilteredItems(items);
    }
  }, [items, featuredOnly]);

  return (
    <div>
      {/* Header with filters */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {showFilters && (
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="mr-2"
              />
              Featured only
            </label>
          </div>
        )}
      </div>

      {/* Items grid/list */}
      <div className={layout === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "space-y-4"
      }>
        {filteredItems.map((item) => (
          <EnhancedListItemComponent key={item.id} item={item} layout={layout} />
        ))}
      </div>
    </div>
  );
}

function EnhancedListItemComponent({ 
  item, 
  layout 
}: { 
  item: EnhancedListItem; 
  layout: 'grid' | 'list';
}) {
  const isGrid = layout === 'grid';
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
      isGrid ? 'p-4' : 'p-4 flex items-start space-x-4'
    }`}>
      <div className={isGrid ? '' : 'flex-1'}>
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold ${isGrid ? 'text-lg' : 'text-base'} leading-tight`}>
            <Link href={item.link} className="text-gray-900 hover:text-blue-600">
              {item.title}
            </Link>
          </h3>
          {item.featured && (
            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              Featured
            </span>
          )}
        </div>
        
        <div className="text-sm text-gray-600 space-y-1">
          {item.date && <div>Date: {item.date}</div>}
          {item.venue && <div>Venue: {item.venue}</div>}
          {item.organization && <div>Organization: {item.organization}</div>}
          {item.reading_time && <div>Reading time: {item.reading_time} min</div>}
        </div>
        
        {item.excerpt && (
          <p className="mt-2 text-sm text-gray-700 line-clamp-3">
            {item.excerpt}
          </p>
        )}
      </div>
    </div>
  );
}
