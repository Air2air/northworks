import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getContentByType, getAllContent, getLandingPageNavigation } from '../unified-data'
import { getContentByType as originalGetContentByType, getContentBySlug as originalGetContentBySlug } from '../content'

// Mock the original content functions
vi.mock('../content', () => ({
  getContentByType: vi.fn(),
  getContentBySlug: vi.fn()
}))

describe('unified-data', () => {
  const mockContentData = {
    slug: 'test-article',
    frontmatter: {
      id: 'test-id',
      title: 'Test Article',
      type: 'article',
      description: 'Test description',
      tags: ['music', 'opera'],
      images: [
        {
          src: '/test-image.jpg',
          alt: 'Test image',
          width: 300,
          height: 200
        }
      ]
    },
    content: 'Test content'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getContentByType', () => {
    it('converts ContentData to UnifiedContentItem correctly', () => {
      vi.mocked(originalGetContentByType).mockReturnValue([mockContentData])

      const result = getContentByType('article')

      expect(result).toHaveLength(1)
      const item = result[0]

      expect(item.id).toBe('test-id')
      expect(item.slug).toBe('test-article')
      expect(item.type).toBe('article')
      expect(item.category).toBe('articles')
      expect(item.title).toBe('Test Article')
      expect(item.summary).toBe('Test description')
      expect(item.url).toBe('/articles/test-article')
      expect(item.status).toBe('published')
      expect(item.source).toBe('markdown')
      expect(item.tags).toEqual(['music', 'opera'])
    })

    it('converts images to media format correctly', () => {
      vi.mocked(originalGetContentByType).mockReturnValue([mockContentData])

      const result = getContentByType('article')
      const item = result[0]

      expect(item.media).toHaveLength(1)
      expect(item.media![0]).toEqual({
        url: '/test-image.jpg',
        type: 'image',
        alt: 'Test image',
        width: 300,
        height: 200
      })
    })

    it('handles content without images', () => {
      const contentWithoutImages = {
        ...mockContentData,
        frontmatter: {
          ...mockContentData.frontmatter,
          images: undefined
        }
      }
      vi.mocked(originalGetContentByType).mockReturnValue([contentWithoutImages])

      const result = getContentByType('article')
      const item = result[0]

      expect(item.media).toBeUndefined()
    })

    it('handles content without id (uses slug as fallback)', () => {
      const contentWithoutId = {
        ...mockContentData,
        frontmatter: {
          ...mockContentData.frontmatter,
          id: undefined
        }
      }
      vi.mocked(originalGetContentByType).mockReturnValue([contentWithoutId])

      const result = getContentByType('article')
      const item = result[0]

      expect(item.id).toBe('test-article')
    })

    it('stores original frontmatter in legacy property', () => {
      vi.mocked(originalGetContentByType).mockReturnValue([mockContentData])

      const result = getContentByType('article')
      const item = result[0]

      expect(item.legacy?.originalData).toEqual(mockContentData.frontmatter)
    })

    it('handles images without alt text (uses title as fallback)', () => {
      const contentWithImageNoAlt = {
        ...mockContentData,
        frontmatter: {
          ...mockContentData.frontmatter,
          images: [
            {
              src: '/test-image.jpg',
              width: 300,
              height: 200
            }
          ]
        }
      }
      vi.mocked(originalGetContentByType).mockReturnValue([contentWithImageNoAlt])

      const result = getContentByType('article')
      const item = result[0]

      expect(item.media![0].alt).toBe('Test Article')
    })

    it('handles images without dimensions (provides defaults)', () => {
      const contentWithImageNoDimensions = {
        ...mockContentData,
        frontmatter: {
          ...mockContentData.frontmatter,
          images: [
            {
              src: '/test-image.jpg',
              alt: 'Test image'
            }
          ]
        }
      }
      vi.mocked(originalGetContentByType).mockReturnValue([contentWithImageNoDimensions])

      const result = getContentByType('article')
      const item = result[0]

      expect(item.media![0].width).toBe(300)
      expect(item.media![0].height).toBe(200)
    })

    it('handles content without tags (provides empty array)', () => {
      const contentWithoutTags = {
        ...mockContentData,
        frontmatter: {
          ...mockContentData.frontmatter,
          tags: undefined
        }
      }
      vi.mocked(originalGetContentByType).mockReturnValue([contentWithoutTags])

      const result = getContentByType('article')
      const item = result[0]

      expect(item.tags).toEqual([])
    })

    it('handles different content types correctly', () => {
      const interviewContent = {
        ...mockContentData,
        frontmatter: {
          ...mockContentData.frontmatter,
          type: 'interview'
        }
      }
      vi.mocked(originalGetContentByType).mockReturnValue([interviewContent])

      const result = getContentByType('interview')
      const item = result[0]

      expect(item.type).toBe('interview')
      expect(item.category).toBe('interviews')
      expect(item.url).toBe('/interviews/test-article')
    })
  })

  describe('getAllContent', () => {
    it('combines content from all types', () => {
      const mockArticle = {
        ...mockContentData,
        frontmatter: { ...mockContentData.frontmatter, type: 'article' }
      }
      const mockInterview = {
        ...mockContentData,
        slug: 'test-interview',
        frontmatter: { ...mockContentData.frontmatter, type: 'interview', id: 'test-interview-id' }
      }
      const mockReview = {
        ...mockContentData,
        slug: 'test-review',
        frontmatter: { ...mockContentData.frontmatter, type: 'review', id: 'test-review-id' }
      }

      vi.mocked(originalGetContentByType)
        .mockImplementationOnce(() => [mockArticle])  // articles
        .mockImplementationOnce(() => [mockInterview]) // interviews
        .mockImplementationOnce(() => [mockReview])    // reviews

      const result = getAllContent()

      expect(result).toHaveLength(3)
      expect(result[0].type).toBe('article')
      expect(result[1].type).toBe('interview')
      expect(result[2].type).toBe('review')
    })

    it('handles empty content arrays', () => {
      vi.mocked(originalGetContentByType).mockReturnValue([])

      const result = getAllContent()

      expect(result).toHaveLength(0)
    })
  })

  describe('getLandingPageNavigation', () => {
    const mockMainContent = {
      slug: 'c-main',
      content: 'Main content',
      frontmatter: {
        navigation: {
          professional: {
            title: 'Professional',
            summary: 'Professional content',
            url: '/cheryl/professional',
            tags: ['work']
          },
          articles: {
            title: 'Articles',
            summary: 'Article content',
            url: '/cheryl/articles'
          }
        },
        images: [
          {
            section: 'professional',
            src: '/professional.jpg',
            alt: 'Professional image',
            width: 400,
            height: 300
          }
        ]
      }
    }

    it('generates navigation from frontmatter correctly', () => {
      vi.mocked(originalGetContentBySlug).mockReturnValue(mockMainContent)

      const result = getLandingPageNavigation('cheryl')

      expect(result).toHaveLength(2)
      
      const professionalItem = result.find(item => item.slug === 'professional')
      expect(professionalItem).toBeDefined()
      expect(professionalItem?.title).toBe('Professional')
      expect(professionalItem?.summary).toBe('Professional content')
      expect(professionalItem?.url).toBe('/cheryl/professional')
      expect(professionalItem?.type).toBe('professional')
      expect(professionalItem?.tags).toEqual(['work'])
      expect(professionalItem?.media).toHaveLength(1)
    })

    it('handles warner collection correctly', () => {
      vi.mocked(originalGetContentBySlug).mockReturnValue({
        ...mockMainContent,
        slug: 'w-main'
      })

      const result = getLandingPageNavigation('warner')

      expect(originalGetContentBySlug).toHaveBeenCalledWith('w-main')
      expect(result).toHaveLength(2)
    })

    it('handles missing navigation gracefully', () => {
      vi.mocked(originalGetContentBySlug).mockReturnValue({
        slug: 'c-main',
        content: 'Content',
        frontmatter: {}
      })

      const result = getLandingPageNavigation('cheryl')

      expect(result).toHaveLength(0)
    })

    it('handles missing frontmatter gracefully', () => {
      vi.mocked(originalGetContentBySlug).mockReturnValue({
        slug: 'c-main',
        content: 'Content',
        frontmatter: {}
      } as any)

      const result = getLandingPageNavigation('cheryl')

      expect(result).toHaveLength(0)
    })

    it('handles error in content retrieval gracefully', () => {
      vi.mocked(originalGetContentBySlug).mockImplementation(() => {
        throw new Error('Content not found')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = getLandingPageNavigation('cheryl')

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error generating navigation for cheryl:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    it('determines content type correctly from section key', () => {
      const mockContentWithDifferentSections = {
        slug: 'c-main',
        content: 'Content',
        frontmatter: {
          navigation: {
            'interview-section': { title: 'Interviews' },
            'review-section': { title: 'Reviews' },
            'article-section': { title: 'Articles' },
            'background-section': { title: 'Background' },
            'publication-section': { title: 'Publications' },
            'northworks-section': { title: 'Northworks' },
            'unknown-section': { title: 'Unknown' }
          }
        }
      }

      vi.mocked(originalGetContentBySlug).mockReturnValue(mockContentWithDifferentSections)

      const result = getLandingPageNavigation('cheryl')

      expect(result.find(item => item.slug === 'interview-section')?.type).toBe('interview')
      expect(result.find(item => item.slug === 'review-section')?.type).toBe('review')
      expect(result.find(item => item.slug === 'article-section')?.type).toBe('article')
      expect(result.find(item => item.slug === 'background-section')?.type).toBe('background')
      expect(result.find(item => item.slug === 'publication-section')?.type).toBe('publication')
      expect(result.find(item => item.slug === 'northworks-section')?.type).toBe('company')
      expect(result.find(item => item.slug === 'unknown-section')?.type).toBe('other')
    })

    it('handles images without sections gracefully', () => {
      const mockContentWithoutSectionImages = {
        slug: 'c-main',
        content: 'Content',
        frontmatter: {
          navigation: {
            professional: {
              title: 'Professional'
            }
          },
          images: []
        }
      }

      vi.mocked(originalGetContentBySlug).mockReturnValue(mockContentWithoutSectionImages)

      const result = getLandingPageNavigation('cheryl')

      expect(result[0].media).toBeUndefined()
    })
  })
})
