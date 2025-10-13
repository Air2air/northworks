import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  resolveContentLink,
  resolveLinksInContent,
  extractAndResolveLinks
} from '../linkResolver';

describe('linkResolver', () => {
  beforeEach(() => {
    // Reset console.warn spy
    vi.clearAllMocks();
  });

  describe('resolveContentLink', () => {
    test('handles external HTTP URLs', () => {
      const httpUrl = 'http://example.com/test';
      expect(resolveContentLink(httpUrl)).toBe(httpUrl);
    });

    test('handles external HTTPS URLs', () => {
      const httpsUrl = 'https://example.com/test';
      expect(resolveContentLink(httpsUrl)).toBe(httpsUrl);
    });

    test('handles absolute paths', () => {
      const absolutePath = '/some/absolute/path';
      expect(resolveContentLink(absolutePath)).toBe(absolutePath);
    });

    test('handles fragment/anchor links', () => {
      const fragmentLink = '#section-header';
      expect(resolveContentLink(fragmentLink)).toBe(fragmentLink);
    });

    test('resolves interview content (c- prefix)', () => {
      expect(resolveContentLink('c-john-doe')).toBe('/interviews/c-john-doe');
      expect(resolveContentLink('c-interview-person1')).toBe('/interviews/c-interview-person1');
    });

    test('resolves review content (c-reviews- prefix)', () => {
      expect(resolveContentLink('c-reviews-conte-america-tropical')).toBe('/reviews/c-reviews-conte-america-tropical');
      expect(resolveContentLink('c-reviews-masur-2010')).toBe('/reviews/c-reviews-masur-2010');
    });

    test('resolves article content (c-articles- prefix)', () => {
      expect(resolveContentLink('c-articles-music-theory')).toBe('/articles/c-articles-music-theory');
      expect(resolveContentLink('c-articles-opera-review')).toBe('/articles/c-articles-opera-review');
    });

    test('resolves professional content (w- prefix)', () => {
      expect(resolveContentLink('w-biography')).toBe('/projects/w-biography');
      expect(resolveContentLink('w-professional-2020')).toBe('/projects/w-professional-2020');
    });

    test('resolves publication content (w-pub prefix)', () => {
      expect(resolveContentLink('w-pub-symphony-analysis')).toBe('/publications/w-pub-symphony-analysis');
      expect(resolveContentLink('w-pub-journal-article')).toBe('/publications/w-pub-journal-article');
    });

    test('warns and returns original slug for unknown content type', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const unknownSlug = 'unknown-content-type';
      const result = resolveContentLink(unknownSlug);
      
      expect(result).toBe(unknownSlug);
      expect(consoleSpy).toHaveBeenCalledWith(`Could not determine content type for slug: ${unknownSlug}`);
      
      consoleSpy.mockRestore();
    });

    test('defaults c- prefix to interview when no specific pattern matches', () => {
      expect(resolveContentLink('c-some-interview')).toBe('/interviews/c-some-interview');
    });

    test('defaults w- prefix to professional when no specific pattern matches', () => {
      expect(resolveContentLink('w-some-work')).toBe('/projects/w-some-work');
    });

    test('handles edge case empty string', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = resolveContentLink('');
      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith('Could not determine content type for slug: ');
      
      consoleSpy.mockRestore();
    });

    test('handles content with special characters', () => {
      expect(resolveContentLink('c-person-with-special-chars-éñ')).toBe('/interviews/c-person-with-special-chars-éñ');
    });
  });

  describe('resolveLinksInContent', () => {
    test('resolves single markdown link', () => {
      const content = 'Check out [this interview](c-john-doe) for more info.';
      const expected = 'Check out [this interview](/interviews/c-john-doe) for more info.';
      
      expect(resolveLinksInContent(content)).toBe(expected);
    });

    test('resolves multiple markdown links', () => {
      const content = `
        Read [this review](c-reviews-opera-2020) and 
        [this article](c-articles-music-theory) for details.
      `;
      const expected = `
        Read [this review](/reviews/c-reviews-opera-2020) and 
        [this article](/articles/c-articles-music-theory) for details.
      `;
      
      expect(resolveLinksInContent(content)).toBe(expected);
    });

    test('preserves external links unchanged', () => {
      const content = 'Visit [Google](https://google.com) for search.';
      const expected = 'Visit [Google](https://google.com) for search.';
      
      expect(resolveLinksInContent(content)).toBe(expected);
    });

    test('preserves absolute paths unchanged', () => {
      const content = 'Go to [home page](/) for navigation.';
      const expected = 'Go to [home page](/) for navigation.';
      
      expect(resolveLinksInContent(content)).toBe(expected);
    });

    test('preserves anchor links unchanged', () => {
      const content = 'Jump to [section](#section-1) below.';
      const expected = 'Jump to [section](#section-1) below.';
      
      expect(resolveLinksInContent(content)).toBe(expected);
    });

    test('handles mixed link types', () => {
      const content = `
        Visit [home](/) or read [interview](c-person) or 
        check [external site](https://example.com) or 
        go to [section](#header).
      `;
      const expected = `
        Visit [home](/) or read [interview](/interviews/c-person) or 
        check [external site](https://example.com) or 
        go to [section](#header).
      `;
      
      expect(resolveLinksInContent(content)).toBe(expected);
    });

    test('handles content with no links', () => {
      const content = 'This is just plain text with no links.';
      expect(resolveLinksInContent(content)).toBe(content);
    });

    test('handles malformed markdown links gracefully', () => {
      const content = 'This has [incomplete link and [another incomplete';
      expect(resolveLinksInContent(content)).toBe(content);
    });

    test('handles links with special characters in titles', () => {
      const content = 'Read [Review: "Così fan tutte"](c-reviews-cosi-fan-tutte) today.';
      const expected = 'Read [Review: "Così fan tutte"](/reviews/c-reviews-cosi-fan-tutte) today.';
      
      expect(resolveLinksInContent(content)).toBe(expected);
    });
  });

  describe('extractAndResolveLinks', () => {
    test('extracts and categorizes single link', () => {
      const content = 'Read [this interview](c-john-doe) for details.';
      const links = extractAndResolveLinks(content);
      
      expect(links).toHaveLength(1);
      expect(links[0]).toEqual({
        title: 'this interview',
        originalUrl: 'c-john-doe',
        resolvedUrl: '/interviews/c-john-doe',
        isPdf: false,
        isExternal: false,
        isBroken: false
      });
    });

    test('extracts multiple links with different types', () => {
      const content = `
        Check [external site](https://example.com), 
        read [interview](c-person), 
        see [PDF document](document.pdf), 
        and go [home](/).
      `;
      const links = extractAndResolveLinks(content);
      
      expect(links).toHaveLength(4);
      
      // External link
      expect(links[0]).toEqual({
        title: 'external site',
        originalUrl: 'https://example.com',
        resolvedUrl: 'https://example.com',
        isPdf: false,
        isExternal: true,
        isBroken: false
      });
      
      // Interview link
      expect(links[1]).toEqual({
        title: 'interview',
        originalUrl: 'c-person',
        resolvedUrl: '/interviews/c-person',
        isPdf: false,
        isExternal: false,
        isBroken: false
      });
      
      // PDF link
      expect(links[2]).toEqual({
        title: 'PDF document',
        originalUrl: 'document.pdf',
        resolvedUrl: 'document.pdf',
        isPdf: true,
        isExternal: false,
        isBroken: true // Can't resolve relative PDF
      });
      
      // Absolute path
      expect(links[3]).toEqual({
        title: 'home',
        originalUrl: '/',
        resolvedUrl: '/',
        isPdf: false,
        isExternal: false,
        isBroken: false
      });
    });

    test('identifies broken links correctly', () => {
      const content = `
        Links: [good link](c-interview) and 
        [broken link](unknown-type-slug) and
        [external](https://example.com) and
        [absolute](/path).
      `;
      const links = extractAndResolveLinks(content);
      
      expect(links).toHaveLength(4);
      expect(links[0].isBroken).toBe(false); // Resolvable
      expect(links[1].isBroken).toBe(true);  // Unknown type
      expect(links[2].isBroken).toBe(false); // External
      expect(links[3].isBroken).toBe(false); // Absolute path
    });

    test('identifies PDF links correctly', () => {
      const content = `
        Download [report.pdf](files/report.pdf) and 
        [document](files/document.doc) and
        [presentation.pdf](slides.pdf).
      `;
      const links = extractAndResolveLinks(content);
      
      expect(links).toHaveLength(3);
      expect(links[0].isPdf).toBe(true);
      expect(links[1].isPdf).toBe(false);
      expect(links[2].isPdf).toBe(true); // Case sensitive check
    });

    test('handles anchor links correctly', () => {
      const content = 'Jump to [section 1](#section-1) or [section 2](#section-2).';
      const links = extractAndResolveLinks(content);
      
      expect(links).toHaveLength(2);
      expect(links[0]).toEqual({
        title: 'section 1',
        originalUrl: '#section-1',
        resolvedUrl: '#section-1',
        isPdf: false,
        isExternal: false,
        isBroken: false
      });
    });

    test('returns empty array for content with no links', () => {
      const content = 'This is just plain text with no markdown links.';
      const links = extractAndResolveLinks(content);
      
      expect(links).toHaveLength(0);
    });

    test('handles complex link titles with special characters', () => {
      const content = 'Read [Review: "La Bohème" - Act II](c-reviews-boheme-act2) tonight.';
      const links = extractAndResolveLinks(content);
      
      expect(links).toHaveLength(1);
      expect(links[0].title).toBe('Review: "La Bohème" - Act II');
      expect(links[0].originalUrl).toBe('c-reviews-boheme-act2');
      expect(links[0].resolvedUrl).toBe('/reviews/c-reviews-boheme-act2');
    });

    test('handles nested brackets in link titles', () => {
      const content = 'Check [Link [with brackets]](c-test) here.';
      const links = extractAndResolveLinks(content);
      
      // The regex stops at the first ], so this doesn't parse as expected
      expect(links).toHaveLength(0);
    });

    test('handles links with query parameters', () => {
      const content = 'Visit [search page](https://example.com/search?q=test&type=all) now.';
      const links = extractAndResolveLinks(content);
      
      expect(links).toHaveLength(1);
      expect(links[0].originalUrl).toBe('https://example.com/search?q=test&type=all');
      expect(links[0].isExternal).toBe(true);
    });
  });
});
