import { describe, it, expect } from 'vitest'
import { formatDate } from '../dateUtils'

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('formats date strings correctly', () => {
      expect(formatDate('2024-01-15')).toBe('January 15, 2024')
      expect(formatDate('2024-12-31')).toBe('December 31, 2024')
      expect(formatDate('2024-06-01')).toBe('June 1, 2024')
    })

    it('handles invalid dates gracefully', () => {
      expect(formatDate('invalid-date')).toBe(null)
      expect(formatDate('')).toBe(null)
    })

    it('handles undefined input', () => {
      expect(formatDate(undefined)).toBe(null)
    })
  })
})
