import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { UnifiedContentItem } from '@/schemas/unified-content-schema'

// Custom render function that includes common providers if needed
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, {
    // Add any providers here if needed in the future
    ...options,
  })
}

// Mock data factories for testing
export const createMockContentItem = (overrides: Partial<UnifiedContentItem> = {}): UnifiedContentItem => ({
  id: 'test-item-1',
  slug: 'test-item-1',
  type: 'article',
  category: 'articles',
  title: 'Test Article',
  subtitle: 'A test article for testing',
  summary: 'This is a test article summary',
  body: 'This is the test article body content',
  excerpt: 'Test excerpt',
  url: '/articles/test-item-1',
  internalUrl: '/articles/test-item-1',
  status: 'published',
  featured: false,
  priority: 1,
  createdDate: '2024-01-01',
  publishedDate: '2024-01-01',
  lastModified: '2024-01-01',
  tags: ['test', 'article'],
  ...overrides
})

export const createMockContentItems = (count: number = 3): UnifiedContentItem[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockContentItem({
      id: `test-item-${index + 1}`,
      slug: `test-item-${index + 1}`,
      title: `Test Article ${index + 1}`,
      url: `/articles/test-item-${index + 1}`,
      internalUrl: `/articles/test-item-${index + 1}`,
    })
  )
}

// Re-export testing library utilities
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
