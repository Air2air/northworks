import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  generateBreadcrumbsFromFrontmatter,
  generateDetailBreadcrumbsFromFrontmatter,
  generateCollectionBreadcrumbs,
  generateSpecialBreadcrumbs
} from '../breadcrumbUtils';

// Mock dependencies
vi.mock('../content', () => ({
  getContentBySlug: vi.fn()
}));

vi.mock('../fieldNormalization', () => ({
  getPageTitle: vi.fn()
}));

import { getContentBySlug } from '../content';
import { getPageTitle } from '../fieldNormalization';

const mockGetContentBySlug = vi.mocked(getContentBySlug);
const mockGetPageTitle = vi.mocked(getPageTitle);

describe('breadcrumbUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateBreadcrumbsFromFrontmatter', () => {
    test('generates breadcrumbs for warner professional content', () => {
      const mockContent = {
        frontmatter: {
          type: 'professional',
          title: 'Consulting Experience'
        },
        content: 'Content here',
        slug: 'w-consulting'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetPageTitle.mockReturnValue('Consulting Experience');

      const breadcrumbs = generateBreadcrumbsFromFrontmatter('w-consulting');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: false },
        { label: 'D. Warner North', href: '/warner', active: false },
        { label: 'Consulting Experience', href: '/w-consulting', active: true }
      ]);
    });

    test('generates breadcrumbs for cheryl interview content', () => {
      const mockContent = {
        frontmatter: {
          type: 'interview',
          title: 'Interview with John Doe'
        },
        content: 'Content here',
        slug: 'c-john-doe'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetPageTitle.mockReturnValue('Interview with John Doe');

      const breadcrumbs = generateBreadcrumbsFromFrontmatter('c-john-doe');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: false },
        { label: 'Cheryl North', href: '/cheryl', active: false },
        { label: 'Interview with John Doe', href: '/c-john-doe', active: true }
      ]);
    });

    test('generates breadcrumbs for warner publication content', () => {
      const mockContent = {
        frontmatter: {
          type: 'publication',
          title: 'Research Paper on Risk Analysis'
        },
        content: 'Content here',
        slug: 'w-pub-risk-analysis'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetPageTitle.mockReturnValue('Research Paper on Risk Analysis');

      const breadcrumbs = generateBreadcrumbsFromFrontmatter('w-pub-risk-analysis');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: false },
        { label: 'D. Warner North', href: '/warner', active: false },
        { label: 'Research Paper on Risk Analysis', href: '/w-pub-risk-analysis', active: true }
      ]);
    });

    test('generates breadcrumbs for warner background content', () => {
      const mockContent = {
        frontmatter: {
          type: 'background',
          title: 'Education and Career'
        },
        content: 'Content here',
        slug: 'w-background'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetPageTitle.mockReturnValue('Education and Career');

      const breadcrumbs = generateBreadcrumbsFromFrontmatter('w-background');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: false },
        { label: 'D. Warner North', href: '/warner', active: false },
        { label: 'Education and Career', href: '/w-background', active: true }
      ]);
    });

    test('generates breadcrumbs for warner company content', () => {
      const mockContent = {
        frontmatter: {
          type: 'company',
          title: 'NorthWorks Inc'
        },
        content: 'Content here',
        slug: 'w-company'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetPageTitle.mockReturnValue('NorthWorks Inc');

      const breadcrumbs = generateBreadcrumbsFromFrontmatter('w-company');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: false },
        { label: 'D. Warner North', href: '/warner', active: false },
        { label: 'NorthWorks Inc', href: '/w-company', active: true }
      ]);
    });

    test('generates breadcrumbs for cheryl article content', () => {
      const mockContent = {
        frontmatter: {
          type: 'article',
          title: 'Music Analysis Article'
        },
        content: 'Content here',
        slug: 'c-articles-music-analysis'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetPageTitle.mockReturnValue('Music Analysis Article');

      const breadcrumbs = generateBreadcrumbsFromFrontmatter('c-articles-music-analysis');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: false },
        { label: 'Cheryl North', href: '/cheryl', active: false },
        { label: 'Music Analysis Article', href: '/c-articles-music-analysis', active: true }
      ]);
    });

    test('generates breadcrumbs for cheryl review content', () => {
      const mockContent = {
        frontmatter: {
          type: 'review',
          title: 'Opera Review: La Bohème'
        },
        content: 'Content here',
        slug: 'c-reviews-boheme'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetPageTitle.mockReturnValue('Opera Review: La Bohème');

      const breadcrumbs = generateBreadcrumbsFromFrontmatter('c-reviews-boheme');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: false },
        { label: 'Cheryl North', href: '/cheryl', active: false },
        { label: 'Opera Review: La Bohème', href: '/c-reviews-boheme', active: true }
      ]);
    });

    test('generates breadcrumbs for cheryl bio content', () => {
      const mockContent = {
        frontmatter: {
          type: 'bio',
          title: 'Biography'
        },
        content: 'Content here',
        slug: 'c-bio'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetPageTitle.mockReturnValue('Biography');

      const breadcrumbs = generateBreadcrumbsFromFrontmatter('c-bio');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: false },
        { label: 'Cheryl North', href: '/cheryl', active: false },
        { label: 'Biography', href: '/c-bio', active: true }
      ]);
    });

    test('generates breadcrumbs for unknown content type', () => {
      const mockContent = {
        frontmatter: {
          type: 'unknown',
          title: 'Unknown Content'
        },
        content: 'Content here',
        slug: 'unknown-content'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetPageTitle.mockReturnValue('Unknown Content');

      const breadcrumbs = generateBreadcrumbsFromFrontmatter('unknown-content');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: false },
        { label: 'Unknown Content', href: '/unknown-content', active: true }
      ]);
    });

    test('returns default breadcrumbs when content not found', () => {
      mockGetContentBySlug.mockReturnValue(null);

      const breadcrumbs = generateBreadcrumbsFromFrontmatter('non-existent');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: true }
      ]);
    });

    test('returns default breadcrumbs when frontmatter missing', () => {
      const mockContent = {
        content: 'Content without frontmatter',
        frontmatter: {},
        slug: 'no-frontmatter'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetPageTitle.mockReturnValue('Unknown Content');

      const breadcrumbs = generateBreadcrumbsFromFrontmatter('no-frontmatter');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: false },
        { label: 'Unknown Content', href: '/no-frontmatter', active: true }
      ]);
    });

    test('handles empty title gracefully', () => {
      const mockContent = {
        frontmatter: {
          type: 'interview',
          title: ''
        },
        content: 'Content here',
        slug: 'c-empty-title'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetPageTitle.mockReturnValue('');

      const breadcrumbs = generateBreadcrumbsFromFrontmatter('c-empty-title');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: false },
        { label: 'Cheryl North', href: '/cheryl', active: false },
        { label: '', href: '/c-empty-title', active: true }
      ]);
    });
  });

  describe('generateDetailBreadcrumbsFromFrontmatter', () => {
    test('is an alias for generateBreadcrumbsFromFrontmatter', () => {
      const mockContent = {
        frontmatter: {
          type: 'interview',
          title: 'Test Interview'
        },
        content: 'Content here',
        slug: 'c-test'
      };

      mockGetContentBySlug.mockReturnValue(mockContent);
      mockGetPageTitle.mockReturnValue('Test Interview');

      const breadcrumbs = generateDetailBreadcrumbsFromFrontmatter('c-test');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: false },
        { label: 'Cheryl North', href: '/cheryl', active: false },
        { label: 'Test Interview', href: '/c-test', active: true }
      ]);
    });
  });

  describe('generateCollectionBreadcrumbs', () => {
    test('generates breadcrumbs for warner collection', () => {
      const breadcrumbs = generateCollectionBreadcrumbs('warner');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: false },
        { label: 'D. Warner North', href: '/warner', active: true }
      ]);
    });

    test('generates breadcrumbs for cheryl collection', () => {
      const breadcrumbs = generateCollectionBreadcrumbs('cheryl');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: false },
        { label: 'Cheryl North', href: '/cheryl', active: true }
      ]);
    });
  });

  describe('generateSpecialBreadcrumbs', () => {
    test('generates breadcrumbs for search page', () => {
      const breadcrumbs = generateSpecialBreadcrumbs('search');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: false },
        { label: 'Search', href: '/search', active: true }
      ]);
    });

    test('generates breadcrumbs for about page', () => {
      const breadcrumbs = generateSpecialBreadcrumbs('about');

      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/', active: false },
        { label: 'About', href: '/about', active: true }
      ]);
    });
  });
});
