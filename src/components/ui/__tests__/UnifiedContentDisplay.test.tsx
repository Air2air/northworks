import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMockContentItems } from '@/test/utils'
import UnifiedContentDisplay from '../UnifiedContentDisplay'

describe('UnifiedContentDisplay', () => {
  const mockItems = createMockContentItems(3)

  it('renders with warner content preset', () => {
    render(
      <UnifiedContentDisplay 
        items={mockItems}
        preset="warnerContent"
      />
    )
    
    expect(screen.getByText('Featured Articles & Reviews')).toBeInTheDocument()
  })

  it('renders with cheryl content preset', () => {
    render(
      <UnifiedContentDisplay 
        items={mockItems}
        preset="cherylContent"
      />
    )
    
    expect(screen.getByText('Articles & Professional Work')).toBeInTheDocument()
  })

  it('renders with custom title', () => {
    render(
      <UnifiedContentDisplay 
        items={mockItems}
        title="Custom Title"
      />
    )
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
  })

  it('renders with description', () => {
    render(
      <UnifiedContentDisplay 
        items={mockItems}
        title="Test Content"
        description="This is a test description"
      />
    )
    
    expect(screen.getByText('This is a test description')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <UnifiedContentDisplay 
        items={mockItems}
        className="custom-class"
      />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders all provided items', () => {
    render(
      <UnifiedContentDisplay 
        items={mockItems}
        title="Test Items"
      />
    )
    
    // Check that all mock items are rendered
    expect(screen.getByText('Test Article 1')).toBeInTheDocument()
    expect(screen.getByText('Test Article 2')).toBeInTheDocument()
    expect(screen.getByText('Test Article 3')).toBeInTheDocument()
  })
})
