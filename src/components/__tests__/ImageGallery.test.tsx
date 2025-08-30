import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ImageGallery from '../ImageGallery'

describe('ImageGallery', () => {
  const mockImages = [
    {
      src: '/image1.jpg',
      alt: 'Test Image 1',
      caption: 'Caption 1',
      width: 300,
      height: 200
    },
    {
      src: '/image2.jpg',
      alt: 'Test Image 2',
      caption: 'Caption 2',
      width: 400,
      height: 300
    }
  ]

  it('renders all images correctly', () => {
    render(<ImageGallery images={mockImages} />)
    
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
    expect(images[0]).toHaveAttribute('src', '/image1.jpg')
    expect(images[0]).toHaveAttribute('alt', 'Test Image 1')
    expect(images[1]).toHaveAttribute('src', '/image2.jpg')
    expect(images[1]).toHaveAttribute('alt', 'Test Image 2')
  })

  it('renders captions when provided', () => {
    render(<ImageGallery images={mockImages} />)
    
    expect(screen.getByText('Caption 1')).toBeInTheDocument()
    expect(screen.getByText('Caption 2')).toBeInTheDocument()
  })

  it('renders inline gallery layout correctly', () => {
    render(<ImageGallery images={mockImages} inline={true} />)
    
    // Should render with float-right container for inline
    const container = document.querySelector('.float-right')
    expect(container).toBeInTheDocument()
    
    // Should still use OptimizedImage
    expect(screen.getAllByRole('img')).toHaveLength(2)
  })

  it('renders non-inline gallery layout correctly', () => {
    render(<ImageGallery images={mockImages} inline={false} />)
    
    // Should not have float-right for non-inline
    const container = document.querySelector('.float-right')
    expect(container).not.toBeInTheDocument()
    
    // Should still render images
    expect(screen.getAllByRole('img')).toHaveLength(2)
  })

  it('renders with default inline=true when not specified', () => {
    render(<ImageGallery images={mockImages} />)
    
    // Default should be inline
    const container = document.querySelector('.float-right')
    expect(container).toBeInTheDocument()
  })

  it('handles empty images array', () => {
    render(<ImageGallery images={[]} />)
    
    const images = screen.queryAllByRole('img')
    expect(images).toHaveLength(0)
  })

  it('handles images without captions', () => {
    const imagesWithoutCaptions = [
      {
        src: '/image1.jpg',
        alt: 'Test Image 1',
        width: 300,
        height: 200
      }
    ]
    
    render(<ImageGallery images={imagesWithoutCaptions} />)
    
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(1)
    
    // Should not have any caption text
    expect(screen.queryByText('Caption 1')).not.toBeInTheDocument()
  })

  it('uses semantic HTML structure with figure and figcaption', () => {
    render(<ImageGallery images={mockImages} />)
    
    // Should have figure elements
    const figures = document.querySelectorAll('figure')
    expect(figures).toHaveLength(2)
    
    // Should have figcaption elements
    const figcaptions = document.querySelectorAll('figcaption')
    expect(figcaptions).toHaveLength(2)
  })

  it('applies correct CSS classes for styling', () => {
    render(<ImageGallery images={mockImages} />)
    
    // Check for specific CSS classes used in the component
    const container = document.querySelector('.float-right')
    expect(container).toHaveClass('max-w-sm', 'ml-6', 'mb-4')
  })

  it('passes correct props to OptimizedImage', () => {
    render(<ImageGallery images={mockImages} />)
    
    const images = screen.getAllByRole('img')
    
    // Check first image attributes
    expect(images[0]).toHaveAttribute('width', '300')
    expect(images[0]).toHaveAttribute('height', '200')
    
    // Check second image attributes
    expect(images[1]).toHaveAttribute('width', '400')
    expect(images[1]).toHaveAttribute('height', '300')
  })

  it('handles images with missing dimensions', () => {
    const imagesWithoutDimensions = [
      {
        src: '/image1.jpg',
        alt: 'Test Image 1',
        caption: 'Caption 1'
      }
    ]
    
    render(<ImageGallery images={imagesWithoutDimensions as any} />)
    
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(1)
    expect(images[0]).toBeInTheDocument()
  })
})
