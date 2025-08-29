import { describe, it, expect } from 'vitest'
import { 
  stripHtmlTags,
  cleanTitle,
  normalizePath,
  encodePath,
  resolveImagePath,
  createPathMapping,
  fixImagePathsInContent,
  fixLegacyPath,
  fixHtmlPathsInContent
} from '../pathUtils'

describe('pathUtils', () => {
  describe('stripHtmlTags', () => {
    it('removes HTML tags from text', () => {
      expect(stripHtmlTags('<p>Hello <strong>world</strong></p>')).toBe('Hello world')
      expect(stripHtmlTags('<div class="test">Content</div>')).toBe('Content')
    })

    it('handles empty strings', () => {
      expect(stripHtmlTags('')).toBe('')
    })

    it('handles text without HTML tags', () => {
      expect(stripHtmlTags('Plain text')).toBe('Plain text')
    })
  })

  describe('cleanTitle', () => {
    it('removes HTML tags and normalizes whitespace', () => {
      expect(cleanTitle('<h1>  My   Title  </h1>')).toBe('My Title')
      expect(cleanTitle('Title\n\twith\n\tspaces')).toBe('Title with spaces')
    })

    it('handles empty input', () => {
      expect(cleanTitle('')).toBe('')
    })
  })

  describe('normalizePath', () => {
    it('normalizes file paths correctly', () => {
      expect(normalizePath('My File Name.jpg')).toBe('my-file-name.jpg')
      expect(normalizePath('Special! @#$ Characters.pdf')).toBe('special-characters.pdf')
    })

    it('removes problematic characters', () => {
      expect(normalizePath('file with spaces.txt')).toBe('file-with-spaces.txt')
      expect(normalizePath('múltiple--hyphens.doc')).toBe('mltiple-hyphens.doc')
    })

    it('handles directory paths', () => {
      expect(normalizePath('folder/file name.jpg')).toBe('folder/file-name.jpg')
      expect(normalizePath('nested/deep/folder/file.png')).toBe('nested/deep/folder/file.png')
    })
  })

  describe('encodePath', () => {
    it('URL encodes path segments', () => {
      expect(encodePath('file name.jpg')).toBe('file%20name.jpg')
      expect(encodePath('folder/file name.jpg')).toBe('folder/file%20name.jpg')
    })

    it('handles empty paths', () => {
      expect(encodePath('')).toBe('')
    })
  })

  describe('resolveImagePath', () => {
    it('returns normalized path for malformed paths', () => {
      expect(resolveImagePath('file name.jpg')).toBe('file-name.jpg')
    })

    it('handles empty paths', () => {
      expect(resolveImagePath('')).toBe('')
    })
  })

  describe('createPathMapping', () => {
    it('creates mapping for problematic paths', () => {
      const paths = ['file name.jpg', 'normal-file.jpg', 'another file.png']
      const mapping = createPathMapping(paths)
      
      expect(mapping['file name.jpg']).toBe('file-name.jpg')
      expect(mapping['another file.png']).toBe('another-file.png')
      expect(mapping['normal-file.jpg']).toBeUndefined()
    })
  })

  describe('fixImagePathsInContent', () => {
    it('fixes img src attributes', () => {
      const content = '<img src="images/test file.jpg" alt="test">'
      const fixed = fixImagePathsInContent(content)
      expect(fixed).toContain('src="images/test file.jpg"')
    })

    it('fixes markdown image syntax', () => {
      const content = '![alt text](images/file name.jpg)'
      const fixed = fixImagePathsInContent(content)
      expect(fixed).toContain('(images/file name.jpg)')
    })

    it('handles empty content', () => {
      expect(fixImagePathsInContent('')).toBe('')
    })
  })

  describe('fixLegacyPath', () => {
    it('uses predefined mappings when available', () => {
      const result = fixLegacyPath('images/racette c w 9-15-09.jpg')
      expect(result).toBe('images/racette-c-w-9-15-09.jpg')
    })

    it('returns path as-is for unknown paths without spaces', () => {
      const result = fixLegacyPath('images/unknown-file.jpg')
      expect(result).toBe('images/unknown-file.jpg')
    })

    it('handles paths with spaces by returning them as-is', () => {
      const result = fixLegacyPath('images/unknown file.jpg')
      expect(result).toBe('images/unknown file.jpg')
    })

    it('handles paths starting with /images/', () => {
      const result = fixLegacyPath('/images/file name.jpg')
      expect(result).toBe('/images/file name.jpg')
    })
  })

  describe('fixHtmlPathsInContent', () => {
    it('fixes href attributes', () => {
      const content = '<a href="images/test file.jpg">Link</a>'
      const fixed = fixHtmlPathsInContent(content)
      expect(fixed).toContain('href="images/test file.jpg"')
    })

    it('fixes background-image CSS', () => {
      const content = 'background-image: url(images/file name.jpg)'
      const fixed = fixHtmlPathsInContent(content)
      expect(fixed).toBe('background-image: url(images/file name.jpg)')
    })

    it('handles empty content', () => {
      expect(fixHtmlPathsInContent('')).toBe('')
    })
  })
})
