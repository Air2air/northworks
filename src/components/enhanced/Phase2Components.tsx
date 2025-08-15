/**
 * Phase 2 Components: Rich Media Integration & Advanced Features
 */

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MediaGallery, 
  EnhancedImage, 
  AudioClip, 
  VideoClip,
  AdvancedTaxonomy,
  ContentRelationships,
  Phase2EnhancedFrontmatter 
} from '@/types/phase2Enhanced';

// Enhanced Media Gallery Component
interface MediaGalleryComponentProps {
  media: MediaGallery;
  title?: string;
}

export function MediaGalleryComponent({ media, title = "Media Gallery" }: MediaGalleryComponentProps) {
  const [selectedImage, setSelectedImage] = useState<EnhancedImage | null>(null);
  const [activeTab, setActiveTab] = useState<'images' | 'audio' | 'video' | 'documents'>('images');

  const hasImages = media.gallery && media.gallery.length > 0;
  const hasAudio = media.audio_clips && media.audio_clips.length > 0;
  const hasVideo = media.video_clips && media.video_clips.length > 0;
  const hasDocuments = media.documents && media.documents.length > 0;

  if (!hasImages && !hasAudio && !hasVideo && !hasDocuments) {
    return null;
  }

  return (
    <div className="mt-8 bg-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-4 border-b border-gray-200">
        {hasImages && (
          <button
            onClick={() => setActiveTab('images')}
            className={`pb-2 px-1 ${activeTab === 'images' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Images ({media.gallery?.length})
          </button>
        )}
        {hasAudio && (
          <button
            onClick={() => setActiveTab('audio')}
            className={`pb-2 px-1 ${activeTab === 'audio' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Audio ({media.audio_clips?.length})
          </button>
        )}
        {hasVideo && (
          <button
            onClick={() => setActiveTab('video')}
            className={`pb-2 px-1 ${activeTab === 'video' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Video ({media.video_clips?.length})
          </button>
        )}
        {hasDocuments && (
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-2 px-1 ${activeTab === 'documents' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Documents ({media.documents?.length})
          </button>
        )}
      </div>

      {/* Content Panels */}
      {activeTab === 'images' && hasImages && (
        <ImageGalleryPanel 
          images={media.gallery!} 
          onImageSelect={setSelectedImage}
        />
      )}
      
      {activeTab === 'audio' && hasAudio && (
        <AudioGalleryPanel audioClips={media.audio_clips!} />
      )}
      
      {activeTab === 'video' && hasVideo && (
        <VideoGalleryPanel videoClips={media.video_clips!} />
      )}
      
      {activeTab === 'documents' && hasDocuments && (
        <DocumentGalleryPanel documents={media.documents!} />
      )}

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
}

function ImageGalleryPanel({ 
  images, 
  onImageSelect 
}: { 
  images: EnhancedImage[]; 
  onImageSelect: (image: EnhancedImage) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <div 
          key={index}
          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onImageSelect(image)}
        >
          <Image
            src={image.thumbnail || image.src}
            alt={image.alt}
            fill
            className="object-cover"
          />
          {image.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs">
              {image.caption}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AudioGalleryPanel({ audioClips }: { audioClips: AudioClip[] }) {
  return (
    <div className="space-y-4">
      {audioClips.map((clip, index) => (
        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-medium mb-2">{clip.title}</h4>
          {clip.description && (
            <p className="text-sm text-gray-600 mb-3">{clip.description}</p>
          )}
          <audio controls className="w-full">
            <source src={clip.src} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <div className="mt-2 text-xs text-gray-500 flex justify-between">
            <span>
              {clip.performer && `Performer: ${clip.performer}`}
              {clip.composer && ` • Composer: ${clip.composer}`}
            </span>
            {clip.duration && <span>{clip.duration}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function VideoGalleryPanel({ videoClips }: { videoClips: VideoClip[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {videoClips.map((clip, index) => (
        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-medium mb-2">{clip.title}</h4>
          {clip.description && (
            <p className="text-sm text-gray-600 mb-3">{clip.description}</p>
          )}
          <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
            <video controls className="w-full h-full">
              <source src={clip.src} type="video/mp4" />
              Your browser does not support the video element.
            </video>
          </div>
          <div className="text-xs text-gray-500">
            {clip.performer && <div>Performer: {clip.performer}</div>}
            {clip.venue && <div>Venue: {clip.venue}</div>}
            {clip.date_recorded && <div>Recorded: {clip.date_recorded}</div>}
            {clip.duration && <div>Duration: {clip.duration}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function DocumentGalleryPanel({ documents }: { documents: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc, index) => (
        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-medium mb-2">{doc.title}</h4>
          {doc.description && (
            <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
          )}
          <a 
            href={doc.src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:underline text-sm"
          >
            <span>View {doc.type.toUpperCase()}</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <div className="mt-2 text-xs text-gray-500">
            {doc.file_size && <span>Size: {doc.file_size}</span>}
            {doc.page_count && <span> • Pages: {doc.page_count}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function ImageModal({ 
  image, 
  onClose 
}: { 
  image: EnhancedImage; 
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width || 800}
          height={image.height || 600}
          className="max-w-full max-h-full object-contain"
        />
        {(image.caption || image.photographer) && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
            {image.caption && <p className="mb-1">{image.caption}</p>}
            {image.photographer && (
              <p className="text-sm text-gray-300">Photo: {image.photographer}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Advanced Taxonomy Display Component
interface AdvancedTaxonomyDisplayProps {
  taxonomy: AdvancedTaxonomy;
  compact?: boolean;
}

export function AdvancedTaxonomyDisplay({ 
  taxonomy, 
  compact = false 
}: AdvancedTaxonomyDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="mt-8 bg-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Detailed Information</h3>
      
      <div className="space-y-4">
        {/* People */}
        {taxonomy.people && taxonomy.people.length > 0 && (
          <TaxonomySection
            title="Featured People"
            items={taxonomy.people}
            expanded={expandedSections.has('people')}
            onToggle={() => toggleSection('people')}
            compact={compact}
            renderItem={(person) => (
              <div className="text-sm">
                <div className="font-medium">{person.name}</div>
                <div className="text-gray-600">{person.role}</div>
                {!compact && person.nationality && (
                  <div className="text-gray-500">{person.nationality}</div>
                )}
                {!compact && person.specialties && person.specialties.length > 0 && (
                  <div className="text-gray-500 text-xs mt-1">
                    Specialties: {person.specialties.join(', ')}
                  </div>
                )}
              </div>
            )}
          />
        )}

        {/* Organizations */}
        {taxonomy.organizations && taxonomy.organizations.length > 0 && (
          <TaxonomySection
            title="Organizations"
            items={taxonomy.organizations}
            expanded={expandedSections.has('organizations')}
            onToggle={() => toggleSection('organizations')}
            compact={compact}
            renderItem={(org) => (
              <div className="text-sm">
                <div className="font-medium">{org.name}</div>
                <div className="text-gray-600">{org.location}</div>
                {!compact && org.founded_year && (
                  <div className="text-gray-500">Founded: {org.founded_year}</div>
                )}
              </div>
            )}
          />
        )}

        {/* Works */}
        {taxonomy.works && taxonomy.works.length > 0 && (
          <TaxonomySection
            title="Musical Works"
            items={taxonomy.works}
            expanded={expandedSections.has('works')}
            onToggle={() => toggleSection('works')}
            compact={compact}
            renderItem={(work) => (
              <div className="text-sm">
                <div className="font-medium italic">{work.title}</div>
                <div className="text-gray-600">by {work.composer}</div>
                {!compact && work.premiere_year && (
                  <div className="text-gray-500">Premiered: {work.premiere_year}</div>
                )}
                {!compact && work.key && (
                  <div className="text-gray-500">Key: {work.key}</div>
                )}
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}

function TaxonomySection<T>({ 
  title, 
  items, 
  expanded, 
  onToggle, 
  compact,
  renderItem 
}: {
  title: string;
  items: T[];
  expanded: boolean;
  onToggle: () => void;
  compact: boolean;
  renderItem: (item: T) => React.ReactNode;
}) {
  const displayItems = expanded ? items : items.slice(0, compact ? 2 : 3);
  const hasMore = items.length > (compact ? 2 : 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{title}</h4>
        {hasMore && (
          <button
            onClick={onToggle}
            className="text-sm text-blue-600 hover:underline"
          >
            {expanded ? 'Show less' : `Show all (${items.length})`}
          </button>
        )}
      </div>
      <div className={`grid gap-3 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {displayItems.map((item, index) => (
          <div key={index} className="bg-white rounded p-3 shadow-sm">
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Related Content Component
interface RelatedContentComponentProps {
  relationships: ContentRelationships;
  currentTitle: string;
}

export function RelatedContentComponent({ 
  relationships, 
  currentTitle 
}: RelatedContentComponentProps) {
  if (!relationships.related_content || relationships.related_content.length === 0) {
    return null;
  }

  const strongRelated = relationships.related_content.filter(r => r.strength === 'strong');
  const mediumRelated = relationships.related_content.filter(r => r.strength === 'medium');

  return (
    <div className="mt-8 bg-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Related Content</h3>
      
      {strongRelated.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Highly Related</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strongRelated.map((item, index) => (
              <RelatedContentItem key={index} item={item} />
            ))}
          </div>
        </div>
      )}

      {mediumRelated.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Also of Interest</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediumRelated.map((item, index) => (
              <RelatedContentItem key={index} item={item} compact />
            ))}
          </div>
        </div>
      )}

      {/* Series Navigation */}
      {relationships.series_info && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Part of Series</h4>
          <div className="bg-white rounded-lg p-4">
            <h5 className="font-medium">{relationships.series_info.series_title}</h5>
            {relationships.series_info.series_description && (
              <p className="text-sm text-gray-600 mt-1">
                {relationships.series_info.series_description}
              </p>
            )}
            <div className="mt-2 text-sm text-gray-500">
              Part {relationships.series_info.part_number}
              {relationships.series_info.total_parts && 
                ` of ${relationships.series_info.total_parts}`
              }
            </div>
            <div className="mt-3 flex space-x-4">
              {relationships.series_info.previous_part && (
                <Link 
                  href={`/${relationships.series_info.previous_part}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  ← Previous
                </Link>
              )}
              {relationships.series_info.next_part && (
                <Link 
                  href={`/${relationships.series_info.next_part}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Next →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RelatedContentItem({ 
  item, 
  compact = false 
}: { 
  item: any; 
  compact?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h5 className={`font-medium ${compact ? 'text-sm' : 'text-base'}`}>
        <Link href={`/${item.type}s/${item.id}`} className="text-gray-900 hover:text-blue-600">
          {item.title}
        </Link>
      </h5>
      {item.description && (
        <p className={`text-gray-600 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
          {item.description}
        </p>
      )}
      <div className={`mt-2 text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>
        {item.relation.replace('_', ' ')} • {item.type}
      </div>
    </div>
  );
}
