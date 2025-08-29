import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ImageGallery from '../ImageGallery'
import type { ImageGalleryProps, ContentImage } from '@/types'

// Mock LazyImage component
vi.mock('@/components/ui/LazyImage', () => ({
  default: ({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) => (
    <div data-testid="lazy-image" data-src={src} data-alt={alt} data-priority={priority}>
      {alt}
    </div>
  )
}))

describe('ImageGallery (Consolidated with LazyImage)', () => {
  const mockImages: ContentImage[] = [
    {
      src: '/image1.jpg',
      alt: 'First image',
      width: 300,
      height: 200,
      caption: 'This is the first image'
    },
    {
      src: '/image2.jpg',
      alt: 'Second image',
      width: 300,
      height: 200,
      caption: 'This is the second image'
    }
  ]

  it('renders nothing when no images provided', () => {
    render(<ImageGallery images={[]} />)
    
    expect(screen.queryByTestId('lazy-image')).not.toBeInTheDocument()
  })

  it('renders images using LazyImage component', () => {
    render(<ImageGallery images={mockImages} />)
    
    // Should render both images with LazyImage
    const lazyImages = screen.getAllByTestId('lazy-image')
    expect(lazyImages).toHaveLength(2)
    
    // Check that first image gets priority loading
    expect(lazyImages[0]).toHaveAttribute('data-priority', 'true')
    expect(lazyImages[1]).toHaveAttribute('data-priority', 'false')
  })

  it('renders inline gallery layout correctly', () => {
    render(<ImageGallery images={mockImages} inline={true} />)
    
    // Should render with float-right container for inline
    const container = document.querySelector('.float-right')
    expect(container).toBeInTheDocument()
    
    // Should still use LazyImage
    expect(screen.getAllByTestId('lazy-image')).toHaveLength(2)
  })

  it('shows captions when enabled', () => {
    render(<ImageGallery images={mockImages} showCaptions={true} />)
    
    // Should show captions (both hover and permanent versions)
    expect(screen.getAllByText('This is the first image')).toHaveLength(2)
    expect(screen.getAllByText('This is the second image')).toHaveLength(2)
  })

  it('hides captions when disabled', () => {
    render(<ImageGallery images={mockImages} showCaptions={false} />)
    
    expect(screen.queryByText('This is the first image')).not.toBeInTheDocument()
    expect(screen.queryByText('This is the second image')).not.toBeInTheDocument()
  })

  it('maintains ImageGalleryProps interface compatibility', () => {
    const props: ImageGalleryProps = {
      images: mockImages,
      showCaptions: true,
      inline: false
    }

    render(<ImageGallery {...props} />)
    
    // Should render without TypeScript errors and work as expected
    expect(screen.getAllByTestId('lazy-image')).toHaveLength(2)
  })

  it('handles images without captions gracefully', () => {
    const imagesWithoutCaptions: ContentImage[] = [
      { src: '/image1.jpg', alt: 'Image 1' },
      { src: '/image2.jpg', alt: 'Image 2' }
    ]

    render(<ImageGallery images={imagesWithoutCaptions} showCaptions={true} />)
    
    // Should still render images
    expect(screen.getAllByTestId('lazy-image')).toHaveLength(2)
    
    // Should not crash when trying to show captions that don't exist
    expect(screen.getByText('Image 1')).toBeInTheDocument()
    expect(screen.getByText('Image 2')).toBeInTheDocument()
  })

  it('prioritizes first image loading for performance', () => {
    render(<ImageGallery images={mockImages} />)
    
    const lazyImages = screen.getAllByTestId('lazy-image')
    
    // First image should have priority loading
    expect(lazyImages[0]).toHaveAttribute('data-priority', 'true')
    
    // Subsequent images should not have priority
    expect(lazyImages[1]).toHaveAttribute('data-priority', 'false')
  })
})
