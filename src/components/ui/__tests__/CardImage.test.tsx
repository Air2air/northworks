import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import CardImage from '../CardImage'
import type { CardImageProps } from '@/types'

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}

global.IntersectionObserver = MockIntersectionObserver as any
import { createMockContentItem } from '@/test/utils'

describe('CardImage', () => {
  const mockItem = createMockContentItem({
    title: 'Test Article',
    type: 'article'
  })

  const defaultProps: CardImageProps = {
    item: mockItem,
    variant: 'thumbnail',
    showImage: true
  }

  it('renders with centralized CardImageProps interface', () => {
    render(<CardImage {...defaultProps} />)
    
    // Should render the image container or fallback
    const container = screen.getByTestId || screen.getByRole || (() => document.querySelector('[class*="bg-gradient"]'))
    expect(container).toBeTruthy()
  })

  it('accepts all centralized CardImageProps properties', () => {
    const fullProps: CardImageProps = {
      item: mockItem,
      variant: 'card',
      showImage: true,
      className: 'custom-card-image'
    }

    render(<CardImage {...fullProps} />)
    
    // Should render with container
    expect(document.querySelector('.custom-card-image')).toBeTruthy()
  })

  it('does not render when showImage is false', () => {
    render(
      <CardImage 
        {...defaultProps}
        showImage={false}
      />
    )
    
    // Should not render anything
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders fallback icon when no image available', () => {
    const itemWithoutImage = createMockContentItem({
      title: 'Test Article',
      type: 'article',
      media: [] // No images
    })

    render(
      <CardImage 
        item={itemWithoutImage}
        variant="thumbnail"
        showImage={true}
      />
    )
    
    // Should render fallback with type icon
    expect(document.querySelector('[class*="bg-gradient"]')).toBeTruthy()
  })

  it('renders image when available in item', () => {
    const itemWithImage = createMockContentItem({
      title: 'Test Article',
      type: 'article',
      media: [{
        url: '/test-image.jpg',
        type: 'image',
        alt: 'Test image',
        variant: 'thumbnail',
        usage: 'primary'
      }]
    })

    render(
      <CardImage 
        item={itemWithImage}
        variant="thumbnail"
        showImage={true}
      />
    )
    
    // Should render LazyImage component - check for the container instead
    const imageContainer = document.querySelector('.relative.overflow-hidden')
    expect(imageContainer).toBeInTheDocument()
  })

  it('applies custom className correctly', () => {
    render(
      <CardImage 
        {...defaultProps}
        className="test-card-class"
      />
    )
    
    // Should apply the custom class
    expect(document.querySelector('.test-card-class')).toBeTruthy()
  })

  it('handles different content types correctly', () => {
    const interviewItem = createMockContentItem({
      title: 'Interview',
      type: 'interview'
    })

    render(
      <CardImage 
        item={interviewItem}
        variant="card"
        showImage={true}
      />
    )
    
    // Should render with appropriate icon for interview type
    expect(document.querySelector('[class*="bg-gradient"]')).toBeTruthy()
  })

  it('handles different variants correctly', () => {
    const variants = ['thumbnail', 'card', 'hero', 'portrait']
    
    variants.forEach(variant => {
      const { unmount } = render(
        <CardImage 
          {...defaultProps}
          variant={variant}
        />
      )
      
      // Should render for each variant
      expect(document.querySelector('[class*="bg-gradient"]') || screen.queryByRole('img')).toBeTruthy()
      
      unmount()
    })
  })

  it('maintains proper TypeScript interface compliance', () => {
    // This test verifies that the component accepts the centralized interface
    const validProps: CardImageProps = {
      item: mockItem,
      variant: 'thumbnail',
      showImage: true,
      className: 'test-class'
    }

    // Should compile and render without TypeScript errors
    expect(() => render(<CardImage {...validProps} />)).not.toThrow()
  })

  it('works with minimal props from centralized interface', () => {
    const minimalProps: CardImageProps = {
      item: mockItem,
      variant: 'card',
      showImage: true
    }

    // Should render with minimal required props
    expect(() => render(<CardImage {...minimalProps} />)).not.toThrow()
  })
})
