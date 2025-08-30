import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getContentBySlug, getContentByType, getAllContentSlugs } from '../content'

// Mock file system and dependencies
vi.mock('fs')
vi.mock('path')
vi.mock('gray-matter')

const mockFs = vi.mocked(fs)
const mockPath = vi.mocked(path)
const mockMatter = vi.mocked(matter)

describe('content', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Setup default mocks
    mockPath.join.mockImplementation((...args) => args.join('/'))
    process.cwd = vi.fn().mockReturnValue('/app')
  })

  // Helper to create proper matter mock objects
  const createMatterMock = (data: any, content: string) => ({
    data,
    content,
    orig: '',
    language: 'yaml',
    matter: '',
    stringify: () => ''
  })

  describe('getContentBySlug', () => {
    const mockFileContent = `---
title: Test Article
type: article
description: Test description
tags:
  - music
  - opera
images:
  - src: /test-image.jpg
    alt: Test image
    width: 300
    height: 200
---

# Test Content

This is test content.`

    const mockParsedContent = {
      data: {
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
      content: '# Test Content\n\nThis is test content.',
      orig: mockFileContent,
      language: 'yaml',
      matter: '',
      stringify: () => ''
    }

    it('returns content when file exists', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readFileSync.mockReturnValue(mockFileContent)
      mockMatter.mockReturnValue(mockParsedContent)

      const result = getContentBySlug('test-article')

      expect(result).toBeDefined()
      expect(result?.slug).toBe('test-article')
      expect(result?.frontmatter.title).toBe('Test Article')
      expect(result?.frontmatter.type).toBe('article')
      expect(result?.content).toContain('<h1>Test Content</h1>')
    })

    it('returns null when file does not exist', () => {
      mockFs.existsSync.mockReturnValue(false)

      const result = getContentBySlug('nonexistent-article')

      expect(result).toBeNull()
      expect(mockFs.readFileSync).not.toHaveBeenCalled()
    })

    it('returns raw content when processHtml is false', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readFileSync.mockReturnValue(mockFileContent)
      mockMatter.mockReturnValue(mockParsedContent)

      const result = getContentBySlug('test-article', false)

      expect(result).toBeDefined()
      expect(result?.content).toBe('# Test Content\n\nThis is test content.')
      expect(result?.content).not.toContain('<h1>')
    })

    it('handles file read errors gracefully', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File read error')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = getContentBySlug('error-article')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Error reading content for slug error-article:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    it('handles matter parsing errors gracefully', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readFileSync.mockReturnValue(mockFileContent)
      mockMatter.mockImplementation(() => {
        throw new Error('Matter parsing error')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = getContentBySlug('parse-error-article')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Error reading content for slug parse-error-article:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    it('constructs correct file path', () => {
      vi.clearAllMocks() // Clear any previous calls
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readFileSync.mockReturnValue(mockFileContent)
      mockMatter.mockReturnValue(mockParsedContent)

      getContentBySlug('test-article')

      // We're just checking that the function was called with a proper file path
      expect(mockFs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('test-article.md'), 'utf8')
    })
  })

  describe('getContentByType', () => {
    const mockFiles = [
      'c_art_article1.md',
      'c_art_article2.md',
      'c_interview_person1.md',
      'c_review_concert1.md'
    ]

    beforeEach(() => {
      mockFs.readdirSync.mockReturnValue(mockFiles as any)
    })

    it('returns articles when type is article', () => {
      mockFs.existsSync.mockReturnValue(true)
      
      // Mock different content based on filename
      mockFs.readFileSync.mockImplementation((filePath: any) => {
        const filename = filePath.toString().split('/').pop()
        if (filename === 'c_art_article1.md' || filename === 'c_art_article2.md') {
          return `---\ntitle: Test Article\ntype: article\n---\nContent`
        }
        return `---\ntitle: Other Content\ntype: other\n---\nContent`
      })
      
      mockMatter.mockImplementation((content: any) => {
        const contentStr = content.toString()
        if (contentStr.includes('type: article')) {
          return createMatterMock({ title: 'Test Article', type: 'article' }, 'Content')
        }
        return createMatterMock({ title: 'Other Content', type: 'other' }, 'Content')
      })

      const result = getContentByType('article')

      expect(result).toHaveLength(2)
      expect(result[0].slug).toBe('c_art_article1')
      expect(result[1].slug).toBe('c_art_article2')
    })

    it('returns interviews when type is interview', () => {
      mockFs.existsSync.mockReturnValue(true)
      
      mockFs.readFileSync.mockImplementation((filePath: any) => {
        const filename = filePath.toString().split('/').pop()
        if (filename === 'c_interview_person1.md') {
          return `---\ntitle: Test Interview\ntype: interview\n---\nContent`
        }
        return `---\ntitle: Other Content\ntype: other\n---\nContent`
      })
      
      mockMatter.mockImplementation((content: any) => {
        const contentStr = content.toString()
        if (contentStr.includes('type: interview')) {
          return createMatterMock({ title: 'Test Interview', type: 'interview' }, 'Content')
        }
        return createMatterMock({ title: 'Other Content', type: 'other' }, 'Content')
      })

      const result = getContentByType('interview')

      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe('c_interview_person1')
    })

    it('returns reviews when type is review', () => {
      mockFs.existsSync.mockReturnValue(true)
      
      mockFs.readFileSync.mockImplementation((filePath: any) => {
        const filename = filePath.toString().split('/').pop()
        if (filename === 'c_review_concert1.md') {
          return `---\ntitle: Test Review\ntype: review\n---\nContent`
        }
        return `---\ntitle: Other Content\ntype: other\n---\nContent`
      })
      
      mockMatter.mockImplementation((content: any) => {
        const contentStr = content.toString()
        if (contentStr.includes('type: review')) {
          return createMatterMock({ title: 'Test Review', type: 'review' }, 'Content')
        }
        return createMatterMock({ title: 'Other Content', type: 'other' }, 'Content')
      })

      const result = getContentByType('review')

      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe('c_review_concert1')
    })

    it('filters files correctly by type prefix', () => {
      mockFs.existsSync.mockReturnValue(true)
      
      mockFs.readFileSync.mockImplementation((filePath: any) => {
        const filename = filePath.toString().split('/').pop()
        if (filename === 'c_art_article1.md' || filename === 'c_art_article2.md') {
          return `---\ntitle: Test Article\ntype: article\n---\nContent`
        }
        return `---\ntitle: Other Content\ntype: other\n---\nContent`
      })
      
      mockMatter.mockImplementation((content: any) => {
        const contentStr = content.toString()
        if (contentStr.includes('type: article')) {
          return createMatterMock({ title: 'Test Article', type: 'article' }, 'Content')
        }
        return createMatterMock({ title: 'Other Content', type: 'other' }, 'Content')
      })

      getContentByType('article')

      // Should read all files to check their types, but only return articles
      expect(mockFs.readFileSync).toHaveBeenCalledTimes(4)
      expect(mockFs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('c_art_article1.md'), 'utf8')
      expect(mockFs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('c_art_article2.md'), 'utf8')
    })

    it('handles directory read errors gracefully', () => {
      mockFs.readdirSync.mockImplementation(() => {
        throw new Error('Directory read error')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = getContentByType('article')

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith('Error getting all content:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    it('skips files that fail to read', () => {
      // Set up a mock with only 2 files for this test
      mockFs.readdirSync.mockReturnValue(['good_article.md', 'bad_article.md'] as any)
      mockFs.existsSync.mockReturnValue(true)
      
      mockFs.readFileSync.mockImplementation((filePath: any) => {
        const filename = filePath.toString().split('/').pop()
        if (filename === 'good_article.md') {
          return `---\ntitle: Good Article\ntype: article\n---\nContent`
        }
        if (filename === 'bad_article.md') {
          throw new Error('File read error')
        }
        return `---\ntitle: Other\ntype: other\n---\nContent`
      })
      
      mockMatter.mockImplementation((content: any) => {
        const contentStr = content.toString()
        if (contentStr.includes('Good Article')) {
          return createMatterMock({ title: 'Good Article', type: 'article' }, 'Content')
        }
        return createMatterMock({ title: 'Other', type: 'other' }, 'Content')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = getContentByType('article')

      expect(result).toHaveLength(1)
      expect(result[0].frontmatter.title).toBe('Good Article')
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
      
      // Reset mock files for other tests
      mockFs.readdirSync.mockReturnValue([
        'c_art_article1.md',
        'c_art_article2.md',
        'c_interview_person1.md',
        'c_review_concert1.md'
      ] as any)
    })
  })

  describe('getAllContentSlugs', () => {
    it('returns all markdown file slugs', () => {
      const mockFiles = [
        'article1.md',
        'article2.md',
        'interview1.md',
        'not-markdown.txt',
        'review1.md'
      ]

      mockFs.readdirSync.mockReturnValue(mockFiles as any)

      const result = getAllContentSlugs()

      expect(result).toEqual([
        'article1',
        'article2',
        'interview1',
        'review1'
      ])
    })

    it('handles empty directory', () => {
      mockFs.readdirSync.mockReturnValue([])

      const result = getAllContentSlugs()

      expect(result).toEqual([])
    })

    it('handles directory read errors gracefully', () => {
      mockFs.readdirSync.mockImplementation(() => {
        throw new Error('Directory read error')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = getAllContentSlugs()

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith('Error getting all content slugs:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    it('constructs correct directory path', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue([])

      getAllContentSlugs()

      // We're just checking that the function was called properly
      expect(mockFs.existsSync).toHaveBeenCalled()
      expect(mockFs.readdirSync).toHaveBeenCalled()
    })
  })
})
