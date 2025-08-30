import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import OptimizedImage from '../OptimizedImage'

describe('OptimizedImage', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image',
    width: 300,
    height: 200
  }

  it('renders image with correct attributes', () => {
    render(<OptimizedImage {...defaultProps} />)
    
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    expect(image).toHaveAttribute('alt', 'Test image')
    expect(image).toHaveAttribute('width', '300')
    expect(image).toHaveAttribute('height', '200')
  })

  it('applies custom className', () => {
    render(<OptimizedImage {...defaultProps} className="custom-class" />)
    
    const image = screen.getByRole('img')
    expect(image).toHaveClass('custom-class')
  })

  it('applies correct default styles', () => {
    render(<OptimizedImage {...defaultProps} />)
    
    const image = screen.getByRole('img')
    expect(image).toHaveStyle({
      objectFit: 'cover',
      objectPosition: 'center top',
      width: '100%',
      height: '100%'
    })
  })

  it('handles image load event', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    render(<OptimizedImage {...defaultProps} />)
    
    const image = screen.getByRole('img')
    fireEvent.load(image)
    
    expect(consoleSpy).toHaveBeenCalledWith('Image loaded successfully:', '/test-image.jpg')
    
    consoleSpy.mockRestore()
  })

  it('handles image error event', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<OptimizedImage {...defaultProps} />)
    
    const image = screen.getByRole('img')
    fireEvent.error(image)
    
    expect(consoleSpy).toHaveBeenCalledWith('Image failed to load:', '/test-image.jpg')
    
    consoleSpy.mockRestore()
  })

  it('logs rendering information', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    render(<OptimizedImage {...defaultProps} />)
    
    expect(consoleSpy).toHaveBeenCalledWith('OptimizedImage: rendering', {
      src: '/test-image.jpg',
      alt: 'Test image',
      width: 300,
      height: 200
    })
    
    consoleSpy.mockRestore()
  })

  it('handles priority prop (though not currently used)', () => {
    render(<OptimizedImage {...defaultProps} priority={true} />)
    
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
  })

  it('works with empty className', () => {
    render(<OptimizedImage {...defaultProps} className="" />)
    
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
  })

  it('works without optional props', () => {
    render(<OptimizedImage {...defaultProps} />)
    
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
  })
})
