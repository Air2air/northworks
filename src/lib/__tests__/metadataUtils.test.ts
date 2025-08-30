import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  generateMetadataFromContent,
  generateCollectionMetadata,
  generateListingMetadata
} from '../metadataUtils';

// Mock the content loading function
vi.mock('../content', () => ({
  getContentBySlug: vi.fn()
}));

// Mock field normalization functions
vi.mock('../fieldNormalization', () => ({
  getDescription: vi.fn(),
  getKeywords: vi.fn()
}));

import { getContentBySlug } from '../content';
import { getDescription, getKeywords } from '../fieldNormalization';

const mockGetContentBySlug = vi.mocked(getContentBySlug);
const mockGetDescription = vi.mocked(getDescription);
const mockGetKeywords = vi.mocked(getKeywords);

describe('metadataUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateMetadataFromContent', () => {
    test('generates metadata from content frontmatter', () => {
      const mockContent = {
        frontmatter: {
          title: 'Interview with John Doe',
          description: 'A fascinating conversation',
          keywords: ['interview', 'conductor']
        },
        content: 'Content here',
        slug: 'c-john-doe'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetDescription.mockReturnValue('A fascinating conversation');
      mockGetKeywords.mockReturnValue(['interview', 'conductor']);

      const metadata = generateMetadataFromContent('c-john-doe', {
        collection: 'cheryl',
        type: 'article'
      });

      expect(metadata).toEqual({
        title: 'Interview with John Doe | Cheryl North | NorthWorks',
        description: 'A fascinating conversation',
        keywords: ['interview', 'conductor'],
        openGraph: {
          title: 'Interview with John Doe',
          description: 'A fascinating conversation',
          type: 'article',
          siteName: 'NorthWorks'
        }
      });
    });

    test('uses default values when frontmatter is empty', () => {
      const mockContent = {
        frontmatter: {},
        content: 'Content here',
        slug: 'c-interview'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetDescription.mockReturnValue('');
      mockGetKeywords.mockReturnValue([]);

      const metadata = generateMetadataFromContent('c-interview', {
        defaultTitle: 'Default Title',
        defaultDescription: 'Default description',
        defaultKeywords: ['default', 'keywords'],
        collection: 'warner'
      });

      expect(metadata).toEqual({
        title: 'Default Title',
        description: 'Default description',
        keywords: ['default', 'keywords'],
        openGraph: {
          title: 'Default Title',
          description: 'Default description',
          type: 'website',
          siteName: 'NorthWorks'
        }
      });
    });

    test('merges frontmatter keywords with defaults', () => {
      const mockContent = {
        frontmatter: {
          title: 'Article Title',
          keywords: ['specific', 'article']
        },
        content: 'Content here',
        slug: 'c-article'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetDescription.mockReturnValue('Article description');
      mockGetKeywords.mockReturnValue(['specific', 'article']);

      const metadata = generateMetadataFromContent('c-article', {
        defaultKeywords: ['default', 'specific'], // 'specific' overlaps
        collection: 'cheryl'
      });

      // Should deduplicate keywords
      expect(metadata.keywords).toEqual(['specific', 'article', 'default']);
    });

    test('returns fallback metadata when content not found', () => {
      mockGetContentBySlug.mockReturnValue(null);

      const metadata = generateMetadataFromContent('non-existent', {
        defaultTitle: 'Fallback Title',
        defaultDescription: 'Fallback description'
      });

      expect(metadata).toEqual({
        title: 'Fallback Title',
        description: 'Fallback description',
        keywords: [],
        openGraph: {
          title: 'Fallback Title',
          description: 'Fallback description',
          type: 'website',
          siteName: 'NorthWorks'
        }
      });
    });

    test('handles missing frontmatter gracefully', () => {
      const mockContent = {
        content: 'Content without frontmatter',
        frontmatter: {},
        slug: 'c-content'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetDescription.mockReturnValue('');
      mockGetKeywords.mockReturnValue([]);

      const metadata = generateMetadataFromContent('c-content');

      expect(metadata).toEqual({
        title: 'NorthWorks',
        description: '',
        keywords: [],
        openGraph: {
          title: 'NorthWorks',
          description: '',
          type: 'website',
          siteName: 'NorthWorks'
        }
      });
    });

    test('builds proper hierarchical titles for different collections', () => {
      const mockContent = {
        frontmatter: {
          title: 'Sample Article'
        },
        content: 'Content',
        slug: 'sample-article'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetDescription.mockReturnValue('');
      mockGetKeywords.mockReturnValue([]);

      // Test warner collection
      const warnerMetadata = generateMetadataFromContent('w-article', {
        collection: 'warner'
      });
      expect(warnerMetadata.title).toBe('Sample Article | D. Warner North | NorthWorks');

      // Test cheryl collection
      const cherylMetadata = generateMetadataFromContent('c-article', {
        collection: 'cheryl'
      });
      expect(cherylMetadata.title).toBe('Sample Article | Cheryl North | NorthWorks');

      // Test global collection
      const globalMetadata = generateMetadataFromContent('global-article', {
        collection: 'global',
        defaultTitle: 'Site Title'
      });
      expect(globalMetadata.title).toBe('Sample Article | Site Title');
    });
  });

  describe('generateCollectionMetadata', () => {
    test('generates metadata for warner collection from frontmatter', () => {
      const mockContent = {
        frontmatter: {
          title: 'Dr. D. Warner North',
          description: 'Risk analysis expert'
        },
        content: 'Bio content',
        slug: 'w-main'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetDescription.mockReturnValue('Risk analysis expert');
      mockGetKeywords.mockReturnValue(['risk', 'analysis']);

      const metadata = generateCollectionMetadata('warner');

      expect(mockGetContentBySlug).toHaveBeenCalledWith('w-main', false);
      expect(metadata).toEqual({
        title: 'Dr. D. Warner North | D. Warner North | NorthWorks',
        description: 'Risk analysis expert',
        keywords: ['risk', 'analysis'],
        openGraph: {
          title: 'Dr. D. Warner North',
          description: 'Risk analysis expert',
          type: 'profile',
          siteName: 'NorthWorks'
        }
      });
    });

    test('generates metadata for cheryl collection from frontmatter', () => {
      const mockContent = {
        frontmatter: {
          title: 'Cheryl North',
          description: 'Music journalist'
        },
        content: 'Bio content',
        slug: 'c-main'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetDescription.mockReturnValue('Music journalist');
      mockGetKeywords.mockReturnValue(['music', 'journalism']);

      const metadata = generateCollectionMetadata('cheryl');

      expect(mockGetContentBySlug).toHaveBeenCalledWith('c-main', false);
      expect(metadata).toEqual({
        title: 'Cheryl North | Cheryl North | NorthWorks',
        description: 'Music journalist',
        keywords: ['music', 'journalism'],
        openGraph: {
          title: 'Cheryl North',
          description: 'Music journalist',
          type: 'profile',
          siteName: 'NorthWorks'
        }
      });
    });

    test('uses fallback metadata for warner when content not found', () => {
      mockGetContentBySlug.mockReturnValue(null);

      const metadata = generateCollectionMetadata('warner');

      expect(metadata).toEqual({
        title: 'D. Warner North - Risk Analysis Consultant | NorthWorks',
        description: 'Dr. D. Warner North is principal scientist of NorthWorks, a leading expert in risk analysis and nuclear waste issues with over 50 years of experience.',
        keywords: ['risk analysis', 'nuclear waste', 'consulting', 'Stanford University', 'EPA Science Advisory Board', 'decision analysis'],
        openGraph: {
          title: 'D. Warner North - Risk Analysis Consultant',
          description: 'Dr. D. Warner North is principal scientist of NorthWorks, a leading expert in risk analysis and nuclear waste issues with over 50 years of experience.',
          type: 'profile',
          siteName: 'NorthWorks'
        }
      });
    });

    test('uses fallback metadata for cheryl when content not found', () => {
      mockGetContentBySlug.mockReturnValue(null);

      const metadata = generateCollectionMetadata('cheryl');

      expect(metadata).toEqual({
        title: 'Cheryl North - Classical Music Journalist | NorthWorks',
        description: 'Cheryl North is a noted music columnist for Classical Voice of North Carolina and ANG Newspapers, specializing in opera, symphony, and chamber music interviews.',
        keywords: ['classical music', 'opera', 'music journalism', 'interviews', 'music reviews', 'symphony', 'chamber music'],
        openGraph: {
          title: 'Cheryl North - Classical Music Journalist',
          description: 'Cheryl North is a noted music columnist for Classical Voice of North Carolina and ANG Newspapers, specializing in opera, symphony, and chamber music interviews.',
          type: 'profile',
          siteName: 'NorthWorks'
        }
      });
    });
  });

  describe('generateListingMetadata', () => {
    test('generates metadata from content frontmatter', () => {
      const mockContent = {
        frontmatter: {
          title: 'All Interviews',
          description: 'Collection of interviews'
        },
        content: 'Listing content',
        slug: 'interviews'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetDescription.mockReturnValue('Collection of interviews');
      mockGetKeywords.mockReturnValue(['interviews', 'collection']);

      const metadata = generateListingMetadata('interviews', 'cheryl');

      expect(mockGetContentBySlug).toHaveBeenCalledWith('interviews', false);
      expect(metadata).toEqual({
        title: 'All Interviews | Cheryl North | NorthWorks',
        description: 'Collection of interviews',
        keywords: ['interviews', 'collection'],
        openGraph: {
          title: 'All Interviews',
          description: 'Collection of interviews',
          type: 'website',
          siteName: 'NorthWorks'
        }
      });
    });

    test('uses fallback metadata for articles when content not found', () => {
      mockGetContentBySlug.mockReturnValue(null);

      const metadata = generateListingMetadata('articles', 'cheryl');

      expect(metadata).toEqual({
        title: 'Articles | Cheryl North | NorthWorks',
        description: 'Music journalism, features, and cultural commentary',
        keywords: ['articles', 'journalism', 'features', 'commentary'],
        openGraph: {
          title: 'Articles | Cheryl North',
          description: 'Music journalism, features, and cultural commentary',
          type: 'website',
          siteName: 'NorthWorks'
        }
      });
    });

    test('uses fallback metadata for reviews when content not found', () => {
      mockGetContentBySlug.mockReturnValue(null);

      const metadata = generateListingMetadata('reviews', 'cheryl');

      expect(metadata).toEqual({
        title: 'Reviews | Cheryl North | NorthWorks',
        description: 'Concert reviews, opera critiques, and performance analysis',
        keywords: ['reviews', 'concerts', 'opera', 'performances'],
        openGraph: {
          title: 'Reviews | Cheryl North',
          description: 'Concert reviews, opera critiques, and performance analysis',
          type: 'website',
          siteName: 'NorthWorks'
        }
      });
    });

    test('uses fallback metadata for professional content (warner)', () => {
      mockGetContentBySlug.mockReturnValue(null);

      const metadata = generateListingMetadata('professional', 'warner');

      expect(metadata).toEqual({
        title: 'Professional Experience | D. Warner North | NorthWorks',
        description: 'Consulting work, government service, and academic collaborations',
        keywords: ['consulting', 'government', 'academic', 'professional'],
        openGraph: {
          title: 'Professional Experience | D. Warner North',
          description: 'Consulting work, government service, and academic collaborations',
          type: 'website',
          siteName: 'NorthWorks'
        }
      });
    });

    test('uses fallback metadata for publications (warner)', () => {
      mockGetContentBySlug.mockReturnValue(null);

      const metadata = generateListingMetadata('publications', 'warner');

      expect(metadata).toEqual({
        title: 'Publications | D. Warner North | NorthWorks',
        description: 'Books, research papers, reports, and articles',
        keywords: ['research', 'papers', 'books', 'articles', 'publications'],
        openGraph: {
          title: 'Publications | D. Warner North',
          description: 'Books, research papers, reports, and articles',
          type: 'website',
          siteName: 'NorthWorks'
        }
      });
    });

    test('uses fallback metadata for background content', () => {
      mockGetContentBySlug.mockReturnValue(null);

      const metadata = generateListingMetadata('background', 'warner');

      expect(metadata).toEqual({
        title: 'Background | D. Warner North | NorthWorks',
        description: 'Background information, education, and biographical details',
        keywords: ['biography', 'education', 'background', 'career history'],
        openGraph: {
          title: 'Background | D. Warner North',
          description: 'Background information, education, and biographical details',
          type: 'website',
          siteName: 'NorthWorks'
        }
      });
    });

    test('returns generic fallback for unknown content types', () => {
      mockGetContentBySlug.mockReturnValue(null);

      const metadata = generateListingMetadata('unknown-type', 'cheryl');

      expect(metadata).toEqual({
        title: 'NorthWorks',
        description: 'NorthWorks - Risk Analysis and Music Journalism',
        keywords: [],
        openGraph: {
          title: 'NorthWorks',
          description: 'NorthWorks - Risk Analysis and Music Journalism',
          type: 'website',
          siteName: 'NorthWorks'
        }
      });
    });

    test('defaults to cheryl collection when collection not specified', () => {
      mockGetContentBySlug.mockReturnValue(null);

      const metadata = generateListingMetadata('interviews');

      expect(metadata.title).toBe('Interviews | Cheryl North | NorthWorks');
      expect(metadata.openGraph?.title).toBe('Interviews | Cheryl North');
    });
  });
});
