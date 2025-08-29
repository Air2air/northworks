import { describe, it, expect } from 'vitest'
import { formatDate } from '../dateUtils'
import { cleanTitle } from '../pathUtils'

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('formats ISO date strings correctly', () => {
      expect(formatDate('2024-01-15')).toBe('January 15, 2024')
      expect(formatDate('2024-12-31')).toBe('December 31, 2024')
    })

    it('handles different date formats', () => {
      expect(formatDate('2024-01-15')).toBe('January 15, 2024')
    })

    it('returns null for invalid dates', () => {
      expect(formatDate('')).toBe(null)
      expect(formatDate('invalid-date')).toBe(null)
    })

    it('returns null for null/undefined', () => {
      expect(formatDate(null)).toBe(null)
      expect(formatDate(undefined)).toBe(null)
    })
  })
})

describe('pathUtils', () => {
  describe('cleanTitle', () => {
    it('removes HTML tags', () => {
      expect(cleanTitle('<strong>test-article</strong>')).toBe('test-article')
      expect(cleanTitle('<em>another-file</em>')).toBe('another-file')
    })

    it('normalizes whitespace', () => {
      expect(cleanTitle('  test   article   title  ')).toBe('test article title')
    })

    it('handles HTML tags with attributes', () => {
      expect(cleanTitle('<span class="highlight">test</span> article')).toBe('test article')
    })

    it('handles empty strings', () => {
      expect(cleanTitle('')).toBe('')
    })
  })
})
